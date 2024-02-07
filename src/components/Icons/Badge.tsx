import React from 'react'

export default function Badge({
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
      <g clipPath="url(#clip0_1_3)">
        <path
          d="M19 0.5H3C1.61929 0.5 0.5 1.61929 0.5 3V19C0.5 20.3807 1.61929 21.5 3 21.5H19C20.3807 21.5 21.5 20.3807 21.5 19V3C21.5 1.61929 20.3807 0.5 19 0.5Z"
          stroke="url(#paint0_linear_1_3)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 19H17C18.1046 19 19 18.1046 19 17V12H18.2V17C18.2 17.6627 17.6627 18.2 17 18.2H12V19ZM12 3.8H17C17.6627 3.8 18.2 4.33726 18.2 5V10H19V5C19 3.89543 18.1046 3 17 3H12V3.8ZM10 3V3.8H5C4.33726 3.8 3.8 4.33726 3.8 5V10H3V5C3 3.89543 3.89543 3 5 3H10ZM10 18.2V19H5C3.89543 19 3 18.1046 3 17V12H3.8V17C3.8 17.6627 4.33726 18.2 5 18.2H10Z"
          fill="url(#paint1_linear_1_3)"
        />
        <path d="M11 8V14M8 11H14" stroke="url(#paint2_linear_1_3)" strokeLinecap="round" />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1_3"
          x1="2.49908e-09"
          y1="13.6829"
          x2="28.1754"
          y2="13.6829"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_3"
          x1="3"
          y1="12.9512"
          x2="23.4912"
          y2="12.9512"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
        <linearGradient id="paint2_linear_1_3" x1="8" y1="11.5" x2="14" y2="11.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
        <clipPath id="clip0_1_3">
          <rect width="22" height="22" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
