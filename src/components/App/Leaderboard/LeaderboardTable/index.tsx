/* eslint-disable react/prop-types */

import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'
import Config from '/public/static/images/etc/config.svg'
import IntxCoin from '/public/static/images/etc/intx-coin.svg'
import RankBg from '/public/static/images/etc/rank.svg'

import { ConfigButton } from 'components/Button'
import OutlineBtn from 'components/Button/OutlineButton'
import Column from 'components/Column'
import ExpandArrow from 'components/Icons/ExpandArrow'
import PaginationArrow from 'components/Icons/PaginationArrow'
import SortArrow from 'components/Icons/SortArrow'
import { Row } from 'components/Row'
import { useIsLaptop } from 'lib/hooks/useWindowSize'
import { useVirtualPointsLeaderboard } from 'state/tradingIncentives/hooks'
import { VirtualPointsLeaderboardEntry } from 'state/tradingIncentives/types'
import { truncateAddress } from 'utils/address'
import { formatDollarAmount, fromWei } from 'utils/numbers'
import OpenNewTab from '/public/static/images/etc/OpenNewTab.svg'

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 40px 0 60px 0;
  z-index: 50;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin: 28px 0 42px 0;
  `};
`

const TableHeader = styled.th`
  text-align: ${(props) => props.align};
  valign: middle;
  font-size: 15px;
  cursor: pointer;
  padding: 10px 18px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 11px;
  padding: 8px 12px;
  `};
`

const TableCell = styled.td`
  text-align: ${(props) => props.align};
  position: relative;
  vertical-align: middle;
  width: ${(props) => props.width};
  padding: 10px 18px;
  font-size: 14px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 0px 12px;
  font-size: 10px;
  `};
`

const RankContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const StatusDot = styled.div<{ isConnected?: boolean }>`
  height: 7px;
  width: 7px;
  border-radius: 100%;
  background-color: ${({ isConnected, theme }) => (isConnected ? theme.green : '#748090')};
`

const Label = styled.span<{ size?: number; weight?: string; reducedOpacity?: boolean }>`
  font-weight: ${({ weight }) => weight ?? '300'};
  font-size: ${({ size }) => (size ? `${size}px` : '14px')};
  color: ${({ theme }) => theme.white};
  opacity: ${({ reducedOpacity }) => (reducedOpacity ? '0.5' : '1')};

  ${({ theme, size }) => theme.mediaWidth.upToExtraLarge`
  font-size: ${size ? `${size * 0.7}px` : '10px'};
  `};
`

const TableRow = styled.tr`
  background-color: #181a1f;
  border-bottom: 10px solid #131518;
`

const TableBody = styled.tbody`
  margin-top: 10px;
`

const HeaderRow = styled.tr``

const HeaderLine = styled.div`
  height: 4px;
  width: 100%;
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(
    90deg,
    rgba(42, 48, 58, 0) 0.5%,
    rgba(42, 48, 58, 0.958333) 25.38%,
    #2a303a 73.57%,
    rgba(42, 48, 58, 0) 100%
  );
  border-image-slice: 1;
`

// Footer

const PaginationFooter = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
  z-index: 999;
`

const FooterLeft = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`

const FooterRight = styled.div`
  display: flex;
  align-items: center;
`

const PageNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ArrowButton = styled.button``

const PageNumberButton = styled.button<{ active?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  background: ${({ active, theme }) => (active ? theme.gradCustom1 : 'transparent')};
  width: 32px;
  height: 30px;
  font-size: 15px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px;
  `};
`

const Divider = styled.div<{ size?: string }>`
  height: ${({ size }) => (size ? size : '20px')};
  width: 1px;
  border-right: 1px solid ${({ theme }) => theme.red};
`

const ConfigColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: absolute;
  right: -65px;
  top: -124px;
  background: rgba(23, 26, 31);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px;
  z-index: 100;
  border-radius: 5px;
`

const RowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 16px;
  background: #1c1f2680;
  gap: 12px;
`

const RowHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const MobileTableCell = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

const MobileRankContainer = styled.div`
  display: flex;
  position: relative;
`

const ExpandButton = styled.div`
  margin-left: auto;
  cursor: pointer;
`

const RowBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`

export const LeaderboardTable = ({
  isMobile,
  viewAllTimeData,
  setViewAllTimeData,
}: {
  isMobile?: boolean
  viewAllTimeData?: boolean
  setViewAllTimeData?: (value: boolean) => void
}) => {
  const isLaptop = useIsLaptop()

  const [sortConfig, setSortConfig] = useState({
    key: 'rank',
    direction: 'asc',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [isPagesConfigOpen, setIsPagesConfigOpen] = useState(false)

  const virtualPointsLeaderboard = useVirtualPointsLeaderboard()
  const totalItems = virtualPointsLeaderboard?.leaderboard.length ?? 0

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = virtualPointsLeaderboard
    ? [...virtualPointsLeaderboard.leaderboard]
        .map((item, index) => {
          // Patching the cummulative rewards
          return {
            ...item,
            cummulativePoints:
              item.cummulativePoints && item.points ? item.cummulativePoints - item.points : item.cummulativePoints,
          }
        })
        .filter((item) => {
          if (viewAllTimeData) {
            return true
          } else {
            return item.points !== 0
          }
        })
        .sort((a, b) => {
          if (sortConfig.key === 'rank') {
            if (viewAllTimeData) {
              if ((a.cummulativeRank ?? 0) < (b.cummulativeRank ?? 0)) {
                return sortConfig.direction === 'asc' ? -1 : 1
              } else {
                return sortConfig.direction === 'asc' ? 1 : -1
              }
            } else {
              if ((a[sortConfig.key] ?? 0) < (b[sortConfig.key] ?? 0)) {
                return sortConfig.direction === 'asc' ? -1 : 1
              } else {
                return sortConfig.direction === 'asc' ? 1 : -1
              }
            }
          }
          if (sortConfig.key === 'volume') {
            if (viewAllTimeData) {
              if (parseFloat(a['cummulativeVolume'] ?? '0') < parseFloat(b['cummulativeVolume'] ?? '0')) {
                return sortConfig.direction === 'asc' ? -1 : 1
              }
              if (parseFloat(a['cummulativeVolume'] ?? '0') > parseFloat(b['cummulativeVolume'] ?? '0')) {
                return sortConfig.direction === 'asc' ? 1 : -1
              }
            } else {
              if (parseFloat(a[sortConfig.key] ?? '0') < parseFloat(b[sortConfig.key] ?? '0')) {
                return sortConfig.direction === 'asc' ? -1 : 1
              }
              if (parseFloat(a[sortConfig.key] ?? '0') > parseFloat(b[sortConfig.key] ?? '0')) {
                return sortConfig.direction === 'asc' ? 1 : -1
              }
            }
          } else {
            if (a[sortConfig.key] < b[sortConfig.key]) {
              return sortConfig.direction === 'asc' ? -1 : 1
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
              return sortConfig.direction === 'asc' ? 1 : -1
            }
          }

          return 0
        })
    : []

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, sortedData.length)

  const itemsToDisplay = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const switchPagesConfig = (): void => {
    setIsPagesConfigOpen((prev) => !prev)
  }

  const updateItemsPerPageConfig = (itemsPerPage: number) => (): void => {
    setItemsPerPage(itemsPerPage)
    switchPagesConfig()
  }

  const PageConfigDropdown = () => {
    return (
      <ConfigColumn>
        <OutlineBtn padding="3px 7px" onClick={updateItemsPerPageConfig(10)}>
          10
        </OutlineBtn>
        <OutlineBtn padding="3px 7px" onClick={updateItemsPerPageConfig(20)}>
          20
        </OutlineBtn>
        <OutlineBtn padding="3px 7px" onClick={updateItemsPerPageConfig(30)}>
          30
        </OutlineBtn>
        <OutlineBtn padding="3px 7px" onClick={updateItemsPerPageConfig(100)}>
          100
        </OutlineBtn>
      </ConfigColumn>
    )
  }

  const Ellipsis = styled.span`
    margin: 0 5px;
    font-size: 14px;
  `

  const renderPageNumbers = () => {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

    // Define the range of visible page numbers
    const visiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2))
    const endPage = Math.min(totalPages, startPage + visiblePages - 1)

    const pages: any = []

    // Always show the first page
    if (startPage > 1) {
      pages.push(
        <PageNumberButton key={1} onClick={() => setCurrentPage(1)} active={1 === currentPage}>
          1
        </PageNumberButton>
      )
      if (startPage > 2) {
        // Show ellipsis to the left of the first visible page
        pages.push(<Ellipsis key="ellipsis-start">...</Ellipsis>)
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageNumberButton key={i} onClick={() => setCurrentPage(i)} active={i === currentPage}>
          {i}
        </PageNumberButton>
      )
    }

    // Add ellipsis for the end of the page numbers
    if (endPage < totalPages) {
      // Show ellipsis to the left of the last visible page
      pages.push(<Ellipsis key="ellipsis-end">...</Ellipsis>)
      // Always show the last page after the ellipsis
      pages.push(
        <PageNumberButton
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          active={totalPages === currentPage}
        >
          {totalPages}
        </PageNumberButton>
      )
    }

    return pages
  }

  const MobileTableRow = ({ item }: { item: VirtualPointsLeaderboardEntry }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
      <RowWrapper>
        <RowHeader>
          <Row gap="32px">
            <Label size={11} reducedOpacity>
              Rank
            </Label>
            <Label size={11} reducedOpacity>
              Trader
            </Label>
          </Row>
          <Row gap="14px">
            <MobileTableCell>
              <MobileRankContainer>
                <Image
                  unoptimized={true}
                  src={RankBg}
                  alt="icon"
                  style={{ position: 'relative', top: '1px', width: '45px', height: '45px' }}
                />
                <RankContainer>
                  <Label size={12}>{item.rank}</Label>
                </RankContainer>
              </MobileRankContainer>
            </MobileTableCell>
            <MobileTableCell>
              <Row gap="8px">
                {/* <Image unoptimized={true} src={item.trader.profilePicture} alt="icon" width={26} /> */}
                <Column>
                  <Label weight="600" size={12}>
                    {truncateAddress(item.userAddress ?? '')}
                  </Label>
                  <Row gap="5px">
                    {/* <StatusDot isConnected={item.trader.connected} /> */}
                    {/* <Label size="11px">{item.trader.connected ? 'Connected' : 'Disconnected'}</Label> */}
                  </Row>
                </Column>
              </Row>
            </MobileTableCell>
            <ExpandButton onClick={() => setIsExpanded((prev) => !prev)}>
              <ExpandArrow isExpanded={isExpanded} />
            </ExpandButton>
          </Row>
        </RowHeader>
        {isExpanded ? (
          <RowBody>
            <Row gap="28px">
              <Label size={11} reducedOpacity>
                Account Address
              </Label>
              <Label size={11} reducedOpacity>
                Trade Volume
              </Label>
              <Label size={11} reducedOpacity>
                Epoch Potential Reward
              </Label>
              <Label size={11} reducedOpacity>
                Cumulative Reward
              </Label>
            </Row>
            <Row gap="32px">
              <MobileTableCell>
                <Row gap="8px">
                  <Label size={11}>{truncateAddress(item.userAddress ?? '')?.slice(0, 6)}...</Label>
                  <Image unoptimized={true} src={OpenNewTab} alt="icon" style={{ width: '16px', height: '16px' }} />
                </Row>
              </MobileTableCell>
              <MobileTableCell>
                <Row gap="8px" marginLeft="6px">
                  <Label size={11}>
                    {viewAllTimeData
                      ? formatDollarAmount(fromWei(item.cummulativeVolume))
                      : formatDollarAmount(fromWei(item.volume))}
                  </Label>
                </Row>
              </MobileTableCell>
              <MobileTableCell>
                <Row gap="8px" marginLeft="30px">
                  <Image unoptimized={true} src={IntxCoin} alt="icon" />
                  <Label size={11}>{item.points?.toFixed(0)}</Label>
                </Row>
              </MobileTableCell>
              <MobileTableCell>
                <Row gap="8px" marginLeft="50px">
                  <Image unoptimized={true} src={IntxCoin} alt="icon" />
                  <Label size={11}>{item.cummulativePoints?.toFixed(0)}</Label>
                </Row>
              </MobileTableCell>
            </Row>
          </RowBody>
        ) : null}
      </RowWrapper>
    )
  }

  return (
    <>
      <Table>
        {!isMobile ? (
          <thead>
            <HeaderRow>
              <TableHeader onClick={() => handleSort('rank')}>
                Rank{' '}
                {sortConfig.key === 'rank' && (sortConfig.direction === 'asc' ? <SortArrow /> : <SortArrow desc />)}
              </TableHeader>
              {/* <TableHeader align="left" onClick={() => handleSort('trader')}>
              Trader{' '}
              {sortConfig.key === 'trader' && (sortConfig.direction === 'asc' ? <SortArrow /> : <SortArrow desc />)}
            </TableHeader> */}
              <TableHeader align="left" onClick={() => handleSort('userAddress')}>
                Account Address{' '}
                {sortConfig.key === 'userAddress' &&
                  (sortConfig.direction === 'asc' ? <SortArrow /> : <SortArrow desc />)}
              </TableHeader>
              <TableHeader onClick={() => handleSort('volume')}>
                Trade Volume{' '}
                {sortConfig.key === 'volume' && (sortConfig.direction === 'asc' ? <SortArrow /> : <SortArrow desc />)}
              </TableHeader>
              <TableHeader align="right" onClick={() => handleSort('points')}>
                Epoch Potential Reward{' '}
                {sortConfig.key === 'points' && (sortConfig.direction === 'asc' ? <SortArrow /> : <SortArrow desc />)}
              </TableHeader>
              <TableHeader align="right" onClick={() => handleSort('cummulativePoints')}>
                Cumulative Reward{' '}
                {sortConfig.key === 'cummulativePoints' &&
                  (sortConfig.direction === 'asc' ? <SortArrow /> : <SortArrow desc />)}
              </TableHeader>
            </HeaderRow>
          </thead>
        ) : null}

        {!isMobile ? (
          <tbody>
            <tr>
              <td colSpan={5} style={{ paddingBottom: '10px' }}>
                <HeaderLine />
              </td>
            </tr>
          </tbody>
        ) : null}

        <TableBody>
          {itemsToDisplay.map((item, index) =>
            isMobile ? (
              <MobileTableRow key={index} item={item} />
            ) : (
              <TableRow key={index}>
                <TableCell align="center" width="10%">
                  <Image
                    unoptimized={true}
                    src={RankBg}
                    alt="icon"
                    style={{ position: 'relative', top: isLaptop ? '2px' : '4px' }}
                  />
                  <RankContainer>
                    <Label size={16}>{viewAllTimeData ? item.cummulativeRank : item.rank}</Label>
                  </RankContainer>
                </TableCell>
                {/* <TableCell align="left" width="20%">
              <Row gap="8px">
                <Image unoptimized={true} src={item.trader.profilePicture} alt="icon" width={40} />
                <Column>
                  <Label weight="600">{item.trader.name}</Label>
                  <Row gap="5px">
                    <StatusDot isConnected={item.trader.connected} />
                    <Label>{item.trader.connected ? 'Connected' : 'Disconnected'}</Label>
                  </Row>
                </Column>
              </Row>
            </TableCell> */}
                <TableCell
                  onClick={() => {
                    console.debug(item.userAddress)
                  }}
                  align="left"
                  width="30%"
                >
                  {truncateAddress(item.userAddress ?? '')}
                </TableCell>
                <TableCell align="center" width="20%">
                  {viewAllTimeData
                    ? formatDollarAmount(fromWei(item.cummulativeVolume))
                    : formatDollarAmount(fromWei(item.volume))}
                </TableCell>
                <TableCell align="right" width="20%">
                  <Row justify="flex-end" gap="5px">
                    <Image unoptimized={true} src={IntxCoin} alt="icon" />
                    {item.points?.toFixed(0)} Points
                  </Row>
                </TableCell>
                <TableCell align="right" width="20%">
                  <Row justify="flex-end" gap="5px">
                    <Image unoptimized={true} src={IntxCoin} alt="icon" />
                    {item.cummulativePoints?.toFixed(0)} Points
                  </Row>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
      <PaginationFooter>
        <FooterLeft>
          <Row
            backgroundColor="#171a1f"
            borderRadius="5px"
            padding="0px 25px"
            height="34px"
            gap="12px"
            flexShrink={0}
            width="fit-content"
          >
            <Label>{itemsPerPage} Rows</Label>
            <Divider />
            <Label>
              {startItem}-{endItem} of {totalItems}
            </Label>
          </Row>
          <ConfigButton onClick={switchPagesConfig} isActive={isPagesConfigOpen}>
            <Image unoptimized={true} src={Config} alt="icon" />
          </ConfigButton>
          {isPagesConfigOpen ? <PageConfigDropdown /> : null}
        </FooterLeft>
        <FooterRight>
          <PageNavigation>
            <ArrowButton onClick={() => (currentPage > 1 ? setCurrentPage(currentPage - 1) : {})}>
              <PaginationArrow disabled={currentPage === 1} />
            </ArrowButton>

            {!isMobile ? <Row>{renderPageNumbers()}</Row> : null}

            <ArrowButton onClick={() => (currentPage < totalPages ? setCurrentPage(currentPage + 1) : {})}>
              <PaginationArrow disabled={currentPage === totalPages} isNext />
            </ArrowButton>
          </PageNavigation>
        </FooterRight>
      </PaginationFooter>
    </>
  )
}

export default LeaderboardTable
