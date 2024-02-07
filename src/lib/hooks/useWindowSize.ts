import { useLayoutEffect, useMemo, useState } from 'react'

import { MEDIA_WIDTHS } from 'theme'
import useEventListener from './useEventListener'

interface WindowSize {
  width: number
  height: number
}

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  useLayoutEffect(() => {
    const handleSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleSize()

    window.addEventListener('resize', handleSize)

    return () => {
      window.removeEventListener('resize', handleSize)
    }
  }, [])

  return windowSize
}

export function useIsMobile() {
  const { width } = useWindowSize()

  return useMemo(() => {
    if (width === 0) return false
    if (width <= MEDIA_WIDTHS.upToMedium) {
      return true
    }
  }, [width])
}

export function useIsLaptop() {
  const { width } = useWindowSize()

  return useMemo(() => {
    if (width === 0) return false

    if (width <= MEDIA_WIDTHS.upToExtraLarge && width > MEDIA_WIDTHS.upToMedium) {
      return true
    } else {
      return false
    }
  }, [width])
}
