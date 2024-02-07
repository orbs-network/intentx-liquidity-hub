import React from 'react'

export const CumulativeIcon = ({ color }: { color: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="8" fill="none" viewBox="0 0 16 8">
      <circle cx="7.844" cy="4" r="3.25" stroke={color}></circle>
      <path stroke={color} d="M0 4.5h5M10.98 4.5h5"></path>
    </svg>
  )
}

export default CumulativeIcon
