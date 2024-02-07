import React from 'react'

export default function ChevronDown({
  width = 10,
  height = 7,
  color = '#5F6064',
  ...rest
}: {
  width: number
  height: number
  color?: string
  [x: string]: any
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 6 3" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d="M0.5 0.5L3 3L5.5 0.5L0.5 0.5Z" fill={color} fillOpacity="0.5" />
    </svg>
  )
}
