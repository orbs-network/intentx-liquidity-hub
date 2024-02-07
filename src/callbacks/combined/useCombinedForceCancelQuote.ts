import { useCallback } from 'react'

import { Quote } from 'types/quote'

import { ForceCloseTransactionInfo, TradeTransactionInfo, TransactionType } from 'state/transactions/types'
import { useActiveAccountAddress } from 'state/user/hooks'

import { useDiamondContract, useMultiAccountContract } from 'hooks/useContract'

import useCombinedTransaction from 'hooks/useCombinedTransaction'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { Address, encodeFunctionData } from 'viem'

export default function useCombinedForceCancelQuote(quote: Quote | null) {
  const { account } = useActiveConnectionDetails()

  const diamondContract = useDiamondContract()
  const multiAccountContract = useMultiAccountContract()

  const activeAccountAddress = useActiveAccountAddress()

  const callDataCallback = useCallback(async () => {
    if (!account || !diamondContract || !quote || !multiAccountContract) {
      throw new Error('Missing dependencies for constructCall.')
    }

    const proxiedData = encodeFunctionData({
      abi: diamondContract.abi,
      functionName: 'forceCancelQuote',
      args: [BigInt(quote.id)],
    })

    const data = encodeFunctionData({
      abi: multiAccountContract.abi,
      functionName: '_call',
      args: [activeAccountAddress as Address, [proxiedData]],
    })

    return {
      to: multiAccountContract.address,
      data,
      value: '0',
    }
  }, [account, activeAccountAddress, diamondContract, multiAccountContract, quote])

  const txInfo = {
    type: TransactionType.FORCE_CLOSE,
    id: quote?.id.toString(),
  } as ForceCloseTransactionInfo
  const summary = `Q${txInfo.id} Force Close Position`

  return useCombinedTransaction(callDataCallback, txInfo, summary)
}
