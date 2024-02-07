import React from 'react'

export default function Withdraw({ size, isHover, ...rest }: { size?: number; isHover?: boolean; [x: string]: any }) {
  return (
    <svg width={size ?? 42} height={size ?? 42} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M36.75 15.75V8.75C36.75 7.82174 36.3813 6.9315 35.7249 6.27513C35.0685 5.61875 34.1783 5.25 33.25 5.25H8.75C7.82174 5.25 6.9315 5.61875 6.27513 6.27513C5.61875 6.9315 5.25 7.82174 5.25 8.75V15.75M29.75 28C26.3329 31.4171 21 36.75 21 36.75M21 36.75C17.5829 33.3329 15.6671 31.4171 12.25 28M21 36.75V15.75"
        stroke="url(#paint0_linear_4992_8880)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_4992_8880"
          x1="5.25"
          y1="17.1585"
          x2="45.5921"
          y2="17.1585"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
      </defs>
    </svg>
  )
}
