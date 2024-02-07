import { ApiState } from 'types/api'
import { ReferralState } from './types'
import { createReducer } from '@reduxjs/toolkit'
import { getUserReferralAccountInfo, getUserReferralAnalaytics } from './thunks'

export const initialState: ReferralState = {
  userFetchState: ApiState.LOADING,
  userInformation: null,
  userAnalyticsFetchState: ApiState.LOADING,
  userAnalytics: null,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(getUserReferralAccountInfo.pending, (state) => {
      state.userFetchState = ApiState.LOADING
    })
    .addCase(getUserReferralAccountInfo.fulfilled, (state, action) => {
      if (action.payload) {
        state.userFetchState = ApiState.OK
        state.userInformation = action.payload
      } else {
        state.userFetchState = ApiState.ERROR
      }
    })
    .addCase(getUserReferralAccountInfo.rejected, (state) => {
      state.userFetchState = ApiState.ERROR
    })
    .addCase(getUserReferralAnalaytics.pending, (state) => {
      state.userAnalyticsFetchState = ApiState.LOADING
    })
    .addCase(getUserReferralAnalaytics.fulfilled, (state, action) => {
      if (action.payload) {
        state.userAnalyticsFetchState = ApiState.OK
        state.userAnalytics = action.payload
      } else {
        state.userAnalyticsFetchState = ApiState.ERROR
      }
    })
    .addCase(getUserReferralAnalaytics.rejected, (state) => {
      state.userAnalyticsFetchState = ApiState.ERROR
    })
)
