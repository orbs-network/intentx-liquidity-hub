import { FC } from 'react'
import styled from 'styled-components'

interface Props {
  title: string
  number: string
}

const TitlePhaseContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
gap: 0.3rem;
`}

  @media (min-width: 768px) {
    margin-top: 3rem;
  }
`

const NumberPhase = styled.span`
  text-align: center;
  position: absolute;
  display: flex;
  align-items: center;
  background-clip: text;
  bottom: 20px;
  opacity: 0.3;
  font-size: 128px;
  font-weight: 300;
  background: linear-gradient(180deg, #ff0420 0%, rgba(255, 4, 32, 0) 77.6%);
  background-clip: te;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  bottom: 14px;
  font-size: 90px;
`}

  @media (min-width: 768px) {
    left: -5px;
  }
`

const TitleText = styled.h3`
  color: white;
  position: relative;
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: bold;
  white-space: nowrap;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 1.3rem;
  line-height: 1.5rem;
`}
`

const PhaseSpan = styled.span`
  position: relative;
  z-index: 10;
  text-transform: capitalize;
  white-space: nowrap;
  padding: 6px 25px;
  align-self: flex-start;
  display: inline-flex;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  align-items: center;
  border-radius: 999px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%),
    linear-gradient(180deg, #ff0420 0%, #bd2738 100%);
  transition: all 300ms;
  duration: 300ms;

  &:hover {
    background: linear-gradient(180deg, #ff0420 0%, #bd2738 100%);
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 4px 18px;
`}

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`

const PhaseContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`

export const TitlePhase: FC<Props> = ({ number, title }) => {
  return (
    <TitlePhaseContainer>
      <NumberPhase>{number}</NumberPhase>
      <TitleText>{title}</TitleText>
      <PhaseContainer>
        <PhaseSpan>{`phase ${number}`}</PhaseSpan>
      </PhaseContainer>
    </TitlePhaseContainer>
  )
}
