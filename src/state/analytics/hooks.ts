import { getCurrentEpochStartTimestamp, getEpochEndTimestamp } from 'lib/epoch/getEpochInformation'
import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'state'
import { MainAnalyticsHistory, OpenInterestDetails, SymbolDailyTradeVolume, SymbolTradeVolume, TotalMainAnalytics } from './types'

import { useCallback } from 'react'
import { updateFilterDateRange } from './actions'

export function useMainAnalyticsHistory(): MainAnalyticsHistory[] {
  const mainAnalyticsHistory: MainAnalyticsHistory[] = useAppSelector((state) => state.analytics.mainAnalyticsHistory)

  return mainAnalyticsHistory
}

export function useMainAnalyticsHistoryFilterDateRange(): [Date, Date] {
  const mainAnalyticsHistoryFilterDateRange: [Date, Date] = useAppSelector(
    (state) => state.analytics.mainAnalyticsHistoryFilterDateRange
  )

  return mainAnalyticsHistoryFilterDateRange
}

export function useSetMainAnalyticsHistoryFilterDateRange() {
  const dispatch = useAppDispatch()

  return useCallback(
    (dateRange: [Date, Date]) => {
      dispatch(updateFilterDateRange(dateRange))
    },
    [dispatch]
  )
}

export function useCurrentEpochAnalytics(): MainAnalyticsHistory | null {
  const mainAnalyticsHistory: MainAnalyticsHistory[] = useAppSelector((state) => state.analytics.mainAnalyticsHistory)

  const currentEpochAnalytics = useMemo(() => {
    if (!mainAnalyticsHistory) {
      return null
    }
    const currentEpochStartTimestamp = getCurrentEpochStartTimestamp()
    const currentEpochEndTimestamp = getEpochEndTimestamp(currentEpochStartTimestamp)
    const currentEpochAnalytics = mainAnalyticsHistory.slice().sort(
      (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp) 
    )[0]

    return currentEpochAnalytics ?? null
  }, [mainAnalyticsHistory])

  return currentEpochAnalytics
}

export function useTotalMainAnalytics(): TotalMainAnalytics {
  const totalMainAnalytics: TotalMainAnalytics = useAppSelector((state) => state.analytics.totalMainAnalytics)

  return totalMainAnalytics
}

export function useSymbolsTradeAnalytics(): SymbolTradeVolume[] {
  const symbolTradeAnalytics: SymbolTradeVolume[] = useAppSelector((state) => state.analytics.symbolTradeAnalytics)

  return symbolTradeAnalytics
}

export function useOpenInterestAnalytics(): OpenInterestDetails[] {
  const openInterestAnalytic: OpenInterestDetails[] = useAppSelector((state) => state.analytics.openInterestAnalytic)

  return openInterestAnalytic
}

export function useOpenInterestAnalyticsAsSymbolDictionary(): Record<string, OpenInterestDetails> {
  const openInterestAnalytic: OpenInterestDetails[] = useOpenInterestAnalytics()

  const openInterestDictionary = useMemo(() => {
    if (!openInterestAnalytic) {
      return {}
    }
    const openInterestDictionary: Record<string, OpenInterestDetails> = {}
    openInterestAnalytic.forEach((openInterest) => {
      if (openInterest.symbol) {
        openInterestDictionary[openInterest.symbol.name] = openInterest
      }
    })
    return openInterestDictionary
  }, [openInterestAnalytic])

  return openInterestDictionary
}



export function useLast24HoursSymbolsTradingVolume(): SymbolDailyTradeVolume[] {
  const last24HoursSymbolsTradingVolume: SymbolDailyTradeVolume[] = useAppSelector(
    (state) => state.analytics.last24HoursSymbolsTradingVolume
  )

  return last24HoursSymbolsTradingVolume
}

export function useLast24HoursSymbolsTradingVolumeAsSymbolDictionary(): Record<string, SymbolDailyTradeVolume> {
  const last24HoursSymbolsTradingVolume: SymbolDailyTradeVolume[] = useLast24HoursSymbolsTradingVolume()

  const last24HoursSymbolsTradingVolumeDictionary = useMemo(() => {
    if (!last24HoursSymbolsTradingVolume) {
      return {}
    }
    const last24HoursSymbolsTradingVolumeDictionary: Record<string, SymbolDailyTradeVolume> = {}
    last24HoursSymbolsTradingVolume.forEach((symbolTrade) => {
      if (symbolTrade.symbol) {
        last24HoursSymbolsTradingVolumeDictionary[symbolTrade.symbol.name] = symbolTrade
      }
    })
    return last24HoursSymbolsTradingVolumeDictionary
  }, [last24HoursSymbolsTradingVolume])

  return last24HoursSymbolsTradingVolumeDictionary
}

export function useCurrentEpochSymbolVolume(symbol: string) {
  const last24HoursSymbolsTradingVolume: SymbolDailyTradeVolume[] = useLast24HoursSymbolsTradingVolume()

  const symbolVolume = useMemo(() => {
    const symbolVolume = last24HoursSymbolsTradingVolume.find((symbolTrade) => symbolTrade.symbol.name === symbol)
    return symbolVolume ? symbolVolume.volume : 0
  }, [symbol, last24HoursSymbolsTradingVolume])

  return symbolVolume
}
