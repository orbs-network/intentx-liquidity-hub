export interface TotalMainAnalytics {
  id: string
  openTradeVolume: string
  accounts: string
  quotesCount: string
  tradeVolume: string
  users: string
  withdraw: string
  updateTimestamp: string
  timestamp: string
  platformFee: string
  deposit: string
  allocate: string
  deallocate: string
  closeTradeVolume: string
  accountSource: string
}

export interface MainAnalyticsHistory {
  id: string
  quotesCount: string
  openInterest: string
  maxOpenInterest: string
  newUsers: string
  newAccounts: string
  activeUsers: string
  accountSource: string
  withdraw: string
  updateTimestamp: string
  tradeVolume: string
  timestamp: string
  platformFee: string
  openTradeVolume: string
  deposit: string
  deallocate: string
  closeTradeVolume: string
  allocate: string
}

export type SymbolTradeVolume = {
  id: string
  accountSource: string
  updateTimestamp: string
  volume: string
  timestamp: string
  symbolId: string
}

export type OpenInterestDetails = {
  symbol?: {
    name: string
  }
  amount: string
  accumulatedAmount: string
  id: string
  timestamp: string
}

export type UserDailyTradeVolume = {
  id: string
  quotesCount: string
  openInterest: string
  accountSource: string
  withdraw: string
  updateTimestamp: string
  tradeVolume: string
  timestamp: string
  platformFee: string
  openTradeVolume: string
  deposit: string
  deallocate: string
  closeTradeVolume: string
  allocate: string
  user: {
    id: string
    address: string
  }
}

export type UserTotalTradeVolume = {
  id: string
  quotesCount: string
  accountSource: string
  withdraw: string
  updateTimestamp: string
  tradeVolume: string
  timestamp: string
  generatedFee: string
  openTradeVolume: string
  deposit: string
  deallocate: string
  closeTradeVolume: string
  allocate
}
export interface Leaderboard {
  entries: LeaderboardEntry[]
}

export type LeaderboardEntry = {
  rank: number
  address: string
  volume: number
  reward: string
}

export type SymbolDailyTradeVolume = {
  id: string
  symbol: {
    name: string
  }
  timestamp: string
  volume: string
  updateTimestamp: string
  accountSource: string
}
