export default function Expand({ width, height, ...rest }: { width?: number; height?: number; [x: string]: any }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '1em'}
      height={height || '1em'}
      viewBox="0 0 15 15"
      {...rest}
    >
      <path
        d="M7.5 2.8125H12.1875V7.5H10.9375V4.94625L4.94625 10.9375H7.5V12.1875H2.8125V7.5H4.0625V10.0538L10.0538 4.0625H7.5V2.8125Z"
        fill="currentColor"
      />
    </svg>
  )
}
