import { createAsyncThunk } from '@reduxjs/toolkit'
import { getAnalyticsApolloClient } from 'apollo/client/analytics'
import { GET_USER_TOTAL_VOLUME, USER_DAILY_VOLUME } from 'apollo/queries/analytics'
import { MULTI_ACCOUNT_ADDRESS } from 'constants/addresses'
import { REFERRALS_BACKEND_URL } from 'constants/apis'
import { getCurrentEpochStartTimestamp, getEpochEndTimestamp } from 'lib/epoch/getEpochInformation'
import { UserDailyTradeVolume, UserTotalTradeVolume } from 'state/analytics/types'
import { ReferralApiResponse } from 'types/api'
import { TradingIncentivesUserVolume, VirtualPointsLeaderboard, VirtualPointsLeaderboardEntry } from './types'

export const getTradingIncentivesUserAnalytics = createAsyncThunk(
  'analytics/getTradingIncentivesUserAnalytics',
  async ({ user, chainId }: { user: string; chainId: number }) => {
    try {
      const client = getAnalyticsApolloClient(chainId)
      if (!client) {
        console.error('No client found')
        return
      }

      const epochStartTimestamp = getCurrentEpochStartTimestamp()
      const epochEndTimestamp = getEpochEndTimestamp(epochStartTimestamp)

      const multiaccountAddress = MULTI_ACCOUNT_ADDRESS[chainId].toLowerCase()

      const {
        data: { userDailyHistories },
      } = await client.query({
        query: USER_DAILY_VOLUME,
        fetchPolicy: 'no-cache',
        variables: {
          startTimestamp: epochStartTimestamp,
          endTimestamp: epochEndTimestamp,
          user: user.toLowerCase(),
          multiAccountAddress: multiaccountAddress,
        },
      })

      const {
        data: { userTotalHistories },
      } = await client.query({
        query: GET_USER_TOTAL_VOLUME,
        fetchPolicy: 'no-cache',
        variables: {
          user: user.toLowerCase(),
          multiAccountAddress: multiaccountAddress,
        },
      })

      const userTodayVolumeInfo: UserDailyTradeVolume = userDailyHistories.sort(
        (itemA: UserDailyTradeVolume, itemB: UserDailyTradeVolume) => {
          return parseInt(itemB.timestamp) - parseInt(itemA.timestamp)
        }
      )[0]

      const userTotalVolumeInfo: UserTotalTradeVolume = userTotalHistories.sort(
        (itemA: UserTotalTradeVolume, itemB: UserTotalTradeVolume) => {
          return parseInt(itemB.timestamp) - parseInt(itemA.timestamp)
        }
      )[0]

      let parsedTradeIncentives: TradingIncentivesUserVolume = {
        userDailyEpochVolume: '0',
        userTotalVolume: '0',
      }

      if (userTodayVolumeInfo) {
        parsedTradeIncentives = {
          ...parsedTradeIncentives,
          userDailyEpochVolume: userTodayVolumeInfo.tradeVolume,
        }
      }

      if (userTotalVolumeInfo) {
        parsedTradeIncentives = {
          ...parsedTradeIncentives,
          userTotalVolume: userTotalVolumeInfo.tradeVolume,
        }
      }

      return { tradingIncentives: parsedTradeIncentives }
    } catch (error) {
      console.error(error)
      throw new Error(`Unable to query data from Client`)
    }
  }
)

export const getUserVirtualPointsLeaderboardDetails = createAsyncThunk(
  'analytics/getUserPointsLeaderboardDetails',
  async ({ userAddress, timestamp }: { userAddress: string; timestamp: number }) => {
    // Send this data to the backend
    return new Promise<VirtualPointsLeaderboardEntry | null>((resolve, reject) => {
      fetch(REFERRALS_BACKEND_URL + `/referrals/analytics/leaderboard/${timestamp}/${userAddress}`)
        .then((response) => response.json())
        .then((data: ReferralApiResponse<VirtualPointsLeaderboardEntry>) => {
          return resolve(data.data)
        })
        .catch((err) => {
          console.error('Error fetching user referral info', err)
          return reject(err)
        })
    })
  }
)

export const getYesterdayUserVirtualPointsLeaderboardDetails = createAsyncThunk(
  'analytics/getYesterdayUserPointsLeaderboardDetails',
  async ({ userAddress, timestamp }: { userAddress: string; timestamp: number }) => {
    // Send this data to the backend
    return new Promise<VirtualPointsLeaderboardEntry | null>((resolve, reject) => {
      fetch(REFERRALS_BACKEND_URL + `/referrals/analytics/leaderboard/${timestamp}/${userAddress}`)
        .then((response) => response.json())
        .then((data: ReferralApiResponse<VirtualPointsLeaderboardEntry>) => {
          return resolve(data.data)
        })
        .catch((err) => {
          console.error('Error fetching user referral info', err)
          return reject(err)
        })
    })
  }
)

export const getVirtualPointsLeaderboard = createAsyncThunk(
  'analytics/getVirtualPointsLeaderboard',
  async ({ timestamp }: { timestamp: number }) => {
    return new Promise<VirtualPointsLeaderboard | null>((resolve, reject) => {
      fetch(REFERRALS_BACKEND_URL + `/referrals/analytics/leaderboard/${timestamp}`)
        .then((response) => response.json())
        .then((data: ReferralApiResponse<VirtualPointsLeaderboard>) => {
          // Quick fix: Setting the cummulative rank

          const cummulativeRankedByAddresses = data.data.leaderboard
            .sort((itemA: VirtualPointsLeaderboardEntry, itemB: VirtualPointsLeaderboardEntry) => {
              return (itemB.cummulativePoints ?? 0) - (itemA.cummulativePoints ?? 0)
            })
            .reduce((acc, item: VirtualPointsLeaderboardEntry, index: number) => {
              if (item.userAddress) {
                acc[item.userAddress] = index + 1
              }
              return acc
            }, {})

          const cummulativeRankedByAddressesWithRank = data.data.leaderboard.map(
            (item: VirtualPointsLeaderboardEntry) => {
              return {
                ...item,
                cummulativeRank: cummulativeRankedByAddresses[item.userAddress ?? ''] ?? null,
              }
            }
          )

          return resolve({
            leaderboard: cummulativeRankedByAddressesWithRank,
          })
        })
        .catch((err) => {
          console.error('Error fetching user referral info', err)
          return reject(err)
        })
    })
  }
)
