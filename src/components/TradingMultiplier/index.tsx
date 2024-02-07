import Image from 'next/image'
import styled from 'styled-components'

import { ColumnCenter } from 'components/Column'
import { useIsLaptop, useIsMobile } from 'lib/hooks/useWindowSize'
import { useMemo } from 'react'
import {
  useVirtualPointsUserLeaderboardEntry,
  useYesterdayVirtualPointsUserLeaderboardEntry,
} from 'state/tradingIncentives/hooks'
import { rewardsData } from './utils'

const ParentWrapper = styled.span<{ leaderboard: boolean }>`
  background: rgba(35, 39, 49, 0.5);
  max-width: 2000px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 15px;
  z-index: 10;

  margin-top: ${({ leaderboard }) => (leaderboard ? '0rem' : '2.5rem')};
  padding: 0;

  // ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  // max-width: 1425px;
  // `}
  // ${({ theme }) => theme.mediaWidth.upToMedium`
  //   flex-direction: column;
  // `}
`

const Wrapper = styled.div`
  background: rgba(35, 39, 49, 0.6);
  max-width: 1900px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  gap: 0px;
  margin-top: 0rem;
  border-radius: 15px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  max-width: 1425px;
  padding: 8px 10px;
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

  ${({ theme, size }) => theme.mediaWidth.upToExtraLarge`
  font-size: ${size ? `${size}px` : '12px'};
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
  max-width: 350px;
  text-align: center;
  `};
`

const ResponsiveRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    & > :nth-last-child(1) {
      grid-column: span 3;
    }
  `};
`

const CardContainer = styled.div<{ isUnlocked?: boolean }>`
  width: 125px;
  min-width: 125px;
  height: 200px;
  border-radius: 15px;
  background: #1c1f26;
  overflow: hidden;
  opacity: ${({ isUnlocked }) => (isUnlocked ? '1' : '0.3')};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    width: 90px;
    min-width: 90px;
    height: 140px;
  `};

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

const GradientLabel = styled.span<{ size?: number }>`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;

  background: linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;

  ${({ theme, size }) => theme.mediaWidth.upToExtraLarge`
  font-size: ${size ? `${size}px` : '12px'};
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
  max-width: 250px;
  text-align: center;
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
  gap: 8px;
`

const RewardCard = ({ data }: { data: any }) => {
  const isMobile = useIsMobile()
  const isLaptop = useIsLaptop()

  const getResponsiveSize = (mobile: number, desktop: number, isLast?: boolean, isImage?: boolean) => {
    if (isMobile && isLast) {
      return isImage ? mobile * 2 : mobile * 1.3
    } else if (isMobile) {
      return mobile
    } else if (!isMobile && isLast) {
      if (isLaptop) {
        return desktop * 0.7
      } else {
        return desktop
      }
    } else if (!isMobile) {
      if (isLaptop) {
        return desktop * 0.7
      } else {
        return desktop
      }
    }
  }

  return (
    <CardContainer isUnlocked={data.isUnlocked}>
      <RewardColumn>
        <CardHeader isToday={data.isToday}>
          <Label fontWeight="500" size={getResponsiveSize(12, 16)}>
            {data.isToday ? 'Today' : `Day ${data.dayNumber}`}
          </Label>
        </CardHeader>

        <ResponsiveRewardContainer isLast={data.dayNumber === 7}>
          <Image
            unoptimized={true}
            src={data.rewardImage}
            alt="reward"
            width={getResponsiveSize(55, 90, data.dayNumber === 7, true)}
          />
          <ColumnCenter>
            <Label size={getResponsiveSize(14, 20, data.dayNumber === 7)} fontWeight="600">
              {data.rewardBonus}%
            </Label>
            {data.isUnlocked ? (
              <GradientLabel size={getResponsiveSize(11, 14, data.dayNumber === 7)}>Bonus Rewards</GradientLabel>
            ) : (
              <Label fontWeight="500" size={getResponsiveSize(11, 14, data.dayNumber === 7)}>
                Bonus Rewards
              </Label>
            )}
          </ColumnCenter>
        </ResponsiveRewardContainer>
      </RewardColumn>
    </CardContainer>
  )
}

export default function TradingMultiplier({ leaderboard = false }: { leaderboard?: boolean }) {
  const currentLeaderbordEntry = useVirtualPointsUserLeaderboardEntry()
  const yesterdayLeaderboardEntry = useYesterdayVirtualPointsUserLeaderboardEntry()
  const isMobile = useIsMobile()
  const isLaptop = useIsLaptop()

  const currentStreak = useMemo(() => {
    console.log('Current leaderboard entry ', currentLeaderbordEntry)
    console.log('Yesterday leaderboard entry ', yesterdayLeaderboardEntry)
    if (
      currentLeaderbordEntry &&
      currentLeaderbordEntry.tradingStreak !== null &&
      yesterdayLeaderboardEntry &&
      yesterdayLeaderboardEntry.tradingStreak !== null
    ) {
      if (currentLeaderbordEntry.tradingStreak) {
        return currentLeaderbordEntry.tradingStreak
      } else {
        return yesterdayLeaderboardEntry.tradingStreak
      }
    }
    return null
  }, [currentLeaderbordEntry, yesterdayLeaderboardEntry])

  const getResponsiveSize = (mobile: number, desktop: number, isLast?: boolean, isImage?: boolean) => {
    if (isMobile && isLast) {
      return isImage ? mobile * 2 : mobile * 1.3
    } else if (isMobile) {
      return mobile
    } else if (!isMobile && isLast) {
      if (isLaptop) {
        return desktop * 0.7
      } else {
        return desktop
      }
    } else if (!isMobile) {
      if (isLaptop) {
        return desktop * 0.7
      } else {
        return desktop
      }
    }
  }

  return (
    <ParentWrapper leaderboard={leaderboard}>
      <Wrapper>
        {isMobile ? (
          <ColumnCenter gap={isMobile ? '5px' : '35px'}>
            <Label size={getResponsiveSize(16, 25)}>Daily Trading Multiplier</Label>

            <Label size={getResponsiveSize(13, 16)}>
              Trade $10k+ volume on consecutive days to receive bonus Reward Points
            </Label>
          </ColumnCenter>
        ) : null}
        <ContentColumn>
          {!isMobile ? <Label size={getResponsiveSize(16, 25)}>Daily Trading Multiplier</Label> : null}

          {!isMobile ? (
            <Label size={getResponsiveSize(13, 16)}>
              Trade $10k+ volume on consecutive days to receive bonus Reward Points
            </Label>
          ) : null}

          <ResponsiveRow>
            {currentStreak !== null &&
              rewardsData(currentStreak).map((element) => <RewardCard data={element} key={element.dayNumber} />)}
          </ResponsiveRow>
        </ContentColumn>
      </Wrapper>
    </ParentWrapper>
  )
}
