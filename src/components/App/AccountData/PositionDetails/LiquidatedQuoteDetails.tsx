import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'

import { Loader } from 'components/Icons'
import { Quote } from 'types/quote'
import { PositionType } from 'types/trade'
import { formatAmount, formatCurrency, toBN } from 'utils/numbers'
import { formatTimestamp } from 'utils/time'

import { useMarketData } from 'state/hedger/hooks'

import { useMarket } from 'hooks/useMarkets'
import { useLockedMargin, useQuoteLeverage, useQuoteSize, useQuoteUpnlAndPnl } from 'hooks/useQuotes'

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
import { LongArrow, ShortArrow } from 'components/Icons'
import { Row as RowComponent, RowEnd } from 'components/Row'
import { ToolTipBottomEnd } from 'components/ToolTip'
import { COLLATERAL_TOKEN } from 'constants/tokens'
import { useGetPaidAmount } from 'hooks/useFundingRate'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { ApiState } from 'types/api'
import { getTokenWithFallbackChainId } from 'utils/token'
import ClosedAmountDetails from './ClosedSizeDetails/ClosedAmountDetails'
import PositionDetailsNavigator from './PositionDetailsNavigator'

const LiquidateWrap = styled(DataWrap)`
  background: ${({ theme }) => theme.bgLoose};
`

const LiquidateLabel = styled(Label)`
  color: ${({ theme }) => theme.red1};
`

const LiquidatedAccountContainer = styled.div`
  color: ${({ theme }) => theme.red1};
  gap: 20px;
  display: flex;
  justify-content: center;
  text-align: center;
`

export default function LiquidatedQuoteDetails({
  quote,
  platformFee,
  mobileVersion = false,
}: {
  quote: Quote
  platformFee: string
  mobileVersion: boolean
}): JSX.Element {
  const theme = useTheme()
  const {
    id,
    positionType,
    marketId,
    createTimestamp,
    statusModifyTimestamp,
    liquidateAmount,
    liquidatePrice,
    openedPrice,
  } = quote
  const { symbol, name, asset } = useMarket(marketId) || {}
  const marketData = useMarketData(name)

  const quoteSize = useQuoteSize(quote)
  const leverage = useQuoteLeverage(quote)
  const lockedAmount = useLockedMargin(quote)
  const [, pnl] = useQuoteUpnlAndPnl(quote, marketData?.markPrice || 0)
  const [expanded, setExpanded] = useState(!mobileVersion)

  const { chainId } = useActiveConnectionDetails()
  const collateralCurrency = getTokenWithFallbackChainId(COLLATERAL_TOKEN, chainId)

  const { paidAmount, status } = useGetPaidAmount(id)
  const paidAmountBN = toBN(paidAmount).div(1e18)

  

  useEffect(() => {
    if (!mobileVersion) {
      setExpanded(true)
    }
  }, [mobileVersion])
  function getPnlData(value: string) {
    const valueBN = toBN(value)
    const valuePercent = valueBN.div(quoteSize).div(openedPrice).times(leverage).times(100).toFixed(2)

    if (valueBN.isGreaterThan(0)) return [`+ $${formatAmount(valueBN)}`, valuePercent, theme.green1]
    else if (valueBN.isLessThan(0))
      return [`- $${formatAmount(Math.abs(valueBN.toNumber()))}`, valuePercent, theme.red1]
    return [`$${formatAmount(valueBN)}`, valuePercent, theme.text1]
  }

  const [PNL, PNLPercent, PNLColor] = getPnlData(pnl)

  const lockedMargin = useLockedMargin(quote)

  return (
    <>
      <TopWrap mobileVersion={mobileVersion}>
        <FlexColumn flex={4} alignItems={'flex-start'}>
          <PositionInfoBox>
            <LiquidatedAccountContainer>
              <div>Account Liquidated</div>
              <div>- ${formatCurrency(lockedMargin)}</div>
            </LiquidatedAccountContainer>
          </PositionInfoBox>
        </FlexColumn>
      </TopWrap>
      <TopWrap
        onClick={() => {
          if (mobileVersion) {
            setExpanded(!expanded)
          }
        }}
        mobileVersion={mobileVersion}
        expand={expanded}
      >
        <FlexColumn flex={4} alignItems={'flex-start'}>
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

          {mobileVersion && (
            <RowPnl>
              <Label>PNL:</Label>
              <PositionPnl color={PNLColor}>{`${PNL} (${Math.abs(Number(PNLPercent)).toFixed(2)}%)`}</PositionPnl>
            </RowPnl>
          )}
        </FlexColumn>
        {mobileVersion && (
          <FlexColumn flex={1} alignItems={'flex-end'}>
            <Chevron open={expanded} />
          </FlexColumn>
        )}
      </TopWrap>
      {expanded && (
        <Wrapper>
          <LiquidateWrap>
            <Row>
              <LiquidateLabel>PNL:</LiquidateLabel>
              <RowEnd>
                <PositionPnl color={PNLColor}>{`${PNL} (${Math.abs(Number(PNLPercent)).toFixed(2)}%)`}</PositionPnl>
              </RowEnd>
            </Row>
            <Row>
              <LiquidateLabel>Liquidated Size:</LiquidateLabel>
              <Value>{`${formatAmount(liquidateAmount, 6, true)} ${symbol}`}</Value>
            </Row>
            <Row>
              <LiquidateLabel>Liquidated Price:</LiquidateLabel>
              <Value>{`${formatAmount(liquidatePrice, 6, true)} ${asset}`}</Value>
            </Row>
          </LiquidateWrap>
          <ClosedAmountDetails quote={quote} />
          <ContentWrapper>
            <Row>
              <Label>Liquidated Time:</Label>
              <Value>{formatTimestamp(statusModifyTimestamp * 1000)}</Value>
            </Row>
            <Row>
              <Label>Created Time:</Label>
              <Value>{formatTimestamp(createTimestamp * 1000)}</Value>
            </Row>

            <Row>
              <Label>Maintenance Margin (CVA)</Label>
              <Value>${parseFloat(quote.CVA).toFixed(2)}</Value>
            </Row>
            <Row>
              <Label>Liquidation Fee:</Label>
              <Value>${parseFloat(quote.LF).toFixed(2)}</Value>
            </Row>

            <Row>
              <Label>Locked Amount:</Label>
              <Value>{`${formatAmount(lockedAmount, 6, true)} ${asset}`}</Value>
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
            </Row>
            <Row>
              <Label>Platform Fee:</Label>
              <Value>{`${formatCurrency(platformFee)} ${asset}`}</Value>
            </Row>
          </ContentWrapper>
        </Wrapper>
      )}
    </>
  )
}
