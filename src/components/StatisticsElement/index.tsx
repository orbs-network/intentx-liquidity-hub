import { Row, RowBetween } from 'components/Row'
import styled from 'styled-components'
import Image from 'next/image'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(35, 41, 51, 0.5);
  border-radius: 15px;
  padding: 32px 0;
  gap: 10px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  border-radius: 12px;
  padding: 24px 0;
  gap: 8px;
`}
`

const Label = styled.span<{ size?: string; weight?: string }>`
  font-weight: ${({ weight }) => (weight ? weight : '500')};
  font-size: ${({ size }) => (size ? size : '16px')};
  color: ${({ theme }) => theme.white};
  text-align: center;
`

const PercentageContainer = styled.div<{ isPositive?: boolean }>`
  padding: 4px 16px;
  border: 1px solid ${({ isPositive }) => (isPositive ? '#27F291' : '#FF0420')};
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  background-color: ${({ isPositive }) => (isPositive ? 'rgba(39, 242, 145, 0.2)' : 'rgba(255, 4, 32, 0.2)')};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 11px; 
  padding: 4px 12px;
  border-radius: 80px;
`}
`

export default function StatisticsElement({
  icon,
  value,
  percentageChange,
  title,
  isMobile,
}: {
  icon: any
  value: string
  percentageChange?: number | undefined
  title: string
  isMobile: boolean
}) {
  return (
    <Wrapper>
      <Image unoptimized={true} src={icon} alt="icon" width={60} />
      <Row width="fit-content" gap="6px">
        <Label size="32px" weight="300">
          {value}
        </Label>
        {percentageChange && (
          <PercentageContainer isPositive={percentageChange >= 0}>{`${
            percentageChange >= 0 ? '+' : ''
          } ${percentageChange}%`}</PercentageContainer>
        )}
      </Row>
      <Label size={isMobile ? '11px' : '12px'}>{title}</Label>
    </Wrapper>
  )
}
