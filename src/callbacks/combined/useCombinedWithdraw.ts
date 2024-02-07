import { MetaTransactionData, MetaTransactionOptions, OperationType } from '@safe-global/safe-core-sdk-types'
import BigNumber from 'bignumber.js'
import { SPONSOR_TRANSACTIONS } from 'constants/accountAbstraction'
import useAATransaction from 'hooks/accountAbstraction/useAATransaction'
import useCombinedTransaction from 'hooks/useCombinedTransaction'
import { useCurrency } from 'lib/hooks/useTokens'
import { useMemo } from 'react'
import { TransactionType, WithdrawTransactionInfo } from 'state/transactions/types'
import { CombinedTransactionData } from 'types/web3'
import { removeTrailingZeros } from 'utils/numbers'
import { Address, encodeFunctionData } from 'viem'

export default function useCombinedWithdraw(
  tokenAddress: Address | undefined,
  targetAddress: Address | undefined,
  amount: bigint | undefined
) {
  const currency = useCurrency(tokenAddress)

  const callData = useMemo<CombinedTransactionData | undefined>(() => {
    if (!tokenAddress || !targetAddress || !amount) {
      return
    }

    const data = encodeFunctionData({
      abi: [
        {
          inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' },
          ],
          name: 'transfer',
          outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: 'transfer',
      args: [targetAddress, amount],
    })

    return {
      to: tokenAddress as Address,
      data: data,
      value: '0',
    }
  }, [targetAddress, amount, tokenAddress])

  const txInfo: WithdrawTransactionInfo = {
    type: TransactionType.WITHDRAW,
    amount: amount ? removeTrailingZeros(BigNumber(amount.toString())) : '0',
    toAddress: targetAddress ?? '',
    tokenAddress: tokenAddress ?? '',
    tokenSymbol: currency?.wrapped.symbol ?? '',
  }

  const summary = `Withdraw of ${txInfo.amount} ${txInfo.tokenSymbol} to ${txInfo.toAddress}`

  return useCombinedTransaction(callData, txInfo, summary)
}
