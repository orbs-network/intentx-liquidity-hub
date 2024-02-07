import { useMemo } from 'react'
import { NativeCurrency, Token } from '@uniswap/sdk-core'

import { SupportedChainId } from 'constants/chains'
import { nativeOnChain } from 'utils/token'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'

export default function useNativeCurrency(): NativeCurrency | Token {
  const { chainId } = useActiveConnectionDetails()

  return useMemo(
    () =>
      chainId
        ? nativeOnChain(chainId)
        : // display mainnet when not connected
          nativeOnChain(SupportedChainId.MAINNET),
    [chainId]
  )
}
