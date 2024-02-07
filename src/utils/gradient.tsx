import React from 'react'

const Gradient = ({ start, end, id, disabled, value }: any) => {
  return (
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={disabled ? 'rgba(0,0,0,0)' : start} />
        <stop offset={`${value - 10}%`} stopColor={disabled ? 'rgba(0,0,0,0)' : start} />
        <stop offset={`${value + 20}%`} stopColor={disabled ? 'rgba(0,0,0)' : end} />
        <stop offset="100%" stopColor={disabled ? 'rgba(0,0,0)' : end} />
      </linearGradient>
    </defs>
  )
}

export default Gradient
