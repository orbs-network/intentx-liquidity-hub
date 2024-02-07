import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  {
    week: 0,
    rewardsmultiplier: 4000,
    exitFee: 2400,
  },
  {
    week: 1,
    rewardsmultiplier: 3000,
    exitFee: 1398,
  },
  {
    week: 2,
    rewardsmultiplier: 2000,
    exitFee: 9800,
  },
  {
    week: 3,
    rewardsmultiplier: 2780,
    exitFee: 3908,
  },
  {
    week: 4,
    rewardsmultiplier: 1890,
    exitFee: 4800,
  },
  {
    week: 5,
    rewardsmultiplier: 2390,
    exitFee: 3800,
  },
  {
    week: 6,
    rewardsmultiplier: 3490,
    exitFee: 4300,
  },
]

export const RewardsChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid stroke="#25282D" strokeDasharray="5 5 5 5" />
        <XAxis dataKey="week" axisLine={false} />
        <YAxis
          yAxisId="left"
          label={{
            value: 'Rewards Multiplier',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: 'white' },
            offset: -5,
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{
            value: 'Exit Fee (%)',
            angle: -90,
            position: 'insideRight',
            style: { textAnchor: 'middle', fill: 'white' },
            offset: -5,
          }}
        />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="linear" dataKey="rewardsmultiplier" stroke="#1BBC7A" dot={false} activeDot={false} />
        <Line yAxisId="right" type="linear" dataKey="exitFee" stroke="#EA3C55" dot={false} activeDot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default RewardsChart
