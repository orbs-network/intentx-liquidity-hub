import React from 'react'
import styled from 'styled-components'

import { NotificationMessages, NotificationDetails, NotificationType } from 'state/notifications/types'

import { RowStart } from 'components/Row'
import { useErrorMessage, useMarket } from 'hooks/useMarkets'
import { useGetExistedQuoteByIdsCallback } from 'state/quotes/hooks'
import { useGetQuoteByIds } from 'hooks/useQuotes'
import { Quote } from 'types/quote'

const NotificationText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.white};
`

export default function NotificationSummary({
  notification,
}: {
  notification: NotificationDetails
}): JSX.Element | null {
  const { notificationType, quoteId, lastSeenAction, errorCode } = notification
  const existedQuoteCallback = useGetExistedQuoteByIdsCallback()
  const existedQuote = existedQuoteCallback(quoteId)
  const { quotes, loading } = useGetQuoteByIds([Number(quoteId)])
  const quoteData = existedQuote ? existedQuote : !loading ? quotes[0] : ({} as Quote)
  const { name } = useMarket(quoteData?.marketId) || {}
  const text = lastSeenAction !== null ? NotificationMessages[lastSeenAction] : ''
  const errorMessage = useErrorMessage(errorCode)

  switch (notificationType) {
    case NotificationType.TRANSFER_COLLATERAL:
      return <>Transfer collateral</>

    case NotificationType.LIQUIDATION_ALERT:
      return <>Liq alert</>

    case NotificationType.PARTIAL_FILL:
      return <>fill</>

    case NotificationType.SEEN_BY_HEDGER:
      return (
        <NotificationText>
          {name}-Q{quoteId} &#34;{text}&#34; received
        </NotificationText>
      )

    case NotificationType.HEDGER_ERROR:
      return (
        <NotificationText>
          <div>
            {name}-Q{quoteId}
          </div>
          &#34;
          {errorMessage ??
            'PartyB (Hedger) request time requirements are not sufficient, please send a new request with more time to process.'}
          &#34;
        </NotificationText>
      )
    case NotificationType.SUCCESS:
      return (
        <NotificationText>
          {name}-Q{quoteId} &#34;{text}&#34; successful
        </NotificationText>
      )
    case NotificationType.PUSH:
      return <NotificationText>{notification.pushNotificationTitle}</NotificationText>
    case NotificationType.OTHER:
      return <>other</>

    default:
      return <>default</>
  }
}
