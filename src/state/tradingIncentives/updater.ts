import { SupportedChainId } from 'constants/chains'
import { getCurrentEpochStartTimestamp } from 'lib/epoch/getEpochInformation'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useEffect } from 'react'
import { AppThunkDispatch, useAppDispatch } from 'state'
import { useSelectedEpochTimestampInSecondsForLeaderboard } from './hooks'
import {
  getTradingIncentivesUserAnalytics,
  getUserVirtualPointsLeaderboardDetails,
  getVirtualPointsLeaderboard,
  getYesterdayUserVirtualPointsLeaderboardDetails,
} from './thunks'

export default function TradingIncentivesUpdater() {
  const { account, chainId } = useActiveConnectionDetails()
  const thunkDispatch: AppThunkDispatch = useAppDispatch()

  const selectedEpochTimestampForLeaderboard = useSelectedEpochTimestampInSecondsForLeaderboard()

  useEffect(() => {
    const cId = chainId ? chainId : SupportedChainId.BASE

    const epochStartTimestamp = getCurrentEpochStartTimestamp()
    const previousEpochStartTimestamp = epochStartTimestamp - 86400
    if (account) {
      thunkDispatch(
        getTradingIncentivesUserAnalytics({
          chainId: cId,
          user: account,
        })
      )

      thunkDispatch(
        getUserVirtualPointsLeaderboardDetails({
          userAddress: account,
          timestamp: epochStartTimestamp,
        })
      )

      thunkDispatch(
        getYesterdayUserVirtualPointsLeaderboardDetails({
          userAddress: account,
          timestamp: previousEpochStartTimestamp,
        })
      )
    }
  }, [account, chainId, thunkDispatch])

  useEffect(() => {
    if (!selectedEpochTimestampForLeaderboard) return

    thunkDispatch(
      getVirtualPointsLeaderboard({
        timestamp: selectedEpochTimestampForLeaderboard,
      })
    )
  }, [selectedEpochTimestampForLeaderboard, thunkDispatch])

  return null
}
