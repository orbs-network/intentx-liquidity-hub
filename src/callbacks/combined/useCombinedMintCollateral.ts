import { SPONSOR_TRANSACTIONS } from 'constants/accountAbstraction'
import { COLLATERAL_ADDRESS } from 'constants/addresses'
import { FALLBACK_CHAIN_ID } from 'constants/chains'
import { COLLATERAL_TOKEN } from 'constants/tokens'
import useAATransaction from 'hooks/accountAbstraction/useAATransaction'
import useCombinedTransaction from 'hooks/useCombinedTransaction'
import { useCollateralContract } from 'hooks/useContract'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useMemo } from 'react'
import { MintTransactionInfo, TransactionType } from 'state/transactions/types'
import { CombinedTransactionData } from 'types/web3'
import { encodeFunctionData } from 'viem'

export default function useCombinedMintCollateral() {
  const collateralContract = useCollateralContract()
  const { account, chainId } = useActiveConnectionDetails()
  const collateralSymbol = COLLATERAL_TOKEN[chainId ?? FALLBACK_CHAIN_ID].symbol ?? ''

  const callData = useMemo<CombinedTransactionData | undefined>(() => {
    if (!account || !collateralContract || !chainId) {
      return
    }

    const data = encodeFunctionData({
      abi: collateralContract?.abi,
      functionName: 'mint',
      args: [account, BigInt(50000)],
    })

    return {
      to: collateralContract.address,
      data: data,
      value: '0',
    }
  }, [account, collateralContract, chainId])

  const txInfo = {
    type: TransactionType.MINT,
    amount: '50000',
  } as MintTransactionInfo

  const summary = `&#34;Mint&#34; ${txInfo.amount} ${collateralSymbol} {status}`

  return useCombinedTransaction(callData, txInfo, summary)
}
