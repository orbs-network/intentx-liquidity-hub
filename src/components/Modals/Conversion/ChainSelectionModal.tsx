import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import styled from 'styled-components'

import { ArrowUpLeft } from 'components/Icons'
import { Modal } from 'components/Modal'

import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

import { ChainData } from '@0xsquid/squid-types'
import ChainsList from 'components/App/Conversion/ChainsList'
import SearchBar from 'components/SearchBar'

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

export default function ChainSelectionModal({
  availableChains,
  handleSelectChain,
}: {
  availableChains: ChainData[]
  handleSelectChain: (chain: ChainData) => void
}) {
  const isOpen = useModalOpen(ApplicationModal.CHAIN_SELECTION)
  const toggleModal = useToggleModal(ApplicationModal.CHAIN_SELECTION)

  const [searchValue, setSearchValue] = useState('')

  const dispatch = useDispatch()

  const handleUpdateSearch = (value: string): void => {
    setSearchValue(value)
  }

  const filteredChains = useMemo(() => {
    if (searchValue !== '') {
      return availableChains.filter(
        (chain) =>
          chain.networkName.toLowerCase().includes(searchValue.toLowerCase()) ||
          chain.networkName.toLowerCase().includes(searchValue.toLowerCase())
      )
    } else {
      return availableChains
    }
  }, [searchValue, availableChains])

  return (
    <Modal isOpen={isOpen} onBackgroundClick={toggleModal} onEscapeKeydown={toggleModal}>
      <Wrapper>
        <BackTo onClick={() => toggleModal()}>
          <ArrowUpLeft />
          <span>Go Back</span>
        </BackTo>
        <Title>Source Network</Title>
        <SearchBar searchValue={searchValue} onChange={handleUpdateSearch} placeHolder="Search network..." />
        <ChainsList data={filteredChains} onSelectChain={handleSelectChain} />
      </Wrapper>
    </Modal>
  )
}
