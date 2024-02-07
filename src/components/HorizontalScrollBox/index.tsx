import React, { Children, cloneElement } from 'react'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

type HorizontalScrollBoxProps = {
  children: React.ReactNode
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
`

const HorizontalScrollBox = ({ children }: HorizontalScrollBoxProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const divRef = useRef<HTMLDivElement>(null)

  const onMouseDown = (e) => {
    if (divRef.current === null) return
    setIsDragging(true)
    setStartX(e.pageX - divRef.current.offsetLeft)
    setScrollLeft(divRef.current.scrollLeft)
  }

  const onMouseLeave = () => {
    setIsDragging(false)
  }

  const onMouseUp = () => {
    setIsDragging(false)
  }

  const onMouseMove = (e) => {
    if (divRef.current === null) return

    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - divRef.current.offsetLeft
    const walk = (x - startX) * 1.25 //scroll-fast
    divRef.current.scrollLeft = scrollLeft - walk
  }

  useEffect(() => {
    const onWheel = (e) => {
      const favElement = divRef.current
      if (!favElement) return

      const hasVerticalScrollbar = favElement.scrollHeight > favElement.clientHeight
      const hasHorizontalScrollbar = favElement.scrollWidth > favElement.clientWidth

      if (hasVerticalScrollbar || hasHorizontalScrollbar) {
        e.preventDefault()
        favElement.scrollLeft += e.deltaY
      }
    }

    const favElement = divRef.current

    favElement?.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      favElement?.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <>
      {Children.map(children, (child) =>
        cloneElement(child as any, {
          ref: divRef,
          onMouseDown,
          onMouseLeave,
          onMouseUp,
          onMouseMove,
        })
      )}
    </>
  )
}

export default HorizontalScrollBox
