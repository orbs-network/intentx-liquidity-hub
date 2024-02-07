import BlinkingPrice from 'components/App/FavoriteBar/BlinkingPrice'
import Column from 'components/Column'
import { Loader } from 'components/Icons'
import { RowEnd } from 'components/Row'
import { ToolTipBottomEnd } from 'components/ToolTip'
import useBidAskPrice from 'hooks/useBidAskPrice'
import { useActiveMarket } from 'state/trade/hooks'
import styled from 'styled-components'
import { Name, Value } from '.'

const MarginColumn = styled(Column)`
  ${({ theme }) => theme.mediaWidth.upToLarge` 
      
      margin-left: unset;
  `};
  margin-right: 5px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding-right: 8px;
`

const MarketInfos = styled(RowEnd)`
  flex: 1;

  justify-content: flex-start;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    gap: 10px;
    justify-content: space-between;
    flex-direction: row-reverse;
  `};
`

const HedgerColumn = styled(Column)`
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding-right: 8px;
`

export default function MarketDepths() {
  const activeMarket = useActiveMarket()
  const { ask, bid, spread } = useBidAskPrice(activeMarket?.name, activeMarket?.pricePrecision)

  return (
    <>
      <MarginColumn>
        <span data-for="spread" data-tip="The difference between the ask and bid price.">
          <ToolTipBottomEnd id="spread" />
          <Name>Spread(bps)</Name>
          {spread != '0' ? <Value>{spread}</Value> : <Loader size={'12px'} stroke="#EBEBEC" />}
        </span>
      </MarginColumn>
      {/* <MarketDepth> */}
      <MarginColumn>
        <span data-for="bid" data-tip="The current price quoted for a short position.">
          <ToolTipBottomEnd id="bid" />
          <Name>Bid</Name>
          {spread != '0' ? <BlinkingPrice data={bid} /> : <Loader size={'12px'} stroke="#EBEBEC" />}
        </span>
      </MarginColumn>
      <MarginColumn>
        <span data-for="ask" data-tip="The current price quoted for a long position.">
          <ToolTipBottomEnd id="ask" />
          <Name>Ask</Name>
          {spread != '0' ? <BlinkingPrice data={ask} /> : <Loader size={'12px'} stroke="#EBEBEC" />}
        </span>
      </MarginColumn>
      {/* </MarketDepth> */}
    </>
  )
}
