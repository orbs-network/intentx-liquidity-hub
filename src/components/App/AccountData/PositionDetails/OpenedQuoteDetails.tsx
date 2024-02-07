import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'

import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'

import { COLLATERAL_TOKEN } from 'constants/tokens'
import { Quote, QuoteStatus } from 'types/quote'
import { OrderType, PositionType } from 'types/trade'
import { formatAmount, formatCurrency, formatPrice, toBN } from 'utils/numbers'
import { formatTimestamp, getRemainingTime } from 'utils/time'
import { getTokenWithFallbackChainId } from 'utils/token'

import useBidAskPrice from 'hooks/useBidAskPrice'
import { useMarket } from 'hooks/useMarkets'
import {
  useClosingLastMarketPrice,
  useLiquidationPriceForPosition,
  useLockedMargin,
  useOpeningLastMarketPrice,
  useQuoteLeverage,
  useQuoteSize,
  useQuoteUpnlAndPnl,
} from 'hooks/useQuotes'
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
import { CooldownTimer, MainButton, PositionActionButton } from 'components/Button'
import { Loader, LongArrow, ShortArrow } from 'components/Icons'
import Share from 'components/Icons/Share'
import { Row as RowComponent, RowEnd } from 'components/Row'
import { ToolTipBottomEnd } from 'components/ToolTip'
import useFetchFundingRate, { shouldPayFundingRate, useGetPaidAmount } from 'hooks/useFundingRate'
import { useIsLaptop } from 'lib/hooks/useWindowSize'
import { FundingRateData } from 'state/hedger/types'
import { ApiState } from 'types/api'
import ClosePendingDetails from './ClosedSizeDetails/ClosePendingDetails'
import ClosedAmountDetails from './ClosedSizeDetails/ClosedAmountDetails'
import PositionSummaryCard from './PositionSummaryCard'

import { useSetQuoteDetailCallback } from 'state/quotes/hooks'
import useCurrentTimestamp from 'lib/hooks/useCurrentTimestamp'
import {
  TRANSACTION_FORCE_CANCEL_CLOSE_COOLDOWN_SECONDS,
  TRANSACTION_FORCE_CLOSE_COOLDOWN_SECONDS,
} from 'constants/misc'
import useCombinedForceClosePosition from 'callbacks/combined/useCombinedForceClosePosition'
import useCombinedForceCancelCloseRequest from 'callbacks/combined/useCombinedForceCancelCloseRequest'

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

export default function OpenedQuoteDetails({
  quote,
  platformFee,
  buttonText,
  disableButton,
  expired,
  onClickButton,
  mobileVersion = false,
  liquidatePending,
}: {
  quote: Quote
  platformFee: string
  buttonText?: string
  disableButton?: boolean
  expired?: boolean
  onClickButton?: (event: React.MouseEvent<HTMLDivElement>) => void
  mobileVersion: boolean
  liquidatePending?: boolean
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
    requestedCloseLimitPrice,
    orderType,
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
  const [expanded, setExpanded] = useState(true)
  const setQuoteDetail = useSetQuoteDetailCallback()
  const currentTimestamp = useCurrentTimestamp()
  const { callback: forceCloseCallback } = useCombinedForceClosePosition(quote)
  const { callback: forceCancelCloseCallback } = useCombinedForceCancelCloseRequest(quote)

  const isLaptop = useIsLaptop()

  useEffect(() => {
    if (!mobileVersion && !isLaptop) {
      setExpanded(true)
    }
  }, [mobileVersion, isLaptop])
  function getPnlData(value: string) {
    const valueBN = toBN(value)
    const valuePercent = valueBN.div(quoteSize).div(openedPrice).times(leverage).times(100).toFixed(2)
    if (!marketData?.markPrice) return ['-', '-', theme.text0]
    if (valueBN.isGreaterThan(0))
      return [`+ $${parseFloat(formatAmount(valueBN)).toFixed(2)}`, valuePercent, theme.green1]
    else if (valueBN.isLessThan(0))
      return [`- $${parseFloat(formatAmount(Math.abs(valueBN.toNumber()))).toFixed(2)}`, valuePercent, theme.red1]
    return [`$${parseFloat(formatAmount(valueBN)).toFixed(2)}`, valuePercent, theme.text1]
  }
  const [showPositionSummaryCard, setShowPositionSummaryCard] = useState(false)

  const [uPnl, upnlPercent, upnlColor] = getPnlData(upnl)
  const [PNL, PNLPercent, PNLColor] = getPnlData(pnl)
  const liquidationPrice = useLiquidationPriceForPosition(quote.marketId)
  const closeLastMarketPrice = useClosingLastMarketPrice(quote, name, pricePrecision)
  const openLastMarketPrice = useOpeningLastMarketPrice(quote, name, pricePrecision)

  const isForceCancelCloseAvailable = useMemo(() => {
    // Checking time conditions
    if (statusModifyTimestamp + TRANSACTION_FORCE_CANCEL_CLOSE_COOLDOWN_SECONDS > currentTimestamp) {
      return false
    }
  }, [statusModifyTimestamp, currentTimestamp])

  const quoteMarketPrice = useMemo(() => {
    if (quoteStatus === QuoteStatus.CLOSE_PENDING || quoteStatus === QuoteStatus.CANCEL_CLOSE_PENDING) {
      return closeLastMarketPrice
    } else if (
      quoteStatus === QuoteStatus.PENDING ||
      quoteStatus === QuoteStatus.LOCKED ||
      quoteStatus === QuoteStatus.CANCEL_PENDING
    ) {
      return openLastMarketPrice
    }
    return formatPrice(marketData?.markPrice ?? '0', pricePrecision)
  }, [closeLastMarketPrice, marketData?.markPrice, openLastMarketPrice, pricePrecision, quoteStatus])

  const isForceCloseAvailable = useMemo(() => {
    // Checking time conditions
    if (statusModifyTimestamp + TRANSACTION_FORCE_CLOSE_COOLDOWN_SECONDS > currentTimestamp) {
      return false
    }

    // Checking price conditions
    const requestedCloseLimitPriceBN = toBN(requestedCloseLimitPrice)
    const marketPrice = toBN(quoteMarketPrice)
    const bps = 0.0006

    if (positionType === PositionType.LONG) {
      // If its long, market price should be greater than close price plus 6 BPS
      if (marketPrice.isLessThan(requestedCloseLimitPriceBN.times(1 + bps))) {
        return false
      }
    } else {
      // If its short, market price should be less than close price minus 6 BPS
      if (marketPrice.isGreaterThan(requestedCloseLimitPriceBN.times(1 - bps))) {
        return false
      }
    }
  }, [statusModifyTimestamp, currentTimestamp, requestedCloseLimitPrice, quoteMarketPrice, positionType])

  const forceClose = useCallback(async () => {
    if (!forceCloseCallback || !isForceCloseAvailable) {
      return
    }

    try {
      const txHash = await forceCloseCallback()
    } catch (e) {
      console.error(e)
    }
  }, [forceCloseCallback, isForceCloseAvailable])

  const forceCancelClose = useCallback(async () => {
    if (!forceCancelCloseCallback || !isForceCancelCloseAvailable) {
      return
    }

    try {
      const txHash = await forceCancelCloseCallback()
    } catch (e) {
      console.error(e)
    }
  }, [forceCancelCloseCallback, isForceCancelCloseAvailable])

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
          </PositionInfoBox>

          {mobileVersion &&
            (quoteStatus === QuoteStatus.CLOSED ? (
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

        <FlexColumn flex={1} alignItems={'flex-end'}>
          {buttonText && (
            <PositionActionButton expired={expired} disabled={disableButton} onClick={onClickButton}>
              {buttonText}
            </PositionActionButton>
          )}
          {quoteStatus === QuoteStatus.CLOSE_PENDING && orderType === OrderType.LIMIT && !expired && (
            <div>
              <PositionActionButton
                expired={expired}
                liquidatePending={liquidatePending}
                disabled={disableButton || !isForceCloseAvailable}
                onClick={forceClose}
                height={'30px'}
                width={'110px'}
                hasCooldown={statusModifyTimestamp + TRANSACTION_FORCE_CLOSE_COOLDOWN_SECONDS > currentTimestamp}
              >
                <CooldownTimer>
                  {statusModifyTimestamp + TRANSACTION_FORCE_CLOSE_COOLDOWN_SECONDS - currentTimestamp}s
                </CooldownTimer>
                Force Close
              </PositionActionButton>
            </div>
          )}

          {quoteStatus === QuoteStatus.CANCEL_CLOSE_PENDING && (
            <PositionActionButton
              expired={expired}
              liquidatePending={liquidatePending}
              disabled={
                disableButton ||
                statusModifyTimestamp + TRANSACTION_FORCE_CANCEL_CLOSE_COOLDOWN_SECONDS > Math.floor(Date.now() / 1000)
              }
              onClick={forceCancelClose}
              height={'30px'}
              width={'110px'}
              hasCooldown={statusModifyTimestamp + TRANSACTION_FORCE_CANCEL_CLOSE_COOLDOWN_SECONDS > currentTimestamp}
            >
              <CooldownTimer>
                {statusModifyTimestamp + TRANSACTION_FORCE_CANCEL_CLOSE_COOLDOWN_SECONDS - currentTimestamp}s
              </CooldownTimer>
              Force Cancel Close
            </PositionActionButton>
          )}

          <Chevron open={expanded} />
        </FlexColumn>
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
                    : `${formatCurrency(closePositionValue, 2)} ${collateralCurrency?.symbol}`}
                </Value>
              </Row>
            ) : (
              <Row>
                <Label>Position Value:</Label>
                <Value>
                  {toBN(notionalValue).isEqualTo(0)
                    ? '-'
                    : `${formatPrice(notionalValue)} ${collateralCurrency?.symbol}`}
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
            {quoteStatus === QuoteStatus.OPENED && liquidationPrice && (
              <>
                <Row>
                  <Label>Estimated Liquidation Price:</Label>
                  <Value>{`${formatAmount(liquidationPrice, 4, true)} ${collateralCurrency?.symbol}`}</Value>
                </Row>
              </>
            )}

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
            <Row>
              <Label>{quoteStatus === QuoteStatus.CLOSED ? 'Close Time:' : 'Last modified Time:'}</Label>
              <Value>{formatTimestamp(statusModifyTimestamp * 1000)}</Value>
            </Row>

            <FundingRate
              notionalValue={notionalValue}
              name={name}
              quoteId={id}
              symbol={collateralCurrency?.symbol}
              positionType={positionType}
              quoteStatus={quoteStatus}
            />
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
              <Label>Platform Fee:</Label>
              <Value>{`${formatCurrency(platformFee)} ${collateralCurrency?.symbol}`}</Value>
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

function FundingRate({
  notionalValue,
  positionType,
  quoteId,
  name,
  symbol,
  quoteStatus,
}: {
  notionalValue: string
  positionType: PositionType
  quoteId: number
  quoteStatus: QuoteStatus
  name?: string
  symbol?: string
}) {
  const theme = useTheme()
  const fundingRates = useFetchFundingRate(quoteStatus !== QuoteStatus.CLOSED ? name : undefined)
  const fundingRate =
    name && fundingRates
      ? fundingRates
      : ({ next_funding_time: 0, next_funding_rate_long: '', next_funding_rate_short: '' } as FundingRateData)

  const { paidAmount, status } = useGetPaidAmount(quoteId)

  const { next_funding_rate_long, next_funding_rate_short, next_funding_time } = fundingRate
  const { diff, hours, minutes, seconds } = getRemainingTime(next_funding_time)
  const nextFunding = positionType === PositionType.LONG ? next_funding_rate_long : next_funding_rate_short
  const color = shouldPayFundingRate(positionType, next_funding_rate_long, next_funding_rate_short)
    ? theme.red1
    : theme.green1

  const paidAmountBN = toBN(paidAmount).div(1e18)

  return (
    <React.Fragment>
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

        <PositionPnl color={paidAmountBN.lt(0) ? theme.green1 : paidAmountBN.isEqualTo(0) ? theme.text0 : theme.red1}>
          {status === ApiState.LOADING ? (
            <Loader />
          ) : (
            `${formatAmount(
              paidAmountBN.isGreaterThanOrEqualTo(1) || paidAmountBN.lt(0) ? paidAmountBN.abs() : '0'
            )} ${symbol}`
          )}
        </PositionPnl>
        <ToolTipBottomEnd id="paid-funding" />
      </Row>
      {quoteStatus !== QuoteStatus.CLOSED && (
        <Row>
          <Label>Next Funding:</Label>
          <Value>
            <PositionPnl color={color}>
              {!toBN(nextFunding).isNaN() ? `${formatAmount(toBN(notionalValue).times(nextFunding).abs())} ` : '-'}
            </PositionPnl>
            {symbol} in
            {diff > 0 &&
              ` ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
                .toString()
                .padStart(2, '0')}`}
          </Value>
        </Row>
      )}
    </React.Fragment>
  )
}
