import SpotTradeInput from 'components/App/SpotTrading/SpotTradeInput'
import Swap from 'components/Icons/Swap'
import { useIsLaptop, useIsMobile } from 'lib/hooks/useWindowSize'
import { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  gap: 24px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 16px;
`}
`

const SwapButton = styled.div<{ isHovering?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ isHovering }) => (isHovering ? '#171A1F' : '#232933')};
  width: 64px;
  height: 64px;
  border-radius: 100%;
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 45px;
  height: 45px;
`};
`

const SwapContainer = styled.div<{ isHovering?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ isHovering }) => (isHovering ? '#232933' : '#1C1F26')};
  transition: all 0.3s ease;
  width: 48px;
  height: 48px;
  border-radius: 100%;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 33px;
  height: 33px;
`};
`

export default function SpotTradeForm({
  onUpdateFromToken,
  onUpdateToToken,
  onClickSwap,
  tokenFrom,
  tokenTo,
}: {
  onUpdateFromToken(value: string): void
  onUpdateToToken(value: string): void
  onClickSwap(): void
  tokenFrom: any
  tokenTo: any
}) {
  const isMobile = useIsMobile()
  const isLaptop = useIsLaptop()
  const [isHoveringSwapButton, setIsHoveringSwapButton] = useState<boolean>(false)

  const updateFromTokenAmount = (value: string): void => {
    onUpdateFromToken?.(value)
  }

  const updateToTokenAmount = (value: string): void => {
    onUpdateToToken?.(value)
  }

  const handleSwapClick = () => {
    onClickSwap?.()
  }

  return (
    <Wrapper>
      <SpotTradeInput
        leftLabel="From"
        rightLabel="Exchange"
        tokenBalance={tokenFrom.balance}
        tokenName={tokenFrom.name}
        onUpdateValue={updateFromTokenAmount}
        value={tokenFrom.value}
        tokenValue="0.00"
      />
      <SwapButton
        onMouseEnter={() => setIsHoveringSwapButton(true)}
        onMouseLeave={() => setIsHoveringSwapButton(false)}
        isHovering={isHoveringSwapButton}
        onClick={handleSwapClick}
      >
        <SwapContainer isHovering={isHoveringSwapButton}>
          <Swap size={isLaptop || isMobile ? '16' : '24'} />
        </SwapContainer>
      </SwapButton>
      <SpotTradeInput
        leftLabel="To"
        rightLabel="Receive"
        tokenBalance={tokenTo.balance}
        tokenName={tokenTo.name}
        onUpdateValue={updateToTokenAmount}
        value={tokenTo.value}
        tokenValue="0.00"
      />
    </Wrapper>
  )
}
