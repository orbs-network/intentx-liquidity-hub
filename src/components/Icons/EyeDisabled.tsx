import React from 'react'

export default function EyeDisabled({
  width,
  height,
  color = 'white',
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
      viewBox={`0 0 ${width || 16} ${height || 14}`}
      fill="none"
      {...rest}
    >
      <path
        d="M5.25 1.6017C5.81594 1.42229 6.40628 1.33177 7 1.33337C9.4395 1.33337 11.0997 2.7917 12.0896 4.07737C12.5854 4.72253 12.8333 5.04393 12.8333 6.00001C12.8333 6.95668 12.5854 7.27809 12.0896 7.92268C11.0997 9.20834 9.4395 10.6667 7 10.6667C4.5605 10.6667 2.90033 9.20834 1.91041 7.92268C1.41458 7.27868 1.16666 6.95609 1.16666 6.00001C1.16666 5.04334 1.41458 4.72195 1.91041 4.07737C2.21279 3.68227 2.54952 3.31471 2.91666 2.97895M1.16666 1.33334L12.25 10.0833M8.75 6.00001C8.75 6.46411 8.56561 6.90925 8.23742 7.23743C7.90924 7.56562 7.4641 7.75001 7 7.75001C6.5359 7.75001 6.09076 7.56562 5.76256 7.23743C5.43437 6.90925 5.25 6.46411 5.25 6.00001C5.25 5.53591 5.43437 5.09077 5.76256 4.76257C6.09076 4.43438 6.5359 4.25001 7 4.25001C7.4641 4.25001 7.90924 4.43438 8.23742 4.76257C8.56561 5.09077 8.75 5.53591 8.75 6.00001Z"
        stroke={color || '#414B5B'}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}