import { createReducer } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

import {
  getDailyMainAnalytics,
  getLast24HoursSymbolsTradingVolume,
  getOpenInterestAnalytic,
  getSymbolTradeAnalytics,
  getTotalMainAnalytics,
} from './thunks'
import {
  Leaderboard,
  MainAnalyticsHistory,
  OpenInterestDetails,
  SymbolDailyTradeVolume,
  SymbolTradeVolume,
  TotalMainAnalytics,
} from './types'

import { updateFilterDateRange } from './actions'

export interface AnalyticsState {
  totalMainAnalytics: TotalMainAnalytics | null
  mainAnalyticsHistory: MainAnalyticsHistory[] | null
  mainAnalyticsHistoryFilterDateRange: [Date, Date]
  symbolTradeAnalytics: SymbolTradeVolume[] | null
  openInterestAnalytic: OpenInterestDetails[] | null
  last24HoursSymbolsTradingVolume: SymbolDailyTradeVolume[] | null

  // Leaderboard
  leaderboard: Leaderboard | null
}

const initialState: AnalyticsState = {
  totalMainAnalytics: null,
  mainAnalyticsHistory: null,
  mainAnalyticsHistoryFilterDateRange: [dayjs().subtract(6, 'month').toDate(), new Date()],
  symbolTradeAnalytics: null,
  openInterestAnalytic: null,
  last24HoursSymbolsTradingVolume: null,
  leaderboard: null,
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(getDailyMainAnalytics.pending, (state) => {
      state.mainAnalyticsHistory = null
    })
    .addCase(getDailyMainAnalytics.fulfilled, (state, { payload }) => {
      if (payload.dailyMainAnalytics) {
        state.mainAnalyticsHistory = payload.dailyMainAnalytics
      }
    })
    .addCase(getDailyMainAnalytics.rejected, (state) => {
      console.error('Unable to fetch analytics from The Graph Network')
    })
    .addCase(getTotalMainAnalytics.pending, (state) => {
      state.totalMainAnalytics = null
    })
    .addCase(getTotalMainAnalytics.fulfilled, (state, { payload }) => {
      if (payload.totalMainAnalytics) {
        state.totalMainAnalytics = payload.totalMainAnalytics
      }
    })
    .addCase(getTotalMainAnalytics.rejected, (state) => {
      console.error('Unable to fetch analytics from The Graph Network')
    })
    .addCase(getSymbolTradeAnalytics.pending, (state) => {
      state.symbolTradeAnalytics = null
    })
    .addCase(getSymbolTradeAnalytics.fulfilled, (state, { payload }) => {
      if (payload.symbolTradeAnalytics) {
        state.symbolTradeAnalytics = payload.symbolTradeAnalytics
      }
    })
    .addCase(getSymbolTradeAnalytics.rejected, (state) => {
      console.error('Unable to fetch analytics from The Graph Network')
    })
    .addCase(getOpenInterestAnalytic.pending, (state) => {
      state.openInterestAnalytic = null
    })
    .addCase(getOpenInterestAnalytic.fulfilled, (state, { payload }) => {
      if (payload.openInterestAnalytic) {
        state.openInterestAnalytic = payload.openInterestAnalytic
      }
    })
    .addCase(getOpenInterestAnalytic.rejected, (state) => {
      console.error('Unable to fetch analytics from The Graph Network')
    })
    .addCase(updateFilterDateRange, (state, { payload }) => {
      state.mainAnalyticsHistoryFilterDateRange = payload
    })
    .addCase(getLast24HoursSymbolsTradingVolume.pending, (state) => {
      state.last24HoursSymbolsTradingVolume = null
    })
    .addCase(getLast24HoursSymbolsTradingVolume.fulfilled, (state, { payload }) => {
      if (payload.last24HoursSymbolsTradingVolume) {
        state.last24HoursSymbolsTradingVolume = payload.last24HoursSymbolsTradingVolume
      }
    })
    .addCase(getLast24HoursSymbolsTradingVolume.rejected, (state) => {
      console.error('Unable to fetch analytics from The Graph Network')
    })
})
