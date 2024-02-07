import React from 'react'

export default function ArrowUpRight({
  width,
  height,
  ...rest
}: {
  width?: number
  height?: number
  [x: string]: any
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '1em'}
      height={height || '1em'}
      viewBox={`0 0 ${width || 12} ${height || 12}`}
      fill="none"
      {...rest}
    >
      <path
        d="M1.25 8.875L9.375 0.75M9.375 0.75V8.55M9.375 0.75H1.575"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
