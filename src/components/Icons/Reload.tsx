import React from 'react'

export default function Reload({ hovered, size = '24' }: { hovered?: boolean; size: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path
        fill={hovered ? 'url(#paint0_linear_12224_113494)' : 'white'}
        fillRule="evenodd"
        d="M12 2a1 1 0 100 2 8 8 0 11-6.924 3.99l1.217 1.217A1 1 0 008 8.5v-4a1 1 0 00-1-1H3a1 1 0 00-.707 1.707l1.33 1.33A9.955 9.955 0 002 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2z"
        clipRule="evenodd"
      ></path>
      <defs>
        <linearGradient id="paint0_linear_12224_113494" x1="12" x2="12" y1="2" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF0420"></stop>
          <stop offset="1" stopColor="#BD2738"></stop>
        </linearGradient>
      </defs>
    </svg>
  )
}
