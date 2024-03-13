import {
  Token,
  useFormatNumber,
  useSetMaxBalance,
  useUsdAmount,
  useBalancesLoading,
} from '@orbs-network/liquidity-hub-ui-sdk'
import TokenDropdown from 'components/App/SpotTrading/TokenDropdown'
import BalanceWallet from 'components/BalanceWallet'
import { Loader } from 'components/Icons'
import LineChartBaseline from 'components/Icons/LineChartBaseline'
import { SpotCustomBox } from 'components/InputBox'
import TokenSelectionModal from 'components/Modals/SpotTrading/TokenSelectionModal'
import { Row } from 'components/Row'
import { useIsLaptop } from 'lib/hooks/useWindowSize'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

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

const Balance = ({ balance, onClick }: { balance?: string; onClick?: () => void }) => {
  const _balance = useFormatNumber({ value: balance })

  const isLoading = useBalancesLoading()

  return (
    <StyledBalance gap="4px">
      <BalanceWallet />
      {isLoading ? (
        <>
          <Label onClick={onClick}>Balance: </Label>
          <Loader size="15px" />
        </>
      ) : (
        <Label onClick={onClick}>Balance: {_balance || '-'}</Label>
      )}
    </StyledBalance>
  )
}

const StyledBalance = styled(Row)`
  cursor: pointer;
`

export default function SpotTradeInput({
  leftLabel,
  rightLabel,
  onUpdateValue,
  value,
  isSrc,
  token,
  onTokenSelect,
  balance,
}: {
  leftLabel: string
  rightLabel: string
  onUpdateValue?: (value: string) => void
  value?: string
  isSrc?: boolean
  token?: Token
  onTokenSelect: (token: Token) => void
  balance?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const isLaptop = useIsLaptop()
  const setMaxBalance = useSetMaxBalance()
  const usd = useFormatNumber({ value: useUsdAmount(token?.address, value || '0').usd })

  const _onTokenSelect = useCallback(
    (token: Token) => {
      onTokenSelect(token)
      setIsOpen(false)
    },
    [onTokenSelect, setIsOpen]
  )

  return (
    <Wrapper>
      <ColumnContainer orientation="left">
        <Label>{leftLabel}</Label>
        <TokenDropdown token={token} onClick={() => setIsOpen(true)} />
        <Balance balance={balance} onClick={isSrc ? setMaxBalance : undefined} />
      </ColumnContainer>

      <ColumnContainer>
        <Label>{rightLabel}</Label>
        <SpotCustomBox
          disabled={!isSrc}
          value={value || ''}
          onChange={(value: string) => onUpdateValue?.(value)}
          placeholder="0.00"
          isLaptop={isLaptop}
        />
        <Row gap="4px" width="fit-content">
          <LineChartBaseline />
          <Label>${usd || '0'}</Label>
        </Row>
      </ColumnContainer>
      <TokenSelectionModal isOpen={isOpen} closeModal={() => setIsOpen(false)} onTokenSelect={_onTokenSelect} />
    </Wrapper>
  )
}
