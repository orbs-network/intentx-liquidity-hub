import { useMemo } from 'react'
import { isAddress } from 'viem'
import { useRouter } from 'next/router'

export function useInjectedAddress() {
  const router = useRouter()
  const WalletAddress = router.query?.address
  return useMemo(
    () => (WalletAddress && isAddress(WalletAddress.toString()) ? WalletAddress.toString() : ''),
    [WalletAddress]
  )
}
