import React from 'react'

export default function Bow({
  width = 22,
  height = 22,
  ...rest
}: {
  width?: number
  height?: number
  [x: string]: any
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      {...rest}
    >
      <path d="M8.99978 2C7.16645 4.66667 4.59978 11.6 8.99978 18" stroke="#4F1C21" strokeWidth="0.6" />
      <path d="M9 0V2" stroke="#BD2738" />
      <path d="M9 18V20" stroke="#BD2738" />
      <path d="M9 18C12 16.8571 14 14.4183 14 10C14 5.58172 12 3.14286 9 2" stroke="#BD2738" />
      <path d="M18 10H2" stroke="#BD2738" strokeWidth="0.6" />
      <path d="M2 8L4 10L2 12" stroke="#BD2738" strokeWidth="0.5" />
      <path d="M19 10L16 8L17.5 10L16 12L19 10Z" fill="#AEE3FA" stroke="#BD2738" />
    </svg>
  )
}
