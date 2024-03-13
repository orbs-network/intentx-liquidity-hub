import Image from 'next/image'
import styled from 'styled-components'
import RedirectArrow from 'components/Icons/RedirectArrow'
import { Row, RowBetween } from 'components/Row'
import {
  Token,
  useTokens,
  TokenList as LiquidityHubTokenList,
  useFormatNumber,
  TokenListItemProps,
} from '@orbs-network/liquidity-hub-ui-sdk'
import { Loader } from 'components/Icons'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  margin-top: 10px;
  height: 330px;
  overflow-y: auto;
`

const Label = styled.span<{ size?: string; weight?: string; reducedOpacity?: boolean }>`
  font-weight: ${({ weight }) => (weight ? weight : '400')};
  font-size: ${({ size }) => (size ? size : '14px')};
  color: ${({ theme }) => theme.white};
  opacity: ${({ reducedOpacity }) => (reducedOpacity ? '0.5' : '1')};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`

`}
`

const ElementContainer = styled.div<{ $disabled?: boolean }>`
  display: flex;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(56, 64, 79, 0.5);
  border-radius: 5px;
  transition: background 0.3s ease;
  gap: 9px;
  cursor: pointer;
  opacity: ${({ $disabled }) => ($disabled ? '0.5' : '1')};
  &:hover {
    background: #38404f;
  }
`

const ActionButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const ColumnContainer = styled.div<{ orientation?: string }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ orientation }) => (orientation === 'left' ? 'flex-start' : 'flex-end')};
`

const IconContainer = styled.div<{ isSwap?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 20;
`

const ListItem = ({ token, selected, balance: _balance }: TokenListItemProps) => {
  // const usd = useFormatNumber({ value: useUsdAmount(token.address, _balance) })

  const balance = useFormatNumber({ value: _balance })

  return (
    <ElementContainer $disabled={selected}>
      <IconContainer>
        <Image src={token.logoUrl || ''} alt="" width={30} height={30} style={{ borderRadius: '50%' }} />
      </IconContainer>
      <RowBetween>
        <ColumnContainer orientation="left">
          <Row>
            <Label reducedOpacity>{token.symbol}</Label>
          </Row>
          <Row>
            <Label reducedOpacity>{token.name} Coin</Label>
          </Row>
        </ColumnContainer>
        <Row gap="10px" width="fit-content">
          {!balance ? (
            <Loader />
          ) : (
            <ColumnContainer>
              <Label>{balance}</Label>
              {/* <Label reducedOpacity>${usd || '0'}</Label> */}
            </ColumnContainer>
          )}
          <ActionButton onClick={() => {}}>
            <RedirectArrow />
          </ActionButton>
        </Row>
      </RowBetween>
    </ElementContainer>
  )
}

export default function TokensList({
  searchValue,
  onTokenSelect,
}: {
  searchValue?: string
  onTokenSelect: (token: Token) => void
}) {
  const tokens = useTokens(searchValue)

  return (
    <Container>
      <Label size="12px">{tokens?.length ? 'Available Tokens' : 'Loading tokens...'}</Label>
      <Wrapper>
      <LiquidityHubTokenList itemSize={78} onTokenSelect={onTokenSelect} tokens={tokens} ListItem={ListItem} />
      </Wrapper>
    </Container>
  )
}

const Container = styled.div`
  flex: 1;
`
