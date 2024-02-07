import { createAsyncThunk } from '@reduxjs/toolkit'
import { createApolloClient } from 'apollo/client'
import { GET_PAID_AMOUNT } from 'apollo/queries'
import { ANALYTICS_BACKEND_URL } from 'constants/apis'
import { OpenInterest } from 'types/hedger'
import { Market } from 'types/market'
import { makeHttpRequest } from 'utils/http'
import { toBN } from 'utils/numbers'
import {
  DepthItems,
  DepthResponse,
  ErrorMessages,
  MarketCapData,
  MarketDepthData,
  MarketDepthGraphData,
  MarketDepthGraphMap,
  MarketDepthMap,
  MarketNotionalCap,
  MarketsInfo,
  PriceRange,
} from './types'

export const getMarkets = createAsyncThunk(
  'hedger/getAllApi',
  async ({
    hedgerUrl,
    multiAccountAddress,
  }: {
    hedgerUrl: string | undefined
    multiAccountAddress: string | undefined
  }) => {
    if (!hedgerUrl) {
      throw new Error('hedgerUrl is empty')
    }
    if (!multiAccountAddress) {
      throw new Error('multiAccountAddress is empty')
    }

    const { href: marketsUrl } = new URL(`contract-symbols`, hedgerUrl)
    const { href: openUrl } = new URL(`open-interest/${multiAccountAddress}`, hedgerUrl)
    const { href: errorMessagesUrl } = new URL(`error_codes`, hedgerUrl)

    let count = 0
    let markets: Market[] = []
    let errorMessages: ErrorMessages = {}
    const openInterest: OpenInterest = { used: 0, total: 0 }

    try {
      const [marketsRes, openRes, errorMessagesRes] = await Promise.allSettled([
        makeHttpRequest(marketsUrl),
        makeHttpRequest(openUrl),
        makeHttpRequest(errorMessagesUrl),
      ])

      console.log('Error messages res ', errorMessagesRes)

      if (marketsRes.status === 'fulfilled') {
        if (marketsRes.value && marketsRes.value.symbols) {
          markets = marketsRes.value.symbols.map((market: any) => ({
            id: market.symbol_id,
            name: market.name,
            symbol: market.symbol,
            asset: market.asset,
            pricePrecision: market.price_precision,
            quantityPrecision: market.quantity_precision,
            isValid: market.is_valid,
            minAcceptableQuoteValue: market.min_acceptable_quote_value,
            minAcceptablePortionLF: market.min_acceptable_portion_lf,
            tradingFee: market.trading_fee,
            maxLeverage: market.max_leverage,
            rfqAllowed: market?.rfq_allowed,
            maxNotionalValue: market.max_notional_value,
            maxFundingRate: market.max_funding_rate,
            hedgerFeeOpen: market.hedger_fee_open,
            hedgerFeeClose: market.hedger_fee_close,
            autoSlippage: toBN(60).div(market.max_leverage).div(100).plus(1).toNumber(),
          }))
          count = marketsRes.value.count
        }

        if (openRes.status === 'fulfilled') {
          openInterest.total = openRes.value.total_cap
          openInterest.used = openRes.value.used
        }
        if (errorMessagesRes.status === 'fulfilled') {
          errorMessages = errorMessagesRes.value
        }
      }
    } catch (error) {
      console.error(error, 'happened in getHedgerMarkets')
    }

    return { markets, count, openInterest, errorMessages }
  }
)

export const getNotionalCap = createAsyncThunk(
  'hedger/getNotionalCap',
  async ({
    hedgerUrl,
    multiAccountAddress,
    market,
    preNotional,
  }: {
    hedgerUrl: string | undefined
    multiAccountAddress: string | undefined
    market: Market | undefined
    preNotional?: MarketNotionalCap
  }) => {
    if (!hedgerUrl) {
      throw new Error('hedgerUrl is empty')
    }
    if (!market) {
      throw new Error('market is empty')
    }
    if (!multiAccountAddress) {
      throw new Error('multiAccountAddress is empty')
    }

    const { href: notionalCapUrl } = new URL(`notional_cap/${market.id}/${multiAccountAddress}`, hedgerUrl)

    const notionalCap: MarketNotionalCap = { name: '', totalCap: -1, used: -1 }

    // add this part to have previous value if api doesn't working
    if (preNotional && preNotional.name === market.name && preNotional.totalCap !== -1) {
      notionalCap.name = preNotional.name
      notionalCap.used = preNotional.used
      notionalCap.totalCap = preNotional.totalCap
    }

    try {
      const [notionalCapRes] = await Promise.allSettled([makeHttpRequest(notionalCapUrl)])

      if (notionalCapRes.status === 'fulfilled') {
        notionalCap.name = market.name
        notionalCap.used = notionalCapRes.value.used
        notionalCap.totalCap = notionalCapRes.value.total_cap
      }
    } catch (error) {
      console.error(error, 'happened in getNotionalCap')
    }

    return { notionalCap }
  }
)

export const getPriceRange = createAsyncThunk(
  'hedger/getPriceRange',
  async ({ hedgerUrl, market }: { hedgerUrl: string | undefined; market: Market | undefined }) => {
    if (!hedgerUrl) {
      throw new Error('hedgerUrl is empty')
    }
    if (!market) {
      throw new Error('market is empty')
    }

    const { href: priceRangeUrl } = new URL(`price-range/${market.name}`, hedgerUrl)

    const priceRange: PriceRange = { name: '', minPrice: -1, maxPrice: -1 }

    try {
      const [priceRangeRes] = await Promise.allSettled([makeHttpRequest(priceRangeUrl)])

      if (priceRangeRes.status === 'fulfilled') {
        priceRange.name = market.name
        priceRange.minPrice = priceRangeRes.value.min_price
        priceRange.maxPrice = priceRangeRes.value.max_price
      }
    } catch (error) {
      console.error(error, 'happened in getPriceRange')
    }

    return { priceRange }
  }
)

export const getDepthSnapshot = createAsyncThunk(
  'hedger/getDepthSnapshot',
  async ({ market, apiUrl }: { market: string; apiUrl?: string | undefined }) => {
    if (!apiUrl) {
      throw new Error('Url is empty')
    }
    if (!market) {
      throw new Error('market is empty')
    }
    console.log('getDepthSnapshot', market)
    const depthGraph: MarketDepthGraphMap = {}
    const { href: marketDepthUrl } = new URL(`fapi/v1/depth?symbol=${market}&limit=10`, apiUrl)

    try {
      const [marketDepths] = await Promise.allSettled([makeHttpRequest(marketDepthUrl)])

      if (marketDepths.status === 'fulfilled' && marketDepths.value) {
        const asks: DepthItems = {}
        const bids: DepthItems = {}

        marketDepths.value.asks.forEach((ask: string[]) => {
          asks[ask[0]] = ask[1]
        })
        marketDepths.value.bids.forEach((bid: string[]) => {
          bids[bid[0]] = bid[1]
        })

        const newDepth = {
          asks: asks,
          bids: bids,
          lastUpdateId: marketDepths.value.lastUpdateId,
          isFirst: true,
          isLive: true,
        } as MarketDepthGraphData
        depthGraph[market] = newDepth
      }
    } catch (error) {
      console.error(error, 'happened in getMarketsDepth')
      return { depthGraph: {}, name: market }
    }
    return { depthGraph, name: market }
  }
)

export const getMarketsDepth = createAsyncThunk('hedger/getMarketsDepth', async (apiUrl: string | undefined) => {
  if (!apiUrl) {
    throw new Error('Url is empty')
  }
  const depths: MarketDepthMap = {}
  const { href: marketDepthUrl } = new URL(`fapi/v1/ticker/bookTicker`, apiUrl)

  try {
    const [marketDepths] = await Promise.allSettled([makeHttpRequest(marketDepthUrl)])

    if (marketDepths.status === 'fulfilled') {
      marketDepths.value &&
        marketDepths.value.forEach((depth: DepthResponse) => {
          const newDepth = {
            bestAskPrice: depth.askPrice,
            bestAskQuantity: depth.askQty,
            bestBidPrice: depth.bidPrice,
            bestBidQuantity: depth.bidQty,
          } as MarketDepthData
          depths[depth.symbol] = newDepth
        })
    }
  } catch (error) {
    console.error(error, 'happened in getMarketsDepth')
    return { depths: {} }
  }
  return { depths }
})

export const getMarketsCap = async () => {
  const marketCapInfoUrl = `${ANALYTICS_BACKEND_URL}/analytics/marketcap`

  let marketCaps: MarketCapData[] = []

  try {
    const [marketsCapRes] = await Promise.allSettled([makeHttpRequest(marketCapInfoUrl)])

    if (marketsCapRes.status === 'fulfilled' && marketsCapRes.value) {
      marketCaps = marketsCapRes.value
    }
  } catch (error) {
    console.error(error, 'happened in getMarketsCap')
  }

  return marketCaps
}

export const getMarketsInfo = createAsyncThunk(
  'hedger/getMarketsInfo',
  async ({
    hedgerUrl,
    multiAccountAddress,
  }: {
    hedgerUrl: string | undefined
    multiAccountAddress: string | undefined
  }) => {
    if (!hedgerUrl) {
      throw new Error('hedgerUrl is empty')
    }
    if (!multiAccountAddress) {
      throw new Error('multiAccountAddress is empty')
    }

    const { href: marketsInfoUrl } = new URL(`get_market_info/${multiAccountAddress}`, hedgerUrl)

    let marketCaps: MarketCapData[] = []
    try {
      marketCaps = await getMarketsCap()
    } catch (error) {
      console.error(error, 'happened in getMarketsCap')
    }

    const marketCapsMap = marketCaps.reduce((acc, marketCap) => {
      acc[marketCap.symbol] = marketCap
      return acc
    }, {})

    const marketsInfo: MarketsInfo = {}

    console.log('marketsInfoUrl', marketsInfoUrl)

    try {
      const [marketsInfoRes] = await Promise.allSettled([makeHttpRequest(marketsInfoUrl)])

      if (marketsInfoRes.status === 'fulfilled' && marketsInfoRes.value) {
        Object.entries(marketsInfoRes.value).forEach(async (localMarketEntry) => {
          const [marketName, marketInfoValue]: [marketName: string, marketInfoValue: any] = localMarketEntry
          let tokenSymbol = marketName.slice(0, -4)
          tokenSymbol = tokenSymbol.replace('1000', '')

          const specialCases = {
            BEAMX: 'BEAM',
            LUNA2: 'LUNA',
            DYDX: 'ETHDYDX',
          }

          // Special cases
          if (specialCases[tokenSymbol]) tokenSymbol = specialCases[tokenSymbol]

          const { marketCap } = marketCapsMap[tokenSymbol] || { marketCap: 0 }
          marketsInfo[marketName] = {
            price: marketInfoValue.price.toString(),
            priceChangePercent: marketInfoValue.price_change_percent.toString(),
            tradeVolume: marketInfoValue.trade_volume.toString(),
            notionalCap: marketInfoValue.notional_cap.toString(),
            marketCap: marketCap.toString(),
          }
        })
      }
    } catch (error) {
      console.error(error, 'happened in getMarketsInfo')
    }

    return { marketsInfo }
  }
)

export const getPaidAmount = createAsyncThunk('hedger/getPaidAmount', async ({ quoteId }: { quoteId: number }) => {
  try {
    // TODO: change url
    const client = createApolloClient('https://api.studio.thegraph.com/query/62454/fundingrate_base_8_2/version/latest')

    const {
      data: { resultEntities },
    } = await client.query<{
      resultEntities: { fee: string; __typename: string }[]
    }>({
      query: GET_PAID_AMOUNT,
      variables: { id: `${quoteId}` },
      fetchPolicy: 'no-cache',
    })
    if (resultEntities.length) return { fee: resultEntities[0].fee }
    return { fee: '' }
  } catch (error) {
    console.error(error)
    throw new Error(`Unable to query Paid Amount from Client`)
  }
})
