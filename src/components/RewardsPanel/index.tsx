import GradientButton from 'components/Button/GradientButton'
import Column, { ColumnCenter } from 'components/Column'
import { Row, RowBetween } from 'components/Row'
import styled from 'styled-components'
import Image from 'next/image'

import Medal from '/public/static/images/etc/medal.svg'
import { useBonusPointsObtainedWithTheReferrals, useUserReferralAccountInfo } from 'state/referrals/hooks'
import { LoaderIcon } from 'react-hot-toast'
import { useEffect, useMemo } from 'react'
import { useVirtualPointsUserLeaderboardEntry } from 'state/tradingIncentives/hooks'

const Wrapper = styled.div`
  background: linear-gradient(90deg, rgba(188, 39, 56, 0.5) 0%, rgba(110, 22, 32, 0.5) 128.07%);
  border-radius: 10px;
  width: 100%;
  max-height: 131px;
  max-width: 1800px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  position: relative;
  margin-top: 80px;
  padding: 10px 20px;

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
  gap: 50px;

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

const ColumnRewards = styled(Column)`
  gap: 5px;
`


interface ReferralRewardsProps {
  isMobile?: boolean
}

export default function RewardsPanel({ isMobile }: ReferralRewardsProps) {

  return (
    <Wrapper>
      <LeftRow>
        <Row width='fit-content' gap='20px'>
          <Image unoptimized={true} src={Medal} alt="Medal" />
          <Column>
            <Label weight="600" size={isMobile ? '18px' : '22px'}>
              Rewards
            </Label>
          </Column> 
        </Row>
        <ColumnRewards>
          <Label weight="500" size={isMobile ? '14px' : '16px'}>
            Pending Rewards
          </Label>
          <Label weight="300" size={isMobile ? '14px' : '16px'}>
            $--,- USDC
          </Label>
        </ColumnRewards>
        <ColumnRewards>
          <Label weight="500" size={isMobile ? '14px' : '16px'}>
            LifeTime Rewards
          </Label>
          <Label weight="300" size={isMobile ? '14px' : '16px'}>
            $--,- USDC
          </Label>
        </ColumnRewards>
      </LeftRow>
      <Row width="fit-content" gap="15px" height={!isMobile ? 'unset' : '103px'} padding="16px">
        <Row width="fit-content" gap="10px">
          <GradientButton
            buttonFilled={true}
            label={'Claim Rewards'}
            onClick={() => console.log('')}
            size="201px"
            height="51px"
          />
          <GradientButton
            buttonFilled={true}
            label={'Claim all'}
            onClick={() => console.log('')}
            size="201px"
            height="51px"
          />
        </Row>
      </Row>
    </Wrapper>
  )
}
