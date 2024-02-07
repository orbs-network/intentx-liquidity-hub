import { useMemo } from 'react'

import { Quote } from 'types/quote'
import { CloseQuote, CloseQuoteMessages } from 'types/trade'

import { useSupportedChainId } from 'lib/hooks/useSupportedChainId'
import { useTransactionAdder } from 'state/transactions/hooks'
import { CancelQuoteTransactionInfo, TransactionType } from 'state/transactions/types'

import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { useDiamondContract, useMultiAccountContract } from 'hooks/useContract'
import { useMarket } from 'hooks/useMarkets'

import useCombinedTransaction from 'hooks/useCombinedTransaction'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useActiveAccountAddress } from 'state/user/hooks'
import { CombinedTransactionData } from 'types/web3'
import { Address, encodeFunctionData } from 'viem'

export default function useCombinedCancelQuote(quote: Quote | null, closeQuote: CloseQuote | null) {
  const { account, chainId } = useActiveConnectionDetails()
  const addTransaction = useTransactionAdder()
  const addRecentTransaction = useAddRecentTransaction()
  const isSupportedChainId = useSupportedChainId()
  // const userExpertMode = useExpertMode()

  const diamondContract = useDiamondContract()
  const multiAccountContract = useMultiAccountContract()

  const activeAccountAddress = useActiveAccountAddress()

  const functionName = useMemo(() => {
    return closeQuote === CloseQuote.CANCEL_CLOSE_REQUEST
      ? 'requestToCancelCloseRequest'
      : closeQuote === CloseQuote.CANCEL_QUOTE
      ? 'requestToCancelQuote'
      : closeQuote === CloseQuote.FORCE_CLOSE
      ? 'forceCancelQuote'
      : null
  }, [closeQuote])

  const market = useMarket(quote?.marketId)

  const callData = useMemo<CombinedTransactionData>(() => {
    try {
      if (!account || !diamondContract || !multiAccountContract || !quote || !functionName || !isSupportedChainId) {
        throw new Error('Missing dependencies.')
      }

      const args = [BigInt(quote.id)] as const
      const proxiedData = encodeFunctionData({
        abi: diamondContract.abi,
        functionName,
        args,
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
    } catch (error) {
      throw new Error(error)
    }
  }, [account, diamondContract, multiAccountContract, quote, functionName, isSupportedChainId, activeAccountAddress])

  const summary = `${name}-Q${quote?.id.toString()} “${
    CloseQuoteMessages[closeQuote || CloseQuote.CANCEL_QUOTE]
  }” ${status}`

  const txInfo = {
    type: TransactionType.CANCEL,
    name: market?.name,
    id: quote?.id.toString(),
    positionType: quote?.positionType,
    closeQuote,
    hedger: '',
  } as CancelQuoteTransactionInfo

  return useCombinedTransaction(callData, txInfo, summary)
}