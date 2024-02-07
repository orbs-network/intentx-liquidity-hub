import { createAsyncThunk } from '@reduxjs/toolkit'
import { REFERRALS_BACKEND_URL } from 'constants/apis'
import { ReferralApiResponse } from 'types/api'
import { ReferralUserAnalytics, ReferralUserInformation } from './types'

export const getUserReferralAccountInfo = createAsyncThunk(
  'referrals/getUserReferralAccountInfo',
  async ({ userAddress }: { userAddress: string }) => {
    // Send this data to the backend
    return new Promise<ReferralUserInformation | null>((resolve, reject) => {
      fetch(REFERRALS_BACKEND_URL + `/referrals/me/${userAddress}`)
        .then((response) => response.json())
        .then((data: ReferralApiResponse<ReferralUserInformation>) => {
          return resolve(data.data)
        })
        .catch((err) => {
          console.error('Error fetching user referral info', err)
          return reject(err)
        })
    })
  }
)

export const getUserReferralAnalaytics = createAsyncThunk(
  'referrals/getUserReferralAnalytics',
  async ({ userAddress }: { userAddress: string }) => {
    return new Promise<ReferralUserAnalytics | null>((resolve, reject) => {
      fetch(REFERRALS_BACKEND_URL + `/referrals/me/analytics/${userAddress}`)
        .then((response) => response.json())
        .then((data: ReferralApiResponse<ReferralUserAnalytics>) => {
          return resolve(data.data)
        })
        .catch((err) => {
          console.error('Error fetching user referral info', err)
          return reject(err)
        })
    })
  }
)
