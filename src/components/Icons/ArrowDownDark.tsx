
export default function ArrowDownDark({ colored, ...rest }: { colored?: boolean; [x: string]: any }) {
  return !colored ? (
    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M8.6723 14.7071L16 7.00003L14.6554 5.58582L8.9508 11.5858L8.9508 8.31192e-08L7.04926 0L7.04926 11.5858L1.34459 5.58581L0 7.00003L7.3277 14.7071C7.699 15.0977 8.301 15.0977 8.6723 14.7071Z"
        fill="#EBEBEC"
      />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 2.66602V13.3327M8 13.3327L12 9.33268M8 13.3327L4 9.33268"
        stroke="url(#paint0_linear_9543_103719)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_9543_103719"
          x1="4"
          y1="9.30016"
          x2="14.2456"
          y2="9.30016"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
      </defs>
    </svg>
  )
}
