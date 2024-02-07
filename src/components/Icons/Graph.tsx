export default function Graph({
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
      viewBox="0 0 20 21"
      fill="none"
      {...rest}
    >
      <path
        d="M13.3337 10.3167L16.867 4.20833L18.3087 5.04167L13.9503 12.5833L8.52532 9.45833L4.55033 16.3333H18.3337V18H1.66699V3H3.33366V15.1167L7.91699 7.16667L13.3337 10.3167Z"
        fill={color || 'url(#paint0_linear_7522_40228)'}
      />
      <defs>
        <linearGradient
          id="paint0_linear_7522_36195"
          x1="1.66699"
          y1="12.3293"
          x2="23.012"
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
