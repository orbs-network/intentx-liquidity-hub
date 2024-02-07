import React from 'react'

function ChevronOutline({ ...rest }: { [x: string]: any }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" {...rest}>
      <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 10l5 5 5-5"></path>
    </svg>
  )
}

export default ChevronOutline
