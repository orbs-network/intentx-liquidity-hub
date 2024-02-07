import React from 'react'

export default function GiftGradient({ size = 12 }: { size?: number; [x: string]: any }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_1951_1879)">
        <path
          d="M17.8572 4.78589H2.14293C1.35395 4.78589 0.714355 5.42548 0.714355 6.21446V10.5002C0.714355 11.2892 1.35395 11.9287 2.14293 11.9287H17.8572C18.6462 11.9287 19.2858 11.2892 19.2858 10.5002V6.21446C19.2858 5.42548 18.6462 4.78589 17.8572 4.78589Z"
          stroke="url(#paint0_linear_1951_1879)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.8574 11.9286V18.3572C17.8574 18.7361 17.7068 19.0995 17.4389 19.3674C17.171 19.6353 16.8077 19.7858 16.4288 19.7858H3.57164C3.19276 19.7858 2.82939 19.6353 2.56149 19.3674C2.29358
          19.0995 2.14307 18.7361 2.14307 18.3572V11.9286M10.0002 4.78578V19.7858M10.0002 4.78578L14.2859 1.21436M10.0002 4.78578L5.7145 1.21436"
          stroke="url(#paint1_linear_1951_1879)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1951_1879"
          x1="0.714355"
          y1="9.2284"
          x2="24.4988"
          y2="9.2284"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1951_1879"
          x1="2.14307"
          y1="12.7649"
          x2="22.2684"
          y2="12.7649"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
        <clipPath id="clip0_1951_1879">
          <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </svg>
  )
}
