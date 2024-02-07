export default function Contract({ width, height, ...rest }: { width?: number; height?: number; [x: string]: any }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '1em'}
      height={height || '1em'}
      viewBox="0 0 13 13"
      {...rest}
    >
      <path
        d="M1.125 12.75L0.25 11.875L4.375 7.75H1.5V6.5H6.5V11.5H5.25V8.625L1.125 12.75ZM6.5 6.5V1.5H7.75V4.375L11.875 0.25L12.75 1.125L8.625 5.25H11.5V6.5H6.5Z"
        fill="currentColor"
      />
    </svg>
  )
}
