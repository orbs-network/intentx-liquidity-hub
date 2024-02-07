import styled from 'styled-components'

import MarketsBox from 'components/App/Markets/MarketsBox'
import { RowStart } from 'components/Row'
import { useIsMobile } from 'lib/hooks/useWindowSize'
import MarketsTable from './MarketsTable'

const Container = styled.div`
  margin: auto;
  border-radius: 4px;
  max-width: 95vw;
`

const TitleBox = styled(RowStart)<{ isMobile: boolean }>`
  flex-direction: column;
  margin: ${({ isMobile }) => (isMobile ? '20px 0px' : '10px 0px')};
  align-items: ${({ isMobile }) => (isMobile ? 'center' : 'start')};
  gap: ${({ isMobile }) => (isMobile ? '10px' : '1px')};
`

const Title = styled.div`
  color: ${({ theme }) => theme.white};
  font-size: 32px;
  font-weight: 500;
  line-height: 50px;
  letter-spacing: 0em;
  text-align: left;
`

const Subtitle = styled.div`
  color: ${({ theme }) => theme.white};
  font-size: 16px;
  font-weight: 200;
  line-height: 20px;
`

const TableWrapper = styled.div`
  position: relative;
  z-index: 9;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: -65px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: -35px;
  `}
`
const Boxes = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

export default function Markets() {
  const isMobile = useIsMobile()
  return isMobile ? getMobileContent() : getDefaultContent()

  function getMobileContent() {
    return (
      <Container>
        <TitleBox isMobile={isMobile}>
          <Title>Market Data</Title>
          <Subtitle>IntentX Perpetuals</Subtitle>
        </TitleBox>
        <MarketsBox />
        <TableWrapper>
          <MarketsTable />
        </TableWrapper>
      </Container>
    )
  }

  function getDefaultContent() {
    return (
      <Container>
        <TitleBox isMobile={isMobile}>
          <Title>Market Data</Title>
          <Subtitle>IntentX Perpetuals</Subtitle>
        </TitleBox>
        <Boxes>
          <MarketsBox />
        </Boxes>
        <TableWrapper>
          <MarketsTable />
        </TableWrapper>
      </Container>
    )
  }
}
