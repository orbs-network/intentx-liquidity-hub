import { useCallback } from 'react'

import { Quote } from 'types/quote'

import { ForceCloseTransactionInfo, TransactionType } from 'state/transactions/types'
import { useActiveAccountAddress } from 'state/user/hooks'

import { useDiamondContract, useMultiAccountContract } from 'hooks/useContract'

import { PARTY_B_WHITELIST } from 'constants/addresses'
import useCombinedTransaction from 'hooks/useCombinedTransaction'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useSupportedChainId } from 'lib/hooks/useSupportedChainId'
import { ForceCloseClient } from 'lib/muon'
import { toast } from 'react-hot-toast'
import { Address, decodeErrorResult, encodeFunctionData } from 'viem'
import { usePublicClient } from 'wagmi'

export default function useCombinedForceClosePosition(quote: Quote | null) {
  const publicClient = usePublicClient()

  const { account, chainId } = useActiveConnectionDetails()

  const diamondContract = useDiamondContract()
  const multiAccountContract = useMultiAccountContract()

  const activeAccountAddress = useActiveAccountAddress()
  const isSupportedChainId = useSupportedChainId()

  const selectedPartyBAddress = chainId && isSupportedChainId ? PARTY_B_WHITELIST[chainId][0] : null

  const getSignature = useCallback(async () => {
    if (!ForceCloseClient) {
      throw new Error('Missing Client')
    }

    if (!activeAccountAddress || !chainId || !diamondContract || !quote) {
      throw new Error('Missing muon params')
    }

    const { success, signature, error } = await ForceCloseClient.getMuonSig(
      activeAccountAddress,
      selectedPartyBAddress,
      quote.marketId,
      diamondContract.address,
      chainId
    )

    if (success === false || !signature) {
      throw new Error(`Unable to fetch Muon signature: ${error}`)
    }
    return { signature }
  }, [activeAccountAddress, chainId, diamondContract, selectedPartyBAddress, quote])

  const callDataCallback = useCallback(async () => {
    if (!account || !diamondContract || !quote || !multiAccountContract) {
      throw new Error('Missing dependencies for constructCall.')
    }

    const { signature } = await getSignature()

    if (!signature) {
      throw new Error('Missing signature for constructCall.')
    }

    const proxiedData = encodeFunctionData({
      abi: diamondContract.abi,
      functionName: 'forceClosePosition',
      args: [BigInt(quote.id), signature],
    })

   /* try {
      await publicClient.call({
        to: diamondContract.address,
        data: proxiedData,
        value: 0n,
        account,
      })
    }
    catch (e) {
      if (e?.cause?.cause?.cause?.data) {
        const data = e.cause.cause.cause.data
        console.log({ data })
        let value: any
        try {
          value = decodeErrorResult({
            data
          })
        }
        catch (e) {
          console.log({ e })
        }
        if (value && value?.args?.[0]) {
          const err = value.args[0]
          toast.error(`Error: ${err}`)
          throw new Error(err)
        }
      }
    } */

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
  }, [account, activeAccountAddress, diamondContract, getSignature, multiAccountContract, publicClient, quote])

  const txInfo = {
    type: TransactionType.FORCE_CLOSE,
    id: quote?.id.toString(),
  } as ForceCloseTransactionInfo
  const summary = `Q${txInfo.id} Force Close Position`

  return useCombinedTransaction(callDataCallback, txInfo, summary)
}
