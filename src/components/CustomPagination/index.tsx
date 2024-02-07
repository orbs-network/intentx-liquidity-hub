import { useState, createContext, useContext } from 'react'
import styled from 'styled-components'

import { IconWrapper } from 'components/Icons'
import ArrowRightTriangle from 'components/Icons/ArrowRightTriangle'
import { Card } from 'components/Card'
import { Row, RowBetween, RowEnd } from 'components/Row'
import SettingIcon from 'components/Icons/Setting'

const Container = styled(RowBetween)`
  height: 48px;
  padding: 0 24px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  `}
  position: relative;
`

const ContainerRowPage = styled(RowEnd)`
  background: rgba(23, 26, 31, 1);
  box-shadow: 0px 2.7547414302825928px 14.274569511413574px 0px rgba(0, 0, 0, 0.07);
  box-shadow: 0px 22px 114px 0px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;

  width: 203px;
  height: 34px;
  padding: 10px, 25px, 10px, 25px;
  border-radius: 5px;
  gap: 8px;
`

const Center = styled.div``

const Pagination = styled(Row)`
  font-weight: 400;
`
const RowAdjust = styled.div`
  display: inline-flex;
  gap: 10px;
`

const Separator = styled.div`
  width: 1px;
  height: 20px;
  border-radius: 4px;
  margin-left: 5px;
  margin-right: 5px;
  background: ${({ theme }) => theme.gradCustom2};
`

const RowPerPage = styled(Pagination)`
  background: rgba(23, 26, 31, 1);
  box-shadow: 0px 2.7547414302825928px 14.274569511413574px 0px rgba(0, 0, 0, 0.07);
  box-shadow: 0px 22px 114px 0px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;

  width: 36px;
  height: 34px;
  padding: 5px;
  border-radius: 5px;
  gap: 10px;

  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.gradCustom2};
  }
`
const RowPerPageText = styled.div`
  font-size: 14px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `}
`

const CurrentRowText = styled.div`
  font-size: 14px;
  display: inline-flex;
  gap: 5px;
`

const ArrowWrapper = styled.button<{ left?: boolean; active?: boolean }>`
  transform: rotate(${({ left }) => (left ? '180deg' : '0')});
  opacity: ${({ active }) => (active ? '1' : '0.5')};
  &:hover {
    cursor: ${({ active }) => (active ? 'pointer' : 'default')};
  }
`

const ActiveNum = styled.span`
  font-size: 14px;
  font-weight: 200;
`

const HoverWrapper = styled(Card)`
  padding: 10px;
  width: 3%;
  position: absolute;
  bottom: 10.1%;
  gap: 5px;
  left: 11.5%;
  z-index: 1;
  background: rgba(23, 26, 31, 0.8);
  border-radius: 4px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 75px;
    left: 230px;
    bottom: 55px;
    background: rgba(23, 26, 31, 1);
  `};
`

const HoverItem = styled.div`
  width: 54px;
  height: 38px;
  border-radius: 5px;
  border: 1px;
  gap: 10px;
  border: double 1px transparent;
  border-radius: 8px;
  background-image: ${({ theme }) => theme.gradCustomBg}, ${({ theme }) => theme.gradCustom1};
  background-origin: border-box;
  background-clip: padding-box, border-box;

  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.gradCustom1};
  }
`
const HoverItemContent = styled.div`
  text-align: center;
  padding: 10px;
  font-size: 14px;
  font-weight: 400;
`

interface IPageInfo {
  currentPage: number
  pageCount: number
  onPageChange: (...args: any) => any
}

interface IRowsPerPageInfo {
  currentPage: number
  rowsPerPage: number
  onRowsPerPageChange: (...args: any) => any
}

const NavigationContext = createContext<IPageInfo>({
  currentPage: 1,
  pageCount: 1,
  onPageChange: () => {
    return
  },
})

const CardContext = createContext<IRowsPerPageInfo>({
  currentPage: 1,
  rowsPerPage: 20,
  onRowsPerPageChange: () => {
    return
  },
})

function Arrow({
  currentPage,
  newPage,
  onPageChange,
  pageCount,
  left,
}: {
  currentPage: number
  newPage: number
  onPageChange: (...args: any) => any
  pageCount: number
  left?: boolean
}) {
  const isActive = left ? currentPage > 1 : currentPage < pageCount
  return (
    <ArrowWrapper active={isActive} left={left} onClick={() => onPageChange(newPage)}>
      <IconWrapper size={'40px'}>
        <ArrowRightTriangle width={10} height={18} />
      </IconWrapper>
    </ArrowWrapper>
  )
}

function PaginationNavigation() {
  const { currentPage, pageCount, onPageChange } = useContext(NavigationContext)
  return (
    <Center>
      <Pagination width={'initial'} gap={'12px'}>
        <Arrow
          currentPage={currentPage}
          newPage={currentPage - 1}
          onPageChange={onPageChange}
          pageCount={pageCount}
          left
        />
        <Row gap={'12px'} width={'initial'}>
          <ActiveNum>{currentPage}</ActiveNum> <span>of</span> <span>{pageCount}</span>
        </Row>
        <Arrow currentPage={currentPage} newPage={currentPage + 1} onPageChange={onPageChange} pageCount={pageCount} />
      </Pagination>
    </Center>
  )
}

function PaginationPerPageCard({
  initRowPage,
  finalRowPage,
  totalRows,
}: {
  initRowPage: number
  finalRowPage: number
  totalRows: number
}) {
  const { currentPage, rowsPerPage, onRowsPerPageChange } = useContext(CardContext)
  const [cardOpen, setCardOpen] = useState<boolean>(false)
  return (
    <div>
      <RowAdjust>
        <ContainerRowPage>
          <ActiveNum>{rowsPerPage}</ActiveNum>
          <RowPerPageText>Rows</RowPerPageText>
          <Separator />
          <CurrentRowText>
            <span>{initRowPage}</span>-<span>{finalRowPage}</span>
            <span>of</span> {totalRows}
          </CurrentRowText>
        </ContainerRowPage>
        <RowPerPage onClick={() => setCardOpen((prevCardOpen) => !prevCardOpen)}>
          <SettingIcon />
        </RowPerPage>
      </RowAdjust>
      {cardOpen && (
        <HoverWrapper onClick={() => setCardOpen(false)}>
          {[5, 10, 20].map((newRowsPerPage) => (
            <HoverItem
              key={newRowsPerPage}
              onClick={() => onRowsPerPageChange(currentPage, rowsPerPage, newRowsPerPage)}
            >
              <HoverItemContent>{newRowsPerPage}</HoverItemContent>
            </HoverItem>
          ))}
        </HoverWrapper>
      )}
    </div>
  )
}

export default function CustomPagination({
  pageCount,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  initRowPage,
  finalRowPage,
  totalRows,
}: {
  pageCount: number
  initRowPage: number
  totalRows: number
  finalRowPage: number
  currentPage: number
  onPageChange: (...args: any) => any
  rowsPerPage: number
  onRowsPerPageChange: (...args: any) => any
}) {
  const pageInfo: IPageInfo = {
    currentPage,
    pageCount,
    onPageChange,
  }
  const rowsPerPageInfo: IRowsPerPageInfo = {
    currentPage,
    rowsPerPage,
    onRowsPerPageChange,
  }
  return (
    <Container>
      <CardContext.Provider value={rowsPerPageInfo}>
        <PaginationPerPageCard initRowPage={initRowPage} finalRowPage={finalRowPage} totalRows={totalRows} />
      </CardContext.Provider>

      <NavigationContext.Provider value={pageInfo}>
        <PaginationNavigation />
      </NavigationContext.Provider>
    </Container>
  )
}
