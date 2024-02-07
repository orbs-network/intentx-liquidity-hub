import React from 'react'

export default function Bullet({
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
      <g clipPath="url(#clip0_250_7128)">
        <g clipPath="url(#clip1_250_7128)">
          <path d="M17.5863 13.1035L17.5863 6.89663L7.24145 6.89663L7.24146 13.1035L17.5863 13.1035Z" fill="#BD2738" />
          <path d="M18.6207 12.7588L18.6207 7.24156L17.5862 7.24156L17.5862 12.7588L18.6207 12.7588Z" fill="#742B33" />
          <path d="M19.9999 13.1035L19.9999 6.89663L18.6206 6.89663L18.6206 13.1035L19.9999 13.1035Z" fill="#BD2738" />
          <path
            d="M7.24137 7.24152L7.24137 12.7588L5.51722 12.7588C3.34653 12.7588 1.30239 11.7367 -1.20584e-07 10.0002C1.30243 8.26361 3.34657 7.24153 5.51722 7.24152L7.24137 7.24152Z"
            fill="#742B33"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_250_7128">
          <rect width="20" height="20" fill="white" />
        </clipPath>
        <clipPath id="clip1_250_7128">
          <rect width="20" height="20" fill="white" transform="translate(0 20) rotate(-90)" />
        </clipPath>
      </defs>
    </svg>
  )
}
