import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  margin-bottom: 5px;
  align-items: center;
`

const Box = styled.div`
  background-color: ${({ theme }) => theme.bgCustom2};
  width: 35px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  border: double 1px transparent;
  border-radius: 5px;
  background-image: ${({ theme }) => theme.gradCustomBg2}, ${({ theme }) => theme.gradCustom4};
  background-origin: border-box;
  background-clip: padding-box, border-box;
`

export default function ClockBanner({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }) {
  return (
    <Wrapper>
      <Box>{hours}h</Box>:<Box>{minutes}m</Box>:<Box>{seconds}s</Box>
    </Wrapper>
  )
}
