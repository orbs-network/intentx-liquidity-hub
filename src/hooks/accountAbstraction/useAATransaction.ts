import { TransactionStatusResponse } from '@gelatonetwork/relay-sdk'
import { TaskState } from '@gelatonetwork/relay-sdk/dist/lib/status/types'
import { MetaTransactionData, MetaTransactionOptions } from '@safe-global/safe-core-sdk-types'
import useApi from 'hooks/useApi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAA } from 'state/accountAbstraction/provider/AAProvider'
import { AACallbackTransactionInfo } from 'types/web3'
import { Address, Hash } from 'viem'
import { toast } from 'react-hot-toast'
import { useTransactionAdder } from 'state/transactions/hooks'

export default function useAATransaction(
  dataOrConstructCallback: MetaTransactionData[] | (() => Promise<MetaTransactionData[]>) | undefined,
  options: MetaTransactionOptions
): AACallbackTransactionInfo {
  const addTransaction = useTransactionAdder()
  const { web3Provider, safeAccountAbstraction, safeSdk, gelatoRelayPack } = useAA()
  const [isLoading, setIsLoading] = useState(false)
  const [transactionHash, setTransactionHash] = useState<Hash | undefined>(undefined)
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

      let data: MetaTransactionData[] | undefined
      if (typeof dataOrConstructCallback === 'function') {
        data = await dataOrConstructCallback()
      } else {
        if (!dataOrConstructCallback || dataOrConstructCallback?.length === 0) {
          return
        }
        data = dataOrConstructCallback
      }

      setIsLoading(true)

      const gelatoTaskId = await safeAccountAbstraction.relayTransaction(data, options)
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
          toast.success(`Transaction successfully executed: ${result.transactionHash}`)
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
  }, [isLoading, safeAccountAbstraction, dataOrConstructCallback, options, gelatoRelayPack])

  const transactionInfo = useMemo(() => {
    return {
      callback: aaTransactionCallback,
      txHash: transactionHash,
      isLoading,
    }
  }, [aaTransactionCallback, isLoading, transactionHash])

  return transactionInfo
}
