'use client'
import React, { Dispatch, SetStateAction, ReactNode } from 'react'
import Image from 'next/image'
import { ResponsiveContainer, XAxis, Bar, Line, ComposedChart, CartesianGrid, YAxis, Tooltip } from 'recharts'
import styled, { keyframes } from 'styled-components'
import { Row, RowBetween } from 'components/Row'
import dayjs from 'dayjs'
import { formatDollarAmount } from 'utils/numbers'

import DownloadIcon from '/public/static/images/etc/download.svg'

import ChartTooltip from 'components/ChartTooltip'
import { BarChartActiveDot } from 'components/ChartActiveDot'
import DatePickerPopPup from 'components/Calendar'

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

  while (value >= 1000) {
    value /= 1000
    magnitude++
  }

  return value.toFixed(0) + suffixes[magnitude]
}

const BarChartComponent = ({
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
  return (
    <Wrapper {...rest}>
      <RowBetween style={{ alignItems: 'center', marginBottom: '30px', padding: '0 50px' }}>
        <Row gap="10px" align="center">
          <ChartTitleLabel>{topLeft ?? null}</ChartTitleLabel>
          {/*<Image unoptimized={true} src={DownloadIcon} alt="icon" /> */}
        </Row>

        <DatePickerPopPup />
      </RowBetween>
      {data?.length === 0 ? (
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
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 5,
            }}
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
              tickFormatter={(time) => dayjs(time).format('MMM DD')}
              tickCount={5}
              minTickGap={10}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(data) => {
                if (formatLeftValues === 'USD') {
                  return formatDollarAmount(data)
                }

                return formatValueWithSuffix(data)
              }}
              tickLine={false}
              axisLine={false}
              label={{
                value: leftLabel,
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
              }}
              width={75}
            />
            <YAxis
              yAxisId="right"
              tickFormatter={(data) => {
                if (formatRightValues === 'USD') {
                  return formatDollarAmount(data)
                }

                return formatValueWithSuffix(data)
              }}
              tickLine={false}
              axisLine={false}
              orientation="right"
              label={{
                value: 'Cumulative',
                angle: 90,
                position: 'insideRight',
                style: { textAnchor: 'middle' },
              }}
              width={75}
            />
            <Bar
              yAxisId="left"
              dataKey="value"
              shape={(props: any) => {
                return <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={color} />
              }}
              activeBar={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="value"
              stroke="#00000000"
              strokeWidth={1}
              dot={false}
              activeDot={<BarChartActiveDot fill="#E63E56" />}
            />
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

export default BarChartComponent
