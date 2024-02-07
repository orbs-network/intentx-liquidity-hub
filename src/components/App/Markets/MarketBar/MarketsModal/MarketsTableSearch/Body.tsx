import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Market } from 'types/market'
import { ApiState } from 'types/api'
import { useMarketsInfo, useMarketsStatus, useSetMarketsInfo } from 'state/hedger/hooks'

import MarketRow from './Row'

import Column from 'components/Column'
import { Loader } from 'components/Icons'
import {
  useLast24HoursSymbolsTradingVolume,
  useLast24HoursSymbolsTradingVolumeAsSymbolDictionary,
  useOpenInterestAnalytics,
  useOpenInterestAnalyticsAsSymbolDictionary,
} from 'state/analytics/hooks'
import { fromWei } from 'utils/numbers'

const LoaderWrapper = styled.div`
  margin: 16px auto;
`

export default function TableBody({
  markets,
  searchValue,
  onDismiss,
  sortConfig,
}: {
  markets: Market[]
  searchValue: string
  onDismiss: () => void
  sortConfig: {
    key: string
    direction: string
    bodyKey: string
  }
}): JSX.Element | null {
  const marketsStatus = useMarketsStatus()
  const getMarketsInfo = useSetMarketsInfo()
  const marketsInfo = useMarketsInfo()

  const last24HoursSymbolsTradingVolume = useLast24HoursSymbolsTradingVolumeAsSymbolDictionary()
  const openInterestAnalytics = useOpenInterestAnalyticsAsSymbolDictionary()

  const isolatedMarketsInfo: Record<
    string,
    { price: string; priceChangePercent: string; tradeVolume: string; notionalCap: string; marketCap: string }
  > = useMemo(
    () =>
      Object.keys(marketsInfo).reduce((acc, key) => {
        const info = marketsInfo[key]
        const symbolVolume = last24HoursSymbolsTradingVolume[key]
        const notionalCap = openInterestAnalytics[key]
        acc[key] = {
          ...info,
          tradeVolume: fromWei(symbolVolume?.volume) || '0',
          notionalCap: fromWei(notionalCap?.amount) || '0',
        }
        return acc
      }, {} as Record<string, { price: string; priceChangePercent: string; tradeVolume: string; notionalCap: string; marketCap: string }>),
    [marketsInfo, last24HoursSymbolsTradingVolume, openInterestAnalytics]
  )

  useEffect(() => {
    getMarketsInfo()
  }, [getMarketsInfo])

  const sortedData = useMemo(() => {
    const transformedData = Object.keys(isolatedMarketsInfo).map((key) => ({ name: key, ...isolatedMarketsInfo[key] }))

    return [...markets].sort((a, b) => {
      const [floatA, floatB] = [a, b].map((market) => {
        const priceChange = transformedData.find((data) => data.name === market.name)

        return priceChange?.hasOwnProperty(sortConfig.bodyKey)
          ? parseFloat(priceChange[sortConfig.bodyKey].replace('$', ''))
          : 0
      })

      if (floatA < floatB) return sortConfig.direction === 'asc' ? -1 : 1
      if (floatA > floatB) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [markets, isolatedMarketsInfo, sortConfig])

  const content =
    marketsStatus === ApiState.LOADING ? (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    ) : marketsStatus === ApiState.OK ? (
      sortedData.map((market) => (
        <MarketRow
          key={market.id}
          market={market}
          marketInfo={isolatedMarketsInfo[market.name]}
          onDismiss={onDismiss}
        />
      ))
    ) : (
      <h1>error</h1>
    )

  return <Column>{content}</Column>
}
