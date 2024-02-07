import { useEffect, useState } from 'react'
import styled from 'styled-components'

import TableBody from './Body'
import TableHeader from './Header'

import { useIsMobile } from 'lib/hooks/useWindowSize'
import { Market } from 'types/market'
import { useFavoriteMarkets } from 'hooks/useMarkets'

const TableWrapper = styled.div`
  border-radius: 4px;
  background: transpareent;
`

const TableCategories = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${({ theme }) => theme.bg9};
  align-items: center;
  justify-content: flex-start;
  padding-left: 24px;
  font-size: 11px;
  gap: 10px;
  height: 14px;
  font-weight: 400;
  line-height: 1;
  z-index: 2;
  color: ${({ theme }) => theme.text0};
  position: sticky;
  top: 0;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    padding-left: 9px;
  `};
`

const TableCategory = styled.div<{ active: boolean }>`
  cursor: pointer;
  text-decoration: ${({ active }) => (active ? 'underline' : 'none')};
  &:hover {
    text-decoration: underline;
  }
`

type CATEGORY = 'All' | 'Favourites' | 'Trendy'

export default function Table({
  markets,
  searchValue,
  onDismiss,
}: {
  markets: Market[]
  searchValue: string
  onDismiss: () => void
}): JSX.Element | null {
  const isMobile = useIsMobile()
  const [filteredMarkets, setFilteredMarkets] = useState(markets)
  const userFavoriteMarkets = useFavoriteMarkets()
  const [sortConfig, setSortConfig] = useState({
    key: '24h Volume',
    direction: 'desc',
    bodyKey: 'tradeVolume',
  })

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    const getKey = () => {
      if (key === '24h Change') {
        return 'priceChangePercent'
      } else if (key === '24h Volume') {
        return 'tradeVolume'
      } else if (key === 'Open Interest') {
        return 'notionalCap'
      } else if (key === 'Market Cap') {
        return 'marketCap'
      }
      return 'tradeVolume'
    }

    setSortConfig({ key, direction, bodyKey: getKey() })
  }

  const [category, setCategory] = useState<CATEGORY>('All')

  useEffect(() => {
    switch (category) {
      case 'All':
        setFilteredMarkets(markets)
        break
      case 'Favourites':
        setFilteredMarkets(markets.filter((market) => userFavoriteMarkets.includes(market)))
        break
      case 'Trendy':
        setFilteredMarkets([...markets].sort((a, b) => b.tradingFee - a.tradingFee).slice(0, 10))
        break
      default:
        setFilteredMarkets(markets)
    }
  }, [markets, category, userFavoriteMarkets])

  useEffect(() => {
    if (category === 'Favourites') {
      setFilteredMarkets(markets.filter((market) => userFavoriteMarkets.includes(market)))
    }
  }, [userFavoriteMarkets, markets, category])

  useEffect(() => {
    setCategory('All')
  }, [])

  return (
    <TableWrapper>
      <TableCategories>
        <TableCategory
          active={category === 'All'}
          onClick={() => {
            setCategory('All')
          }}
        >
          All
        </TableCategory>
        <TableCategory
          active={category === 'Favourites'}
          onClick={() => {
            setCategory('Favourites')
          }}
        >
          Favorites
        </TableCategory>

      </TableCategories>
      {!isMobile && (
        <TableHeader
          HEADERS={['Symbol', 'Last Price', '24h Change', 'Market Cap', '24h Volume']}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      )}

      {isMobile && (
        <TableHeader HEADERS={['Symbol', 'Last Price', '24h Change']} onSort={handleSort} sortConfig={sortConfig} />
      )}
      <TableBody markets={filteredMarkets} searchValue={searchValue} onDismiss={onDismiss} sortConfig={sortConfig} />
    </TableWrapper>
  )
}
