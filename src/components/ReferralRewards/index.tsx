import Column from 'components/Column'
import { Row } from 'components/Row'
import Image from 'next/image'
import styled from 'styled-components'

import { useEffect, useMemo } from 'react'
import { LoaderIcon } from 'react-hot-toast'
import { useBonusPointsObtainedWithTheReferrals, useUserReferralAccountInfo } from 'state/referrals/hooks'
import { useVirtualPointsUserLeaderboardEntry } from 'state/tradingIncentives/hooks'
import GiftBox from '/public/static/images/etc/gift-box.svg'

const Wrapper = styled.div`
  background: linear-gradient(90deg, rgba(188, 39, 56, 0.3) 0%, rgba(110, 22, 32, 0.3) 128.07%);
  border-radius: 10px;
  width: 100%;
  max-width: 1800px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  position: relative;
  margin-top: 80px;
  padding-right: 22px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 10px;
    padding: 1px;
    background: linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin-top: 56px;
  padding-right: 16px;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
    padding-right: 0;
  `};
`

const Label = styled.span<{ size?: string; weight?: string }>`
  font-weight: ${({ weight }) => (weight ? weight : '400')};
  font-size: ${({ size }) => (size ? size : '18px')};
  color: ${({ theme }) => theme.white};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 14px;
  `};
`

const LeftRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 24px 85px 24px 12px;
  border-radius: 10px;
  gap: 10px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 10px;
    padding: 1px;
    background: linear-gradient(90deg, #bc2738 0%, #bc2738 128.07%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 16px 58px 16px 8px;
  gap: 8px;
  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
    justify-content: center;
    padding: 24px 0;
  `};
`

interface ReferralRewardsProps {
  isMobile?: boolean
}

export default function ReferralRewards({ isMobile }: ReferralRewardsProps) {
  const referralAccountInfo = useUserReferralAccountInfo()
  const bonusPointsByReferrals = useBonusPointsObtainedWithTheReferrals()
  const currentLeaderboardPosition = useVirtualPointsUserLeaderboardEntry()

  const currentCumulativePointsDescartingEpochOnes = useMemo(() => {
    if (
      currentLeaderboardPosition?.cummulativePointsObtainedOnlyWithBoost == undefined ||
      currentLeaderboardPosition?.cummulativePointsObtainedOnlyWithBoost === null ||
      currentLeaderboardPosition?.pointsObtainedOnlyWithBoost === undefined ||
      currentLeaderboardPosition?.pointsObtainedOnlyWithBoost === null
    )
      return 0

    return (
      currentLeaderboardPosition.cummulativePointsObtainedOnlyWithBoost -
      currentLeaderboardPosition.pointsObtainedOnlyWithBoost
    )
  }, [currentLeaderboardPosition])

  useEffect(() => {
    console.log('currentLeaderboardPosition', currentLeaderboardPosition)
  }, [currentLeaderboardPosition])

  return (
    <Wrapper>
      <LeftRow>
        <Image unoptimized={true} src={GiftBox} alt="GiftBox" />
        <Column>
          <Label weight="600" size={isMobile ? '14px' : '18px'}>
            Cumulative Referral Rewards
          </Label>
        </Column>
      </LeftRow>
      <Row width="fit-content" gap="15px" height={!isMobile ? 'unset' : '103px'} padding="16px">
        <Row width="fit-content" gap="10px">
          {/* <Image unoptimized={true} src={IntxCoin} alt="IntxCoin" /> */}
          {bonusPointsByReferrals === null && referralAccountInfo.accountInfo?.isRegistered && <LoaderIcon />}
          <Label size={isMobile ? '14px' : '18px'}>
            {/* bonusPointsByReferrals && bonusPointsByReferrals.toFixed(0) */}
            {currentCumulativePointsDescartingEpochOnes.toFixed(2)}
            <Label size={isMobile ? '14px' : '18px'} weight="600">
              {' '}
              Points
            </Label>
          </Label>
        </Row>
        {/* <GradientButton label="Claim Rewards" onClick={() => {}} size={isMobile ? '180px' : '220px'} /> */}
      </Row>
    </Wrapper>
  )
}
