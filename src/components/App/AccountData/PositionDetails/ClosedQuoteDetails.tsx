import React, { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'

import { COLLATERAL_TOKEN } from 'constants/tokens'
import { Quote, QuoteStatus } from 'types/quote'
import { PositionType } from 'types/trade'
import { formatAmount, formatCurrency, toBN } from 'utils/numbers'
import { formatTimestamp } from 'utils/time'
import { getTokenWithFallbackChainId } from 'utils/token'

import useBidAskPrice from 'hooks/useBidAskPrice'
import { useMarket } from 'hooks/useMarkets'
import { useLockedMargin, useQuoteLeverage, useQuoteSize, useQuoteUpnlAndPnl } from 'hooks/useQuotes'
import { useNotionalValue } from 'hooks/useTradePage'
import { useMarketData } from 'state/hedger/hooks'

import {
  Chevron,
  ContentWrapper,
  DataWrap,
  FlexColumn,
  Label,
  Leverage,
  MarketName,
  PositionInfoBox,
  PositionPnl,
  QuoteData,
  Row,
  RowPnl,
  StyledInfoIcon,
  TopWrap,
  Value,
  Wrapper,
} from 'components/App/AccountData/PositionDetails/styles'
import BlinkingPrice from 'components/App/FavoriteBar/BlinkingPrice'
import { MainButton, PositionActionButton } from 'components/Button'
import { Loader, LongArrow, ShortArrow } from 'components/Icons'
import Share from 'components/Icons/Share'
import { Row as RowComponent, RowEnd } from 'components/Row'

import { useGetPaidAmount } from 'hooks/useFundingRate'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { ApiState } from 'types/api'
import ClosePendingDetails from './ClosedSizeDetails/ClosePendingDetails'
import ClosedAmountDetails from './ClosedSizeDetails/ClosedAmountDetails'
import PositionDetailsNavigator from './PositionDetailsNavigator'
import PositionSummaryCard from './PositionSummaryCard'

import { useSetQuoteDetailCallback } from 'state/quotes/hooks'
import { ToolTipBottomEnd } from 'components/ToolTip'

// const ShareOnTwitterButton = styled(RowEnd)`
//   width: 40%;
//   height: 20px;
//   font-size: 10px;
//   font-weight: 500;
//   border-radius: 2px;
//   cursor: pointer;
//   padding: 4px 4px 4px 8px;
//   color: ${({ theme }) => theme.text0};
//   background: ${({ theme }) => theme.twitter};
// `

export default function ClosedQuoteDetails({
  quote,
  platformFee,
  buttonText,
  disableButton,
  expired,
  onClickButton,
  mobileVersion = false,
}: {
  quote: Quote
  platformFee: string
  buttonText?: string
  disableButton?: boolean
  expired?: boolean
  onClickButton?: (event: React.MouseEvent<HTMLDivElement>) => void
  mobileVersion: boolean
}): JSX.Element {
  const theme = useTheme()
  const { chainId } = useActiveConnectionDetails()
  const {
    id,
    positionType,
    marketId,
    openedPrice,
    quoteStatus,
    avgClosedPrice,
    createTimestamp,
    statusModifyTimestamp,
  } = quote
  const { symbol, name, asset, pricePrecision } = useMarket(marketId) || {}
  const { ask: askPrice, bid: bidPrice } = useBidAskPrice(name, pricePrecision)
  const collateralCurrency = getTokenWithFallbackChainId(COLLATERAL_TOKEN, chainId)
  const marketData = useMarketData(name)
  const quoteSize = useQuoteSize(quote)
  const leverage = useQuoteLeverage(quote)
  const lockedAmount = useLockedMargin(quote)
  const notionalValue = useNotionalValue(quoteSize, marketData?.markPrice || 0)
  const closePositionValue = toBN(avgClosedPrice).times(quoteSize)
  const [upnl, pnl] = useQuoteUpnlAndPnl(quote, marketData?.markPrice || 0, undefined, undefined, pricePrecision)
  const [expanded, setExpanded] = useState(!mobileVersion)
  const setQuoteDetail = useSetQuoteDetailCallback()

  // const [sharePositionModal, togglePositionModal] = useState(false)
  useEffect(() => {
    if (!mobileVersion) {
      setExpanded(true)
    }
  }, [mobileVersion])
  function getPnlData(value: string) {
    const valueBN = toBN(value)
    const valuePercent = valueBN.div(quoteSize).div(openedPrice).times(leverage).times(100).toFixed(2)
    if (!marketData?.markPrice) return ['-', '-', theme.text0]
    if (valueBN.isGreaterThan(0))
      return [`+ $${parseFloat(formatAmount(valueBN)).toFixed(2)}`, valuePercent, theme.green1]
    else if (valueBN.isLessThan(0))
      return [`- $${parseFloat(formatAmount(Math.abs(valueBN.toNumber()).toFixed(2)))}`, valuePercent, theme.red1]
    return [`$${parseFloat(formatAmount(valueBN)).toFixed(2)}`, valuePercent, theme.text1]
  }
  const { paidAmount, status } = useGetPaidAmount(id)
  const paidAmountBN = toBN(paidAmount).div(1e18)

  const [uPnl, upnlPercent, upnlColor] = getPnlData(upnl)
  const [PNL, PNLPercent, PNLColor] = getPnlData(pnl)

  const [showPositionSummaryCard, setShowPositionSummaryCard] = useState(false)

  return (
    <>
      <TopWrap
        onClick={() => {
          if (mobileVersion) {
            setExpanded(!expanded)
          } else {
            setQuoteDetail(quote)
          }
        }}
        mobileVersion={mobileVersion}
        expand={expanded}
      >
        <FlexColumn flex={buttonText ? 2 : 4} alignItems={'flex-start'}>
          <PositionInfoBox>
            <RowComponent width={'initial'}>
              <MarketName>
                <div>
                  {symbol}-{asset}
                </div>
                <div>-Q{id}</div>
              </MarketName>
              <Leverage>{leverage}x</Leverage>
              <QuoteData>
                {positionType}
                {positionType === PositionType.LONG ? (
                  <LongArrow width={16} height={12} color={theme.green1} />
                ) : (
                  <ShortArrow width={16} height={12} color={theme.red1} />
                )}
              </QuoteData>
            </RowComponent>

            {!mobileVersion && <PositionDetailsNavigator />}
          </PositionInfoBox>

          {mobileVersion &&
            (quoteStatus === QuoteStatus.CLOSED ? ( // fix this - write ueseMemo
              <RowPnl>
                <Label>PNL:</Label>
                <PositionPnl color={PNLColor}>{`${PNL} (${Math.abs(Number(PNLPercent))}%)`}</PositionPnl>
              </RowPnl>
            ) : (
              <RowPnl>
                <Label>uPNL:</Label>
                <PositionPnl color={upnlColor}>
                  {uPnl === '-' ? uPnl : `${uPnl} (${Math.abs(Number(upnlPercent))}%)`}
                </PositionPnl>
              </RowPnl>
            ))}
        </FlexColumn>
        {mobileVersion && (
          <FlexColumn flex={1} alignItems={'flex-end'}>
            {buttonText && (
              <PositionActionButton expired={expired} disabled={disableButton} onClick={onClickButton}>
                {buttonText}
              </PositionActionButton>
            )}
            <Chevron open={expanded} />
          </FlexColumn>
        )}
      </TopWrap>

      {expanded && (
        <Wrapper>
          <ClosePendingDetails quote={quote} />

          <DataWrap>
            {quoteStatus === QuoteStatus.CLOSED ? (
              <Row>
                <Label>PNL:</Label>
                <RowEnd>
                  <PositionPnl color={PNLColor}>{`${PNL} (${Math.abs(Number(PNLPercent)).toFixed(2)}%)`}</PositionPnl>
                </RowEnd>
              </Row>
            ) : (
              <Row>
                <Label>uPNL:</Label>
                <RowEnd>
                  <PositionPnl color={upnlColor}>
                    {uPnl === '-' ? uPnl : `${uPnl} (${Math.abs(Number(upnlPercent)).toFixed(2)}%)`}
                  </PositionPnl>
                </RowEnd>
              </Row>
            )}

            {quoteStatus === QuoteStatus.CLOSED ? (
              <Row>
                <Label>Position Value:</Label>
                <Value>
                  {closePositionValue.isEqualTo(0)
                    ? '-'
                    : `${formatCurrency(parseFloat(quote.quantity) * parseFloat(openedPrice))} ${
                        collateralCurrency?.symbol
                      }`}
                </Value>
              </Row>
            ) : (
              <Row>
                <Label>Position Value:</Label>
                <Value>
                  {toBN(notionalValue).isEqualTo(0)
                    ? '-'
                    : `${formatCurrency(notionalValue)}) ${collateralCurrency?.symbol}`}
                </Value>
              </Row>
            )}
            <Row>
              <Label>Position Size:</Label>
              <Value>{`${formatAmount(quoteSize)} ${symbol}`}</Value>
            </Row>

            <Row>
              <Label>Open Price</Label>
              <Value>{`${formatAmount(openedPrice)} ${collateralCurrency?.symbol}`}</Value>
            </Row>

            {quoteStatus === QuoteStatus.CLOSED ? (
              <Row>
                <Label>Closed Price:</Label>
                <Value>{`${formatAmount(avgClosedPrice)} ${collateralCurrency?.symbol}`}</Value>
              </Row>
            ) : (
              <>
                {positionType === PositionType.LONG ? (
                  <Row>
                    <Label>Bid Price:</Label>
                    <Value>
                      {/* `${formatCurrency(bidPrice)} ${collateralCurrency?.symbol}` */}
                      {bidPrice === '0' ? (
                        '-'
                      ) : (
                        <BlinkingPrice data={bidPrice} textSize={mobileVersion ? '12px' : '13px'} />
                      )}
                    </Value>
                  </Row>
                ) : (
                  <Row>
                    <Label>Ask Price:</Label>
                    <Value>
                      {/* `${formatCurrency(askPrice)} ${collateralCurrency?.symbol}` */}
                      {askPrice === '0' ? (
                        '-'
                      ) : (
                        <BlinkingPrice data={askPrice} textSize={mobileVersion ? '12px' : '13px'} />
                      )}
                    </Value>
                  </Row>
                )}
              </>
            )}
          </DataWrap>
          <ClosedAmountDetails quote={quote} />
          <ContentWrapper>
            <Row>
              <Label>Created Time:</Label>
              <Value>{formatTimestamp(createTimestamp * 1000)}</Value>
            </Row>
            {quoteStatus === QuoteStatus.CLOSED ? (
              <Row>
                <Label>Close Time:</Label>
                <Value>{formatTimestamp(statusModifyTimestamp * 1000)}</Value>
              </Row>
            ) : (
              <Row>
                <Label>Last modified Time:</Label>
                <Value>{formatTimestamp(statusModifyTimestamp * 1000)}</Value>
              </Row>
            )}
            <Row>
              <Label>Locked Amount:</Label>
              <Value>{`${formatAmount(lockedAmount, 6, true)} ${collateralCurrency?.symbol}`}</Value>
            </Row>
            <Row>
              <Label>Maintenance Margin (CVA)</Label>
              <Value>{`$${parseFloat(quote.CVA).toFixed(2)}`}</Value>
            </Row>
            <Row>
              <Label>Liquidation Fee</Label>
              <Value>{`$${parseFloat(quote.LF).toFixed(2)}`}</Value>
            </Row>
            <Row>
              <Label
                data-tip="If the funding rate is less than network gas fees, it will be accumulated for next funding."
                data-for="funding-gas-payment"
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>Paid Funding:</div>
                  <div>
                    <StyledInfoIcon />
                  </div>
                </div>
                <ToolTipBottomEnd id="funding-gas-payment" />
              </Label>
              <PositionPnl
                color={paidAmountBN.lt(0) ? theme.green1 : paidAmountBN.isEqualTo(0) ? theme.text0 : theme.red1}
              >
                {status === ApiState.LOADING ? (
                  <Loader />
                ) : (
                  `${formatAmount(
                    paidAmountBN.isGreaterThanOrEqualTo(1) || paidAmountBN.lt(0) ? paidAmountBN.abs() : '0'
                  )} ${collateralCurrency?.symbol}`
                )}
              </PositionPnl>
              <ToolTipBottomEnd id="paid-funding" />
            </Row>
            <Row>
              <Label>Platform Fee:</Label>
              <Value>{`${formatAmount(platformFee, 6, true)} ${collateralCurrency?.symbol}`}</Value>
            </Row>

            <MainButton
              style={{ marginTop: '16px', marginBottom: '5px' }}
              onClick={() => {
                setShowPositionSummaryCard(true)
              }}
            >
              <Share /> Share
            </MainButton>
            {showPositionSummaryCard && (
              <PositionSummaryCard quote={quote} open={showPositionSummaryCard} setOpen={setShowPositionSummaryCard} />
            )}
          </ContentWrapper>
        </Wrapper>
      )}
    </>
  )
}
