import { createAsyncThunk } from '@reduxjs/toolkit'
import { getActivityApolloClient } from 'apollo/client/activity'
import { getAnalyticsApolloClient } from 'apollo/client/analytics'
import { BALANCE_CHANGES_DATA, TOTAL_DEPOSITS_AND_WITHDRAWALS } from 'apollo/queries'
import { HISTORICAL_RESULT_ENTITY, IResultEntity } from 'apollo/queries/operations'
import { BALANCE_HISTORY_ITEMS_NUMBER, CHECK_IS_WHITE_LIST } from 'config'
import { makeHttpRequest } from 'utils/http'
import { BalanceHistoryData, DepositWithdrawalsData } from './types'

export const getIsWhiteList = createAsyncThunk('user/getWalletWhitelist', async (payload: any) => {
  const { baseUrl: hedgerUrl, account, multiAccountAddress } = payload

  if (!hedgerUrl) {
    throw new Error('hedgerUrl is empty')
  }
  if (!account) {
    throw new Error('account is empty')
  }

  const { href: isWhiteListUrl } = new URL(`/check_in-whitelist/${account}/${multiAccountAddress}`, hedgerUrl)

  let isWhiteList: boolean | null = null
  try {
    if (!CHECK_IS_WHITE_LIST) return { isWhiteList: true }

    const [whiteListRes] = await Promise.allSettled([makeHttpRequest(isWhiteListUrl)])
    if (whiteListRes.status === 'fulfilled') {
      isWhiteList = whiteListRes.value
    }
  } catch (error) {
    isWhiteList = false
    console.error(error, ' happened in check-in-whitelist')
  }

  return { isWhiteList }
})

export const getBalanceHistory = createAsyncThunk(
  'user/getBalanceHistory',
  async ({
    account,
    chainId,
    skip,
    first,
  }: {
    account: string | null | undefined
    chainId: number | undefined
    skip: number
    first: number
  }) => {
    if (!account) {
      throw new Error('account is undefined')
    }
    if (!chainId) {
      throw new Error('chainId is empty')
    }

    try {
      const client = getAnalyticsApolloClient(chainId)
      if (!client) return {}
      let hasMore = true

      const {
        data: { balanceChanges },
      } = await client.query<{
        balanceChanges: BalanceHistoryData[]
      }>({
        query: BALANCE_CHANGES_DATA,
        variables: { account: account.toLowerCase(), first, skip },
        fetchPolicy: 'no-cache',
      })

      if (balanceChanges.length !== BALANCE_HISTORY_ITEMS_NUMBER) {
        hasMore = false
      }

      return { result: balanceChanges, hasMore }
    } catch (error) {
      console.error(error)
      throw new Error(`Unable to query data from Client`)
    }
  }
)

export const getTotalDepositsAndWithdrawals = createAsyncThunk(
  'user/getTotalDepositsAndWithdrawals',
  async ({ account, chainId }: { account: string | null | undefined; chainId: number | undefined }) => {
    if (!account) {
      throw new Error('account is undefined')
    }
    if (!chainId) {
      throw new Error('chainId is empty')
    }

    try {
      const client = getAnalyticsApolloClient(chainId)
      if (!client) return { result: null }

      const {
        data: { accounts },
      } = await client.query<{ accounts: DepositWithdrawalsData[] }>({
        query: TOTAL_DEPOSITS_AND_WITHDRAWALS,
        variables: { id: account.toLowerCase() },
        fetchPolicy: 'no-cache',
      })

      if (accounts.length) return { result: accounts[0] }
      return { result: null }
    } catch (error) {
      console.error(error)
      throw new Error(`Unable to query data from Client`)
    }
  }
)

export const getHistoricalResultEntities = createAsyncThunk(
  'user/getHistoricalResultEntities',
  async ({ account, chainId }: { account: string | null | undefined; chainId: number | undefined }) => {
    if (!account) {
      throw new Error('account is undefined')
    }
    if (!chainId) {
      throw new Error('chainId is empty')
    }

    try {
      const client = getActivityApolloClient(chainId)
      if (!client) return { result: null }

      const fetched: IResultEntity[] = []

      let skip = 0
      let hasMore = true
      while (hasMore) {
        const {
          data: { resultEntities },
        } = await client.query<{ resultEntities: IResultEntity[] }>({
          query: HISTORICAL_RESULT_ENTITY,
          variables: {
            address: account.toLowerCase(),
            first: 1000,
            skip,
            startTimestamp: 0,
            endTimestamp: Math.floor(Date.now() / 1000),
          },
          fetchPolicy: 'no-cache',
        })

        if (resultEntities.length) {
          fetched.push(...resultEntities)
          skip += 1000
        } else {
          hasMore = false
        }
      }

      if (fetched.length) return { result: fetched }
      return { result: null }
    } catch (error) {
      console.error(error)
      throw new Error(`Unable to query data from Client`)
    }
  }
)
