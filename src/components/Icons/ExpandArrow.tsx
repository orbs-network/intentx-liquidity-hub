import React from 'react'

export default function ExpandArrow({
  disabled,
  isExpanded,
  width = 16,
  height = 16,
}: {
  disabled?: boolean
  isExpanded?: boolean
  width?: string | number | undefined
  height?: string | number | undefined
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      style={{ opacity: disabled ? '0.5' : '1', rotate: isExpanded ? '180deg' : '0deg' }}
    >
      <path
        d="M7.99952 7.21883L11.2995 10.5188L12.2422 9.57616L7.99952 5.3335L3.75685 9.57616L4.69952 10.5188L7.99952 7.21883Z"
        fill="white"
      />
    </svg>
  )
}
