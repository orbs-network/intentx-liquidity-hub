import styled, { useTheme } from 'styled-components'

import { NotificationDetails, NotificationType } from 'state/notifications/types'
import { useGetExistedQuoteByIdsCallback } from 'state/quotes/hooks'
import { Quote } from 'types/quote'

import LIQUIDATION_ALERT_ICON from '/public/static/images/etc/RedErrorTriangle.svg'

import { useGetQuoteByIds } from 'hooks/useQuotes'

import ImageWithFallback from 'components/ImageWithFallback'
import { Row, RowStart } from 'components/Row'
import NotificationSummary from 'components/Summaries/NotificationSummary'
import NotificationPopupIcon from './NotificationPopupIcon'

const Wrapper = styled(Row)<{ border?: string; bg?: string }>``

const Text = styled(RowStart)`
  font-size: 14px;
  line-height: normal;
  color: ${({ theme }) => theme.text0};
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 3px;
`
const OrderType = styled.div`
  font-size: 9px;
  color: ${({ theme }) => theme.white};
  opacity: 0.5;
  line-height: normal;
`
export default function NotificationPopup({ content }: { content: NotificationDetails }) {
  const theme = useTheme()
  const { quoteId, notificationType } = content
  const existedQuoteCallback = useGetExistedQuoteByIdsCallback()
  const existedQuote = existedQuoteCallback(quoteId)
  const { quotes, loading } = useGetQuoteByIds([Number(quoteId)])
  const quoteData = existedQuote ? existedQuote : !loading ? quotes[0] : ({} as Quote)
  const { orderType } = quoteData || { orderType: 'Market' }

  return (
    <Wrapper>
      <Text>
        {/* notificationType !== NotificationType.LIQUIDATION_ALERT && notificationType !== NotificationType.PUSH && (
          <OrderType>{orderType}</OrderType>
        ) */}

        <NotificationSummary notification={content} />
      </Text>
    </Wrapper>
  )
}

export function NotificationPopupIcons({ content }: { content: NotificationDetails }) {
  const { quoteId, notificationType } = content
  const existedQuoteCallback = useGetExistedQuoteByIdsCallback()
  const existedQuote = existedQuoteCallback(quoteId)
  const { quotes, loading } = useGetQuoteByIds([Number(quoteId)])
  const quoteData = existedQuote ? existedQuote : !loading ? quotes[0] : ({} as Quote)
  if (notificationType === NotificationType.PUSH)
    return <ImageWithFallback src={'/static/images/etc/intx-coin.svg'} width={20} height={20} alt={`icon`} />

  return notificationType === NotificationType.LIQUIDATION_ALERT ? (
    <ImageWithFallback src={LIQUIDATION_ALERT_ICON} width={14} height={14} alt={`icon`} />
  ) : (
    <NotificationPopupIcon quote={quoteData} />
  )
}
