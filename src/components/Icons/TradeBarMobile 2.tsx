export default function TradeBarMobile({
  width = 63,
  height = 63,
  color = '',
  ...rest
}: {
  width?: number
  height?: number
  color?: string
  [x: string]: any
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <g filter="url(#filter0_d_9390_98269)">
        <circle cx="31.5" cy="21.5" r="21.5" fill="url(#paint0_linear_9390_98269)" />
      </g>
      <path
        d="M23.5 31C24.875 31 26 29.9312 26 28.625V20.3125C26 19.0062 24.875 17.9375 23.5 17.9375C22.125 17.9375 21 19.0062 21 20.3125V28.625C21 29.9312 22.125 31 23.5 31ZM36 25.0625V28.625C36 29.9312 37.125 31 38.5 31C39.875 31 41 29.9312 41 28.625V25.0625C41 23.7563 39.875 22.6875 38.5 22.6875C37.125 22.6875 36 23.7563 36 25.0625ZM31 31C32.375 31 33.5 29.9312 33.5 28.625V14.375C33.5 13.0688 32.375 12 31 12C29.625 12 28.5 13.0688 28.5 14.375V28.625C28.5 29.9312 29.625 31 31 31Z"
        fill="white"
      />
      <defs>
        <filter
          id="filter0_d_9390_98269"
          x="0"
          y="0"
          width="63"
          height="63"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="10" />
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.741176 0 0 0 0 0.152941 0 0 0 0 0.219608 0 0 0 0.3 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_9390_98269" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_9390_98269" result="shape" />
        </filter>
        <linearGradient
          id="paint0_linear_9390_98269"
          x1="10"
          y1="26.7439"
          x2="65.0702"
          y2="26.7439"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
      </defs>
    </svg>
  )
}
