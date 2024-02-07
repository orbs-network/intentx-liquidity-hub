import { MetaTransactionData } from '@safe-global/safe-core-sdk-types'
import { Currency } from '@uniswap/sdk-core'
import BigNumber from 'bignumber.js'
import { SPONSOR_TRANSACTIONS } from 'constants/accountAbstraction'
import { COLLATERAL_ADDRESS } from 'constants/addresses'
import { MAX_UINT256 } from 'constants/misc'
import useAATransaction from 'hooks/accountAbstraction/useAATransaction'
import useCombinedTransaction from 'hooks/useCombinedTransaction'
import { useERC20Contract } from 'hooks/useContract'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useSupportedChainId } from 'lib/hooks/useSupportedChainId'
import { useMemo } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { ApproveTransactionInfo, TransactionType } from 'state/transactions/types'
import { useActiveAccountAddress } from 'state/user/hooks'
import { CombinedTransactionData } from 'types/web3'
import { toWei } from 'utils/numbers'
import { Address, encodeFunctionData } from 'viem'

export default function useCombinedApprove(
  currency?: Currency,
  amountToApprove?: BigNumber.Value,
  spender?: Address,
  approveMax?: boolean
) {
  const { account, chainId } = useActiveConnectionDetails()
  const addTransaction = useTransactionAdder()

  // const userExpertMode = useExpertMode()
  const activeAccountAddress = useActiveAccountAddress()
  const isSupportedChainId = useSupportedChainId()

  const token = currency?.isToken ? currency.wrapped : undefined
  const tokenContract = useERC20Contract(token?.address)

  const amountToApproveBN =
    approveMax || !amountToApprove ? MAX_UINT256.toString() : toWei(amountToApprove, token?.decimals)

  const callData = useMemo<CombinedTransactionData | undefined>(() => {
    if (!chainId || !currency || !amountToApprove || !spender || !tokenContract) {
      return
    }

    const data = encodeFunctionData({
      abi: tokenContract.abi,
      functionName: 'approve',
      args: [spender, BigInt(amountToApproveBN)],
    })

    return {
      to: tokenContract.address as Address,
      data: data,
      value: '0',
    }
  }, [chainId, currency, amountToApprove, spender, tokenContract, amountToApproveBN])

  const summary = `Approve ${token?.symbol}`
  const txInfo = {
    type: TransactionType.APPROVAL,
    tokenAddress: token?.address,
    spender,
  } as ApproveTransactionInfo

  return useCombinedTransaction(callData, txInfo, summary)
}
