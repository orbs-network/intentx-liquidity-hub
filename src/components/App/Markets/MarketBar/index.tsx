import { useMemo } from 'react'
import styled from 'styled-components'

import { useMarketNotionalCap, useMarketOpenInterest } from 'state/hedger/hooks'
import { useActiveMarket } from 'state/trade/hooks'
import { ApiState } from 'types/api'
import { formatDollarAmount } from 'utils/numbers'

import BlinkingPrice from 'components/App/FavoriteBar/BlinkingPrice'
import MarketInfo from 'components/App/Markets/MarketBar/MarketInfo'
import Column from 'components/Column'
import { Loader } from 'components/Icons'
import { Row, RowStart } from 'components/Row'
import { ToolTipBottomEnd } from 'components/ToolTip'
import { useIsMobile } from 'lib/hooks/useWindowSize'
import { useLast24HoursSymbolsTradingVolume, useOpenInterestAnalytics } from 'state/analytics/hooks'
import MarketDepths from './MarketDepths'
import MarketFundingRate from './MarketFundingRate'
import HorizontalScrollBox from 'components/HorizontalScrollBox'

const Wrapper = styled(Row)`
  border-radius: 4px;
  background: transparent;
  padding: 10px;
  height: auto;
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 5px; 
  `};

  /* ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    flex-direction: column;
    gap: 10px; 
    padding: 10px;
  `}; */
`

const DataWrap = styled(Row)`
  gap: 15px;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  & > * {
    &:first-child {
      order: 1;
      width: auto;
    }
    &:nth-child(3) {
      order: 1;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
    justify-content: center;
    // align-items: flex-start;
    // flex-direction: column; 
    & > * {
      &:first-child {
        order: 1;
        width: 100%;
      }
      &:nth-child(3) {
        order: 1;
      }
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    gap: 0px;
  `};
`

// ${({ theme }) => theme.mediaWidth.upToMedium`
//   & > * {
//     &:nth-child(2) {
//       display: none;
//     }
//   }
// `};

const MarketInfoStyled = styled(MarketInfo)`
  order: 0;
`

const HedgerInfos = styled(RowStart)`
  /* padding: 0 4px; */
  gap: 15px;
  width: initial;
  flex-wrap: nowrap;
  overflow-x: auto;
  flex-grow: 1;
  overflow-y: hidden;
  flex-shrink: 0;

  & > * {
    &:first-child {
      min-width: 80px;
    }
    &:last-child {
      border-right: none;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 11.25px;
`};

  ${({ theme }) => theme.mediaWidth.upToLarge` 
    gap: 10px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 5px;
    gap: 3px;
  `};
`

const MarketDepthStyled = styled(MarketDepths)`
  order: 2;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    order: 1;
  `};
`

export const Name = styled.div<{ textAlign?: string; textAlignMedium?: string }>`
  font-weight: 400;
  font-size: 12px;
  margin-bottom: 0px;
  text-align: ${({ textAlign }) => textAlign ?? 'left'};
  color: ${({ theme }) => theme.text2};
  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    font-size: 11px!important;
  `};
  ${({ theme, textAlignMedium }) => theme.mediaWidth.upToMedium`
    text-align: ${textAlignMedium ?? 'left'};
    `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 10px!important
  `};
`

export const Value = styled.div<{ textAlign?: string; textAlignMedium?: string }>`
  font-weight: 500;
  font-size: 12px;
  text-align: ${({ textAlign }) => textAlign ?? 'left'};
  color: ${({ theme }) => theme.text0};
  ${({ theme, textAlignMedium }) => theme.mediaWidth.upToMedium`
    text-align: ${textAlignMedium ?? 'left'};
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 10px!important
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 11px!important;
`};
`

const HedgerColumn = styled(Column)`
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding-right: 8px;
  min-width: 120px;
  flex-shrink: 0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 3px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  min-width: 90px;
  padding-right: 6px;
`};
`

export default function MarketBar() {
  const openInterest = useMarketOpenInterest()
  const { marketNotionalCap, marketNotionalCapStatus } = useMarketNotionalCap()
  const activeMarket = useActiveMarket()

  const isMobile = useIsMobile()

  const [used, total] = useMemo(() => [openInterest?.used, openInterest?.total], [openInterest])

  const [notionalCapUsed, totalCap] = useMemo(() => {
    return activeMarket?.name === marketNotionalCap.name && marketNotionalCapStatus !== ApiState.ERROR
      ? [marketNotionalCap?.used, marketNotionalCap?.totalCap]
      : [-1, -1]
  }, [activeMarket?.name, marketNotionalCapStatus, marketNotionalCap])

  const last24HoursSymbolsTradingVolume = useLast24HoursSymbolsTradingVolume()
  const openInterestAnalytics = useOpenInterestAnalytics()

  const totalOpenInterest = useMemo(() => {
    if (!openInterestAnalytics) return '0'
    return openInterestAnalytics.find((item) => !item.symbol && item.id.startsWith('OpenInterestId'))?.amount ?? '0'
  }, [openInterestAnalytics])

  const symbolOpenInterest = useMemo(() => {
    if (!openInterestAnalytics || !activeMarket) return '0'
    return openInterestAnalytics.find((item) => item.symbol?.name === activeMarket?.symbol + 'USDT')?.amount ?? '0'
  }, [activeMarket, openInterestAnalytics])

  const last24HoursSymbolVolume = useMemo(() => {
    if (!activeMarket || !last24HoursSymbolsTradingVolume) return '0'
    const activeMarketSymbol = activeMarket.symbol
    const symbolVolume = last24HoursSymbolsTradingVolume?.find(
      (item) => item.symbol.name === activeMarketSymbol + 'USDT'
    )

    return symbolVolume?.volume ?? '0'
  }, [last24HoursSymbolsTradingVolume, activeMarket])

  return (
    <Wrapper>
      <DataWrap>
        <HorizontalScrollBox>
          <HedgerInfos>
            <HedgerColumn
              data-for="last-price"
              data-tip="The price of the perpetual contract at the source. Used to calculate position PnL. Note that current prices quoted are reflected in the Bid and Ask."
            >
              <ToolTipBottomEnd id="last-price" />
              <Name>Last Price</Name>
              {activeMarket ? (
                <BlinkingPrice market={activeMarket} priceWidth={'66'} />
              ) : (
                <Loader size={'12px'} stroke="#EBEBEC" />
              )}
            </HedgerColumn>
            <HedgerColumn
              data-for="open-interest"
              data-tip="The total outstanding and available amounts across all contracts."
            >
              <ToolTipBottomEnd id="open-interest" />
              <Name>Open Interest</Name>
              <Value>
                {used === -1 ? <Loader size={'12px'} stroke="#EBEBEC" /> : formatDollarAmount(used)} /{' '}
                {total === -1 ? <Loader size={'12px'} stroke="#EBEBEC" /> : formatDollarAmount(total)}
              </Value>
            </HedgerColumn>
            <HedgerColumn
              data-for="notional-cap"
              data-tip="The total outstanding and available amounts for this perpetual contract pair."
            >
              <ToolTipBottomEnd id="notional-cap" />
              <Name>Avail. Liquidity</Name>
              <Value>
                {notionalCapUsed === -1 ? <Loader size={'12px'} stroke="#EBEBEC" /> : formatDollarAmount(notionalCapUsed)}{' '}
                / {totalCap === -1 ? <Loader size={'12px'} stroke="#EBEBEC" /> : formatDollarAmount(totalCap)}
              </Value>
            </HedgerColumn>
            <MarketFundingRate />
            {/*<HedgerColumn
              data-for="funding-rate"
              data-tip="The rate at which longs pay shorts (if negative, shorts pay longs). There are no fees associated with funding, this is a peer-to-peer transfer between users and solvers."
            >
              <ToolTipBottomEnd id="funding-rate" />
              <Name >{activeMarket?.symbol} Funding Rate</Name>
              <Value >0.0224%</Value>
              </HedgerColumn>*/}
            {/*<HedgerColumn
              data-for="countdown"
              data-tip="Displays the time until the next funding payment, which is automatically reflected on open positions."
            >
              <ToolTipBottomEnd id="countdown" />
              <Name >Countdown</Name>
              <Value >00h 00m</Value>
            </HedgerColumn>*/}
            <MarketDepths /> {/* spread */}
            {/* <FullscreenDepthButton /> */}
          </HedgerInfos>
        </HorizontalScrollBox>
        <MarketInfoStyled /> {/* SELECTOR market info */}
      </DataWrap>
    </Wrapper>
  )
}
