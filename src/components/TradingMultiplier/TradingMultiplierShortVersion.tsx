import { Row } from 'components/Row'
import Image from 'next/image'
import styled from 'styled-components'

import { ColumnCenter } from 'components/Column'
import { useIsMobile } from 'lib/hooks/useWindowSize'
import { useVirtualPointsUserLeaderboardEntry } from 'state/tradingIncentives/hooks'
import { rewardsData } from './utils'
import PadlockIcon from '/public/static/images/etc/red-padlock.svg'
import CoinsGraphic from '/public/static/images/reward-coins.png'
import IntentXBgLeft from '/public/static/images/rewards-banner-bg-l.png'
import IntentXBgRight from '/public/static/images/rewards-banner-bg-r.png'

const Wrapper = styled.div`
  background: rgba(35, 39, 49, 0.5);
  max-width: 1900px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  gap: 0px;
  margin-top: 2.5rem;
  border-radius: 15px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  max-width: 1425px;
  `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
  `}
`

const Label = styled.span<{ size?: number; fontWeight?: string; withReducedOpacity?: boolean }>`
  font-size: ${({ size }) => (size ? `${size}px` : '16px')};
  justify-self: start;
  font-weight: 400;
  width: max-content;
  color: ${({ theme }) => theme.white};
  opacity: ${({ withReducedOpacity }) => (withReducedOpacity ? '0.5' : '1')};

  ${({ theme, size }) => theme.mediaWidth.upToMedium`

  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
  max-width: 250px;
  text-align: center;
  `};
`

const ResponsiveRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    & > :nth-last-child(1) {
      grid-column: span 3;
    }
  `};
`

const CardContainer = styled.div<{ isUnlocked?: boolean }>`
  width: 165px;
  min-width: 165px;
  height: 200px;
  border-radius: 15px;
  background: #1c1f26;
  overflow: hidden;
  opacity: ${({ isUnlocked }) => (isUnlocked ? '1' : '0.2')};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
    height: 140px;
    min-width: 100px;
  `};
`

const CardHeader = styled.div<{ isToday?: boolean }>`
  background: ${({ isToday }) => (isToday ? 'linear-gradient(90deg, #BC2738 0%, #6E1620 128.07%)' : '#232933')};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px 0;
`

const RewardColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  padding-bottom: 8px;
`

const GradientLabel = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;

  background: linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: 11px;
  `};
`

const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  background: #1c1f26;
  height: 120px;
`

const ActionColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 18px 0;
`

const ResponsiveRewardContainer = styled.div<{ isLast?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ theme, isLast }) => theme.mediaWidth.upToMedium`
  flex-direction: ${isLast ? 'row-reverse' : 'column'};
  align-items: center;
  justify-content: center;
  height: 100%;
  `};
`

const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  gap: 25px;
`

const RewardCard = ({ data }: { data: any }) => {
  const isMobile = useIsMobile()

  return (
    <CardContainer isUnlocked={data.isUnlocked}>
      <RewardColumn>
        <CardHeader isToday={data.isToday}>
          <Label fontWeight="500" size={isMobile ? 12 : 16}>
            {data.isToday ? 'Today' : `Day ${data.dayNumber}`}
          </Label>
        </CardHeader>

        <ResponsiveRewardContainer isLast={data.dayNumber === 7}>
          <Image unoptimized={true} src={data.rewardImage} alt="reward" width={isMobile ? 55 : 90} />
          <ColumnCenter>
            <Label size={isMobile ? 14 : 20} fontWeight="600">
              {data.rewardBonus}%
            </Label>
            {data.isUnlocked ? (
              <GradientLabel>Bonus Rewards</GradientLabel>
            ) : (
              <Label fontWeight="500" size={isMobile ? 11 : 14}>
                Bonus Rewards
              </Label>
            )}
          </ColumnCenter>
        </ResponsiveRewardContainer>
      </RewardColumn>
    </CardContainer>
  )
}

export default function TradingMultiplier() {
  const isMobile = useIsMobile()

  const currentLeaderbordEntry = useVirtualPointsUserLeaderboardEntry()

  return (
    <Wrapper>
      <ContentColumn>
        {!isMobile ? <Label>Trade $1k+ volume on consecutive days to receive bonus Reward Points</Label> : null}

        <ResponsiveRow>
          {currentLeaderbordEntry &&
            currentLeaderbordEntry?.tradingStreak !== null &&
            rewardsData(currentLeaderbordEntry.tradingStreak).map((element) => (
              <RewardCard data={element} key={element.dayNumber} />
            ))}
        </ResponsiveRow>
      </ContentColumn>
    </Wrapper>
  )
}
