import { useMemo, useState } from 'react'
import styled from 'styled-components'

import TableBody from './Body'
import TableHeader from './Header'
import { RowBetween } from 'components/Row'
import { InputField } from 'components/App/Markets/MarketBar/InputField'
import { useIsMobile } from 'lib/hooks/useWindowSize'
import { useMarkets } from 'state/hedger/hooks'
import { Search as SearchIcon } from 'components/Icons'
import { RowStart } from 'components/Row'

const TableWrapper = styled.div`
  border-radius: 4px;
  background: transparent;
`

const Title = styled(RowBetween)`
  border-bottom: 1px solid red;
`

const InputWrapper = styled.div`
  width: 100%;
  & > * {
    &:first-child {
      & > * {
        &:first-child {
          border-right: none;
        }
        &:last-child::placeholder {
          color: ${({ theme }) => theme.text4};
          font-size: 12px;
        }
      }
    }
  }
`

const SearchWrapper = styled(RowStart)`
  flex-flow: row nowrap;
  background: #21232a;
  padding: 0.2rem 0;
  height: 55px;
  gap: 5px;

  & > * {
    &:first-child {
      width: fit-content;
      padding: 0 0.5rem;
      border-right: 1px solid ${({ theme }) => theme.border1};
    }
  }
`

const Input = styled.input<{
  [x: string]: any
}>`
  height: fit-content;
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.white};
  padding-left: 2px;
  &:focus,
  &:hover {
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 0.6rem;
  `}
`

export default function Table() {
  const markets = useMarkets()

  const [searchValue, setSearchValue] = useState('')

  const isMobile = useIsMobile()
  return (
    <TableWrapper>
      <Title>
        <InputWrapper>
          <SearchWrapper>
            <SearchIcon size={20} />
            <Input
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
              autoFocus
              type="text"
              placeholder={'Search for a market'}
              spellCheck="false"
              onBlur={() => null}
            />
          </SearchWrapper>
        </InputWrapper>
      </Title>
      {!isMobile && (
        <TableHeader
          HEADERS={['', 'Name', 'Price', '24h / 7d Change', 'Market Cap', 'Open Interest', '24h Volume', 'Action']}
        />
      )}
      <TableBody markets={markets} searchValue={searchValue} />
    </TableWrapper>
  )
}
