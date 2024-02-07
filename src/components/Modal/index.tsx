import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import StyledModal from 'styled-react-modal'
import { Z_INDEX } from 'theme'

import { PositionType } from 'types/trade'

import { Close as CloseIcon, IconWrapper, LongArrow, Redeem, ShortArrow, WalletGrad } from 'components/Icons'
import { ChevronDown } from 'components/Icons'
import { ThemedText } from 'components/Text'
import { RowBetween, RowStart } from 'components/Row'
import ArrowUpLeft from 'components/Icons/ArrowUpL'
import History from 'components/Icons/History'
import Cash from 'components/Icons/Cash'
import Withdraw from 'components/Icons/Withdraw'
import Transfer from 'components/Icons/Transfer'
import Stake from 'components/Icons/Stake'
import CoinHand from 'components/Icons/CoinHand'
import Merge from 'components/Icons/Merge'

const BaseModal = StyledModal.styled`
  display: flex;
  flex-flow: column nowrap;
  background: ${({ theme }: { theme: any }) => theme.bg0};
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 4px;
  z-index: ${Z_INDEX.modal};
  overflow: hidden;
`

export const MobileModal = styled(BaseModal)`
  width: 100vw;
  height: 100vh;
  border-radius: 0px;
`

export const Modal = styled(BaseModal)<{
  width?: string
  padding?: string
  radius?: string
}>`
  padding: ${({ padding }) => (padding ? padding : '10px')}
  background: ${({ theme }) => theme.bg0};
  width: ${({ width }: { width?: string }) => width ?? '450px'};
  border-radius: ${({ radius }) => radius && radius};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 350px;
  `};

  @keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 100;
  }

  animation: fadeIn 3s;
`

export const SplittedModal = styled(BaseModal)<{
  width?: string
  borderRadius?: string
}>`
  border-radius: ${({ borderRadius }) => borderRadius};
  background: transparent;
  overflow-y: auto;
  width: ${({ width }: { width?: string }) => width ?? '404px'};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    padding: 10px;
  `};
`

export const ModalBackground = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${Z_INDEX.modalBackdrop};
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
`

const HeaderWrapper = styled.div`
  color: ${({ theme }) => theme.text0};
  padding: 12px 12px 0 12px;
  padding-bottom: 0;
  background-color: ${({ theme }) => theme.bg0};
  margin-bottom: 20px;
  text-align: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 10px;
    padding-bottom: 0;
    font-size:12px;
  `};
`

const GoBack = styled.div`
  color: ${({ theme }) => theme.text2};
  font-size: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.gradCustom2};
    color: ${({ theme }) => theme.red2};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

export const WarnModal = styled.div<{
  height?: string
}>`
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: row;
  height: ${({ height }) => (height ? height : '45px')};
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: ${({ theme }) => theme.gradCustomCleared};
`
const HeaderContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3px;
  justify-content: space-between;
  align-items: center;
`

const TitleHeader = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 3px;
`

const HistoryButton = styled.div`
  display: flex;
  background: rgba(23, 26, 31, 1);
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;

  &:hover {
    background: ${({ theme }) => theme.gradCustom2};
  }
`

export const Title = styled.div<{
  size?: string
}>`
  color: ${({ theme }) => theme.white};
  font-size: ${({ size }) => (size ? size : '14px')};
  font-weight: 300;
`

export const Subtitle = styled.div<{
  size?: string
}>`
  color: ${({ theme }) => theme.textMuted};
  font-size: ${({ size }) => (size ? size : '12px')};
  font-weight: 300;
`

const ChevronLeft = styled(ChevronDown)<{
  open: boolean
}>`
  transform: rotate(90deg);
`

export const ModalHeader = ({
  title,
  positionType,
  onClose,
  onBack,
  hideClose,
}: {
  title?: string
  positionType?: PositionType
  onClose: () => void
  onBack?: () => void
  hideClose?: boolean
}) => {
  const theme = useTheme()
  return (
    <HeaderWrapper>
      {onBack && <ChevronLeft onClick={onBack} />}
      {title && (
        <ThemedText.MediumHeader>
          {title}
          {!positionType ? null : positionType === PositionType.LONG ? (
            <LongArrow width={15} height={12} color={theme.green1} style={{ marginLeft: '10px' }} />
          ) : (
            <ShortArrow width={15} height={12} color={theme.red1} style={{ marginLeft: '10px' }} />
          )}
        </ThemedText.MediumHeader>
      )}
    </HeaderWrapper>
  )
}

export const ModalHeader2 = ({
  title,
  subtitle,
  onBack,
  wallet,
  fiat,
  deposit,
  withdraw,
  transfer,
  stake,
  reedem,
  merge
}: {
  title: string
  wallet?: boolean
  fiat?: boolean
  deposit?: boolean
  withdraw?: boolean
  transfer?: boolean
  subtitle?: string
  stake?: boolean
  reedem?: boolean
  merge?: boolean
  onBack: () => void
}) => {
  const theme = useTheme()

  const [isHoveringBack, setIsHoveringBack] = useState(false)
  const [isHoveringHistory, setIsHoveringHistory] = useState(false)

  const handleMouseOver = (history: boolean) => {
    if (history) {
      setIsHoveringHistory(true)
    } else {
      setIsHoveringBack(true)
    }
  }
  const handleMouseOut = () => {
    setIsHoveringBack(false)
    setIsHoveringHistory(false)
  }
  return (
    <>
      <RowStart>
        <GoBack onClick={onBack} onMouseOver={() => handleMouseOver(false)} onMouseOut={handleMouseOut}>
          <ArrowUpLeft size={30} hover={isHoveringBack} /> Go Back
        </GoBack>
      </RowStart>
      <HeaderContent>
        <TitleHeader>
          {wallet && (
            <IconWrapper size={'52px'}>
              <WalletGrad isHover={false} />
            </IconWrapper>
          )}
          {fiat && (
            <IconWrapper size={'52px'}>
              <Cash isHover={false} />
            </IconWrapper>
          )}
          {withdraw && (
            <IconWrapper size={'52px'}>
              <Withdraw />
            </IconWrapper>
          )}
          {transfer && (
            <IconWrapper size={'52px'}>
              <Transfer />
            </IconWrapper>
          )}
          {stake && (
            <IconWrapper size={'52px'}>
              <Stake />
            </IconWrapper>
          )}
          {reedem && (
            <IconWrapper size={'52px'}>
              <CoinHand />
            </IconWrapper>
          )}
          {merge && (
            <IconWrapper size={'52px'}>
              <Merge />
            </IconWrapper>
          )}
          <div>
            <Title size="18px">{title}</Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
          </div>
        </TitleHeader>
        {/* <HistoryButton onMouseOver={() => handleMouseOver(true)} onMouseOut={handleMouseOut}>
          <History isHover={isHoveringHistory} />
        </HistoryButton> */}
      </HeaderContent>
    </>
  )
}
