import React from 'react'

export default function ClockIcon({ size = 11, ...rest }: { size?: number; [x: string]: any }) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.49984 1.22656C2.97259 1.22656 0.916504 3.28265 0.916504 5.8099C0.916504 8.33715 2.97259 10.3932 5.49984 10.3932C8.02709 10.3932 10.0832 8.33715 10.0832 5.8099C10.0832 3.28265 8.02709 1.22656 5.49984 1.22656ZM5.49984 9.47656C3.47813 9.47656 1.83317 7.8316 1.83317 5.8099C1.83317 3.78819 3.47813 2.14323 5.49984 2.14323C7.52155 2.14323 9.1665 3.78819 9.1665 5.8099C9.1665 7.8316 7.52155 9.47656 5.49984 9.47656Z"
        fill="url(#paint0_linear_6955_56928)"
      />
      <path d="M5.95817 3.51953H5.0415V6.26953H7.7915V5.35286H5.95817V3.51953Z" fill="url(#paint1_linear_6955_56928)" />
      <defs>
        <linearGradient
          id="paint0_linear_6955_56928"
          x1="0.916504"
          y1="6.92778"
          x2="12.6563"
          y2="6.92778"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_6955_56928"
          x1="5.0415"
          y1="5.2299"
          x2="8.56343"
          y2="5.2299"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
      </defs>
    </svg>
  )
}
