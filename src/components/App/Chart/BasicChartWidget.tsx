import { useIsMobile } from 'lib/hooks/useWindowSize'
import { useEffect, useMemo, useRef, useState } from 'react'

import Script from 'next/script'
import dynamic from 'next/dynamic'
const Lottie = dynamic(() => import('react-lottie'), { ssr: false })
import { useActiveMarket } from 'state/trade/hooks'
import styled from 'styled-components'
import { ResolutionString } from '../../../../public/static/charting_library/charting_library'
import loaderAnimationData from './loading-chart.json'

const BasicWidgetContainer = styled.div`
  --tv-color-pane-background: #131518;
  height: 100%;
`

const LoaderWrapper = styled.div`
  margin: auto;

  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #363a45;
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

const Tradingview_c6655 = styled.div`
  & > div {
    overflow: hidden;
    display: flex;
  }
`

export default function BasicChartWidget() {
  const market = useActiveMarket()

  const [scriptReady, setScriptReady] = useState(false)
  const tvWidgetRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>
  const symbol = useMemo(() => {
    if (!market) return ''

    if (market.name === 'WIFUSDT') return 'BYBIT:WIFUSDT.P'
    return `BINANCE:${market.name}.P`
  }, [market])

  const isMobile = useIsMobile()

  const [chartReady, setChartReady] = useState(false)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  function applyGreenStyleToButtons() {
    console.log('apply')
    const buttons = document.querySelectorAll('button')
    buttons.forEach((button) => {
      button.style.color = 'green'
    })
  }

  useEffect(() => {
    window.addEventListener('message', (event: any) => {
      console.log('Message received in iframe:', event.data)
      if (event.name === 'widgetReady') {
        console.log('Applying green style to buttons in iframe.')
        applyGreenStyleToButtons()
      }
    })
  }, [])

  useEffect(() => {
    if (!scriptReady || !market) return

    const widgetOptions = {
      symbol,
      container: tvWidgetRef.current,
      autosize: true,
      interval: '30' as ResolutionString,
      timezone: 'exchange',
      theme: 'dark',
      toolbar_bg: '#131518',
      backgroundColor: '#131518',
      loading_screen: { backgroundColor: '#131518' },

      locale: 'en',

      custom_css_url: '/tradingview.css',
      hide_side_toolbar: isMobile ? true : false,
      container_id: 'tradingview_c6655',
    }
    tvWidgetRef.current = new window.TradingView.widget(widgetOptions)
    setChartReady(true)

    const iframe = document.querySelector('iframe[title="advanced chart TradingView widget"]')

    if (iframe) {
      const iframe = document.querySelector('iframe[title="advanced chart TradingView widget"]') as HTMLIFrameElement

      const contentWindow: any = iframe.contentWindow

      iframe.style.width = 'calc(100% + 2px)'
      iframe.style.margin = '-1px 0px -1px -1px'
      iframe.style.flexShrink = '0'

      console.log('Sending postMessage to iframe.')
      contentWindow.postMessage('applyGreenStyle', '*')
    }

    return () => {
      tvWidgetRef?.current?.remove()
    }
  }, [chartReady, isMobile, scriptReady, setChartReady, symbol, market])

  return (
    <>
      {market && (
        <Script
          onReady={() => {
            setScriptReady(true)
            setChartReady(true)
          }}
          id="tradingview-widget-loading-script"
          src={'https://s3.tradingview.com/tv.js'}
          type="text/javascript"
        ></Script>
      )}

      {!chartReady && (
        <LoaderWrapper>
          <Lottie options={defaultOptions} height={160} width={160} />
        </LoaderWrapper>
      )}

      {market && <Tradingview_c6655 ref={tvWidgetRef} id="tradingview_c6655" />}
    </>
  )
}
