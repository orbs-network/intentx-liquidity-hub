
export default function Ratio({
  width = 15,
  height = 16,
  ...rest
}: {
  width?: number
  height?: number
  [x: string]: any
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M10 1.75H5C4.30964 1.75 3.75 2.30964 3.75 3V13C3.75 13.6904 4.30964 14.25 5 14.25H10C10.6904 14.25 11.25 13.6904 11.25 13V3C11.25 2.30964 10.6904 1.75 10 1.75Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 4.25H2.5C1.80964 4.25 1.25 4.80964 1.25 5.5V10.5C1.25 11.1904 1.80964 11.75 2.5 11.75H12.5C13.1904 11.75 13.75 11.1904 13.75 10.5V5.5C13.75 4.80964 13.1904 4.25 12.5 4.25Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
