import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`

const PercentageContainer = styled.div<{ isPositive?: boolean }>`
  color: ${({ isPositive }) => (isPositive ? '#27F291' : '#FF0420')};
  font-size: 12px;
  font-weight: 500;
`

const Label = styled.span<{ size?: string; weight?: string }>`
  font-weight: ${({ weight }) => (weight ? weight : '500')};
  font-size: ${({ size }) => (size ? size : '12px')};
  color: ${({ theme }) => theme.white};
  max-width: 210px;
  text-align: center;
`

export default function FeedElement({
  title,
  value,
  percentageChange,
}: {
  title: string
  value: string
  percentageChange: number
}) {
  const router = useRouter()

  return (
    <Wrapper
      onClick={() => {
        router.push(`/trade/${title}`)
      }}
    >
      <Label>{title}</Label>
      <PercentageContainer isPositive={percentageChange >= 0}>{`${
        percentageChange >= 0 ? '+' : ''
      } ${percentageChange}%`}</PercentageContainer>
      <Label>{value}</Label>
    </Wrapper>
  )
}
