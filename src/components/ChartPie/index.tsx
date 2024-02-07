import React from 'react'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import styled from 'styled-components'

const COLORS = ['#BD2738', '#27F290']

export type ChartPieData = {
  name: string
  value: number
}

const ChartWrapper = styled.div`
  display: flex;
  position: relative;
  top: 20px;
`
const RatioContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
`

const PieChartComponent = ({ data, ratio }: { data: ChartPieData[]; ratio: string }) => {
  return (
    <ChartWrapper>
      <PieChart width={114} height={114}>
        <Pie
          data={data}
          cx={52}
          cy={52}
          innerRadius={30}
          outerRadius={50}
          stroke="transparent"
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <RatioContainer>{ratio}</RatioContainer>
    </ChartWrapper>
  )
}

export default PieChartComponent
