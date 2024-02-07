import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  LanguageCode,
  ResolutionString,
  widget,
} from 'lib/tradingview/charting_library-master/charting_library'
import { useParams } from 'next/navigation'
import { useActiveMarket } from 'state/trade/hooks'
import { useActiveAccountAddress } from 'state/user/hooks'

import styled from 'styled-components'
import loaderAnimationData from './loading-chart.json'

import { useIsMobile } from 'lib/hooks/useWindowSize'
import binanceDatafeed from 'lib/tradingview/datafeeds/binance-datafeed/index'
import save_load_adapter from 'utils/saveLoadAdapter'
import { UDFCompatibleDatafeed } from '../../../../public/static/datafeeds/udf/src/udf-compatible-datafeed'

const LoaderWrapper = styled.div`
  margin: auto;

  display: flex;
  justify-content: center;
  align-items: center;

  height: 593px;
  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    height: 524px;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
    height: 489px;

`};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 400px;
`};
`

export default function AdvancedChartWidget({ symbol }: { symbol: string }) {
  const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>
  const activeAccountAddress = useActiveAccountAddress()
  const market = useActiveMarket()
  const tvWidgetRef = useRef<IChartingLibraryWidget>()
  const urlParams = useParams()
  const [hasCharts, setHasCharts] = useState<boolean>(false)
  const [chart, setChart] = useState<IChartingLibraryWidget | null>(null)

  const isMobile = useIsMobile()

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  useEffect(() => {
    try {
      const widgetOptions: ChartingLibraryWidgetOptions = {
        debug: false,
        symbol,
        datafeed: new UDFCompatibleDatafeed('https://charts.intentx.io'),
        disabled_features: [
          'timeframes_toolbar',
          'create_volume_indicator_by_default',
          'create_volume_indicator_by_default_once',
          'header_symbol_search',
        ],
        enabled_features: ['study_templates'],
        container: chartContainerRef.current,
        autosize: true,
        interval: '30' as ResolutionString,
        study_count_limit: 15, //max number of indicators that can be added to charts
        timezone: 'exchange',
        theme: 'dark',
        toolbar_bg: '#131518',

        loading_screen: { backgroundColor: '#131518', foregroundColor: '#131518' },

        // Background
        overrides: {
          'linetoolarc.backgroundColor': '#131518',
          'paneProperties.background': '#131518',
          'paneProperties.backgroundType': 'solid',
          'mainSeriesProperties.style': 1,
        },

        library_path: '/static/charting_library/',
        locale: 'en' as LanguageCode,
        custom_css_url: '../tradingview.css',
        charts_storage_api_version: '1.1',
        save_load_adapter: save_load_adapter,
        // charts_storage_url: 'https://saveload.tradingview.com',

        load_last_chart: true, //last chart layout (if present)
        client_id: 'intentx.io',
        user_id: 'public_user',
      }

      const myChart = new widget(widgetOptions)
      setChart(myChart)
      myChart.onChartReady(() => {
        setHasCharts(true)
      })
      return () => {
        myChart.remove()
        setHasCharts(false)
        setChart(null)
      }
    } catch (e) {
      console.error(e)
      setHasCharts(false)
    }
    // run only once after mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useLayoutEffect(() => {
    if (chart && hasCharts) {
      chart.chart().resetData()

      chart.chart().setSymbol(symbol)
    }
  }, [chart, hasCharts, symbol])

  return (
    <>
      {/*!chartReady && (
        <LoaderWrapper>
          <Lottie options={defaultOptions} height={160} width={160} />
        </LoaderWrapper>
      )*/}

      <div style={{ height: isMobile ? '400px' : '100%', minHeight: '400px', width: '100%' }} ref={chartContainerRef} />
    </>
  )
}
