import { createReducer } from '@reduxjs/toolkit'
import { getCurrentEpochStartTimestamp } from 'lib/epoch/getEpochInformation'
import { ApiState } from 'types/api'
import { updateSelectedEpochDateForLeaderboard } from './actions'
import {
  getTradingIncentivesUserAnalytics,
  getUserVirtualPointsLeaderboardDetails,
  getVirtualPointsLeaderboard,
  getYesterdayUserVirtualPointsLeaderboardDetails,
} from './thunks'
import { TradingIncentivesUserVolume, VirtualPointsLeaderboard, VirtualPointsLeaderboardEntry } from './types'

export interface TradingIncentivesState {
  tradingIncentivesUserVolume: TradingIncentivesUserVolume | null
  tradingIncentivesUserVolumeFetchStatus: ApiState

  selectedEpochTimestampInSecondsForLeaderboard: number | null

  virtualPointsLeaderboard: VirtualPointsLeaderboard | null
  virtualPointsLeaderboardFetchStatus: ApiState

  userVirtualPointsLeaderboardEntry: VirtualPointsLeaderboardEntry | null
  userVirtualPointsLeaderboardEntryFetchStatus: ApiState

  yesterdayUserVirtualPointsLeaderboardEntry: VirtualPointsLeaderboardEntry | null
  yesterdayUserVirtualPointsLeaderboardEntryFetchStatus: ApiState
}

const initialState: TradingIncentivesState = {
  tradingIncentivesUserVolume: null,
  tradingIncentivesUserVolumeFetchStatus: ApiState.LOADING,

  selectedEpochTimestampInSecondsForLeaderboard: getCurrentEpochStartTimestamp(),

  virtualPointsLeaderboard: null,
  virtualPointsLeaderboardFetchStatus: ApiState.LOADING,

  userVirtualPointsLeaderboardEntry: null,
  userVirtualPointsLeaderboardEntryFetchStatus: ApiState.LOADING,

  yesterdayUserVirtualPointsLeaderboardEntry: null,
  yesterdayUserVirtualPointsLeaderboardEntryFetchStatus: ApiState.LOADING,
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateSelectedEpochDateForLeaderboard, (state, { payload }) => {
      state.selectedEpochTimestampInSecondsForLeaderboard = payload.date
    })
    .addCase(getTradingIncentivesUserAnalytics.pending, (state, { payload }) => {
      state.tradingIncentivesUserVolumeFetchStatus = ApiState.LOADING
    })
    .addCase(getTradingIncentivesUserAnalytics.fulfilled, (state, { payload }) => {
      if (payload && payload.tradingIncentives) {
        state.tradingIncentivesUserVolume = payload.tradingIncentives
      }
    })
    .addCase(getTradingIncentivesUserAnalytics.rejected, (state) => {
      console.error('Unable to fetch analytics from The Graph Network')
    })
    .addCase(getUserVirtualPointsLeaderboardDetails.pending, (state, { payload }) => {
      state.userVirtualPointsLeaderboardEntryFetchStatus = ApiState.LOADING
    })
    .addCase(getUserVirtualPointsLeaderboardDetails.fulfilled, (state, { payload }) => {
      if (payload) {
        state.userVirtualPointsLeaderboardEntry = payload
      }
    })
    .addCase(getUserVirtualPointsLeaderboardDetails.rejected, (state) => {
      console.error('Unable to fetch analytics from The Graph Network')
    })
    .addCase(getYesterdayUserVirtualPointsLeaderboardDetails.pending, (state, { payload }) => {
      state.yesterdayUserVirtualPointsLeaderboardEntryFetchStatus = ApiState.LOADING
    })
    .addCase(getYesterdayUserVirtualPointsLeaderboardDetails.fulfilled, (state, { payload }) => {
      if (payload) {
        state.yesterdayUserVirtualPointsLeaderboardEntry = payload
      }
    })
    .addCase(getYesterdayUserVirtualPointsLeaderboardDetails.rejected, (state) => {
      console.error('Unable to fetch analytics from The Graph Network')
    })

    .addCase(getVirtualPointsLeaderboard.pending, (state, { payload }) => {
      state.virtualPointsLeaderboardFetchStatus = ApiState.LOADING
    })
    .addCase(getVirtualPointsLeaderboard.fulfilled, (state, { payload }) => {
      if (payload) {
        state.virtualPointsLeaderboard = payload
      }
    })
    .addCase(getVirtualPointsLeaderboard.rejected, (state) => {
      console.error('Unable to fetch analytics from The Graph Network')
    })
})
