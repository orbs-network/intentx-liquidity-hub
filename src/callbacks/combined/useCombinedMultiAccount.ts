import { MetaTransactionData } from '@safe-global/safe-core-sdk-types'
import { SPONSOR_TRANSACTIONS } from 'constants/accountAbstraction'
import { COLLATERAL_ADDRESS } from 'constants/addresses'
import useAATransaction from 'hooks/accountAbstraction/useAATransaction'
import useCombinedTransaction from 'hooks/useCombinedTransaction'
import { useMultiAccountContract } from 'hooks/useContract'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useSupportedChainId } from 'lib/hooks/useSupportedChainId'
import { useCallback, useMemo } from 'react'
import { useApplicationConnectionStatus } from 'state/application/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { AddAccountTransactionInfo, TransactionType } from 'state/transactions/types'
import { CombinedTransactionData } from 'types/web3'
import { encodeFunctionData } from 'viem'

export function useCombinedAddAccountToContract(accountName: string) {
  const { chainId } = useActiveConnectionDetails()
  const collateral = chainId ? COLLATERAL_ADDRESS[chainId] : undefined

  const multiAccountContract = useMultiAccountContract()

  const callData = useMemo<CombinedTransactionData | undefined>(() => {
    if (!accountName || !multiAccountContract) {
      return
    }

    const data = encodeFunctionData({
      abi: multiAccountContract?.abi,
      functionName: 'addAccount',
      args: [accountName],
    })

    return {
      to: multiAccountContract.address,
      data: data,
      value: '0',
    }
  }, [accountName, multiAccountContract])

  const txInfo = {
    type: TransactionType.ADD_ACCOUNT,
    name: accountName,
  } as AddAccountTransactionInfo

  const summary = `Created new account ${txInfo.name}`

  return useCombinedTransaction(callData, txInfo, summary)
}
