import React from 'react'
import { line, scaleLinear } from 'd3'

const Pointer = (props: any) => {
  const {
    width = 6.4,
    head = (0.8 * 43) / 8, // Adjusted to make it vertically shorter
    tail = 0,
    value = -5,
    center = { x: 125, y: 135 },
    minAngle,
    maxAngle,
    disabled,
    pointerFill = '#fff',
  } = props

  const pointerLine = line()([
    [width / 3, 0],
    [0, -18],
    [-(width / 2), 0],
    [width / 2, 0],
    [0, -18],
    [width / 3, 0],
  ])

  const valueScale = scaleLinear().domain([0, 1]).range([minAngle, maxAngle])
  const pointerValue = valueScale(value)

  return (
    <path
      className="gauge-pointer"
      d={pointerLine ?? ''}
      transform={`translate(${center.x}, ${center.y}) rotate(${pointerValue})`}
      fill={pointerFill}
      opacity={disabled ? 0.3 : undefined}
      style={{
        transition: 'all 0.25s 0.25s',
      }}
    />
  )
}

export default Pointer
