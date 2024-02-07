import React from 'react'
import styled from 'styled-components'

import { Close as CloseIcon } from 'components/Icons'
import { RowCenter } from 'components/Row'
import { LearnMore } from './LearnMore'
import GiftGradient from 'components/Icons/GiftGradient'
import Image from 'next/image'

import BACKGROUND_CARD from '/public/static/images/CardBackground.png'
import BACKGROUND_DECORATOR1 from '/public/static/images/BackgroundDecorator1.png'
import BACKGROUND_DECORATOR2 from '/public/static/images/BackgroundDecorator2.png'

const Wrapper = styled(RowCenter)`
  position: relative;
  margin: 20px;
  display: flex;
  justify-content: center;
  width: 95vw;
  height: 81px;
  left: 1vw;
  border-radius: 8px;
  padding: 10px 0;
  gap: 24px;
  z-index: 20;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    display: none;
  `};
`

const Value = styled.div`
  font-weight: 400;
  font-size: 14px;
  display: contents;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 10px;
  `}
`

const Title = styled.div`
  font-weight: 400;
  font-size: 16px;
  color: white;
  text-align: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 10px;
  `}
`

const CloseIconWrapper = styled.button`
  position: absolute;
  right: 15vw;
  cursor: pointer;
  top: 1.5vh;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    right: 4px;
    top:unset;
  `}
`

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const ValueText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
`

const Background = styled.div`
  position: absolute;
  z-index: -2;
  left: 17vw;
`

const BackgroundDecorator = styled.div`
  position: absolute;
  z-index: 10;
  display: flex;
  gap: 25vw;
  top: 3px;
`

export function InfoHeader({ onClose }: { text: string; onClose: (status: boolean) => void; hasInfoIcon?: boolean }) {
  return (
    <Wrapper>
      <InfoText>
        <ValueText>
          <GiftGradient size={20} />
          <Title>Trading Rewards</Title>
        </ValueText>
        <ValueText>
          <Value>
            Earn $xINTX rewards as you trade.
            <LearnMore />
          </Value>
        </ValueText>
      </InfoText>
      <CloseIconWrapper onClick={() => onClose(false)}>
        <CloseIcon size={12} />
      </CloseIconWrapper>
      <Background>
        <BackgroundDecorator>
          <Image unoptimized={true} src={BACKGROUND_DECORATOR1} alt="BACKGROUND_DECORATOR1" />
          <Image unoptimized={true} src={BACKGROUND_DECORATOR2} alt="BACKGROUND_DECORATOR2" />
        </BackgroundDecorator>
        <Image unoptimized={true} src={BACKGROUND_CARD} alt="BACKGROUND_CARD" />
      </Background>
    </Wrapper>
  )
}
