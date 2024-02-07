import { TransactionStatusResponse } from '@gelatonetwork/relay-sdk'
import { TaskState } from '@gelatonetwork/relay-sdk/dist/lib/status/types'
import { MetaTransactionData, MetaTransactionOptions, OperationType } from '@safe-global/safe-core-sdk-types'
import useApi from 'hooks/useApi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAA } from 'state/accountAbstraction/provider/AAProvider'
import {
  AACallbackTransactionInfo,
  CombinedTransactionCallbackInfo,
  CombinedTransactionData,
  ContractCallData,
} from 'types/web3'
import { ContractFunctionRevertedError, BaseError } from 'viem'
import { UserRejectedRequestError } from 'viem'
import { Address, Hash } from 'viem'
import { toast } from 'react-hot-toast'
import { useTransactionAdder } from 'state/transactions/hooks'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { SPONSOR_TRANSACTIONS } from 'constants/accountAbstraction'
import { COLLATERAL_ADDRESS } from 'constants/addresses'
import { ApplicationConnectionStatus } from 'state/application/reducer'
import { TransactionInfo } from 'state/transactions/types'
import { useAccount, usePublicClient } from 'wagmi'
import { prepareSendTransaction, sendTransaction } from '@wagmi/core'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import * as Sentry from "@sentry/nextjs";

/**
 * Hook to enable transaction execution via Account Abstraction and DEFI unified
 * @param dataOrConstructCallback
 * @param txInfo
 * @param summary
 * @returns
 */
export default function useCombinedTransaction(
  dataOrConstructCallback:
    | CombinedTransactionData
    | (() => Promise<CombinedTransactionData | undefined>)
    | undefined
    | null,
  txInfo?: TransactionInfo,
  summary?: string,
  onSubmitCallback?: (txHash: string) => any
): CombinedTransactionCallbackInfo {
  const addTransaction = useTransactionAdder()
  const addRecentTransaction = useAddRecentTransaction()

  const { account, chainId, applicationConnectionStatus } = useActiveConnectionDetails()
  const { web3Provider, safeAccountAbstraction, safeSdk, gelatoRelayPack } = useAA()
  const [isLoading, setIsLoading] = useState(false)
  const publicClient = usePublicClient()

  const [transactionHash, setTransactionHash] = useState<Hash>()

  const aaTransactionCallback = useCallback(async () => {
    try {
      if (isLoading) {
        toast.error('Transaction is already in progress.')
        throw new Error('Transaction is already in progress.')
      }

      if (!safeAccountAbstraction) {
        toast.error('SafeAccountAbstraction is not initialized.')
        throw new Error('SafeAccountAbstraction is not initialized.')
      }

      if (!gelatoRelayPack) {
        toast.error('GelatoRelayPack is not initialized.')
        throw new Error('GelatoRelayPack is not initialized.')
      }

      setIsLoading(true)
      let parsedData: MetaTransactionData[] | undefined
      if (typeof dataOrConstructCallback === 'function') {
        const d = await dataOrConstructCallback()
        if (!d) {
          throw new Error('Transaction not initialized')
        }
        parsedData = [
          {
            to: d.to,
            data: d.data,
            value: d.value,
            operation: OperationType.Call,
          },
        ]
      } else {
        if (!dataOrConstructCallback) {
          return
        }
        parsedData = [
          {
            to: dataOrConstructCallback.to,
            data: dataOrConstructCallback.data,
            value: dataOrConstructCallback.value,
            operation: OperationType.Call,
          },
        ]
      }

      const options = {
        isSponsored: SPONSOR_TRANSACTIONS,
        gasToken: chainId ? COLLATERAL_ADDRESS[chainId] : undefined,
      }

      const gelatoTaskId = await safeAccountAbstraction.relayTransaction(parsedData, options)
      // Fetching gelato task info until is executed
      let result: TransactionStatusResponse | undefined

      do {
        result = await gelatoRelayPack.getTaskStatus(gelatoTaskId)
        if (
          result?.taskState !== TaskState.ExecSuccess &&
          result?.taskState !== TaskState.Cancelled &&
          result?.taskState !== TaskState.ExecReverted
        ) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      } while (
        result?.taskState !== TaskState.ExecSuccess &&
        result?.taskState !== TaskState.Cancelled &&
        result?.taskState !== TaskState.ExecReverted
      )

      setIsLoading(false)

      if (result?.taskState === TaskState.ExecSuccess) {
        if (result.transactionHash) {
          setTransactionHash(result?.transactionHash as Hash)
          if (txInfo) {
            addTransaction(result.transactionHash, txInfo, summary)
            // addRecentTransaction({ hash: result.transactionHash, description: summary || '-------' })
            onSubmitCallback && onSubmitCallback(result.transactionHash)
          }

          return result.transactionHash
        } else {
          throw new Error(`Transaction hash not found in result: ${result}`)
        }
      }

      toast.error(`Transaction failed with state: ${result?.taskState}`)
      throw new Error(`Transaction failed with state: ${result?.taskState}`)
    } catch (err) {
      setIsLoading(false)
      throw err
    }
  }, [
    isLoading,
    safeAccountAbstraction,
    gelatoRelayPack,
    dataOrConstructCallback,
    chainId,
    txInfo,
    addTransaction,
    summary,
    onSubmitCallback,
  ])

  const web3TransactionCallback = useCallback(async () => {
    // sentry log transaction
    const sentryTransaction = Sentry.startTransaction({
      op: "web3TransactionCallback",
      name: "web3TransactionCallback",
    });

    // Transaction info
    sentryTransaction.setTag("account", account);
    sentryTransaction.setTag("chainId", chainId);
    sentryTransaction.setTag("summary", summary);
    try {



      if (!account) {
        // update sentry transaction
        sentryTransaction.setData("error", "Not connected");
        sentryTransaction.finish();
        throw new Error('Not connected')
      }

      console.log('web3TransactionCallback')

      setIsLoading(true)
      let config: ContractCallData | undefined = undefined
      if (typeof dataOrConstructCallback === 'function') {
        const d = await dataOrConstructCallback()
        if (!d) {
          sentryTransaction.setData("error", "Transaction not initialized");
          sentryTransaction.finish();
          throw new Error('Transaction not initialized')
        }
        config = {
          to: d.to,
          data: d.data as any,
          value: BigInt(d.value),
        }
      } else {
        if (!dataOrConstructCallback) {
          return
        }
        config = {
          to: dataOrConstructCallback.to,
          data: dataOrConstructCallback.data as any,
          value: BigInt(dataOrConstructCallback.value),
        }
      }

      if (!config) {
        sentryTransaction.setData("error", "Missing config");
        sentryTransaction.finish();
        throw new Error('Missing config')
      }

      const gas: bigint = await publicClient.estimateGas({
        to: config.to,
        data: config.data,
        value: config.value,
        account,
      })

      const request = await prepareSendTransaction(config)

      let sentTransactionData
      try {
        sentTransactionData = await sendTransaction({ ...request, gas: gas })
      } catch (err) {
        const errMessage = err.message
        if (errMessage.includes('An internal error was received.')) {
          toast.error(
            'An error ocured while sending your transaction. Please, check you have enough funds to cover gas fees and try again.'
          )
          sentryTransaction.setData("error", err);
          sentryTransaction.finish();
          throw err
        } else {
          sentryTransaction.setData("error", err);
          sentryTransaction.finish();
          throw err
        }
      }

      if (txInfo) {
        setTransactionHash(sentTransactionData.hash as Hash)
        console.log("Adding transaction ", sentTransactionData.hash, " to account ", account, " on chain ", chainId, " with summary ", summary ?? 'no summary')
        addTransaction(sentTransactionData.hash, txInfo, summary)
        // addRecentTransaction({ hash: sentTransactionData.hash, description: summary || '-------' })
        onSubmitCallback && onSubmitCallback(sentTransactionData.hash)
      }

      return sentTransactionData.hash
    } catch (err) {
      if (err instanceof BaseError) {
        if (err.cause instanceof UserRejectedRequestError) {
          toast.error('Transaction rejected.')
        } else if (err.cause instanceof ContractFunctionRevertedError) {
          // console.log({ error })
          toast.error(`${err.cause.reason}`)
        } else {
          toast.error(`${err.shortMessage}`)
        }
      }
      sentryTransaction.setData("error", err);
      sentryTransaction.finish();
      setIsLoading(false)
      throw err
    }
  }, [account, chainId, summary, dataOrConstructCallback, publicClient, txInfo, addTransaction, onSubmitCallback])

  const transactionInfo = useMemo(() => {
    if (applicationConnectionStatus === ApplicationConnectionStatus.ACCOUNT_ABSTRACTION) {
      return {
        callback: aaTransactionCallback,
        txHash: transactionHash,
        isLoading,
      }
    } else {
      return {
        callback: web3TransactionCallback,
        txHash: transactionHash,
        isLoading,
      }
    }
  }, [aaTransactionCallback, applicationConnectionStatus, isLoading, transactionHash, web3TransactionCallback])

  return transactionInfo
}
