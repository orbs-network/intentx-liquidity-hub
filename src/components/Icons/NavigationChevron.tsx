import React from 'react'

export const NavigationChevron = ({ disabled, isPrev }: { disabled?: boolean; isPrev?: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="31"
      height="30"
      fill="none"
      viewBox="0 0 31 30"
      style={{ opacity: disabled ? '0.5' : '1', rotate: isPrev ? '180deg' : '0deg' }}
    >
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M14.46 10.845a.616.616 0 00-.89.85l3.082 3.225-3.081 3.225a.616.616 0 10.89.85l3.893-4.075-3.893-4.075z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}

export default NavigationChevron
