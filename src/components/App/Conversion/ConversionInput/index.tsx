import { ChainData, Token } from '@0xsquid/squid-types'
import TokenDropdown from 'components/App/Conversion/TokenDropdown'
import BalanceWallet from 'components/BalanceWallet'
import LineChartBaseline from 'components/Icons/LineChartBaseline'
import { SpotCustomBox } from 'components/InputBox'
import { Row } from 'components/Row'
import { useIsLaptop, useIsMobile } from 'lib/hooks/useWindowSize'
import styled from 'styled-components'
import ChainDropdown from '../ChainDropdown'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-radius: 10px;
  width: 100%;
  background: #1c1f26;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 14px 16px;
`};
`

const Label = styled.span<{ size?: string; weight?: string; reducedOpacity?: boolean }>`
  font-weight: ${({ weight }) => (weight ? weight : '400')};
  font-size: ${({ size }) => (size ? size : '13px')};
  color: #637188;
  opacity: ${({ reducedOpacity }) => (reducedOpacity ? '0.5' : '1')};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 9px;
`}
`

const ColumnContainer = styled.div<{ orientation?: string }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ orientation }) => (orientation === 'left' ? 'flex-start' : 'flex-end')};
  gap: 5px;
`

export default function ConversionInput({
  leftLabel,
  rightLabel,
  tokenBalance,
  onUpdateValue,
  value,
  tokenValue,
  selectedToken,
  selectedChain,
  onToggle,
}: {
  leftLabel: string
  rightLabel: string
  tokenBalance: string
  onUpdateValue(value: string): void
  value: string
  tokenValue: string
  onToggle: () => void
  selectedToken: Token | null
  selectedChain: ChainData | null
}) {
  const isMobile = useIsMobile()
  const isLaptop = useIsLaptop()
  const onValueChange = (value: string): void => {
    onUpdateValue?.(value)
  }

  return (
    <Wrapper>
      <ColumnContainer orientation="left">
        <Label>{leftLabel}</Label>
        <ChainDropdown selectedChain={selectedChain} />

        <Row gap="4px">
          <BalanceWallet />
          <Label>Balance: {tokenBalance}</Label>
        </Row>
      </ColumnContainer>

      <TokenDropdown onToggle={onToggle} selectedToken={selectedToken} />

      <ColumnContainer>
        <Label>{rightLabel}</Label>
        <SpotCustomBox value={value} onChange={onValueChange} placeholder="0.00" isLaptop={isLaptop || isMobile} />
        <Row gap="4px" width="fit-content">
          <LineChartBaseline />
          <Label>${tokenValue}</Label>
        </Row>
      </ColumnContainer>
    </Wrapper>
  )
}
