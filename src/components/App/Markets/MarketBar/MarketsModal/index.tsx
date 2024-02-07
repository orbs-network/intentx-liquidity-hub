import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Z_INDEX } from 'theme'

import { useFavoriteMarkets } from 'hooks/useMarkets'

import { Card } from 'components/Card'
import { IconWrapper, Search } from 'components/Icons'
import SearchClose from 'components/Icons/SearchClose'
import { Modal as ModalBody } from 'components/Modal'
import { RowStart } from 'components/Row'
import { useIsLaptop } from 'lib/hooks/useWindowSize'
import { useDispatch } from 'react-redux'
import { AppThunkDispatch } from 'state'
import { useMarkets, useSetMarketsInfo } from 'state/hedger/hooks'
import Table from './MarketsTableSearch'

const ModalWrapper = styled(Card)`
  padding: 0;
  border: none;
  background: linear-gradient(0deg, #171a1f, #171a1f),
    linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));

  & > * {
    &:last-child {
      overflow-y: scroll;
      overflow-x: hidden;
      width: 100%;
      min-height: 100%;
      max-height: 400px;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`

  & > * {
    &:last-child {
      overflow-y: scroll;
      overflow-x: hidden;
      width: 100%;
      min-height: 100%;
      max-height: 300px;
    }
  }
`};
`

const Wrapper = styled.div`
  display: flex;
  height: 52px;
  width: 100%;
  border-radius: 4px;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  height: 40px;
  border-radius: 3px;
`};
`

const InlineModal = styled(Card)<{ isOpen: boolean; height?: string }>`
  padding: 0px;
  max-height: ${({ height }) => height ?? '554px'};
  position: absolute;
  z-index: ${Z_INDEX.modal};
  left: 0;
  top: 100%;
  background: linear-gradient(0deg, #171a1f, #171a1f),
    linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));

  border: 1px solid ${({ theme }) => theme.bgCustom2};
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};

  & > * {
    &:last-child {
      overflow-y: scroll;
      overflow-x: hidden;
      width: 100%;
      min-height: 100%;
      height: 400px;
    }
  }

  ${({ theme, height }) => theme.mediaWidth.upToExtraLarge`
  max-height: ${height ?? '415px'};

  & > * {
    &:last-child {
      overflow-y: scroll;
      overflow-x: hidden;
      width: 100%;
      min-height: 100%;
      height: 300px;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
    left: 50%;
    transform: translateX(-50%);
  `})}
`};
`

const Modal = styled(ModalBody)`
  border: none;
`

const UpperRow = styled(RowStart)`
  z-index: 0;
  gap: 12px;
  flex-flow: nowrap;
  font-size: 0.8rem;
  margin-bottom: 13px;
  flex-direction: column;
  background: linear-gradient(0deg, #1c1f26, #1c1f26),
    linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
  width: 100%;
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px 4px 0px 0px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    border: none;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    gap: 9px;
    font-size: 0.6rem;
    margin-bottom: 9px;
    padding: 9px;
    border-radius: 3px 3px 0px 0px;
`};
`

const Input = styled.input<{
  [x: string]: any
}>`
  height: 100%;
  flex: 1;
  border: none;
  background: linear-gradient(0deg, #171a1f, #171a1f),
    linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
  border-radius: 0px 4px 4px 0px;
  color: ${({ theme }) => theme.white};
  padding-left: 2px;
  &:focus,
  &:hover {
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 0.6rem;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 0.75rem;
  padding-left: 1.5px;
`};
`

const IconInput = styled(IconWrapper)`
  height: 100%;
  padding-left: 20px;
  padding-right: 15px;
  border-radius: 4px 0px 0px 4px;
  background: linear-gradient(0deg, #171a1f, #171a1f),
    linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
`

const CloseIconInput = styled(IconWrapper)`
  height: 100%;

  padding-right: 20px;
  border-radius: 4px 0px 0px 4px;
  background: linear-gradient(0deg, #171a1f, #171a1f),
    linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));

  cursor: pointer;
`

export enum MarketsFilters {
  ALL = 'ALL',
  TRENDING = 'TRENDING',
  DEX_ONLY = 'DEX_ONLY',
}

export function MarketsModal({
  isModal,
  isOpen,
  onDismiss,
}: {
  isModal?: boolean
  isOpen: boolean
  onDismiss: () => void
}) {
  const thunkDispatch: AppThunkDispatch = useDispatch()

  const getMarketsInfo = useSetMarketsInfo()
  // Updating the markets info every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getMarketsInfo()
    }, 30000)
    return () => clearInterval(interval)
  }, [thunkDispatch, getMarketsInfo])

  const markets = useMarkets()
  const isLaptop = useIsLaptop()

  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState(MarketsFilters.ALL)
  const filteredMarkets = useMemo(() => {
    return markets.filter((market) => market.name.toLowerCase().includes(searchValue.toLowerCase()))
  }, [searchValue, markets])

  const favorites = useFavoriteMarkets()
  const filteredFavouriteMarkets = useMemo(() => {
    return favorites.filter((market) => market.name.toLowerCase().includes(searchValue.toLowerCase()))
  }, [searchValue, favorites])

  function getInnerContent() {
    return (
      <>
        <UpperRow>
          <Wrapper>
            <IconInput>
              <Search size={isLaptop ? 19 : 25}></Search>
            </IconInput>
            <Input
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
              autoFocus
              type="text"
              placeholder={'Search by symbol'}
              spellCheck="false"
              onBlur={() => null}
            />
            <CloseIconInput
              onClick={() => {
                setSearchValue('')
              }}
            >
              <SearchClose size={isLaptop ? 19 : 25}></SearchClose>
            </CloseIconInput>
          </Wrapper>
          {/* <SearchFilters selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} /> */}
        </UpperRow>
        <div>
          <Table markets={filteredMarkets} searchValue={searchValue} onDismiss={onDismiss}></Table>
        </div>
      </>
    )
  }

  return isModal ? (
    <Modal isOpen={isOpen} onBackgroundClick={onDismiss} onEscapeKeydown={onDismiss}>
      <ModalWrapper>{getInnerContent()}</ModalWrapper>
    </Modal>
  ) : (
    <InlineModal isOpen={isOpen}>{getInnerContent()}</InlineModal>
  )
}
