import React from 'react'

const SVGBase = ({ children, ...props }: any) => {
  return <svg {...props}>{children}</svg>
}

export default SVGBase
