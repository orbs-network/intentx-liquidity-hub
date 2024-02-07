import React from 'react'
import Gradient from 'utils/gradient'

const useGradient = (startColour: any, stopColour: any, value: any, id: any) => {
  return {
    color: `url(#${id})`,
    node: (disabled: boolean) => (
      <Gradient start={startColour} end={stopColour} value={value} id={id} disabled={disabled} />
    ),
  }
}

export default useGradient
