import React from 'react'

export const PaginationArrow = ({ disabled, isNext }: { disabled: boolean; isNext?: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="16"
      fill="none"
      viewBox="0 0 18 16"
      style={{ opacity: disabled ? 0.5 : 1, rotate: isNext ? '180deg' : '0deg' }}
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.875 15.125l-6.75-6.75m0 0l6.75-6.75m-6.75 6.75h15.75"
      ></path>
    </svg>
  )
}

export default PaginationArrow
