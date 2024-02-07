import React, { useState } from 'react'
import styled from 'styled-components'

import ArrowLeft from 'components/Icons/ArrowLeft'

const Wrapper = styled.div`
  cursor: pointer;
  transition: background-color 0.3s linear;

  &:hover {
    background: ${({ theme }) => theme.gradCustom2};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

const Text = styled.div`
  font-weight: 300;
  font-size: 14px;
  color: white;
`

export function LearnMore() {
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseOver = () => {
    setIsHovering(true)
  }
  const handleMouseOut = () => {
    setIsHovering(false)
  }

  return (
    <Wrapper onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <Text>
        Learn More <ArrowLeft isHover={isHovering} />
      </Text>
    </Wrapper>
  )
}
