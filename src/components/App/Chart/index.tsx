import { useDetectAdBlock } from 'adblock-detect-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import LOADING_CHART from '/public/static/images/etc/LoadChart.svg'

import { useActiveMarket } from 'state/trade/hooks'

import { Card } from 'components/Card'
import { ContextError, useInvalidContext } from 'components/InvalidContext'
import { RowCenter } from 'components/Row'
import BasicChartWidget from './BasicChartWidget'
import AdvancedChartWidget from './AdvancedChartWidget'
import { useRouter } from 'next/router'

const Wrapper = styled(Card)`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0;
  position: relative;
  justify-content: center;
  background: rgba(17, 17, 24, 1);
  border-radius: 0px;
`
const LoaderWrapper = styled.div`
  margin: 16px auto;

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

const AdBlockText = styled(RowCenter)`
  width: 100%;
  font-size: 16px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text1};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px;
  margin-bottom: 15px; 
`};
`

const WarningText = styled.span`
  font-size: 16px;
  margin: 0px 4px;
  color: ${({ theme }) => theme.warning};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px;
  margin: 0px 3px;
`};
`

const LoadChartImage = styled.div`
  text-align: center;
`

const WidgetContainer = styled.div<{ invalidContext: boolean }>`
  height: 100%;
  border-top: 1px solid #363a45;

  iframe {
    height: 100%;
    min-height: 593px;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  iframe {
    min-height: 524px;
  }
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
  iframe {
    min-height: 489px;
  }
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
  iframe {
    min-height: 489px;

  }
`};
  ${({ theme }) => theme.mediaWidth.upToMedium`

 iframe {
    min-height: 400px;

  }
`};
`

export default function Chart() {
  const adBlockDetected = useDetectAdBlock()
  const market = useActiveMarket()
  const [isScriptReady, setIsScriptReady] = useState(true)

  const invalidContext = useInvalidContext()
  const [isInvalidContext, setIsInvalidContext] = useState(true)
  useEffect(() => {
    setIsInvalidContext(invalidContext === ContextError.ACCOUNT)
  }, [invalidContext])
  return (
    <Wrapper>
      {adBlockDetected ? (
        <>
          <LoadChartImage>
            <Image unoptimized={true} src={LOADING_CHART} alt={'load_chart'} width={182} height={184} />
          </LoadChartImage>
          <AdBlockText>Cannot load chart</AdBlockText>
          <AdBlockText>
            (The chart can not be loaded while your<WarningText>ad blocker</WarningText> is ON)
          </AdBlockText>
        </>
      ) : (
        <WidgetContainer className="tradingview-widget-container" invalidContext={isInvalidContext}>
          <AdvancedChartWidget symbol={market?.name || 'BTCUSDT'} />
          {/* <BasicChartWidget /> */}
        </WidgetContainer>
      )}
    </Wrapper>
  )
}
