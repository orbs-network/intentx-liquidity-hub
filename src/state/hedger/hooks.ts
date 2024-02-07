import { useCallback, useMemo } from 'react'
import { AppThunkDispatch, useAppDispatch, useAppSelector } from 'state'

import { MULTI_ACCOUNT_ADDRESS } from 'constants/addresses'
import { FALLBACK_CHAIN_ID } from 'constants/chains'
import { DEFAULT_HEDGER, getHedgerInfo } from 'constants/hedgers'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import useDebounce from 'lib/hooks/useDebounce'
import { useSupportedChainId } from 'lib/hooks/useSupportedChainId'
import { Market } from 'types/market'
import {
  clearDepthGraph,
  updateDepth,
  updateDepthGraph,
  updateFundingRates,
  updatePrices,
  updateWebSocketStatus,
} from './actions'
import { getMarketsInfo } from './thunks'
import {
  ConnectionStatus,
  FundingRateData,
  FundingRateMap,
  MarketData,
  MarketDataMap,
  MarketDepthData,
  MarketDepthGraphData,
  MarketsInfo,
} from './types'

export function useMarketsStatus() {
  const marketsStatus = useAppSelector((state) => state.hedger.marketsStatus)
  return marketsStatus
}

export function useSetWebSocketStatus() {
  const dispatch = useAppDispatch()
  return useCallback(
    (status: ConnectionStatus) => {
      dispatch(updateWebSocketStatus({ status }))
    },
    [dispatch]
  )
}

export function useHedgerInfo() {
  const { chainId } = useActiveConnectionDetails()
  const isSupportedChainId = useSupportedChainId()
  const debouncedChainId = useDebounce(isSupportedChainId, 3000)
  return useMemo(() => (debouncedChainId ? getHedgerInfo(chainId) : DEFAULT_HEDGER), [chainId, debouncedChainId])
}

export function useWebSocketUrl() {
  const hedger = useHedgerInfo()
  return useMemo(() => (hedger ? hedger.webSocketUrl : null), [hedger])
}

export function useWebSocketStatus() {
  const webSocketStatus = useAppSelector((state) => state.hedger.webSocketStatus)
  return webSocketStatus
}

export function useMarkets(): Market[] {
  const markets = useAppSelector((state) => state.hedger.markets)
  return markets
}

export function useMarketsIdMap(): { [key: string]: Market } {
  const markets = useAppSelector((state) => state.hedger.markets)
  return useMemo(() => {
    const map: { [key: string]: Market } = {}
    markets.forEach((market: Market) => {
      map[market.id] = market
    })
    return map
  }, [markets])
}

export function useMarketById(marketId: string): Market | null {
  const marketsIdMap = useMarketsIdMap()
  return marketsIdMap[marketId] || null
}

export function useErrorMessages() {
  const errorMessages = useAppSelector((state) => state.hedger.errorMessages)
  return errorMessages
}

export function useMarketNotionalCap() {
  const marketNotionalCap = useAppSelector((state) => state.hedger.marketNotionalCap)
  const marketNotionalCapStatus = useAppSelector((state) => state.hedger.marketNotionalCapStatus)
  return { marketNotionalCap, marketNotionalCapStatus }
}

export function useMarketOpenInterest() {
  const openInterest = useAppSelector((state) => state.hedger.openInterest)
  return openInterest as {
    total: number
    used: number
  }
}

export function usePrices(): MarketData[] {
  const prices = useAppSelector((state) => state.hedger.prices)
  return prices
}

export function useFundingRateData(name: string | undefined): FundingRateData | null {
  const fundingRates = useAppSelector((state) => state.hedger.fundingRates)
  return name ? fundingRates[name] : null
}

export function useMarketPriceRange() {
  const priceRange = useAppSelector((state) => state.hedger.priceRange)
  return priceRange
}

export function useMarketData(name: string | undefined): MarketData | null {
  const prices = useAppSelector((state) => state.hedger.prices)
  return name ? prices[name] : null
}

export function useMarketDepth(name: string | undefined): MarketDepthData | null {
  const depths = useAppSelector((state) => state.hedger.depths)
  return name ? depths[name] : null
}

export function useDepthGraph(name: string | undefined): MarketDepthGraphData | null {
  const depth = useAppSelector((state) => state.hedger.depthGraph)
  return name && depth[name] ? depth[name] : null
}

export function useMarketsInfo(): MarketsInfo {
  const marketsInfo = useAppSelector((state) => state.hedger.marketsInfo)
  return marketsInfo
}

export function useSetPrices() {
  const dispatch = useAppDispatch()
  return useCallback(
    (prices: MarketDataMap) => {
      dispatch(updatePrices({ prices }))
    },
    [dispatch]
  )
}

export function useSetDepth() {
  const dispatch = useAppDispatch()
  return useCallback(
    (depth: MarketDepthData, name: string) => {
      dispatch(updateDepth({ name, depth }))
    },
    [dispatch]
  )
}

export function useSetDepthGraph() {
  const dispatch = useAppDispatch()
  return useCallback(
    (depth: MarketDepthGraphData, name: string) => {
      dispatch(updateDepthGraph({ name, depth }))
    },
    [dispatch]
  )
}

export function useSetFundingRates() {
  const dispatch = useAppDispatch()
  return useCallback(
    (fundingRates: FundingRateMap) => {
      dispatch(updateFundingRates({ fundingRates }))
    },
    [dispatch]
  )
}

export function useClearDepthGraph() {
  const dispatch = useAppDispatch()
  return useCallback(
    (name: string) => {
      dispatch(clearDepthGraph({ name }))
    },
    [dispatch]
  )
}

export function useSetMarketsInfo() {
  const hedger = useHedgerInfo()
  const { chainId } = useActiveConnectionDetails()

  const { baseUrl } = hedger || {}
  const dispatch: AppThunkDispatch = useAppDispatch()
  const multiAccountAddress = chainId ? MULTI_ACCOUNT_ADDRESS[chainId] : MULTI_ACCOUNT_ADDRESS[FALLBACK_CHAIN_ID]

  return useCallback(() => {
    console.log('useSetMarketsInfo')
    dispatch(getMarketsInfo({ hedgerUrl: baseUrl, multiAccountAddress }))
  }, [baseUrl, dispatch, multiAccountAddress])
}
