import React from 'react'

export default function AnalyticsMobile({
  width = 28,
  height = 28,
  color,
}: {
  width?: number
  height?: number
  size?: number
  color?: string
  [x: string]: any
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.6668 13.7433L23.6135 5.19167L25.6318 6.35833L19.5302 16.9167L11.9352 12.5417L6.37016 22.1667H25.6668V24.5H2.3335V3.5H4.66683V20.4633L11.0835 9.33333L18.6668 13.7433Z"
        fill={color || 'url(#paint0_linear_7522_40228)'}
      />
      <defs>
        <linearGradient
          id="paint0_linear_7522_40228"
          x1="2.15625"
          y1="12.5451"
          x2="22.237"
          y2="12.5451"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
      </defs>
    </svg>
  )
}
