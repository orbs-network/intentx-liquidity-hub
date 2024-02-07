import React from 'react'

export default function ShortArrow({
  width,
  height,
  color,
  ...rest
}: {
  width: number
  height: number
  color: string
  [x: string]: any
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M15.6001 12C15.821 12 16.0001 11.8209 16.0001 11.6V6.89745C16.0001 6.53986 15.5667 6.36195 15.3154 6.61641L14.0186 7.92983C13.862 8.08845 13.606 8.08845 13.4494 7.92983L7.24663 1.64752C7.09002 1.4889 6.83396 1.4889 6.67735 1.64752L5.17063 3.17358C5.01401 3.3322 4.75796 3.3322 4.60135 3.17358L1.75259 0.288277C1.59598 0.129656 1.33993 0.129657 1.18331 0.288278L0.27747 1.20574C0.123656 1.36153 0.123656 1.61202 0.27747 1.76781L4.60135 6.14717C4.75796 6.30579 5.01401 6.30579 5.17063 6.14717L6.67735 4.62111C6.83397 4.46249 7.09002 4.46249 7.24663 4.62111L11.9886 9.42388C12.1424 9.57967 12.1424 9.83016 11.9886 9.98595L10.6725 11.3189C10.423 11.5716 10.602 12 10.9571 12H15.6001Z"
        fill={color}
      />
    </svg>
  )
}
