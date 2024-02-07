import React from 'react'

export const SortArrow = ({ desc }: { desc?: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="11"
      fill="none"
      viewBox="0 0 10 11"
      style={desc ? { rotate: '180deg' } : {}}
    >
      <path
        fill="#fff"
        d="M4.557 10.167V2.496L.941 6.113.328 5.5 4.995.833 9.66 5.5l-.612.613-3.617-3.617v7.67h-.875z"
      ></path>
    </svg>
  )
}

export default SortArrow
