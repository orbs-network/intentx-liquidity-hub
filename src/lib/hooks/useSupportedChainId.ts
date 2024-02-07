import { useMemo } from 'react'

import { V3_CHAIN_IDS } from 'constants/chains'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useRouter } from 'next/router'

// Allow user to connect any chain globally, but restrict unsupported ones if needed
export function useSupportedChainId() {
  // Allowing all networks in spot trading
  const { basePath } = useRouter()

  const { chainId, account } = useActiveConnectionDetails()
  return useMemo(() => {
    if (!chainId || !account) return false

    if (basePath === '/spot-trading') return true
    return V3_CHAIN_IDS.includes(chainId)
  }, [chainId, account, basePath])
}
