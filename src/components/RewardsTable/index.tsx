/* eslint-disable react/prop-types */

import React, { useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { Row } from 'components/Row'
import Column from 'components/Column'

import Calendar from '/public/static/images/etc/gradient-calendar.svg'
import IntxCoin from '/public/static/images/etc/intx-coin.svg'
import Config from '/public/static/images/etc/config.svg'

import SortArrow from 'components/Icons/SortArrow'
import OutlineBtn from 'components/Button/OutlineButton'
import { ConfigButton } from 'components/Button'
import PaginationArrow from 'components/Icons/PaginationArrow'

export const RewardsTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'asc',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const [isPagesConfigOpen, setIsPagesConfigOpen] = useState(false)

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const itemsToDisplay = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: 40px 0;
    z-index: 50;
  `

  const TableHeader = styled.th`
    padding: 8px;
    text-align: ${(props) => props.align};
    vertical-align: middle;
    font-size: 15px;
    cursor: pointer;
    padding: 10px 18px;
  `

  const TableCell = styled.td`
    text-align: ${(props) => props.align};
    position: relative;
    vertical-align: middle;
    width: ${(props) => props.width};
    padding: 10px 18px;
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

  const Label = styled.span<{ size?: string; weight?: string }>`
    font-weight: ${({ weight }) => (weight ? weight : '500')};
    font-size: ${({ size }) => (size ? size : '14px')};
    color: ${({ theme }) => theme.white};
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

  return (
    <>
      <Table>
        <thead>
          <HeaderRow>
            <TableHeader align="left" onClick={() => handleSort('date')}>
              Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <SortArrow /> : <SortArrow desc />)}
            </TableHeader>
            <TableHeader align="center" onClick={() => handleSort('tradeVolume')}>
              Your Trade Volume{' '}
              {sortConfig.key === 'tradeVolume' &&
                (sortConfig.direction === 'asc' ? <SortArrow /> : <SortArrow desc />)}
            </TableHeader>
            <TableHeader align="right" onClick={() => handleSort('rewards')}>
              Your Rewards{' '}
              {sortConfig.key === 'rewards' && (sortConfig.direction === 'asc' ? <SortArrow /> : <SortArrow desc />)}
            </TableHeader>
          </HeaderRow>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} style={{ paddingBottom: '10px' }}>
              <HeaderLine />
            </td>
          </tr>
        </tbody>

        <TableBody>
          {itemsToDisplay.map((item, index) => (
            <TableRow key={index}>
              <TableCell align="left" width="20%">
                <Row gap="8px">
                  <Image unoptimized={true} src={Calendar} alt="icon" width={35} />
                  <Column>
                    <Label weight="600">{item.date}</Label>
                    <Label>Epoch {item.epochNumber}</Label>
                  </Column>
                </Row>
              </TableCell>
              <TableCell align="center" width="60%">
                {item.tradeVolume}
              </TableCell>
              <TableCell align="right" width="20%">
                <Row justify="flex-end" gap="5px">
                  <Image unoptimized={true} src={IntxCoin} alt="icon" />
                  {item.rewards}
                </Row>
              </TableCell>
            </TableRow>
          ))}
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

            <Row>
              {Array.from({ length: totalPages }, (_, index) => (
                <PageNumberButton
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  active={index + 1 === currentPage}
                >
                  {index + 1}
                </PageNumberButton>
              ))}
            </Row>

            <ArrowButton onClick={() => (currentPage < totalPages ? setCurrentPage(currentPage + 1) : {})}>
              <PaginationArrow disabled={currentPage === totalPages} isNext />
            </ArrowButton>
          </PageNavigation>
        </FooterRight>
      </PaginationFooter>
    </>
  )
}

export default RewardsTable
