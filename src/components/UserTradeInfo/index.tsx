import { TradeInfoElement } from 'components/TradeInfoElement'
import { getCurrentEpochNumber } from 'lib/epoch/getEpochInformation'
import useDailyEpochRemainingTime from 'lib/epoch/useDailyEpochRemainingTime'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useCurrentEpochAnalytics, useTotalMainAnalytics } from 'state/analytics/hooks'
import { useUserTradingIncentivesVolume, useVirtualPointsUserLeaderboardEntry } from 'state/tradingIncentives/hooks'
import styled from 'styled-components'
import { formatDollarAmount, fromWei } from 'utils/numbers'
import BarChartOutline from '/public/static/images/etc/bar-chart-outline.svg'
import CubeOutline from '/public/static/images/etc/cube-outline.svg'
import DonutOutline from '/public/static/images/etc/donut-outline.svg'
import GlobeOutline from '/public/static/images/etc/globe-outline.svg'
import ReloadTimeOutline from '/public/static/images/etc/reload-time-outline.svg'
import UserOuline from '/public/static/images/etc/user-outline.svg'
import { useEffect } from 'react'

const Wrapper = styled.div`
  margin-top: 20px;
  max-width: 1900px;
  width: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
  grid-column-gap: 20px;
  grid-row-gap: 15px;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  grid-template-rows: 1fr;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  max-width: 1425px;
  grid-column-gap: 14px;
  grid-row-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));

`}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  grid-template-columns: 1fr;
  `}
`

export default function UserTradeInfo() {
  const currentEpoch = getCurrentEpochNumber()
  const { hours, minutes, seconds } = useDailyEpochRemainingTime()

  const userTradingIncentivesVolume = useUserTradingIncentivesVolume()
  const epochAnalytics = useCurrentEpochAnalytics()
  const globalAnalytics = useTotalMainAnalytics()

  const userVirtualLeaderboardEntry = useVirtualPointsUserLeaderboardEntry()

  const { isConnected } = useActiveConnectionDetails()

  return (
    <Wrapper>
      <TradeInfoElement title="Current Epoch" value={currentEpoch.toString()} icon={CubeOutline} />
      <TradeInfoElement
        title="Your Epoch Traded Volume"
        value={
          isConnected
            ? userTradingIncentivesVolume
              ? formatDollarAmount(fromWei(userTradingIncentivesVolume?.userDailyEpochVolume)) ?? '0.00'
              : 'Loading...'
            : 'Connect First'
        }
        icon={DonutOutline}
      />
      <TradeInfoElement
        title="Your Total Traded Volume"
        value={
          isConnected
            ? userTradingIncentivesVolume
              ? formatDollarAmount(fromWei(userTradingIncentivesVolume?.userTotalVolume)) ?? '0.00'
              : 'Loading...'
            : 'Connect First'
        }
        icon={UserOuline}
      />
      <TradeInfoElement
        title="Countdown to Next Epoch"
        value={`${hours}h ${minutes}m ${seconds}s`}
        icon={ReloadTimeOutline}
      />
      <TradeInfoElement
        title="Global Daily Traded Volume"
        value={formatDollarAmount(fromWei(epochAnalytics?.tradeVolume))}
        icon={BarChartOutline}
      />
      <TradeInfoElement
        title="Global Total Traded Volume"
        value={formatDollarAmount(fromWei(globalAnalytics?.tradeVolume)) ?? '0.00'}
        icon={GlobeOutline}
      />
    </Wrapper>
  )
}
