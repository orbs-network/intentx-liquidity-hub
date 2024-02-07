import { Row, RowBetween, RowFixed } from 'components/Row'
import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import { useIsMobile } from 'lib/hooks/useWindowSize'
import { SwiperSlide, Swiper } from 'swiper/react'
import BTC from '/public/static/images/tokens/BTC.svg'
import USDT from '/public/static/images/tokens/USDT.svg'
import Trending from '/public/static/images/etc/trending.svg'
import HighestRow from './HighestRow'
import PieChartComponent, { ChartPieData } from 'components/ChartPie'
import Column from 'components/Column'
import Dropdown from 'components/DropDown'
import AreaChartComponent from 'components/LineChart'
import Gauge from 'components/Gauge'
import useGradient from 'hooks/useGradient'
import { useMarkets, useMarketsInfo, useSetMarketsInfo } from 'state/hedger/hooks'
import { usePositionsQuotes } from 'state/quotes/hooks'
import { getPositionNumbers } from 'state/quotes/parsers'

const Container = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? 'auto' : '400px')};
  height: ${({ isMobile }) => (isMobile ? '250px' : '302px')};
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background: #171a1f;
  margin-bottom: 50px;
  padding: 25px 15px;
`

const TextHead = styled.div`
  display: flex;
  align-items: center;
  color: gray;
  font-size: 12px;
  line-height: 18px;
  font-weight: 200;
  display: inline-flex;
  gap: 5px;
`
const TextSubHead = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.white};
  font-size: 12px;
  line-height: 18px;
  font-weight: 200;
  display: inline-flex;
  gap: 5px;
`

const ButtonsBg = styled.div`
  border-radius: 4px;
  background: linear-gradient(0deg, #22262e, #22262e),
    linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
  border: 0.5px solid #ffffff1a;
  display: inline-flex;
`
const ButtonLeft = styled.div`
  border-left: 0.5px solid #ffffff1a;
  width: 40px;
  height: 30px;
  padding: 3px 8px;
  cursor: pointer;
`
const ButtonRight = styled.div`
  border-right: 0.5px solid #ffffff1a;
  width: 40px;
  height: 30px;
  padding: 3px 8px;
  cursor: pointer;
`

const HourRed = styled.div`
  background: #bd2738;
  width: 30px;
  height: 20px;
  border-radius: 5px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`

const MarketRows = styled.div<{ isMobile: boolean | undefined }>`
  margin-top: 17px;
  display: flex;
  flex-direction: column;
  gap: ${({ isMobile }) => (isMobile ? '5px' : '0px')};
`

const Label = styled.span`
  size: 12px;
  font-weight: 300;
  color: ${({ theme }) => theme.white};
  opacity: 0.5;
`

const ColorDot = styled.div<{ bgColor?: string }>`
  height: 8px;
  width: 8px;
  border-radius: 100%;
  font-weight: 400;
  background-color: ${({ bgColor }) => bgColor && bgColor};
  margin: 8px 5px 0 0;
`

const PercentageLabel = styled.span`
  size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.white};
`

const DropDownContainer = styled.div`
  margin: 8px 0 18px 0;
`

const AreaChartWrapper = styled.div`
  position: absolute;
  bottom: -10px;
  left: -4px;
`

const BTCPerpetual = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.white};
  margin-top: 30px;
  margin-bottom: 5px;
`

const PercentageChange = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 5px;
  background-color: #bd27384d;
  border-radius: 5px;
`

const ChangeLabel = styled.span`
  color: #ff2a5f;
  font-size: 11px;
`

const GaugeWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding-bottom: 1rem;
  justify-content: center;
  position: relative;
`

const AltcoinWeekValue = styled.span`
  font-weight: 500;
  font-size: 14px;
  position: absolute;
  bottom: 0;
`

const MarketBoxesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
`

export default function MarketsBox() {
  const markets = useMarkets()
  const marketsInfo = useMarketsInfo()

  function getOpenInterest() {
    return (
      <div>
        <RowBetween>
          <TextHead>Open interest</TextHead>
          <ButtonsBg>
            <ButtonRight>
              <Image unoptimized={true} src={BTC} alt="icon" width={23} height={23} />
            </ButtonRight>
            <ButtonLeft>
              <Image unoptimized={true} src={USDT} alt="icon" width={23} height={23} />
            </ButtonLeft>
          </ButtonsBg>
        </RowBetween>
        <DropDownContainer>
          <Dropdown
            options={[
              { value: '1', label: 'BTC/USDT Perpetual' },
              { value: '2', label: 'ETH/USDT Perpetual' },
            ]}
            width="150px"
            onSelect={() => {
              console.log('select')
            }}
            defaultValue="BTC/USDT Perpetual"
            placeholder="BTC/USDT Perpetual"
          />
        </DropDownContainer>

        <Column>
          <BTCPerpetual>--.-- BTC</BTCPerpetual>
          <Row gap="8px">
            <PercentageChange>
              <Image unoptimized={true} src={Trending} alt="icon" width={15} height={15} />
              <ChangeLabel>---.--%</ChangeLabel>
            </PercentageChange>
            <Label>24h Change</Label>
          </Row>
        </Column>

        <AreaChartWrapper>
          <AreaChartComponent />
        </AreaChartWrapper>
      </div>
    )
  }

  const getRatio = (data: ChartPieData[]) => {
    if (data[0] && data[1]) {
      const calculatedRatio = data[1].value / data[0].value

      const roundedUpNumber = Math.ceil(calculatedRatio * 100) / 100

      return roundedUpNumber.toFixed(2)
    }

    return null
  }

  const getLongShort = () => {
    const pieChartData = [
      { name: 'Short Account %', value: 43.53 },
      { name: 'Long Account %', value: 56.47 },
    ]

    return (
      <Column>
        <TextHead>
          Long/Short Radio <HourRed>1h</HourRed>
        </TextHead>

        <DropDownContainer>
          <Dropdown
            options={[
              { value: '1', label: 'BTC/USDT Perpetual' },
              { value: '2', label: 'ETH/USDT Perpetual' },
            ]}
            width="150px"
            onSelect={() => {
              console.log('select')
            }}
            defaultValue="BTC/USDT Perpetual"
            placeholder="BTC/USDT Perpetual"
          />
        </DropDownContainer>

        <RowBetween align="end" height="100%">
          <Column>
            <RowFixed align="start">
              <ColorDot bgColor="#BD2738" />
              <Column>
                <Label>{pieChartData[0].name}</Label>
                <PercentageLabel>{pieChartData[0].value}</PercentageLabel>
              </Column>
            </RowFixed>

            <RowFixed align="start" marginTop="8px">
              <ColorDot bgColor="#27F291" />
              <Column>
                <Label>{pieChartData[1].name}</Label>
                <PercentageLabel>{pieChartData[1].value}</PercentageLabel>
              </Column>
            </RowFixed>

            <RowFixed align="start" marginTop="25px">
              <ColorDot bgColor="transparent" />
              <Column>
                <Label>Long/Short Ratio</Label>
                <PercentageLabel>{getRatio(pieChartData)}</PercentageLabel>
              </Column>
            </RowFixed>
          </Column>

          <PieChartComponent data={pieChartData} ratio={getRatio(pieChartData) ?? 'N/A'} />
        </RowBetween>
      </Column>
    )
  }

  function AltcoinIndex() {
    // Hello sir, update this altcoinWeekIndex value to move the needle and gradient
    const altcoinWeekIndex = 40
    const redToGreenFade = useGradient('#BD2738', '#27F290', altcoinWeekIndex, 'gauge-gradient-id')

    const arcSegments = [
      {
        min: 0,
        max: 1,
        ...redToGreenFade,
      },
    ]

    return (
      <Column>
        <TextHead>Altcoin Week Index</TextHead>
        <TextSubHead>It is not Altcoin week</TextSubHead>
        <GaugeWrapper>
          <Gauge
            min={0}
            max={100}
            height={160}
            width={250}
            value={altcoinWeekIndex}
            maxAngle={90}
            minAngle={-90}
            pointerLabel={altcoinWeekIndex}
            arcSegments={arcSegments}
          />
          <AltcoinWeekValue>{altcoinWeekIndex}</AltcoinWeekValue>
        </GaugeWrapper>
      </Column>
    )
  }

  function HighestVolumePairs() {
    return (
      <div>
        <TextHead>
          Highest Volume Pairs <HourRed>24h</HourRed>
        </TextHead>
        <MarketRows isMobile={isMobile}>
          {markets && marketsInfo ? (
            markets
              .slice()
              .sort((a, b) => {
                if (!marketsInfo[b.name] || !marketsInfo[a.name]) return 0
                return parseFloat(marketsInfo[b.name].tradeVolume) - parseFloat(marketsInfo[a.name].tradeVolume)
              })
              .slice(0, 5)
              .map((market, index) => (
                <HighestRow
                  key={index}
                  market={market.name}
                  marketSub={market.name}
                  variation={marketsInfo[market.name] ? parseFloat(marketsInfo[market.name].priceChangePercent) : 0}
                />
              ))
          ) : (
            <></>
          )}
        </MarketRows>
      </div>
    )
  }

  function HighestChange() {
    return (
      <div>
        <TextHead>
          Highest Change <HourRed>24h</HourRed>
        </TextHead>
        <MarketRows isMobile={isMobile}>
          {markets && marketsInfo ? (
            markets
              .slice()
              .sort((a, b) => {
                if (!marketsInfo[b.name] || !marketsInfo[a.name]) return 0
                return (
                  parseFloat(marketsInfo[b.name].priceChangePercent) -
                  parseFloat(marketsInfo[a.name].priceChangePercent)
                )
              })
              .slice(0, 5)
              .map((market, index) => (
                <HighestRow
                  key={index}
                  market={market.name}
                  marketSub={market.name}
                  variation={marketsInfo[market.name] ? parseFloat(marketsInfo[market.name].priceChangePercent) : 0}
                />
              ))
          ) : (
            <></>
          )}
        </MarketRows>
      </div>
    )
  }

  const isMobile = useIsMobile()
  return isMobile ? getMobileContent() : getDefaultContent()

  function getMobileContent() {
    return (
      <Swiper slidesPerView={1} spaceBetween={30} centeredSlides={true} className="mySwiper">
        <SwiperSlide>
          <Container isMobile={isMobile}>{getOpenInterest()}</Container>
        </SwiperSlide>
        <SwiperSlide>
          <Container isMobile={isMobile}>{getLongShort()}</Container>
        </SwiperSlide>
        {/* <SwiperSlide>
          <Container isMobile={isMobile}>{AltcoinIndex()}</Container>
    </SwiperSlide> */}
        <SwiperSlide>
          <Container isMobile={isMobile}>{HighestVolumePairs()}</Container>
        </SwiperSlide>
        <SwiperSlide>
          <Container isMobile={isMobile}>{HighestChange()}</Container>
        </SwiperSlide>
      </Swiper>
    )
  }

  function getDefaultContent() {
    return (
      <MarketBoxesContainer>
        <Container isMobile={isMobile}>{getOpenInterest()}</Container>

        <Container isMobile={isMobile}>{getLongShort()}</Container>

        {/*<Container isMobile={isMobile}>{AltcoinIndex()}</Container> */}

        <Container isMobile={isMobile}>{HighestVolumePairs()}</Container>

        <Container isMobile={isMobile}>{HighestChange()}</Container>
      </MarketBoxesContainer>
    )
  }
}
