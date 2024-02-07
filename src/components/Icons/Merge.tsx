export default function Merge({
  width = 45,
  height = 48,
  ...rest
}: {
  width?: number
  height?: number
  [x: string]: any
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 45 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.6824 11.5372L5.07583 22.6152C4.34359 23.38 4.34359 24.62 5.07583 25.3848L17.0083 37.8475C17.7405 38.6123 18.9277 38.6123 19.6599 37.8475L30.2665 26.7695C30.9987 26.0047 30.9987 24.7648 30.2665 24L18.3341 11.5372C17.6018 10.7725 16.4147 10.7725 15.6824 11.5372Z"
        stroke="url(#paint0_linear_9543_103757)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26.9324 11.5372L16.3258 22.6152C15.5936 23.38 15.5936 24.62 16.3258 25.3848L26.9324 36.4628C27.6647 37.2275 28.8518 37.2275 29.5841 36.4628L40.1907 25.3848C40.9229 24.62 40.9229 23.38 40.1907 22.6152L29.5841 11.5372C28.8518 10.7725 27.6647 10.7725 26.9324 11.5372Z"
        stroke="url(#paint1_linear_9543_103757)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_9543_103757"
          x1="12.8206"
          y1="33.4737"
          x2="30.5384"
          y2="16.5099"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_9543_103757"
          x1="23.246"
          y1="32.6125"
          x2="40.9638"
          y2="15.6486"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
      </defs>
    </svg>
  )
}
