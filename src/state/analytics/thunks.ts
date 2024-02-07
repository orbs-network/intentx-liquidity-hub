import { createAsyncThunk } from '@reduxjs/toolkit'
import { getAnalyticsApolloClient, getJoinedAnalyticsApolloClients } from 'apollo/client/analytics'

import {
  DAILY_MAIN_ANALYTICS,
  OPEN_INTEREST_ANALYTICS,
  SYMBOLS_DAILY_TRADE_VOLUME,
  SYMBOL_TRADE_ANALYTICS,
  TOTAL_MAIN_ANALYTICS,
} from 'apollo/queries/analytics'
import { MULTI_ACCOUNT_ADDRESS, MULTI_ACCOUNT_ADDRESS_0_8_0 } from 'constants/addresses'
import { getCurrentEpochStartTimestamp, getEpochEndTimestamp } from 'lib/epoch/getEpochInformation'
import { queryAllForClients, queryForClients } from 'utils/subgraph'
import {
  MainAnalyticsHistory,
  OpenInterestDetails,
  SymbolDailyTradeVolume,
  SymbolTradeVolume,
  TotalMainAnalytics,
} from './types'

export const getDailyMainAnalytics = createAsyncThunk(
  'analytics/getDailyMainAnalytics',
  async ({
    chainId,
    startTimestamp,
    endTimestamp,
  }: {
    chainId: number
    startTimestamp: number
    endTimestamp: number
  }) => {
    try {
      const client = getAnalyticsApolloClient(chainId)
      if (!client) return {}

      const clients = getJoinedAnalyticsApolloClients(chainId)

      const dailyMainAnalytics = await queryAllForClients<MainAnalyticsHistory>(clients, DAILY_MAIN_ANALYTICS, {
        startTimestamp,
        endTimestamp,
        multiAccountAddresses: [MULTI_ACCOUNT_ADDRESS[chainId], MULTI_ACCOUNT_ADDRESS_0_8_0[chainId]],
      })

      const parsedByDay: { [timestamp: string]: MainAnalyticsHistory } = {}
      if (dailyMainAnalytics.length) {
        dailyMainAnalytics.forEach((item) => {
          // const dayStartTimestamp = (Math.floor(parseInt(item.timestamp) / (24 * 60 * 60)) * 24 * 60 * 60).toString()
          const dayStartTimestamp = (
            new Date(new Date(Number(item.timestamp) * 1000).setHours(0, 0, 0, 0)).getTime() / 1000
          ).toString()

          if (!parsedByDay[dayStartTimestamp]) {
            parsedByDay[dayStartTimestamp] = {
              ...item,
              id: dayStartTimestamp,
              timestamp: dayStartTimestamp,
            }
          } else {
            parsedByDay[dayStartTimestamp] = {
              id: dayStartTimestamp,
              quotesCount: (BigInt(parsedByDay[dayStartTimestamp].quotesCount) + BigInt(item.quotesCount)).toString(),
              openInterest: (
                BigInt(parsedByDay[dayStartTimestamp].openInterest) + BigInt(item.openInterest)
              ).toString(),
              newUsers: (BigInt(parsedByDay[dayStartTimestamp].newUsers) + BigInt(item.newUsers)).toString(),
              newAccounts: (BigInt(parsedByDay[dayStartTimestamp].newAccounts) + BigInt(item.newAccounts)).toString(),
              activeUsers: (BigInt(parsedByDay[dayStartTimestamp].activeUsers) + BigInt(item.activeUsers)).toString(),
              accountSource: item.accountSource,
              withdraw: (BigInt(parsedByDay[dayStartTimestamp].withdraw) + BigInt(item.withdraw)).toString(),
              updateTimestamp: item.updateTimestamp,
              tradeVolume: (BigInt(parsedByDay[dayStartTimestamp].tradeVolume) + BigInt(item.tradeVolume)).toString(),
              timestamp: dayStartTimestamp,
              platformFee: (BigInt(parsedByDay[dayStartTimestamp].platformFee) + BigInt(item.platformFee)).toString(),
              openTradeVolume: (
                BigInt(parsedByDay[dayStartTimestamp].openTradeVolume) + BigInt(item.openTradeVolume)
              ).toString(),
              deposit: (BigInt(parsedByDay[dayStartTimestamp].deposit) + BigInt(item.deposit)).toString(),
              deallocate: (BigInt(parsedByDay[dayStartTimestamp].deallocate) + BigInt(item.deallocate)).toString(),
              closeTradeVolume: (
                BigInt(parsedByDay[dayStartTimestamp].closeTradeVolume) + BigInt(item.closeTradeVolume)
              ).toString(),
              allocate: (BigInt(parsedByDay[dayStartTimestamp].allocate) + BigInt(item.allocate)).toString(),
              maxOpenInterest: Math.max(
                parseInt(parsedByDay[dayStartTimestamp].maxOpenInterest),
                parseInt(item.maxOpenInterest)
              ).toString(),
            }
          }
          return parsedByDay
        })
      }

      const parsedByDayArray = Object.values(parsedByDay)

      return { dailyMainAnalytics: parsedByDayArray, chainId }
    } catch (error) {
      console.error(error)
      throw new Error(`Unable to query data from Client`)
    }
  }
)

export const getTotalMainAnalytics = createAsyncThunk(
  'analytics/getTotalMainAnalytics',
  async ({ chainId }: { chainId: number }) => {
    try {
      const client = getAnalyticsApolloClient(chainId)
      if (!client) return {}

      const clients = getJoinedAnalyticsApolloClients(chainId)

      console.debug('Waitin')
      const totalHistories = await queryForClients<TotalMainAnalytics>(clients, TOTAL_MAIN_ANALYTICS, {
        multiAccountAddresses: [MULTI_ACCOUNT_ADDRESS[chainId], MULTI_ACCOUNT_ADDRESS_0_8_0[chainId]],
      })

      console.debug('Total histories ', totalHistories)

      if (!totalHistories.length) throw new Error(`Unable to query data from client`)

      const joinedTotalHistories = {
        ...totalHistories[0],
      }

      if (totalHistories.length > 1) {
        totalHistories.forEach((item, index) => {
          if (index !== 0) {
            joinedTotalHistories.tradeVolume = (
              BigInt(joinedTotalHistories.tradeVolume) + BigInt(item.tradeVolume)
            ).toString()
            joinedTotalHistories.deposit = (BigInt(joinedTotalHistories.deposit) + BigInt(item.deposit)).toString()
            joinedTotalHistories.withdraw = (BigInt(joinedTotalHistories.withdraw) + BigInt(item.withdraw)).toString()
            joinedTotalHistories.platformFee = (
              BigInt(joinedTotalHistories.platformFee) + BigInt(item.platformFee)
            ).toString()
            joinedTotalHistories.openTradeVolume = (
              BigInt(joinedTotalHistories.openTradeVolume) + BigInt(item.openTradeVolume)
            ).toString()
            joinedTotalHistories.closeTradeVolume = (
              BigInt(joinedTotalHistories.closeTradeVolume) + BigInt(item.closeTradeVolume)
            ).toString()
            joinedTotalHistories.allocate = (BigInt(joinedTotalHistories.allocate) + BigInt(item.allocate)).toString()
            joinedTotalHistories.deallocate = (
              BigInt(joinedTotalHistories.deallocate) + BigInt(item.deallocate)
            ).toString()
            joinedTotalHistories.quotesCount = (
              BigInt(joinedTotalHistories.quotesCount) + BigInt(item.quotesCount)
            ).toString()
            joinedTotalHistories.users = (BigInt(joinedTotalHistories.users) + BigInt(item.users)).toString()
          }
        })
      }

      return {
        totalMainAnalytics: joinedTotalHistories,
      }
    } catch (error) {
      console.error(error)
      throw new Error(`Unable to query data from Client`)
    }
  }
)

export const getSymbolTradeAnalytics = createAsyncThunk(
  'analytics/getSymbolTradeVolumes',
  async ({ chainId }: { chainId: number }) => {
    try {
      const client = getAnalyticsApolloClient(chainId)
      if (!client) return {}

      const {
        data: { symbolTradeVolumes },
      } = await client.query({
        query: SYMBOL_TRADE_ANALYTICS,
        variables: {
          multiAccountAddress: MULTI_ACCOUNT_ADDRESS[chainId],
          first: 1000,
          skip: 0,
        },
        fetchPolicy: 'no-cache',
      })

      const symbolTradeAnalytics: SymbolTradeVolume[] = symbolTradeVolumes.map((item: SymbolTradeVolume) => ({
        ...item,
      }))

      return { symbolTradeAnalytics }
    } catch (error) {
      console.error(error)
      throw new Error(`Unable to query data from Client`)
    }
  }
)

export const getOpenInterestAnalytic = createAsyncThunk(
  'analytics/getOpenInterestAnalytic',
  async ({ chainId }: { chainId: number }) => {
    try {
      const client = getAnalyticsApolloClient(chainId)
      if (!client) return {}

      const {
        data: { openInterests },
      } = await client.query({
        query: OPEN_INTEREST_ANALYTICS,
        fetchPolicy: 'no-cache',
        variables: {
          accountSource: MULTI_ACCOUNT_ADDRESS[chainId],
          first: 1000,
          skip: 0,
        },
      })

      const openInterestAnalytic: OpenInterestDetails[] = openInterests.sort(
        (itemA: OpenInterestDetails, itemB: OpenInterestDetails) => {
          return parseInt(itemB.accumulatedAmount) - parseInt(itemA.accumulatedAmount)
        }
      )

      return { openInterestAnalytic }
    } catch (error) {
      console.error(error)
      throw new Error(`Unable to query data from Client`)
    }
  }
)

export const getLast24HoursSymbolsTradingVolume = createAsyncThunk(
  'analytics/getLast24HoursSymbolsTradingVolume',
  async ({ chainId }: { chainId: number }) => {
    console.log('chainId', chainId)
    const client = getAnalyticsApolloClient(chainId)
    if (!client) return {}

    const currentEpochStartTimestamp = getCurrentEpochStartTimestamp()
    const currentEpochEndTimestamp = getEpochEndTimestamp(currentEpochStartTimestamp)
    const lastEpochStartTimestamp = currentEpochStartTimestamp - 24 * 60 * 60

    const {
      data: { symbolDailyTradeVolumes },
    } = await client.query({
      query: SYMBOLS_DAILY_TRADE_VOLUME,
      fetchPolicy: 'no-cache',
      variables: {
        startTimestamp: currentEpochStartTimestamp,
        endTimestamp: currentEpochEndTimestamp,
        multiAccountAddress: MULTI_ACCOUNT_ADDRESS[chainId],
        first: 1000,
        skip: 0,
      },
    })

    const parsedSymbolDailyTradeVolumes: SymbolDailyTradeVolume[] = symbolDailyTradeVolumes.map(
      (item: SymbolTradeVolume) => ({
        ...item,
      })
    )

    console.log('parsedSymbolDailyTradeVolumes', parsedSymbolDailyTradeVolumes, MULTI_ACCOUNT_ADDRESS[chainId])

    return { last24HoursSymbolsTradingVolume: parsedSymbolDailyTradeVolumes }
  }
)
