import React from 'react'

export default function SupportIcon({
  width = 10,
  height = 11,
  ...rest
}: {
  width?: number
  height?: number
  [x: string]: any
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M5 0.5C2.243 0.5 0 2.743 0 5.5V7.5715C0 8.0835 0.4485 8.5 1 8.5H1.5C1.63261 8.5 1.75979 8.44732 1.85355 8.35355C1.94732 8.25979 2 8.13261 2 8V5.4285C2 5.29589 1.94732 5.16872 1.85355 5.07495C1.75979
        4.98118 1.63261 4.9285 1.5 4.9285H1.046C1.324 2.9935 2.989 1.5 5 1.5C7.011 1.5 8.676 2.9935 8.954 4.9285H8.5C8.36739 4.9285 8.24022 4.98118 8.14645 5.07495C8.05268 5.16872 8 5.29589 8 5.4285V8.5C8 9.0515
        7.5515 9.5 7 9.5H6V9H4V10.5H7C8.103 10.5 9 9.603 9 8.5C9.5515 8.5 10 8.0835 10 7.5715V5.5C10 2.743 7.757 0.5 5 0.5Z"
        fill="#515E70"
      />
    </svg>
  )
}