import { useFromTokenPanel, useSwapTokens, useToTokenPanel } from '@orbs-network/liquidity-hub-ui-sdk'
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

const FromToken = () => {
  const { token, onChange, onTokenSelect, amount, balance } = useFromTokenPanel()
  return (
    <SpotTradeInput
      leftLabel="From"
      rightLabel="Exchange"
      token={token}
      onUpdateValue={onChange}
      value={amount}
      isSrc
      onTokenSelect={onTokenSelect}
      balance={balance}
    />
  )
}

const ToToken = () => {
  const { token, onTokenSelect, amount, balance } = useToTokenPanel()
  return (
    <SpotTradeInput
      onTokenSelect={onTokenSelect}
      token={token}
      leftLabel="To"
      rightLabel="Receive"
      value={amount}
      balance={balance}
    />
  )
}

const SwapTokens = () => {
  const swapTokens = useSwapTokens()
  const [isHoveringSwapButton, setIsHoveringSwapButton] = useState<boolean>(false)
  const isMobile = useIsMobile()
  const isLaptop = useIsLaptop()
  return (
    <SwapButton
      onMouseEnter={() => setIsHoveringSwapButton(true)}
      onMouseLeave={() => setIsHoveringSwapButton(false)}
      isHovering={isHoveringSwapButton}
      onClick={swapTokens}
    >
      <SwapContainer isHovering={isHoveringSwapButton}>
        <Swap size={isLaptop || isMobile ? '16' : '24'} />
      </SwapContainer>
    </SwapButton>
  )
}
export default function SpotTradeForm() {
  return (
    <Wrapper>
      <FromToken />
      <SwapTokens />
      <ToToken />
    </Wrapper>
  )
}
