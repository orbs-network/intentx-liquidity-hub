
import USDC_ICON from '/public/static/images/tokens/USDC.svg'
import USDT_ICON from '/public/static/images/tokens/USDT.svg'

import { SupportedChainId } from 'constants/chains'
import { Quote } from 'types/quote'
import { Account } from 'types/user'

import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { NotificationDetails, NotificationMessages } from 'state/notifications/types'

import { useMarket } from 'hooks/useMarkets'
import useCurrencyLogo from 'lib/hooks/useCurrencyLogo'

import BaseItem from 'components/Notifications/Cards/BaseCard'
import ShimmerAnimation from 'components/ShimmerAnimation'
import { PartiallyFillText, PartiallyFillTitle } from './styles'

export default function SeenCard({
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
  const { quoteId, modifyTime, lastSeenAction } = notification
  const { symbol, asset } = useMarket(marketId) || {}
  const token1 = useCurrencyLogo(symbol)
  const token2 = chainId === SupportedChainId.BSC ? USDT_ICON : USDC_ICON

  const text = lastSeenAction !== null ? NotificationMessages[lastSeenAction] : ''

  return (
    <>
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
            <div>&#34;{text}&#34; received</div>
          </PartiallyFillText>
        }
        token1={token1}
        token2={token2}
        timestamp={modifyTime}
        accountName={account.name}
        loading={loading}
      />
    </>
  )
}
