import React from 'react'

export default function AddUser({
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
      <g clipPath="url(#clip0_10_2)">
        <path
          d="M10.9167 14.3333V8.51342M13.8333 11.4167H8.01342M5.08333 7.33333C5.85688 7.33333 6.59875 7.02604 7.14573 6.47906C7.69271 5.93208 8 5.19021 8 4.41667C8 3.64312 7.69271 2.90125 7.14573 2.35427C6.59875 1.80729 5.85688 1.5 5.08333 1.5C4.30979 1.5 3.56792 1.80729 3.02094 2.35427C2.47396 2.90125 2.16667 3.64312 2.16667 4.41667C2.16667 5.19021 2.47396 5.93208 3.02094 6.47906C3.56792 7.02604 4.30979 7.33333 5.08333 7.33333ZM5.08333 7.33333C6.25758 7.33333 7.28367 7.77667 8.01342 8.51342M5.08333 7.33333C2.75 7.33333 1 9.08333 1 11.4167V14.3333H6.83333"
          stroke="white"
          strokeWidth="1.5"
        />
      </g>
      <defs>
        <clipPath id="clip0_10_2">
          <rect width="14" height="15" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
