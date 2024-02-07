export default function DepthChart({
  width,
  height,
  color = '#fff',
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
      viewBox="0 0 20 18"
      fill="none"
      {...rest}
    >
      <g clipPath="url(#clip0_9180_80016)">
        <path
          d="M0.666992 0V17.4H19.3337V0M0.666992 5.4H3.33366V6.6H6.00033V10.2H8.66699V13.8H10.0003V17.4V15H12.667V12.6H15.3337V9H16.667V6.6H19.3337"
          stroke={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_9180_80016">
          <rect width="20" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
