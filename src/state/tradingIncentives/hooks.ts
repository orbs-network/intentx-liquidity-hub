import { useAppSelector } from 'state'
import { TradingIncentivesUserVolume, VirtualPointsLeaderboard, VirtualPointsLeaderboardEntry } from './types'

export function useSelectedEpochTimestampInSecondsForLeaderboard(): number | null {
  const selectedEpochTimestampInSecondsForLeaderboard: number | null = useAppSelector(
    (state) => state.tradingIncentives.selectedEpochTimestampInSecondsForLeaderboard
  )

  return selectedEpochTimestampInSecondsForLeaderboard
}

export function useUserTradingIncentivesVolume(): TradingIncentivesUserVolume | null {
  const tradingIncentivesUserAnalytics: TradingIncentivesUserVolume = useAppSelector(
    (state) => state.tradingIncentives.tradingIncentivesUserVolume
  )

  return tradingIncentivesUserAnalytics
}

export function useTradingIncentivesUserPoints(): number | null {
  const virtualPointsLeaderboardEntry: VirtualPointsLeaderboardEntry = useAppSelector(
    (state) => state.tradingIncentives.userVirtualPointsLeaderboardEntry
  )

  return virtualPointsLeaderboardEntry?.points ?? null
}

export function useVirtualPointsUserLeaderboardEntry(): VirtualPointsLeaderboardEntry | null {
  const virtualPointsLeaderboardEntry: VirtualPointsLeaderboardEntry = useAppSelector(
    (state) => state.tradingIncentives.userVirtualPointsLeaderboardEntry
  )

  return virtualPointsLeaderboardEntry
}

export function useYesterdayVirtualPointsUserLeaderboardEntry(): VirtualPointsLeaderboardEntry | null {
  const yesterdayVirtualPointsLeaderboardEntry: VirtualPointsLeaderboardEntry = useAppSelector(
    (state) => state.tradingIncentives.yesterdayUserVirtualPointsLeaderboardEntry
  )

  return yesterdayVirtualPointsLeaderboardEntry
}

export function useVirtualPointsLeaderboard(): VirtualPointsLeaderboard | null {
  const virtualPointsLeaderboard: VirtualPointsLeaderboard = useAppSelector(
    (state) => state.tradingIncentives.virtualPointsLeaderboard
  )

  return virtualPointsLeaderboard ?? null
}
