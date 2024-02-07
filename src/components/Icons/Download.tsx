import React from 'react'

export default function Download({
  width,
  height,
  color = '',
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
      width={width || '1em'}
      height={height || '1em'}
      viewBox="0 0 24 25"
      fill="none"
      {...rest}
    >
      <path
        d="M21 15.8335V19.8335C21 20.3639 20.7893 20.8726 20.4142 21.2477C20.0391 21.6228 19.5304 21.8335 19 21.8335H5C4.46957 21.8335 3.96086 21.6228 3.58579 21.2477C3.21071 20.8726 3 20.3639 3 19.8335V15.8335M7 10.8335L12 15.8335M12 15.8335L17 10.8335M12 15.8335V3.8335"
        stroke={color || 'url(#paint0_linear_8099_1668)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <defs>
        <linearGradient
          id="paint0_linear_8099_1668"
          x1="3"
          y1="15.0286"
          x2="26.0526"
          y2="15.0286"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
      </defs>
    </svg>
  )
}
