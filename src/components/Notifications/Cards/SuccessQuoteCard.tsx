

import { NotificationDetails, NotificationMessages } from 'state/notifications/types'
import { Quote } from 'types/quote'
import { Account } from 'types/user'

import { useMarket } from 'hooks/useMarkets'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import useCurrencyLogo from 'lib/hooks/useCurrencyLogo'

import BaseItem from 'components/Notifications/Cards/BaseCard'
import ShimmerAnimation from 'components/ShimmerAnimation'
import { PartiallyFillText, PartiallyFillTitle } from './styles'

export default function SuccessQuoteCard({
  notification,
  account,
  quote,
  loading,
}: {
  notification: NotificationDetails
  account: Account
  quote?: Quote
  loading?: boolean
}): JSX.Element {
  const { chainId } = useActiveConnectionDetails()
  const { marketId, orderType } = quote || {}
  const { modifyTime, lastSeenAction, quoteId } = notification
  const { symbol, asset } = useMarket(marketId) || {}
  const token1 = useCurrencyLogo(symbol)
  const text = lastSeenAction !== null ? NotificationMessages[lastSeenAction] : ''

  return (
    <BaseItem
      title={
        <PartiallyFillTitle>
          {loading ? (
            <ShimmerAnimation width={'55px'} height={'14px'} />
          ) : (
            <div>
              {symbol}-{asset}{' '}
            </div>
          )}
          <div>
            {' '}
            - Q{quoteId}
          </div>
        </PartiallyFillTitle>
      }
      text={
        <PartiallyFillText>
          <div>&#34;{text}&#34; successful</div>
        </PartiallyFillText>
      }
      token1={token1}
      timestamp={modifyTime}
      accountName={account.name}
      loading={loading}
    />
  )
}
