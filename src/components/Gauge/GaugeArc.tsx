import React from 'react'
import { scaleLinear, lineRadial } from 'd3'

const baseRatio = 0.8

const length = 40

const GaugeArc = (props: any) => {
  const { inset = 0, min = 0, max = 1, maxAngle, minAngle, center = { x: 125, y: 135 } } = props

  const maxRatio = maxAngle / 180
  const arcMax = Math.PI * maxRatio

  const minRatio = minAngle / 180
  const arcMin = Math.PI * minRatio

  const refToRads = scaleLinear().domain([0, 1]).range([arcMin, arcMax])

  const arcScale = scaleLinear()
    .domain([0, length - 1])
    .range([refToRads(min), refToRads(max)])

  const arc = lineRadial()
    .angle((d, i) => arcScale(i))
    .radius((280 * baseRatio) / 2 - inset)

  const arcPath = arc({ length } as any)

  return (
    <path
      className="guage-arc"
      d={arcPath}
      transform={`translate(${center.x},${center.y})`}
      fill="transparent"
      style={{
        transition: 'all 0.25s 0.25s',
      }}
      {...props}
    />
  )
}

export default GaugeArc
