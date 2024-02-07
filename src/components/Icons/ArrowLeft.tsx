import React from 'react'

export default function ArrowLeft({ width, height, ...rest }: { width?: number; height?: number; [x: string]: any }) {
  return (
    <svg
      rotate={90}
      width={width || '1em'}
      height={height || '1em'}
      viewBox={`0 0 ${width || 15} ${height || 13}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M7.94531 1.15625L13.2891 6.5L7.94531 11.8438M12.5469 6.5L1.71094 6.5"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
    </svg>
  )
}
