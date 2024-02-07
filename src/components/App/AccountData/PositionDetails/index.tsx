import React, { useMemo } from 'react'
import { MEDIA_WIDTHS } from 'theme'
import { Quote, QuoteStatus } from 'types/quote'
import { OrderType } from 'types/trade'
import { toBN } from 'utils/numbers'

import useWindowSize from 'lib/hooks/useWindowSize'
import { useMarket } from 'hooks/useMarkets'

import LiquidatedQuoteDetails from './LiquidatedQuoteDetails'
import CanceledQuoteDetails from './CanceledQuoteDetails'
import PendingQuoteDetails from './PendingsQuoteDetails'
import OpenedQuoteDetails from './OpenedQuoteDetails'
import EmptyDetails from './EmptyDetails'
import ClosedQuoteDetails from './ClosedQuoteDetails'

export default function PositionDetails({
  quote,
  buttonText,
  disableButton,
  expired,
  onClickButton,
  liquidatePending,
}: {
  quote: Quote | null
  buttonText?: string
  disableButton?: boolean
  expired?: boolean
  onClickButton?: (event: React.MouseEvent<HTMLDivElement>) => void
  liquidatePending?: boolean
}): JSX.Element {
  const { quantity, marketPrice, requestedOpenPrice, orderType, quoteStatus } = quote || {}
  const { tradingFee } = useMarket(quote?.marketId) || {}
  const { width } = useWindowSize()
  const mobileVersion = useMemo(() => width <= MEDIA_WIDTHS.upToMedium, [width])

  const platformFee = (() => {
    if (!quantity || !marketPrice || !tradingFee || !requestedOpenPrice) return '0'
    if (orderType === OrderType.LIMIT) return toBN(quantity).times(requestedOpenPrice).times(tradingFee).toString()
    return toBN(quantity).times(marketPrice).times(tradingFee).toString()
  })()

  console.log('QuoteStatus', quoteStatus)

  if (!quote) return <EmptyDetails />

  switch (quoteStatus) {
    case QuoteStatus.PENDING:
    case QuoteStatus.LOCKED:
    case QuoteStatus.CANCEL_PENDING:
      return (
        <PendingQuoteDetails
          quote={quote}
          mobileVersion={mobileVersion}
          platformFee={platformFee}
          buttonText={buttonText}
          disableButton={disableButton}
          expired={expired}
          onClickButton={onClickButton}
        />
      )
    case QuoteStatus.OPENED:
      return (
        <OpenedQuoteDetails
          quote={quote}
          platformFee={platformFee}
          mobileVersion={mobileVersion}
          buttonText={buttonText}
          disableButton={disableButton}
          expired={expired}
          onClickButton={onClickButton}
          liquidatePending={liquidatePending}
        />
      )
    case QuoteStatus.CLOSED:
      return (
        <ClosedQuoteDetails
          quote={quote}
          platformFee={platformFee}
          mobileVersion={mobileVersion}
          buttonText={buttonText}
          disableButton={disableButton}
          expired={expired}
          onClickButton={onClickButton}
        />
      )
    case QuoteStatus.CLOSE_PENDING:
    case QuoteStatus.CANCEL_CLOSE_PENDING:
      return (
        <OpenedQuoteDetails
          quote={quote}
          platformFee={platformFee}
          mobileVersion={mobileVersion}
          buttonText={buttonText}
          disableButton={disableButton}
          expired={expired}
          onClickButton={onClickButton}
        />
      )
    case QuoteStatus.CANCELED:
    case QuoteStatus.EXPIRED:
      return <CanceledQuoteDetails quote={quote} mobileVersion={mobileVersion} />
    case QuoteStatus.LIQUIDATED:
      return <LiquidatedQuoteDetails quote={quote} platformFee={platformFee} mobileVersion={mobileVersion} />
    default:
      return <EmptyDetails />
  }
}
