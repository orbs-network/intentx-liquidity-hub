export default function LinkIconGradient({
  width = 10,
  height = 11,
  ...rest
}: {
  width?: number
  height?: number
  [x: string]: any
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 10 11" fill="none" {...rest}>
      <path
        d="M1.0625 10.375C0.845833 10.375 0.65625 10.2937 0.49375 10.1313C0.33125 9.96875 0.25 9.77917 0.25 9.5625V1.4375C0.25 1.22083 0.33125 1.03125 0.49375 0.86875C0.65625 0.70625 0.845833 0.625 1.0625 0.625H4.84062V1.4375H1.0625V9.5625H9.1875V5.78438H10V9.5625C10 9.77917 9.91875 9.96875 9.75625 10.1313C9.59375 10.2937 9.40417 10.375 9.1875 10.375H1.0625ZM3.79792 7.40938L3.22917 6.82708L8.61875 1.4375H5.65313V0.625H10V4.97188H9.1875V2.01979L3.79792 7.40938Z"
        fill="url(#paint0_linear_3395_42273)"
      />

      <defs>
        <linearGradient
          id="paint0_linear_3395_42273"
          x1="5.125"
          y1="0.625"
          x2="5.125"
          y2="10.375"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF0420" />
          <stop offset="1" stopColor="#BD2738" />
        </linearGradient>
      </defs>
    </svg>
  )
}
