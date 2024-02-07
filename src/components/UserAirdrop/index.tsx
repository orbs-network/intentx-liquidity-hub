import { Row } from 'components/Row'
import Image from 'next/image'
import styled from 'styled-components'

import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useMemo } from 'react'
import { LoaderIcon } from 'react-hot-toast'
import { useVirtualPointsUserLeaderboardEntry } from 'state/tradingIncentives/hooks'
import Airdrop from '/public/static/images/etc/airdrop-outline.svg'

const Wrapper = styled.div`
  background: rgba(35, 39, 49, 0.5);
  max-width: 1900px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px 0;
  gap: 8px;
  border-radius: 15px;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  max-width: 1425px;
  padding: 20px 0;
  gap: 6px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 28px 54px;
    text-align: center;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 28px 16px;
    text-align: center;
  `}
`

const Title = styled.span`
  font-weight: 500;
  font-size: 20px;
  line-height: 30px;
  color: ${({ theme }) => theme.white};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 14px;
  line-height: 21px;
  `}
`

const PointsValue = styled.span`
  font-weight: 300;
  font-size: 35px;
  line-height: 52px;
  color: ${({ theme }) => theme.white};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 24px;
  line-height: 36px;
  `}
`

const AirdropDescription = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.white};
  opacity: 0.5;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 11px;
  line-height: 16px;
  `}
`

export default function UserAirdrop() {
  const userLeaderboard = useVirtualPointsUserLeaderboardEntry()

  const { isConnected } = useActiveConnectionDetails()

  const parsedPoints = useMemo(() => {
    if (userLeaderboard === null || userLeaderboard.points === null || userLeaderboard.cummulativePoints === null)
      return '-'

    const computatedPoints = (userLeaderboard.cummulativePoints - userLeaderboard.points).toFixed(0)

    return isNaN(parseInt(computatedPoints)) ? 0 : computatedPoints
  }, [userLeaderboard])

  return (
    <Wrapper id="user-airdrop">
      <Row gap="5px" justify="center">
        <Image unoptimized={true} src={Airdrop} alt="icon" />
        <Title>Your Accumulated Points</Title>
      </Row>
      <PointsValue>{isConnected ? parsedPoints ?? <LoaderIcon /> : 'Connect First'}</PointsValue>
      <AirdropDescription>
        Airdrop points will accrue every 24 hours at 00:00 UTC. Points are calculated based on your trading volume with
        a bonus of your referrals
      </AirdropDescription>
    </Wrapper>
  )
}
