import { Row, RowBetween } from 'components/Row'
import styled from 'styled-components'
import Image from 'next/image'
import Positions from './Positions'
import Cards from './cards'
import Maturity from '/public/static/images/stakingIcons/maturity.svg'
import Fee from '/public/static/images/stakingIcons/fee.svg'
import ChartIcon from '/public/static/images/stakingIcons/chart.svg'
import ChartCircle from '/public/static/images/stakingIcons/chart-circle.svg'
import IntentXIcon from '/public/static/images/stakingIcons/intentXIcon.svg'
import IntentXIconW from '/public/static/images/stakingIcons/intentXIconW.svg'
import Redeem from '/public/static/images/stakingIcons/redeem.svg'
import Coins from '/public/static/images/stakingIcons/coins.svg'
import Apr from '/public/static/images/stakingIcons/apr.svg'
import Time from '/public/static/images/stakingIcons/time.svg'
import Ratio from '/public/static/images/stakingIcons/ratio.svg'
import Info from './info'
import GradientButton from 'components/Button/GradientButton'

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(5, max-content);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  margin-top: 20px;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: repeat(1, 1fr);
`}
`
const CardContainer = styled.div<{ gridA: string; gridC: string; gridR: string }>`
  width: 100%;
  border-radius: 10px;
  background: rgba(23, 26, 31, 1);
  grid-area: ${({ gridA }) => gridA};
  display: grid;
  grid-template-columns: ${({ gridC }) => gridC};
  grid-template-rows: ${({ gridR }) => gridR};
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  min-height: 100%;
  padding: 25px 15px 25px 15px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-area: inherit;
`}
`
const Chart = styled.div<{ width?: string; height?: string; gridAr: string }>`
  width: ${({ width }) => (width ? width : '100%')};
  height: ${({ height }) => (height ? height : '100%')};
  grid-area: ${({ gridAr }) => (gridAr ? gridAr : 'none')};
  border-radius: 10px;
  background: rgba(23, 26, 31, 1);
  min-height: 100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  grid-area: inherit;
`}
`

const ImageCenter = styled.div<{gridAr?: string}>`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  grid-area: ${({ gridAr }) => (gridAr ? gridAr : ' 1 / 1 / 2 / 3')};
  align-items: center;
  height: 150px;
`

export const Title = styled.div<{fontSize?: string}>`
  font-family: Poppins;
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '32px')};
  font-weight: 600;
  line-height: 48px;
  letter-spacing: 0em;
  text-align: left;
`

export default function DataStaking({ isMobile }: { isMobile: boolean }) {
  return (
    <Wrapper>
      <Positions isMobile={isMobile}></Positions>
      <Chart width="100%" height="464px" gridAr="1 / 2 / 2 / 3"></Chart>
      <CardContainer gridA=" 2 / 2 / 3 / 3" gridC="repeat(3, 1fr)" gridR="repeat(2, max-content)">
        <Cards
          button={false}
          height="150px"
          width="100%"
          icon={Maturity}
          isMobile={isMobile}
          title="Current Maturity"
          type="weeks"
          value="--"
          gridAr="1 / 1 / 2 / 2"
        ></Cards>
        <Cards
          button={false}
          height="150px"
          width="100%"
          isMobile={isMobile}
          title="Current Maturity"
          type="x"
          value="--"
          multiply={1}
          gridAr="1 / 2 / 2 / 3"
        ></Cards>
        <Cards
          button={false}
          height="150px"
          width="100%"
          icon={Fee}
          isMobile={isMobile}
          title="Current Exit Fee"
          type="%"
          value="--"
          gridAr="1 / 3 / 2 / 4"
        ></Cards>
        <Cards
          button={true}
          height="125px"
          width="100%"
          icon={Redeem}
          isMobile={isMobile}
          title="Redeemable"
          type="INTX"
          value="$--"
          gridAr="2 / 1 / 3 / 4"
        ></Cards>
      </CardContainer>
      <Chart width="100%" height="572px" gridAr="3 / 1 / 4 / 3"></Chart>
      <Info isMobile={isMobile} gridAr="4 / 1 / 5 / 2" secondary={false}></Info>
      <Info isMobile={isMobile} gridAr="4 / 2 / 5 / 3" secondary={true}></Info>

      <CardContainer gridA=" 5 / 1 / 6 / 2" gridC="repeat(2, 1fr)" gridR="repeat(3, max-content)">
        <ImageCenter>
          <Image unoptimized={true} src={IntentXIcon} alt="intentx" style={{ position: 'relative', width:'65px' }} />
          <Title fontSize='22px'>INTX</Title>
        </ImageCenter>
        <Cards
          button={false}
          height="150px"
          width="100%"
          icon={Redeem}
          isMobile={isMobile}
          title="Price"
          type=""
          value="$--"
          gridAr="2 / 1 / 3 / 2"
        ></Cards>
        <Cards
          button={false}
          height="150px"
          width="100%"
          icon={Fee}
          isMobile={isMobile}
          title="Total Staked xINTX"
          type=""
          value="--"
          gridAr="2 / 2 / 3 / 3"
        ></Cards>
        <Cards
          button={false}
          height="150px"
          width="100%"
          icon={ChartIcon}
          isMobile={isMobile}
          title="Circulating Market Cap"
          type=""
          value="$--"
          gridAr="3 / 1 / 4 / 2"
        ></Cards>
        <Cards
          button={false}
          height="150px"
          width="100%"
          icon={ChartCircle}
          isMobile={isMobile}
          title="Circulating Supply"
          type=""
          value="--"
          gridAr="3 / 2 / 4 / 3"
        ></Cards>
        <GradientButton
          buttonFilled={true}
          label={'Buy INTX'}
          onClick={() => console.log('')}
          size="100%"
          height="59px"
        />
        <GradientButton
          buttonFilled={true}
          label={'Stake INTX'}
          onClick={() => console.log('')}
          size="100%"
          height="59px"
        />
      </CardContainer>
      <CardContainer gridA="5 / 2 / 6 / 3" gridC="1fr repeat(2, 0.5fr) 1fr" gridR="repeat(4, max-content)">
        <ImageCenter gridAr='1 / 1 / 2 / 5'>
          <Image unoptimized={true} src={IntentXIconW} alt="intentxW" style={{ position: 'relative', width:'65px' }} />
          <Title fontSize='22px'>xINTX</Title>
        </ImageCenter>
        <Cards
          button={false}
          height="120px"
          width="100%"
          icon={Fee}
          isMobile={isMobile}
          title="Total xINTX"
          type=""
          value="--"
          gridAr="2 / 1 / 3 / 2"
        ></Cards>
        <Cards
          button={false}
          height="120px"
          width="100%"
          icon={Coins}
          isMobile={isMobile}
          title="Total Value Staked"
          type=""
          value="$--"
          gridAr="2 / 2 / 3 / 4"
        ></Cards>
        <Cards
          button={false}
          height="120px"
          width="100%"
          icon={Apr}
          isMobile={isMobile}
          title="Average APR"
          type="%"
          value="-.--"
          gridAr="2 / 4 / 3 / 5"
        ></Cards>
        <Cards
          button={false}
          height="120px"
          width="100%"
          icon={Maturity}
          isMobile={isMobile}
          title="Max Maturity APR"
          type=""
          value="--"
          gridAr="3 / 1 / 4 / 2"
        ></Cards>
        <Cards
          button={false}
          height="120px"
          width="100%"
          icon={Ratio}
          isMobile={isMobile}
          title="Backing Ratio"
          type=""
          value="-:--"
          gridAr="3 / 2 / 4 / 4"
        ></Cards>
        <Cards
          button={false}
          height="120px"
          width="100%"
          icon={Redeem}
          isMobile={isMobile}
          title="USDC Revenue Distributed"
          type=""
          value="-.--"
          gridAr="3 / 4 / 4 / 5"
        ></Cards>
        <Cards
          button={false}
          height="120px"
          width="100%"
          icon={ChartCircle}
          isMobile={isMobile}
          title="Average Maturity"
          type="%"
          value="-.--"
          gridAr="4 / 1 / 5 / 3"
        ></Cards>
        <Cards
          button={false}
          height="120px"
          width="100%"
          icon={Time}
          isMobile={isMobile}
          title="% of INTX Supply Staked"
          type="%"
          value="-.--"
          gridAr="4 / 3 / 5 / 5"
        ></Cards>
      </CardContainer>
    </Wrapper>
  )
}
