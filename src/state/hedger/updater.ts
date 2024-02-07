import isEmpty from 'lodash/isEmpty'
import { useEffect, useMemo } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { JsonValue } from 'react-use-websocket/dist/lib/types'

import { HedgerInfo, getKeyFromValue } from 'constants/hedgers'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import useIsWindowVisible from 'lib/hooks/useIsWindowVisible'
import { useSupportedChainId } from 'lib/hooks/useSupportedChainId'
import { AppThunkDispatch, useAppDispatch } from 'state'
import { autoRefresh, retry } from 'utils/retry'

import {
  useClearDepthGraph,
  useDepthGraph,
  useHedgerInfo,
  useMarketNotionalCap,
  useMarkets,
  useMarketsStatus,
  useSetDepth,
  useSetDepthGraph,
  useSetFundingRates,
  useSetPrices,
  useSetWebSocketStatus,
  useWebSocketUrl,
} from 'state/hedger/hooks'
import { useActiveMarket } from 'state/trade/hooks'
import { ApiState } from 'types/api'
import { Hedger } from 'types/hedger'
import { Market } from 'types/market'
import { getMarkets, getNotionalCap, getPriceRange } from './thunks'
import {
  ConnectionStatus,
  DepthItems,
  MarketData,
  MarketDepthData,
  MarketDepthGraphData,
  PriceResponse,
  MarketDataMap as PricesType,
} from './types'
import { MULTI_ACCOUNT_ADDRESS } from 'constants/addresses'
import { FALLBACK_CHAIN_ID } from 'constants/chains'

export function HedgerUpdater(): null {
  const thunkDispatch: AppThunkDispatch = useAppDispatch()
  const hedger = useHedgerInfo()
  const { baseUrl, apiUrl, fetchData } = hedger || {}
  const activeMarket = useActiveMarket()
  const markets = useMarkets()
  const depthGraph = useDepthGraph(activeMarket?.name)
  const windowVisible = useIsWindowVisible()

  usePriceWebSocket()
  useFetchMarkets(hedger, thunkDispatch)
  useFetchNotionalCap(hedger, thunkDispatch, activeMarket)
  useFundingRateWebSocket()

  // Get market depth snapshot on page load and when active market changes
  // useEffect(() => {
  //   if (activeMarket?.name && windowVisible) thunkDispatch(getDepthSnapshot({ market: activeMarket.name, apiUrl }))
  // }, [thunkDispatch, apiUrl, activeMarket?.name, windowVisible, depthGraph?.isLive])

  // auto update per each 1 seconds
  // useEffect(() => {
  //   return autoRefresh(() => thunkDispatch(getMarketsDepth(apiUrl)), 1.5)
  // }, [thunkDispatch, apiUrl, markets])

  //auto update price range per symbol, every 1 hours
  useEffect(() => {
    if (fetchData && activeMarket)
      return autoRefresh(() => thunkDispatch(getPriceRange({ hedgerUrl: baseUrl, market: activeMarket })), 60 * 60)
  }, [thunkDispatch, baseUrl, activeMarket, fetchData])

  return null
}

function useFetchMarkets(hedger: Hedger | null, thunkDispatch: AppThunkDispatch) {
  const marketsStatus = useMarketsStatus()
  const { chainId } = useActiveConnectionDetails()
  const isSupported = useSupportedChainId()
  const { baseUrl } = hedger || {}
  const multiAccountAddress = chainId ? MULTI_ACCOUNT_ADDRESS[chainId] : MULTI_ACCOUNT_ADDRESS[FALLBACK_CHAIN_ID]
  //auto update per each 3000 seconds
  useEffect(() => {
    const hedgerChainId = getKeyFromValue(HedgerInfo, hedger)
    if (isSupported && hedgerChainId && hedgerChainId !== chainId)
      thunkDispatch(getMarkets({ hedgerUrl: baseUrl, multiAccountAddress }))
    else return autoRefresh(() => thunkDispatch(getMarkets({ hedgerUrl: baseUrl, multiAccountAddress })), 3000)
  }, [thunkDispatch, baseUrl, hedger, chainId, isSupported, multiAccountAddress])
}

function useFetchNotionalCap(hedger: Hedger | null, thunkDispatch: AppThunkDispatch, activeMarket?: Market) {
  const { marketNotionalCap, marketNotionalCapStatus } = useMarketNotionalCap()
  const { baseUrl } = hedger || {}
  const { chainId } = useActiveConnectionDetails()
  const multiAccountAddress = chainId ? MULTI_ACCOUNT_ADDRESS[chainId] : MULTI_ACCOUNT_ADDRESS[FALLBACK_CHAIN_ID]

  //auto update notional cap per symbol, every 1 hours
  useEffect(() => {
    if (activeMarket)
      return autoRefresh(
        () =>
          thunkDispatch(
            getNotionalCap({
              hedgerUrl: baseUrl,
              market: activeMarket,
              preNotional: marketNotionalCap,
              multiAccountAddress,
            })
          ),
        60 * 60
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMarket, baseUrl, thunkDispatch])

  //if error occurs it will retry to fetch markets 5 times
  useEffect(() => {
    if (activeMarket && marketNotionalCapStatus === ApiState.ERROR) {
      retry(
        () =>
          thunkDispatch(
            getNotionalCap({
              hedgerUrl: baseUrl,
              market: activeMarket,
              preNotional: marketNotionalCap,
              multiAccountAddress,
            })
          ),
        {
          n: 5,
          minWait: 3000,
          maxWait: 10000,
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thunkDispatch, baseUrl, marketNotionalCapStatus, activeMarket])
}

function usePriceWebSocket() {
  const speed = '@500ms'
  const levels = ''
  const sortLevels = 1000

  const windowVisible = useIsWindowVisible()
  const webSocketUrl = useWebSocketUrl()
  const updatePrices = useSetPrices()
  const updateDepth = useSetDepth()
  const updateWebSocketStatus = useSetWebSocketStatus()
  const markets = useMarkets()
  const activeMarket = useActiveMarket()
  const depthGraph = useDepthGraph(activeMarket?.name)
  const clearDepthGraph = useClearDepthGraph()
  const updateDepthGraph = useSetDepthGraph()

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(webSocketUrl === '' ? null : webSocketUrl, {
    reconnectAttempts: 10,
    shouldReconnect: () => true,
    onOpen: () => {
      console.log('WebSocket connection established.')
    },
    onClose: () => console.log('WebSocket connection closed'),
    onError: (e) => console.log('WebSocket connection has error ', e),
  })

  const connectionStatus = useMemo(() => {
    if (readyState === ReadyState.OPEN) {
      return ConnectionStatus.OPEN
    } else {
      return ConnectionStatus.CLOSED
    }
  }, [readyState])

  useEffect(() => {
    updateWebSocketStatus(connectionStatus)
  }, [connectionStatus, updateWebSocketStatus])

  useEffect(() => {
    if (connectionStatus === ConnectionStatus.OPEN) {
      const jsonPrices = {
        method: windowVisible ? 'SUBSCRIBE' : 'UNSUBSCRIBE', // UNSUBSCRIBE websocket when user is idle
        params: ['!markPrice@arr@1s'],
        id: 1,
      }
      sendJsonMessage(jsonPrices as unknown as JsonValue)
    }
  }, [connectionStatus, markets, sendJsonMessage, windowVisible])

  useEffect(() => {
    if (connectionStatus === ConnectionStatus.OPEN) {
      if (activeMarket) {
        const jsonDepth = {
          method: windowVisible ? 'SUBSCRIBE' : 'UNSUBSCRIBE', // UNSUBSCRIBE websocket when user is idle
          params: [`${activeMarket.name.toLowerCase()}@depth${levels}${speed}`],
          id: 1,
        }
        sendJsonMessage(jsonDepth as unknown as JsonValue)
      }
    }
  }, [connectionStatus, sendJsonMessage, windowVisible, activeMarket])
  useEffect(() => {
    if (!depthGraph && activeMarket) {
      const newDepthGraph: MarketDepthGraphData = {
        asks: {},
        bids: {},
        lastUpdateId: 0,
        isFirst: true,
        isLive: false,
      }
      updateDepthGraph(newDepthGraph, activeMarket.name)
    }
  }, [activeMarket, depthGraph, updateDepthGraph])

  useEffect(() => {
    try {
      const lastMessage = lastJsonMessage as any

      //don't update anything if user is idle instead of updating to empty prices
      if (!windowVisible) return

      if (!activeMarket) return

      if (!lastMessage || isEmpty(lastMessage) || !lastMessage.data || !lastMessage.stream) {
        // return
        return updatePrices({})
      }

      switch (lastMessage.stream) {
        case '!markPrice@arr@1s':
          const updatedPrices: PricesType = {}
          lastMessage.data.forEach((price: PriceResponse) => {
            const newPrice = {
              fundingRate: price.r,
              nextFundingTime: price.T,
              markPrice: price.p,
              indexPrice: price.i,
            } as MarketData
            updatedPrices[price.s] = newPrice
          })
          updatePrices(updatedPrices)
          break
        case `${activeMarket.name.toLowerCase()}@bookTicker`:
          const depthData: MarketDepthData = {
            bestBidPrice: lastMessage.data.b,
            bestBidQuantity: lastMessage.data.B,
            bestAskPrice: lastMessage.data.a,
            bestAskQuantity: lastMessage.data.A,
          }
          updateDepth(depthData, lastMessage.data.s)
          break
        case `${activeMarket.name.toLowerCase()}@depth${levels}${speed}`:
          let isStable = false
          if (
            windowVisible &&
            depthGraph?.isLive &&
            lastMessage.data.pu !== depthGraph.lastUpdateId &&
            lastMessage.data.u === depthGraph.lastUpdateId
          ) {
            return
          }
          if (windowVisible && depthGraph?.isLive && lastMessage.data.pu !== depthGraph.lastUpdateId) {
            console.log('Lost sync... Behind... Clearing...')
            return clearDepthGraph(activeMarket.name)
          }
          if (!depthGraph || !depthGraph.isLive) {
            console.log('Setup...')
          } else if (
            lastMessage.data.u < depthGraph.lastUpdateId ||
            (lastMessage.data.U <= depthGraph.lastUpdateId &&
              lastMessage.data.u >= depthGraph.lastUpdateId &&
              depthGraph.isFirst)
          ) {
            console.log('First event...')
          } else if (!depthGraph.isFirst && lastMessage.data.pu === depthGraph.lastUpdateId) {
            isStable = true
            // console.log('Stable...')
          }
          const actualAsks: DepthItems = {}
          const actualBids: DepthItems = {}
          if (depthGraph?.isLive) {
            Object.assign(actualAsks, depthGraph.asks)
            Object.assign(actualBids, depthGraph.bids)
          }

          lastMessage.data.a.forEach((ask: string[]) => {
            if (parseFloat(ask[1]) === 0) {
              delete actualAsks[ask[0]]
            } else {
              actualAsks[ask[0]] = ask[1]
            }
          })

          // sort and remove extra items (max levels)
          const sortedAsks = Object.entries(actualAsks)
            .reduce((acc: [string, string][], [key, value]) => {
              if (parseFloat(value) !== 0) {
                acc.push([key, value])
              }
              return acc
            }, [])
            .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
            .slice(0, sortLevels)

          lastMessage.data.b.forEach((bid: string[]) => {
            if (parseFloat(bid[1]) === 0) {
              delete actualBids[bid[0]]
            } else {
              actualBids[bid[0]] = bid[1]
            }
          })
          // sort and filter 0 values and extra items (max levels)
          const sortedBids = Object.entries(actualBids)
            .reduce((acc: [string, string][], [key, value]) => {
              if (parseFloat(value) !== 0) {
                acc.push([key, value])
              }
              return acc
            }, [])
            .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
            .slice(0, sortLevels)

          const newDepthGraph: MarketDepthGraphData = {
            asks: Object.fromEntries(sortedAsks),
            bids: Object.fromEntries(sortedBids),
            lastUpdateId: lastMessage.data.u,
            isFirst: !depthGraph?.isLive,
            isLive: true,
          }
          updateDepthGraph(newDepthGraph, activeMarket.name)

          if (depthGraph?.isLive && isStable) {
            const bestAskPrice = sortedAsks[0][0]
            const bestAskQuantity = sortedAsks[0][1]
            const bestBidPrice = sortedBids[0][0]
            const bestBidQuantity = sortedBids[0][1]
            updateDepth(
              {
                bestAskPrice,
                bestAskQuantity,
                bestBidPrice,
                bestBidQuantity,
              },
              lastMessage.data.s
            )

            // create table to log to console.table (show price and quantity)
            // const table = [
            //   ...sortedBids.map((bid) => {
            //     return { price: bid[0], quantity: bid[1], type: 'bids' }
            //   }).slice(0, 10).toReversed(),
            // ]
            // console.table(table)
            // console.table([
            //   ...sortedAsks.toReversed().map((ask) => {
            //     return { price: ask[0], quantity: ask[1], type: 'asks' }
            //   }).slice(0, 10).toReversed(),
            // ])
          }
          break
        default:
          const jsonPrices = {
            method: 'UNSUBSCRIBE', // UNSUBSCRIBE websocket when user is idle
            params: [lastMessage.stream],
            id: 1,
          }
          sendJsonMessage(jsonPrices as unknown as JsonValue)
          break
      }
    } catch (err) {
      updatePrices({})
      console.log({ err })
    }
  }, [
    lastJsonMessage,
    updatePrices,
    connectionStatus,
    windowVisible,
    depthGraph?.isLive,
    depthGraph?.isFirst,
    depthGraph?.lastUpdateId,
    updateDepth,
    activeMarket,
    sendJsonMessage,
    updateDepthGraph,
    clearDepthGraph,
  ])
}

function useFundingRateWebSocket() {
  const { webSocketFundingRateUrl } = useHedgerInfo() || {}
  const windowVisible = useIsWindowVisible()
  const activeMarket = useActiveMarket()
  const updateFundingRates = useSetFundingRates()

  const url =
    !activeMarket || webSocketFundingRateUrl === '' || !webSocketFundingRateUrl ? null : webSocketFundingRateUrl
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url, {
    reconnectAttempts: 10,
    shouldReconnect: () => true,
    onOpen: () => {
      console.log('Funding Rate established.')
    },
    onClose: () => console.log('Funding Rate closed'),
    onError: (e) => console.log('Funding Rate has error ', e),
  })

  const connectionStatus = useMemo(() => {
    if (readyState === ReadyState.OPEN) {
      return ConnectionStatus.OPEN
    } else {
      return ConnectionStatus.CLOSED
    }
  }, [readyState])

  useEffect(() => {
    if (connectionStatus === ConnectionStatus.OPEN && activeMarket) {
      const json = {
        symbols: windowVisible ? [activeMarket.name] : [],
      }
      sendJsonMessage(json as unknown as JsonValue)
    }
  }, [connectionStatus, sendJsonMessage, windowVisible, activeMarket])

  useEffect(() => {
    try {
      const lastMessage = lastJsonMessage as any
      //don't update anything if user is idle instead of updating to empty prices
      if (!windowVisible) return

      if (!lastMessage || isEmpty(lastMessage)) {
        return
        // return updateFundingRates({})
      }
      updateFundingRates(lastMessage)
    } catch (err) {
      console.log({ err })
    }
  }, [lastJsonMessage, connectionStatus, windowVisible, updateFundingRates])
}
