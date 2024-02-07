import styled from 'styled-components'
import Image from 'next/image'

interface StatsElementProps {
  icon: any
  title: string
  value: string
  infoRow?: any
  isMobile?: boolean
}

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 270px;
  background: ${({ theme }) => theme.bgCustom1};
  border-radius: 5px;
  gap: 5px;
  padding: 15px 0;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 230px;
  gap: 4px;
  padding: 10px 0;
  `};
`
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  width: 36px;
  background-color: #2e2129;
  border-radius: 10px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  height: 24px;
  width: 25px; 
  border-radius: 8px;
  `};
`

const Title = styled.span`
  font-weight: 400;
  font-size: 16px;
  color: ${({ theme }) => theme.white};
  opacity: 0.7;
  margin-top: 5px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 11px;
  margin-top: 4px;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 12px;
`};
`
const Value = styled.span`
  font-weight: 300;
  font-size: 20px;
  color: ${({ theme }) => theme.white};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 14px;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 14px;
`};
`

export const StatsElement: React.FC<StatsElementProps> = ({ icon, title, value, infoRow }: any) => {
  return (
    <ContentContainer>
      <IconContainer>
        <Image unoptimized={true} src={icon} alt="icon" />
      </IconContainer>
      <Title>{title}</Title>
      <Value>{value}</Value>
      {infoRow ? infoRow : null}
    </ContentContainer>
  )
}
