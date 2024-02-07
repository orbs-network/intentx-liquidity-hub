import React from 'react'

export default function ArrowUpLeft({ width, height, ...rest }: { width?: number; height?: number; [x: string]: any }) {
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
        d="M14 14L1 1M1 1V13.48M1 1H13.48"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
