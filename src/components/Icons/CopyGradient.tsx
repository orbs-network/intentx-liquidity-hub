import React from 'react'

export default function CopyGradient({
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
        d="M16 3.8335H4V16.8335"
        stroke={color || 'url(#paint0_linear_8099_1662)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8 7.8335H20V19.8335C20 20.3639 19.7893 20.8726 19.4142 21.2477C19.0391 21.6228 18.5304 21.8335 18 21.8335H10C9.46957 21.8335 8.96086 21.6228 8.58579 21.2477C8.21071 20.8726 8 20.3639 8 19.8335V7.8335Z"
        stroke={color || 'url(#paint1_linear_8099_1662)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <defs>
        <linearGradient
          id="paint0_linear_8099_1662"
          x1="4"
          y1="11.9189"
          x2="19.3684"
          y2="11.9189"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_8099_1662"
          x1="8"
          y1="16.5408"
          x2="23.3684"
          y2="16.5408"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
      </defs>
    </svg>
  )
}
