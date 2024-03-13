import Image from 'next/image'
import styled from 'styled-components'
import { ArrowUpLeft } from 'components/Icons'
import { Modal } from 'components/Modal'
import { useState } from 'react'
import { ColumnContainer } from 'components/Column'
import { Row } from 'components/Row'
import SearchBar from 'components/SearchBar'
import useCurrencyLogo from 'lib/hooks/useCurrencyLogo'
import TokensList from 'components/App/SpotTrading/TokensList'
import { Token } from '@orbs-network/liquidity-hub-ui-sdk'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  background: #171a1f;
  width: 100%;
  padding: 1.5rem;
  gap: 0.8rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0.5rem;
  `};
`

const BackTo = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text3};
  cursor: pointer;
  gap: 10px;
  &:hover {
    color: ${({ theme }) => theme.red};
  }
`

const Title = styled.h4`
  color: ${({ theme }) => theme.text0};
  font-size: 16px;
  font-weight: 500;
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
  margin-top: 10px;
  padding: 12px 14px;
  border: 1px solid rgba(56, 64, 79, 0.5);
  border-radius: 5px;
  transition: background 0.3s ease;
  gap: 9px;
  cursor: pointer;
  background: #232933;
`

const ActionButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const IconContainer = styled.div<{ isSwap?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 20;
`

function SelectedChainElement({ data }: { data: any }) {
  const { symbol, name, logoSymbol } = data

  const chainIcon = useCurrencyLogo(logoSymbol)

  return (
    <ElementContainer>
      <IconContainer>
        <Image src={chainIcon} alt="" width={30} />
      </IconContainer>

      <ColumnContainer orientation="left">
        <Row>
          <Label>{name}</Label>
        </Row>
        <Row>
          <Label reducedOpacity>{symbol}</Label>
        </Row>
      </ColumnContainer>
    </ElementContainer>
  )
}

export default function TokenSelectionModal({
  onTokenSelect,
  isOpen,
  closeModal,
}: {
  onTokenSelect: (token: Token) => void
  isOpen?: boolean
  closeModal: () => void
}) {
  const [searchValue, handleUpdateSearch] = useState('')

  return (
    <Modal isOpen={!!isOpen} onBackgroundClick={closeModal} onEscapeKeydown={closeModal}>
      <Wrapper>
        <BackTo onClick={closeModal}>
          <ArrowUpLeft />
          <span>Go Back</span>
        </BackTo>
        <Title>Select Token to transfer</Title>
        <SearchBar searchValue={searchValue} onChange={handleUpdateSearch} placeHolder="Search token..." />
        <TokensList onTokenSelect={onTokenSelect} searchValue={searchValue} />
      </Wrapper>
    </Modal>
  )
}
