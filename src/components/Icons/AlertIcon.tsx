export const AlertIcon = ({
  width = 35,
  height = 35,
  fill = '#fff',
  ...props
}: {
  width?: number
  height?: number
  fill?: string
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 35 35" // Set the viewBox to match your default size
      preserveAspectRatio="xMidYMid meet" // Maintain aspect ratio and fit within the specified width and height
      {...props}
    >
      <path
        fill={fill} // Use the fill color provided as a prop
        d="m18.762 4.375 13.892 24.063a1.458 1.458 0 0 1-1.263 2.187H3.606a1.458 1.458 0 0 1-1.262-2.187L16.236 4.375a1.458 1.458 0 0 1 2.526 0ZM6.132 27.708h22.733L17.5 8.021 6.132 27.708Zm9.908-4.375h2.917v2.917H16.04v-2.917Zm0-10.208h2.917v7.292H16.04v-7.292Z"
      />
    </svg>
  )
}
