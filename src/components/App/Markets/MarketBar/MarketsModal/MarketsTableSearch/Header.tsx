import styled from 'styled-components'

import SortArrow from 'components/Icons/SortArrow'
import { RowBetween } from 'components/Row'

const TableStructure = styled(RowBetween)`
  justify-content: flex-start;
  font-size: 12px;
  font-weight: 300;
  text-align: left;

  & > * {
    flex-shrink: 0;
    width: 100px;

    &:first-child {
      width: 150px;
    }

    &:last-child {
      width: 45px;
    }
  }

  
  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    & > * {
      &:last-child {
        display: none;
      }
    }
  `};


  /* margin-left: 12px;
  & > * {
    width: 18%;

    &:nth-child(1) {
      width: 13%;
      margin-right: 14px;
    }
    &:nth-child(2) {
      width: 15%;
    }
    &:nth-child(3) {
      width: 15%;
    }
    &:nth-child(4) {
      width: 14%;
    }
    &:nth-child(5) {
      width: 14%;
    }

    ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    font-size: 9px;
    margin-left: 0px;

    &:nth-child(1) {
      width: 15%;
      margin-right: 10px;
    }
    &:nth-child(2) {
      width: 15%;
    }
    &:nth-child(3) {
      width: 14%;
    }
    &:nth-child(4) {
      width: 12%;
    }
    &:nth-child(5) {
      width: 13%;
    }
  `};

    ${({ theme }) => theme.mediaWidth.upToMedium`
      &:nth-child(1) {
        width: 30% !important;
        margin-right: 0;
      }
      &:nth-child(2) {
        width: 20%;
      }
      &:nth-child(4) {
        width: 16%;
      }
      &:nth-child(5) {
        display: none;
      }
      &:nth-child(6) {
        display: none;
      }
    `}
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      width: 100%;

      &:nth-child(1) {
        width: 28% !important;
      }
      &:nth-child(2) {
        width: 20% !important;
      }
      &:nth-child(3) {
        width: 20%;
      }
    `}
  } */
`

const HeaderWrap = styled(TableStructure)`
  color: ${({ theme }) => theme.white};
  padding: 13px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border3};
  position: sticky;
  top: 14px;
  z-index: 1;
  background-color: ${({ theme }) => theme.bg9};
  border-bottom: 2px solid transparent;
  border-image: radial-gradient(50% 62720000.03% at 50% 52.34%, #33353c 82.29%, rgba(51, 53, 60, 0.075) 100%);
  border-image-slice: 1;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    padding: 9px;
  `};

  /* & > * {
    &:nth-child(1) {
      width: 150px;
    }
    &:last-child {
      width: 185px;

      text-align: right;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
  justify-content: space-between;
  & > * {
    &:nth-child(1) {
      width: 150px;
    }
    &:last-child {
      width: 60px;
      text-align: right;
    }
  }
  `}; */

`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  flex-shrink: 0;
  white-space: nowrap;
`

export default function TableHeader({
  HEADERS,
  onSort,
  sortConfig,
}: {
  HEADERS: string[]
  onSort?: any
  sortConfig?: {
    key: string
    direction: string
  }
}): JSX.Element | null {
  const sortableColumns = ['24h Change', '24h Volume', 'Open Interest', 'Market Cap']

  const handleSort = (item): void => {
    console.log('item', item)
    if (sortableColumns.includes(item)) {
      onSort(item)
    }
  }

  return (
    <HeaderWrap>
      {HEADERS.map((item, key) => {
        return (
          <HeaderElement key={key} onClick={() => handleSort(item)}>
            {item}
            {sortConfig?.key === item && (sortConfig?.direction === 'asc' ? <SortArrow /> : <SortArrow desc />)}
          </HeaderElement>
        )
      })}
      <div style={{ width: 42 }}>
      </div>
    </HeaderWrap>
  )
}
