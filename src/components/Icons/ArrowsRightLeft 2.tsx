import React from 'react'

const ArrowsRightLeft = ({
  width = 16,
  height = 16,
  color = '#EBEBEC',
  ...rest
}: {
  width?: number
  height?: number
  color?: string
  [x: string]: any
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={color}
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  )
}

export default ArrowsRightLeft
