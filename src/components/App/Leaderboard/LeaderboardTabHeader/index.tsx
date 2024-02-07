import Column from 'components/Column'
import { Row } from 'components/Row'
import Image from 'next/image'
import styled from 'styled-components'

import TimeIcon from '/public/static/images/etc/time-outline.svg'
import Trophy from '/public/static/images/etc/trophy-outline.svg'
import Wallet from '/public/static/images/etc/wallet.svg'

import { useConnectModal } from '@rainbow-me/rainbowkit'
import OutlineBtn from 'components/Button/OutlineButton'
import Checkbox from 'components/CheckBox'
import dayjs from 'dayjs'
import { getCurrentEpochStartTimestamp, getEpochNumberFromTimestamp } from 'lib/epoch/getEpochInformation'
import useDailyEpochRemainingTime from 'lib/epoch/useDailyEpochRemainingTime'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { useUserReferralAccountInfo } from 'state/referrals/hooks'
import {
  useSelectedEpochTimestampInSecondsForLeaderboard,
  useVirtualPointsLeaderboard,
  useVirtualPointsUserLeaderboardEntry,
} from 'state/tradingIncentives/hooks'
import { ApiState } from 'types/api'
import { formatDollarAmount, fromWei } from 'utils/numbers'
import EpochDatePicker from './EpochDatePicker'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 100;
  margin-top: 70px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin-top: 20px;
 `};

  //   ${({ theme }) => theme.mediaWidth.upToSmall`
//     padding: 10rem 54px;
//   `}
  //   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//     padding: 10rem 16px;
//   `}
`

const TabOption = styled.div<{ active: boolean }>`
  padding: 10px 75px;
  flex-shrink: 0;
  border-bottom: 2px solid ${({ active, theme }) => (active ? theme.red : '#2A303A')};
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin-top: 16px;
  padding: 8px 50px;
  font-size: 10px;
 `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
  text-align: center;
  padding: 10px 0;
  width: 100%;
  flex-shrink: 1;
  margin-top: 16px;
  font-size: 12px;
 `};
`

const TimeLabel = styled.span`
  font-weight: 400;
  font-size: 16px;
  color: ${({ theme }) => theme.white};
  white-space: nowrap;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 10px;
 `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: 12px;
 `}
`

const CountdownContainer = styled.div`
  width: 50px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 5px;
    padding: 2px;
    background: linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 35px;
  height: 20px;
 `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: 40px;
 `}
`

const HeaderLine = styled.div`
  height: 4px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  height: 3px;
 `};

  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, #2a303a 0.5%, rgba(42, 48, 58, 0.958333) 57.51%, rgba(42, 48, 58, 0) 100%);
  border-image-slice: 1;
`

const InfoLabel = styled.span<{ size?: string; weight?: string }>`
  font-weight: ${({ weight }) => weight ?? '500'};
  font-size: ${({ size }) => size ?? '14px'};
  color: ${({ theme }) => theme.white};

  ${({ theme, size }) => theme.mediaWidth.upToExtraLarge`
  font-size: 10px;
 `};

  ${({ theme, size }) => theme.mediaWidth.upToMedium`
  font-size: ${() => size ?? '12px'};
 `}
`

const Divider = styled.div<{ size?: string }>`
  height: ${({ size }) => size ?? '22px'};
  width: 1px;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
`

const ResponsiveRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
 `}
`

const ResponsiveBottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 30px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin-top: 20px;
 `};

  ${({ theme }) => theme.mediaWidth.upToLarge`
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
 `};
`

const ResponsiveContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 30px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 20px;
 `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
 `};
`

const ResponsiveInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 6px;
 `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
flex-direction: column;
justify-content: center;
align-items: flex-start;
flex-shink: 0;
gap: 0px;
`};
`

const ViewingOldDataWarning = styled.div`
  color: ${({ theme }) => theme.yellow1};
  font-size: 12px;
  text-align: center;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 9px;
 `};
`

const ViewAllTimeDataRow = styled.div`
  display: flex;
  gap: 20px;

  align-items: center;

  & > * {
    margin: 0 4px;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 14px;
 `};
`
const DividerContainer = styled.div`
  position: relative;
  top: 10px;
`

export default function LeaderboardTabHeader({
  selectedTab,
  onChange,
  isWalletConnected,
  isMobile,
  viewAllTimeData,
  setViewAllTimeData,
}: {
  selectedTab: string
  onChange: any
  isWalletConnected: boolean
  isMobile: boolean
  viewAllTimeData: boolean
  setViewAllTimeData: any
}) {
  const handleChangeTab = (tab: string) => (): void => {
    onChange?.(tab)
  }

  const selectedEpochTimestamp = useSelectedEpochTimestampInSecondsForLeaderboard()
  const userLeaderboardInfo = useVirtualPointsUserLeaderboardEntry()
  const leaderboard = useVirtualPointsLeaderboard()
  const userReferralsInfo = useUserReferralAccountInfo()

  const day = selectedEpochTimestamp && dayjs(selectedEpochTimestamp * 1000).format('DD')
  const month = selectedEpochTimestamp && dayjs(selectedEpochTimestamp * 1000).format('MMM')

  const { hours, minutes, seconds } = useDailyEpochRemainingTime()
  const { openConnectModal } = useConnectModal()
  const toggleConnectionModal_temp = useToggleModal(ApplicationModal.ACCOUNT_ABSTRACTION_CONNECTING)

  const [epochSelectorOpened, setEpochSelectorOpened] = useState(false)

  const isWatchingOldData = selectedEpochTimestamp && selectedEpochTimestamp < getCurrentEpochStartTimestamp()

  const cummulativeUserLeaderboardPoints = useMemo(() => {
    if (
      userLeaderboardInfo === null ||
      userLeaderboardInfo.points === null ||
      userLeaderboardInfo.cummulativePoints === null
    )
      return '-'

    const computatedPoints = (userLeaderboardInfo.cummulativePoints - userLeaderboardInfo.points).toFixed(0)

    return isNaN(parseInt(computatedPoints)) ? 0 : computatedPoints
  }, [userLeaderboardInfo])

  const { account } = useActiveConnectionDetails()

  return (
    <Wrapper>
      <ResponsiveRow>
        <Row align="flex-end">
          <TabOption active={selectedTab === 'leaderboard'} onClick={handleChangeTab('leaderboard')}>
            Leaderboard
          </TabOption>
          <TabOption
            active={selectedTab === 'rewards'}
            onClick={() => {
              toast.error('Coming Soon')
              handleChangeTab('rewards')
            }}
          >
            My Rewards (Incoming)
          </TabOption>
          {!isMobile ? <HeaderLine /> : null}
        </Row>
        <Row width="fit-content" gap="10px" flexShrink={0}>
          <Image unoptimized={true} src={TimeIcon} alt="icon" />
          <TimeLabel>Epoch Flip in</TimeLabel>
          <CountdownContainer>
            <TimeLabel>{hours}h</TimeLabel>
          </CountdownContainer>
          <TimeLabel>:</TimeLabel>
          <CountdownContainer>
            <TimeLabel>{minutes}m</TimeLabel>
          </CountdownContainer>
          <TimeLabel>:</TimeLabel>
          <CountdownContainer>
            <TimeLabel>{seconds}s</TimeLabel>
          </CountdownContainer>
        </Row>
      </ResponsiveRow>
      <ResponsiveBottomRow>
        <ResponsiveContainer>
          <Row gap="0px" width="fit-content">
            <Row gap="10px" width="fit-content" justifyContent="center">
              {/* <Image
                unoptimized={true}
                src={Calendar}
                alt="icon"
                style={{ width: isMobile ? '32px' : 'auto', height: isMobile ? '32px' : 'auto' }}
          /> */}

              <Column>
                <InfoLabel size={isMobile ? '16px' : '22px'} weight="500">
                  Epoch {selectedEpochTimestamp && getEpochNumberFromTimestamp(selectedEpochTimestamp)}
                </InfoLabel>
                <InfoLabel weight="400">
                  {day} {month}
                </InfoLabel>
              </Column>
              <EpochDatePicker
                disabled={viewAllTimeData}
                isOpened={epochSelectorOpened}
                setIsOpened={setEpochSelectorOpened}
              />
            </Row>
            {/* <Divider size={isMobile ? '42px' : '22px'} /> */}
            <Row gap="10px" width="fit-content">
              {/* <Image
                unoptimized={true}
                src={Medal}
                alt="icon"
                style={{ width: isMobile ? '32px' : 'auto', height: isMobile ? '32px' : 'auto' }}
              /> */}
              {/* <Column>
                <InfoLabel size={isMobile ? '16px' : '22px'} weight="500">
                  20,000 Points
                </InfoLabel>
                <InfoLabel weight="400">
                  <InfoLabel weight="600">Rewards</InfoLabel> per Epoch
                </InfoLabel>
              </Column> */}
            </Row>
          </Row>

          {!isMobile ? (
            <DividerContainer>
              <Divider size="70px" />
            </DividerContainer>
          ) : null}

          {!isWalletConnected ? (
            <OutlineBtn
              onClick={() => {
                // toggleConnectionModal()
                toggleConnectionModal_temp()
                openConnectModal && openConnectModal()
              }}
              full={isMobile}
              padding={isMobile ? '18px 0' : '18px 30px'}
            >
              <Image unoptimized={true} src={Wallet} alt="icon" />
              Connect your Wallet
            </OutlineBtn>
          ) : (
            <Row gap="10px" width="fit-content" align="flex-end">
              {/* <Image
                unoptimized={true}
                src={UserExample}
                alt="icon"
                style={{ width: isMobile ? '32px' : 'auto', height: isMobile ? '32px' : 'auto' }}
          /> */}
              {userReferralsInfo?.fetchStatus === ApiState.OK &&
                (userReferralsInfo?.accountInfo?.isRegistered ? (
                  <Row gap="10px" align="flex-end">
                    <Column>
                      <InfoLabel size={isMobile ? '16px' : '22px'} weight="500">
                        Your Position
                      </InfoLabel>
                      <Row width="fit-content" gap="5px">
                        <Image
                          unoptimized={true}
                          src={Trophy}
                          alt="icon"
                          style={{ width: isMobile ? '16px' : 'auto', height: isMobile ? '16px' : 'auto' }}
                        />

                        <InfoLabel weight="600">
                          {viewAllTimeData ? 'Global Position' : 'Epoch Position'}{' '}
                          {viewAllTimeData
                            ? leaderboard?.leaderboard.find((e) => {
                                return e.userAddress?.toLowerCase() === account?.toLowerCase()
                              })?.cummulativeRank
                            : userLeaderboardInfo?.rank}
                        </InfoLabel>
                      </Row>
                    </Column>

                    <Divider size={isMobile ? '42px' : '22px'} />

                    <ResponsiveInfo>
                      <InfoLabel weight="600">Epoch Trade Volume</InfoLabel>
                      <InfoLabel weight="400">{formatDollarAmount(fromWei(userLeaderboardInfo?.volume))}</InfoLabel>
                    </ResponsiveInfo>

                    <Divider size={isMobile ? '42px' : '22px'} />

                    <ResponsiveInfo>
                      <InfoLabel weight="600">Epoch Potential Rewards</InfoLabel>
                      <InfoLabel weight="400">{userLeaderboardInfo?.points?.toFixed(0)} Points</InfoLabel>
                    </ResponsiveInfo>

                    <Divider size={isMobile ? '42px' : '22px'} />

                    <ResponsiveInfo>
                      <InfoLabel weight="600">Your Points</InfoLabel>
                      <InfoLabel weight="400">{cummulativeUserLeaderboardPoints} Points</InfoLabel>
                    </ResponsiveInfo>
                  </Row>
                ) : (
                  <>Sign up to enroll in the leaderboard</>
                ))}
            </Row>
          )}

          {isWatchingOldData ? (
            <Column>
              <ViewingOldDataWarning>
                You are watching historical data. Your position may be different from the current epoch.
              </ViewingOldDataWarning>
            </Column>
          ) : (
            <Row width="fit-content">
              <ViewAllTimeDataRow>
                <InfoLabel weight="600">View All Time Data</InfoLabel>

                <Checkbox
                  id="view-all-time-checkbox"
                  checked={viewAllTimeData}
                  onChange={(e) => setViewAllTimeData(e.target.checked)}
                  label=""
                  name="a"
                />
              </ViewAllTimeDataRow>
            </Row>
          )}
        </ResponsiveContainer>

        {/* <Row
          gap="10px"
          width={isMobile ? '100%' : 'fit-content'}
          flexWrap={isMobile ? 'wrap' : 'noWrap'}
          marginTop={isMobile ? '24px' : '0'}
        >
          {isWalletConnected ? (
            <OutlineBtn full={isMobile} padding={isMobile ? '18px 0' : '18px 30px'}>
              Claim Rewards
            </OutlineBtn>
          ) : null}

          <DateFilter isMobile={isMobile} />
          </Row> */}
      </ResponsiveBottomRow>
    </Wrapper>
  )
}
