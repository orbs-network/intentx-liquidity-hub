'use client'
import { Row, RowBetween } from 'components/Row'
import dayjs from 'dayjs'
import React, { Dispatch, ReactNode, SetStateAction } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import styled, { keyframes } from 'styled-components'


import DatePickerPopPup from 'components/Calendar'
import { BarChartActiveDot } from 'components/ChartActiveDot'
import ChartTooltip from 'components/ChartTooltip'

const Wrapper = styled.div`
  width: 100%;
  height: 500px;
  padding: 42px 0px;
  display: flex;
  background-color: rgba(0, 0, 0, 0.2);
  position: relative;

  flex-direction: column;
  > * {
    font-size: 1rem;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
height: 350px;
> * {
  font-size: 0.7rem;
}
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;

    > * {
      font-size: 10px;
    }
  `};
`

const loadingAnimation = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const LoadingRows = styled.div`
  display: grid;
  min-width: 75%;
  max-width: 100%;
  padding: 20px;
  grid-column-gap: 0.5em;
  grid-row-gap: 0.8em;
  grid-template-columns: repeat(1, 1fr);
  & > div {
    animation: ${loadingAnimation} 1.5s infinite;
    animation-fill-mode: both;
    background: linear-gradient(
      to left,
      ${({ theme }) => theme.bg1} 25%,
      ${({ theme }) => theme.bg2} 50%,
      ${({ theme }) => theme.bg1} 75%
    );
    background-size: 400%;
    border-radius: 12px;
    height: 2.4em;
    will-change: background-position;
  }
  & > div:nth-child(4n + 1) {
    grid-column: 1 / 3;
  }
  & > div:nth-child(4n) {
    grid-column: 3 / 4;
    margin-bottom: 2em;
  }
`

export type BarChartProps = {
  data: any[]
  color?: string | undefined
  height?: number | undefined
  minHeight?: number
  setValue?: Dispatch<SetStateAction<number | undefined>>
  setLabel?: Dispatch<SetStateAction<string | undefined>>
  value?: number
  label?: string
  topLeft?: ReactNode | undefined
  topRight?: ReactNode | undefined
  bottomLeft?: ReactNode | undefined
  bottomRight?: ReactNode | undefined
  legend?: ReactNode | undefined
  leftLabel?: string | undefined
  formatLeftValues?: 'USD' | undefined
  formatRightValues?: 'USD' | undefined
} & React.HTMLAttributes<HTMLDivElement>

const CustomBar = ({
  x,
  y,
  width,
  height,
  fill,
}: {
  x: number
  y: number
  width: number
  height: number
  fill: string
}) => {
  return (
    <g>
      <rect x={x} y={height ? y : y - 1} fill={fill} width={width} height={height || 1} rx="2" />
    </g>
  )
}

const ChartTitleLabel = styled.span`
  font-weight: 500;
  font-size: 14px;
  margin-top: 2px;
  ${({ theme }) => theme.white};
`

const formatValueWithSuffix = (value) => {
  const suffixes = ['', 'K', 'M', 'B', 'T']
  let magnitude = 0

  const sign = Math.sign(value)
  value = Math.abs(value)

  while (value >= 1000) {
    value /= 1000
    magnitude++
  }

  const formattedValue = (sign === -1 ? '-' : '') + value.toFixed(0)

  return '$' + formattedValue + suffixes[magnitude]
}

const ComponentAnalysisChart = ({
  data,
  color = '#EA3C55',
  setValue,
  setLabel,
  topLeft,
  bottomLeft,
  bottomRight,
  leftLabel,
  formatLeftValues,
  formatRightValues,
  ...rest
}: BarChartProps) => {
  const newData = JSON.parse(JSON.stringify(data || [])).map((item) => {
    if (item.time) item.time = Number(item.time) * 1000

    return item
  })

  const calculateMinMaxValue = (data) => {
    const values = data.map((item) => item.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)

    const unroundedMinMaxValue = Math.max(Math.abs(minValue), Math.abs(maxValue))

    if (unroundedMinMaxValue < 10) {
      return 10
    }

    let nearestPowerOf10 = 1
    while (nearestPowerOf10 * 10 <= unroundedMinMaxValue) {
      nearestPowerOf10 *= 10
    }

    const roundedMinMaxValue = Math.ceil(unroundedMinMaxValue / nearestPowerOf10) * nearestPowerOf10

    return roundedMinMaxValue
  }

  return (
    <Wrapper {...rest}>
      <RowBetween style={{ alignItems: 'center', marginBottom: '30px', padding: '0 50px' }}>
        <Row gap="10px" align="center">
          <ChartTitleLabel>{topLeft ?? null}</ChartTitleLabel>
          {/*<Image unoptimized={true} src={DownloadIcon} alt="icon" /> */}
        </Row>

        <DatePickerPopPup />
        {/* <DatePickerPopPup /> */}
      </RowBetween>
      {newData?.length === 0 ? (
        <LoadingRows>
          <div />
          <div />
          <div />
        </LoadingRows>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            width={500}
            height={300}
            data={newData}
            margin={{
              top: 10,
              right: 30,
              left: 30,
              bottom: 5,
            }}
            stackOffset="sign"
            onMouseLeave={() => {
              setLabel && setLabel(undefined)
              setValue && setValue(undefined)
            }}
          >
            <Tooltip
              content={
                <ChartTooltip
                  leftLabel={leftLabel}
                  rightLabel="Cumulative"
                  formatLeftValues={formatLeftValues}
                  formatRightValues={formatRightValues}
                />
              }
            />
            <XAxis
              dataKey="time"
              tickLine
              tickFormatter={(time) => dayjs(time).format('DD MMM')}
              tickCount={5}
              minTickGap={10}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(data) => formatValueWithSuffix(data)}
              tickLine={false}
              axisLine={false}
              label={{
                value: leftLabel,
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
                offset: -10,
              }}
              width={75}
            />
            <YAxis
              yAxisId="right"
              tickFormatter={(data) => formatValueWithSuffix(data)}
              tickLine={false}
              axisLine={false}
              orientation="right"
              label={{
                value: 'Cumulative',
                angle: 90,
                position: 'insideRight',
                style: { textAnchor: 'middle' },
                offset: -10,
              }}
              width={75}
            />

            <Bar yAxisId="left" stackId="stack" dataKey="withdraw" fill="#EA3C55" />
            <Bar yAxisId="left"  stackId="stack" dataKey="deposit" fill="#82ca9d" />

            <ReferenceLine yAxisId="left" y={0} stroke="rgba(255,255,255,0.5)" />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulative"
              stroke="#28F290"
              strokeWidth={3}
              dot={false}
              activeDot={<BarChartActiveDot fill="#28F290" />}
            />
            <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="5 0" vertical={false} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
      <RowBetween>
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </RowBetween>
    </Wrapper>
  )
}

export default ComponentAnalysisChart
