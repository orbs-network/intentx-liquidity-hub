import React from 'react'

export default function Menu({
  width = 30,
  height = 30,
  color = 'rgba(255, 255, 255, 1)',
  ...rest
}: {
  width?: number
  height?: number
  color?: string
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
      <path
        fill="#fff"
        d="M22.02 14.079H7.19a.875.875 0 00-.874.875v.092c0 .483.392.875.875.875H22.02a.875.875 0 00.875-.875v-.092a.875.875 0 00-.875-.875zM22.02 18.684H7.19a.875.875 0 00-.874.875v.092c0 .484.392.875.875.875H22.02a.875.875 0 00.875-.875v-.092a.875.875 0 00-.875-.875zM22.02 9.474H7.19a.875.875 0 00-.874.875v.092c0 .483.392.875.875.875H22.02a.875.875 0 00.875-.875v-.092a.875.875 0 00-.875-.875z"
      ></path>
    </svg>
  )
}
