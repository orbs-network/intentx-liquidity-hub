import { useCallback, useState } from 'react'
import { useWalletClient } from 'wagmi'
import { Currency, Token } from '@uniswap/sdk-core'

import useCurrencyLogo from './useCurrencyLogo'

export default function useAddTokenToWallet(currencyToAdd: Currency | undefined): {
  addToken: () => void
  success: boolean | undefined
} {
  const { data: connector } = useWalletClient()

  const token: Token | undefined = currencyToAdd?.wrapped
  const logoURL = useCurrencyLogo(token?.address)
  const [success, setSuccess] = useState<boolean | undefined>()

  const addToken = useCallback(async () => {
    if (!token?.symbol || !connector?.watchAsset) {
      console.error('Missing dependencies for addToken to Wallet')
      return
    }
    try {
      await connector.watchAsset({
        type: 'ERC20',
        options: { address: token.address, symbol: token.symbol, decimals: token.decimals, image: logoURL },
      })
      setSuccess(true)
    } catch (error) {
      console.error('Error adding token:', error)
      setSuccess(false)
    }
  }, [connector, logoURL, token])

  return { addToken, success }
}
