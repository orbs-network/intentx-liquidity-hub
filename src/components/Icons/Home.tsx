import React from 'react'

export default function Home({
  width = 22,
  height = 16,
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
      viewBox="0 0 20 21"
      fill="none"
      {...rest}
    >
      <path
        d="M4.99967 16.3333H7.49967V11.3333H12.4997V16.3333H14.9997V8.83333L9.99967 5.08333L4.99967 8.83333V16.3333ZM3.33301 18V8L9.99967 3L16.6663 8V18H10.833V13H9.16634V18H3.33301Z"
        fill={color || 'url(#paint0_linear_7522_36595)'}
      />
      <defs>
        <linearGradient
          id="paint0_linear_7522_36595"
          x1="3.33301"
          y1="12.3293"
          x2="20.409"
          y2="12.3293"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
      </defs>
    </svg>
  )
}
