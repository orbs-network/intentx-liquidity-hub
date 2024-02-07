import { ApiState } from 'types/api'

export type UserTradingIncentives = {
  tradingIncentivesUserVolume: TradingIncentivesUserVolume | null
  tradingIncentivesUserVolumeFetchStatus: ApiState

  userPointsCalculation: string | null
}

export type TradingIncentivesUserVolume = {
  userDailyEpochVolume: string | null
  userTotalVolume: string | null
}

export type VirtualPointsLeaderboardEntry = {
  userAddress: string | null
  points: number | null
  cummulativePoints: number | null
  volume: string | null
  cummulativeVolume: string | null
  boostedVolume: string | null
  cummulativeBoostedVolume: string | null
  rank: number | null
  cummulativeRank: number | null
  pointsObtainedOnlyWithBoost: number | null
  cummulativePointsObtainedOnlyWithBoost: number | null
  tradingStreak: number | null
}

export type VirtualPointsLeaderboard = {
  leaderboard: VirtualPointsLeaderboardEntry[]
}
