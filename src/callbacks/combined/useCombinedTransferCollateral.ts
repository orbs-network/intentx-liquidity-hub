import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types'
import BigNumber from 'bignumber.js'
import { SPONSOR_TRANSACTIONS } from 'constants/accountAbstraction'
import { COLLATERAL_TOKEN } from 'constants/tokens'
import useAATransaction from 'hooks/accountAbstraction/useAATransaction'
import useCombinedTransaction from 'hooks/useCombinedTransaction'
import { useDiamondContract, useMultiAccountContract } from 'hooks/useContract'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useSupportedChainId } from 'lib/hooks/useSupportedChainId'
import { DeallocateCollateralClient } from 'lib/muon'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TransactionType, TransferCollateralTransactionInfo } from 'state/transactions/types'
import { useActiveAccount } from 'state/user/hooks'
import { TransferTab } from 'types/transfer'
import { CombinedTransactionData } from 'types/web3'
import { formatPrice } from 'utils/numbers'
import { getTokenWithFallbackChainId } from 'utils/token'
import { Address, encodeFunctionData } from 'viem'


export default function useCombinedTransferCollateral(typedAmount: string, activeTab: TransferTab) {
  const { account, chainId } = useActiveConnectionDetails()
  const diamondContract = useDiamondContract()
  const multiAccountContract = useMultiAccountContract()
  const activeAccount = useActiveAccount()
  const isSupportedChainId = useSupportedChainId()
  const collateralCurrency = getTokenWithFallbackChainId(COLLATERAL_TOKEN, chainId)
  const addTransaction = useTransactionAdder()
  const addRecentTransaction = useAddRecentTransaction()

  const getSignature = useCallback(async () => {
    if (!DeallocateCollateralClient) {
      throw new Error('Missing Client')
    }
    if (!chainId || !diamondContract || !activeAccount) {
      throw new Error('Missing muon params')
    }

    const result = await DeallocateCollateralClient.getMuonSig(
      activeAccount.accountAddress,
      chainId,
      diamondContract?.address
    )
    const { success, signature, error } = result
    if (success === false || !signature) {
      throw new Error(`Unable to fetch Muon signature: ${error}`)
    }
    return { signature }
  }, [diamondContract, activeAccount, chainId])

  const callDataCallback = useCallback<() => Promise<CombinedTransactionData | undefined>>(async () => {
    if (
      !chainId ||
      !diamondContract ||
      !activeAccount ||
      !collateralCurrency ||
      !multiAccountContract ||
      !typedAmount
    ) {
      return
    }

    const amount = new BigNumber(typedAmount).shiftedBy(collateralCurrency.decimals).toFixed()
    const collateralShiftAmount = `1e${collateralCurrency.decimals}`

    let data = ''

    if (activeTab === TransferTab.DEPOSIT) {
      data = encodeFunctionData({
        abi: multiAccountContract.abi,
        functionName: 'depositAndAllocateForAccount',
        args: [activeAccount.accountAddress as Address, BigInt(amount)],
      })
    } else if (activeTab === TransferTab.DEALLOCATE) {
      const fixedAmount = formatPrice(typedAmount, collateralCurrency.decimals)
      const amount = new BigNumber(fixedAmount).times(1e18).toFixed()

      const { signature } = await getSignature()

      const proxiedData = encodeFunctionData({
        abi: diamondContract.abi,
        functionName: 'deallocate',
        args: [BigInt(amount), signature] as const,
      })

      data = encodeFunctionData({
        abi: multiAccountContract.abi,
        functionName: '_call',
        args: [activeAccount.accountAddress as Address, [proxiedData]],
      })
    } else if (activeTab === TransferTab.WITHDRAW) {
      const fixedAmount = formatPrice(typedAmount, collateralCurrency.decimals)
      const amount = new BigNumber(fixedAmount).times(collateralShiftAmount).toFixed()
      const functionName = 'withdrawFromAccount'

      data = encodeFunctionData({
        abi: multiAccountContract.abi,
        functionName,
        args: [activeAccount.accountAddress as Address, BigInt(amount)],
      })
    } else if (activeTab === TransferTab.ALLOCATE) {
      const fixedAmount = formatPrice(typedAmount, collateralCurrency.decimals)
      const amount = new BigNumber(fixedAmount).times(1e18).toFixed()

      const proxiedData = encodeFunctionData({
        abi: diamondContract.abi,
        functionName: 'allocate',
        args: [BigInt(amount)] as const,
      })

      data = encodeFunctionData({
        abi: multiAccountContract.abi,
        functionName: '_call',
        args: [activeAccount.accountAddress as Address, [proxiedData]],
      })
    } else {
      throw new Error('Not implemented')
    }

    return {
      to: multiAccountContract.address,
      data,
      value: '0',
    }
  }, [
    activeAccount,
    chainId,
    collateralCurrency,
    diamondContract,
    multiAccountContract,
    typedAmount,
    activeTab,
    getSignature,
  ])

  const txInfo = {
    type: TransactionType.TRANSFER_COLLATERAL,
    transferType: activeTab,
    accountName: activeAccount?.name,
    amount: typedAmount,
    accountAddress: activeAccount?.accountAddress,
  } as TransferCollateralTransactionInfo

  const summary = `${txInfo.amount} ${collateralCurrency?.symbol} ${txInfo.transferType}`

  return useCombinedTransaction(callDataCallback, txInfo, summary)
}
