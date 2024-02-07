import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Market } from 'types/market'
import { ApiState } from 'types/api'
import { useMarketsInfo, useMarketsStatus, useSetMarketsInfo } from 'state/hedger/hooks'

import MarketRow from './Row'
import Footer from './Footer'
import Column from 'components/Column'
import { Loader } from 'components/Icons'

const FooterWrapper = styled.div`
  height: 56px;
  border-radius: 0 0 4px 4px;
`

const LoaderWrapper = styled.div`
  margin: 16px auto;
`

export default function TableBody({
  markets,
  searchValue,
}: {
  markets: Market[]
  searchValue: string
}): JSX.Element | null {
  const marketsStatus = useMarketsStatus()
  const [page, setPage] = useState<number>(1)
  const [marketsPerPage, setMarketsPerPage] = useState<number>(20)

  const getFilteredMarkets = useCallback(() => {
    if (searchValue === '') return markets
    return markets.filter((market) => {
      return (
        market.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        market.symbol.toLowerCase().includes(searchValue.toLowerCase())
      )
    })
  }, [markets, searchValue])

  const visibleMarkets = useMemo<Market[]>(
    () => getFilteredMarkets().slice((page - 1) * marketsPerPage, Math.min(page * marketsPerPage, markets.length)),
    [markets, page, marketsPerPage, getFilteredMarkets]
  )

  const getMarketsInfo = useSetMarketsInfo()
  const marketsInfo = useMarketsInfo()

  const content =
    marketsStatus === ApiState.LOADING ? (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    ) : marketsStatus === ApiState.OK ? (
      visibleMarkets.map((market) => (
        <MarketRow key={market.id} market={market} marketInfo={marketsInfo[market.name]} />
      ))
    ) : (
      <h1>error</h1>
    )

  const pageCount = useMemo(() => Math.ceil(markets.length / marketsPerPage), [markets, marketsPerPage])

  const finalRowPage = marketsPerPage * page
  const initRowPage = 1 + (finalRowPage - visibleMarkets.length)

  const onPageChange = (newCalculatedPage: number) => {
    let newPage
    if (newCalculatedPage > pageCount) newPage = pageCount
    else if (newCalculatedPage < 1) newPage = 1
    else newPage = newCalculatedPage
    setPage(newPage)
  }

  const onMarketsPerPageChange = (currentPage: number, prevRowsPerPageValue: number, newRowsPerPageValue: number) => {
    const rowsPerPageRatio = prevRowsPerPageValue / newRowsPerPageValue
    const newCalculatedPage = Math.floor((currentPage - 1) * rowsPerPageRatio) + 1
    setMarketsPerPage(newRowsPerPageValue)
    onPageChange(newCalculatedPage)
  }

  useEffect(() => {
    setPage(1)
  }, [searchValue])

  useEffect(() => {
    getMarketsInfo()
  }, [])

  return (
    <Column>
      {content}
      <FooterWrapper>
        <Footer
          pageCount={pageCount}
          finalRowPage={finalRowPage}
          initRowPage={initRowPage}
          totalRows={markets.length}
          currentPage={page}
          onPageChange={onPageChange}
          rowsPerPage={marketsPerPage}
          onRowsPerPageChange={onMarketsPerPageChange}
        />
      </FooterWrapper>
    </Column>
  )
}
