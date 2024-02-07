import gql from 'graphql-tag'

export const TOTAL_MAIN_ANALYTICS = gql`
  query GetTotalMainAnalytics($multiAccountAddresses: [String]!) {
    totalHistories(orderBy: timestamp, orderDirection: asc, where: { accountSource_in: $multiAccountAddresses }) {
      id
      tradeVolume
      timestamp
      deposit
      withdraw
      platformFee
      users
      accountSource
      closeTradeVolume
      allocate
      deallocate
      quotesCount
      openTradeVolume
      updateTimestamp
    }
  }
`

export const DAILY_MAIN_ANALYTICS = gql`
  query GetDailyMainAnalytics(
    $startTimestamp: Int!
    $endTimestamp: Int!
    $multiAccountAddresses: [String]!
    $first: Int!
    $skip: Int!
  ) {
    dailyHistories(
      where: { timestamp_gte: $startTimestamp, timestamp_lte: $endTimestamp, accountSource_in: $multiAccountAddresses }
      orderBy: timestamp
      orderDirection: asc
      first: $first
      skip: $skip
    ) {
      id
      quotesCount
      openInterest
      maxOpenInterest
      newUsers
      newAccounts
      activeUsers
      accountSource
      withdraw
      updateTimestamp
      tradeVolume
      timestamp
      platformFee
      openTradeVolume
      deposit
      deallocate
      closeTradeVolume
      allocate
    }
  }
`

// This query gets the TOTAL volume
export const SYMBOL_TRADE_ANALYTICS = gql`
  query GetSymbolTradeAnalytics($multiAccountAddress: String!, $first: Int!, $skip: Int!) {
    symbolTradeVolumes(where: { accountSource: $multiAccountAddress }, first: $first, skip: $skip) {
      accountSource
      id
      updateTimestamp
      volume
      timestamp
      symbolId
    }
  }
`

export const SYMBOL_DAILY_TRADE_VOLUME = gql`
  query GetSymbolDailyTradeVolume(
    $multiAccountAddress: String!
    $startTimestamp: Int!
    $endTimestamp: Int!
    $symbolId: String!
  ) {
    symbolDailyTradeVolumes(
      where: {
        timestamp_gte: $startTimestamp
        timestamp_lte: $endTimestamp
        accountSource: $multiAccountAddress
        symbol_: { id: $symbolId }
      }
      orderBy: timestamp
      orderDirection: asc
    ) {
      id
      accountSource
      updateTimestamp
      volume
      timestamp
    }
  }
`

export const SYMBOLS_DAILY_TRADE_VOLUME = gql`
  query GetSymbolsDailyTradeVolume(
    $multiAccountAddress: String!
    $startTimestamp: Int!
    $endTimestamp: Int!
    $first: Int!
    $skip: Int!
  ) {
    symbolDailyTradeVolumes(
      where: { timestamp_gte: $startTimestamp, timestamp_lte: $endTimestamp, accountSource: $multiAccountAddress }
      orderBy: timestamp
      orderDirection: asc
      first: $first
      skip: $skip
    ) {
      id
      accountSource
      updateTimestamp
      volume
      timestamp
      symbol {
        id
        name
      }
    }
  }
`

export const OPEN_INTEREST_ANALYTICS = gql`
  query GetOpenInterestAnalytics($accountSource: String!, $first: Int!, $skip: Int!) {
    openInterests(where: { accountSource: $accountSource }, first: $first, skip: $skip) {
      amount
      accumulatedAmount
      id
      timestamp
      symbol {
        name
      }
    }
  }
`

export const USER_DAILY_VOLUME = gql`
  query GetUserDailyVolumeAnalytics(
    $startTimestamp: Int!
    $endTimestamp: Int!
    $user: String!
    $multiAccountAddress: String!
  ) {
    userDailyHistories(
      where: {
        timestamp_gte: $startTimestamp
        timestamp_lte: $endTimestamp
        user_: { address: $user }
        accountSource: $multiAccountAddress
      }
      orderBy: timestamp
      orderDirection: asc
    ) {
      id
      quotesCount
      accountSource
      withdraw
      updateTimestamp
      tradeVolume
      timestamp
      generatedFee
      openTradeVolume
      deposit
      deallocate
      closeTradeVolume
      allocate
    }
  }
`

export const GET_USER_TOTAL_VOLUME = gql`
  query GetUserTotalVolumeAnalytics($user: String!, $multiAccountAddress: String!) {
    userTotalHistories(where: { user_: { address: $user }, accountSource: $multiAccountAddress }) {
      id
      quotesCount
      accountSource
      withdraw
      updateTimestamp
      tradeVolume
      timestamp
      generatedFee
      openTradeVolume
      deposit
      deallocate
      closeTradeVolume
      allocate
    }
  }
`

export const DAILY_LEADERBOARD_ANALYTICS = gql`
  query GetLeaderboard($startTimestamp: Int!, $endTimestamp: Int!, $multiAccountAddress: String!) {
    userDailyHistories(
      where: { timestamp_gte: $startTimestamp, timestamp_lte: $endTimestamp, accountSource: $multiAccountAddress }
      orderBy: timestamp
      orderDirection: asc
    ) {
      id
      quotesCount
      accountSource
      withdraw
      updateTimestamp
      tradeVolume
      timestamp
      generatedFee
      openTradeVolume
      deposit
      deallocate
      closeTradeVolume
      allocate
      user {
        id
        address
      }
    }
  }
`
