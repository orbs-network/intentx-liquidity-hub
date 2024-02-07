import Image from 'next/image'
import styled from 'styled-components'

import { Token } from '@0xsquid/squid-types'
import RedirectArrow from 'components/Icons/RedirectArrow'
import { Row, RowBetween } from 'components/Row'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  margin-top: 10px;
  max-height: 330px;
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

const ElementContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(56, 64, 79, 0.5);
  border-radius: 5px;
  transition: background 0.3s ease;
  gap: 9px;
  cursor: pointer;

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

function TokenListElement({ token }: { token: Token }) {
  const getTokenColumn = () => {
    return (
      <ColumnContainer orientation="left">
        <Row>
          <Label reducedOpacity>{token.symbol}</Label>
        </Row>
        <Row>
          <Label reducedOpacity>{token.name} Coin</Label>
        </Row>
      </ColumnContainer>
    )
  }

  if (!token) return

  return (
    <ElementContainer>
      <IconContainer>{token.logoURI && <Image src={token.logoURI} alt="" width={30} height={30} />}</IconContainer>
      <RowBetween>
        {getTokenColumn()}
        <Row gap="10px" width="fit-content">
          <ColumnContainer>
            <Label>{token.symbol}</Label>
            <Label reducedOpacity>${token.name}</Label>
          </ColumnContainer>
          <ActionButton onClick={() => {}}>
            <RedirectArrow />
          </ActionButton>
        </Row>
      </RowBetween>
    </ElementContainer>
  )
}

export default function TokensList({ data, onSelectToken }: { data: Token[]; onSelectToken(token: Token): void }) {
  const handleSelectToken = (element: any) => (): void => {
    onSelectToken?.(element)
  }

  return (
    <div>
      <Label size="12px">Available Tokens</Label>
      <Wrapper>
        {data.map((element, index) => (
          <div key={index} onClick={handleSelectToken(element)}>
            <TokenListElement token={element} />
          </div>
        ))}
      </Wrapper>
    </div>
  )
}
