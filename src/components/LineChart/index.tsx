import React from 'react'
import { AreaChart, XAxis, YAxis, Area } from 'recharts'

const data = [
  { name: 'Jan', value: 40 },
  { name: 'Feb', value: 10 },
  { name: 'Mar', value: 30 },
  { name: 'Apr', value: 44 },
  { name: 'May', value: 15 },
]

const AreaChartComponent = () => {
  return (
    <AreaChart width={410} height={150} data={data}>
      <XAxis hide />
      <YAxis hide />

      <Area type="monotone" dataKey="value" stroke="#BD2738" fillOpacity={1} fill="rgba(234, 69, 85, 0.5)" />
    </AreaChart>
  )
}

export default AreaChartComponent
