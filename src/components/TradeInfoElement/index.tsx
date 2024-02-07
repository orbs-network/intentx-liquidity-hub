import { Row } from 'components/Row'
import styled from 'styled-components'
import Image from 'next/image'
import { FC } from 'react'

interface TradeInfoElementProps {
  title: string
  value: string
  icon: any
  percentageChange?: number
}

const Wrapper = styled.div`
  background-color: #232731;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  gap: 8px;
  text-align: center;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  border-radius: 10px;
  padding: 33px 0;
  gap: 6px;
`}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 28px 54px;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 28px 16px;
  `};
`

const Title = styled.span`
  font-weight: 500;
  font-size: 20px;
  line-height: 30px;
  color: ${({ theme }) => theme.white};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 14px;
  line-height: 21px; 
`}
`

const ValueLabel = styled.span`
  font-weight: 300;
  font-size: 35px;
  line-height: 52px;
  color: ${({ theme }) => theme.white};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 24px;
  line-height: 36px;
`}
`

const PercentageContainer = styled.div<{ isPositive?: boolean }>`
  padding: 4px 16px;
  border: 1px solid ${({ isPositive }) => (isPositive ? '#27F291' : '#FF0420')};
  border-radius: 100px;
  background-color: ${({ isPositive }) => (isPositive ? 'rgba(39, 242, 145, 0.2)' : 'rgba(255, 4, 32, 0.2)')};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 3px 11px; 
`}
`

export const TradeInfoElement: FC<TradeInfoElementProps> = ({ title, value, icon, percentageChange }) => {
  return (
    <Wrapper>
      <Row gap="5px" justify="center">
        <Image unoptimized={true} src={icon} alt="icon" />
        <Title>{title}</Title>
      </Row>
      <Row gap="8px" justify="center">
        <ValueLabel>{value}</ValueLabel>
        {percentageChange ? (
          <PercentageContainer isPositive={percentageChange >= 0}>{`${
            percentageChange >= 0 ? '+' : ''
          } ${percentageChange}%`}</PercentageContainer>
        ) : null}
      </Row>
    </Wrapper>
  )
}
