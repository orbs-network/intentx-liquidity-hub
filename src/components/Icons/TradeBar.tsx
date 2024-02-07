export default function TradeBar({
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
      viewBox="0 0 20 20"
      fill="none"
      {...rest}
    >
      <path
        d="M0 18.75H18.75V20H0V18.75ZM0 13.75H3.75V17.5H0V13.75ZM5 11.25H8.75V17.5H5V11.25ZM10 6.25H13.75V17.5H10V6.25ZM15 0H18.75V17.5H15V0Z"
        fill={color || 'url(#paint0_linear_7522_40228)'}
      />
      <defs>
        <linearGradient
          id="paint0_linear_7522_40228"
          x1="-9.99102e-09"
          y1="12.439"
          x2="24.0132"
          y2="12.439"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
      </defs>
    </svg>
  )
}
