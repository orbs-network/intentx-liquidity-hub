import React from 'react'
import Image from 'next/image'

import USDT_ICON from '/public/static/images/tokens/USDT.svg'
import USDC_ICON from '/public/static/images/tokens/USDC.svg'
import DEFAULT_TOKEN from '/public/static/images/tokens/default-token.svg'

import { Quote } from 'types/quote'
import { SupportedChainId } from 'constants/chains'

import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import useCurrencyLogo from 'lib/hooks/useCurrencyLogo'
import { useMarket } from 'hooks/useMarkets'

export default function NotificationPopupIcon({ quote }: { quote?: Quote }) {
  const { chainId } = useActiveConnectionDetails()
  const { marketId, orderType } = quote || {}
  const { symbol } = useMarket(marketId) || {}
  const token1 = useCurrencyLogo(symbol)
  const token2 =
    chainId === SupportedChainId.BASE ? USDC_ICON : chainId === SupportedChainId.FANTOM ? USDC_ICON : DEFAULT_TOKEN

  return (
    <>
      <Image unoptimized={true} src={token1 ?? DEFAULT_TOKEN} width={14} height={14} alt={`icon`} />
      <Image unoptimized={true} src={token2 ?? DEFAULT_TOKEN} width={14} height={14} alt={`icon`} />
    </>
  )
}
