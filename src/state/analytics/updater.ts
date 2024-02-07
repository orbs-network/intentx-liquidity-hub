import { useEffect, useMemo } from 'react'
import { AppThunkDispatch, useAppDispatch } from 'state'
import {
  getDailyMainAnalytics,
  getLast24HoursSymbolsTradingVolume,
  getOpenInterestAnalytic,
  getSymbolTradeAnalytics,
  getTotalMainAnalytics,
} from './thunks'

import { SupportedChainId } from 'constants/chains'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useMainAnalyticsHistoryFilterDateRange } from './hooks'

export function AnalyticsUpdater(): null {
  const { account, chainId } = useActiveConnectionDetails()
  const thunkDispatch: AppThunkDispatch = useAppDispatch()
  const mainAnalyticsHistoryFilterDateRange = useMainAnalyticsHistoryFilterDateRange()

  const startTimestamp = useMemo(
    () => Math.floor(mainAnalyticsHistoryFilterDateRange[0].getTime() / 1000),
    [mainAnalyticsHistoryFilterDateRange]
  )
  const endTimestamp = useMemo(
    () => Math.floor(mainAnalyticsHistoryFilterDateRange[1].getTime() / 1000),
    [mainAnalyticsHistoryFilterDateRange]
  )

  useEffect(() => {
    // For now, just using BASE chain or the one connected
    const cId = chainId ? chainId : SupportedChainId.BASE

    thunkDispatch(getDailyMainAnalytics({ chainId: cId, startTimestamp, endTimestamp }))
    thunkDispatch(
      getTotalMainAnalytics({
        chainId: cId,
      })
    )
    thunkDispatch(
      getSymbolTradeAnalytics({
        chainId: cId,
      })
    )
    thunkDispatch(
      getOpenInterestAnalytic({
        chainId: cId,
      })
    )

    thunkDispatch(
      getLast24HoursSymbolsTradingVolume({
        chainId: cId,
      })
    )
  }, [chainId, startTimestamp, endTimestamp, thunkDispatch])

  return null
}
