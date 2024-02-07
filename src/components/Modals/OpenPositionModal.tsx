import { useCallback, useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'

import { DEFAULT_PRECISION, MARKET_ORDER_DEADLINE } from 'config'
import { COLLATERAL_TOKEN } from 'constants/tokens'
import { InputField, OrderType, PositionType } from 'types/trade'
import { BN_ZERO, RoundMode, formatAmount, formatDollarAmount, formatPrice, toBN } from 'utils/numbers'
import { titleCase } from 'utils/string'
import { getTokenWithFallbackChainId } from 'utils/token'

import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useModalOpen, useToggleOpenPositionModal } from 'state/application/hooks'
import { ApplicationConnectionStatus, ApplicationModal } from 'state/application/reducer'
import {
  useActiveMarket,
  useEstimatedSlippage,
  useOrderType,
  usePositionType,
  useSetTypedValue,
} from 'state/trade/hooks'
import { useIsHavePendingTransaction } from 'state/transactions/hooks'
import { useFillOrKillMode, useLeverage, useSlippageTolerance } from 'state/user/hooks'

import useTradePage, { useLockedValues, useNotionalValue } from 'hooks/useTradePage'

import { useCombinedTrade } from 'callbacks/combined/useCombinedTrade'
import { MainButton, PrimaryButton } from 'components/Button'
import ErrorButton from 'components/Button/ErrorButton'
import Column from 'components/Column'
import { DotFlashing, Loader, LongArrow, ShortArrow } from 'components/Icons'
import InfoItem from 'components/InfoItem'
import { DisplayLabel } from 'components/InputLabel'
import { Modal, ModalHeader } from 'components/Modal'
import { RowCenter } from 'components/Row'
import useBidAskPrice from 'hooks/useBidAskPrice'
import { useGetLiquidationPriceNew } from 'hooks/useQuotes'

const Wrapper = styled(Column)`
  gap: 16px;
  padding: 12px;
  overflow-y: scroll;
  height: auto;
`

const AwaitingWrapper = styled(Column)`
  padding: 24px 0;
`

const SummaryWrap = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text2};
  margin: 20px auto;
  max-width: 350px;
  text-align: center;
`

const ConfirmWrap = styled(SummaryWrap)`
  font-size: 14px;
  margin: 0;
  margin-top: 20px;
`

const LabelsWrapper = styled(Column)`
  gap: 12px;
`

const OpenPositionButton = styled(PrimaryButton)<{ longOrShort: boolean }>`
  background: ${({ longOrShort, theme }) => (longOrShort ? theme.hoverLong : theme.hoverShort)};

  &:focus,
  &:hover {
    background: ${({ longOrShort, theme }) => (longOrShort ? theme.hoverLong : theme.hoverShort)};
  }
`

const Data = styled(RowCenter)`
  width: 100%;
  padding: 5px;
  font-size: 12px;
  margin-left: 10px;
  color: ${({ theme }) => theme.text1};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 16px;
  `};
`

const Separator = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.border2};
`

const IconWrap = styled.div`
  position: relative;
`

const Info = styled.div`
  background: rgba(23, 26, 31, 0.7);
  padding: 10px;
  border-radius: 5px;
`

const SeparatorInfo = styled.div`
  width: 100%;
  height: 2px;
  border-radius: 4px;
  border: 1px solid;
  border-image-source: linear-gradient(90deg, rgba(188, 39, 56, 0.5) 0%, rgba(110, 22, 32, 0.5) 128.07%);
  background: linear-gradient(90deg, rgba(188, 39, 56, 0.5) 0%, rgba(110, 22, 32, 0.5) 128.07%);
`

export default function OpenPositionModal({ data, summary }: { summary?: string; data?: string }) {
  const theme = useTheme()
  const setTypedValue = useSetTypedValue()
  const { chainId, applicationConnectionStatus } = useActiveConnectionDetails()
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const isPendingTxs = useIsHavePendingTransaction()

  const orderType = useOrderType()
  const market = useActiveMarket()
  const userLeverage = useLeverage()
  const positionType = usePositionType()
  const toggleModal = useToggleOpenPositionModal()
  const modalOpen = useModalOpen(ApplicationModal.OPEN_POSITION)
  const collateralCurrency = getTokenWithFallbackChainId(COLLATERAL_TOKEN, chainId)
  const slippage = useSlippageTolerance()
  const estimatedSlippage = useEstimatedSlippage()

  const { ask: askPrice, bid: bidPrice } = useBidAskPrice(market?.name, market?.pricePrecision)

  const { price, formattedAmounts, state } = useTradePage()

  const [symbol, asset, pricePrecision] = useMemo(
    () => (market ? [market.symbol, market.asset, market.pricePrecision] : ['', '', DEFAULT_PRECISION]),
    [market]
  )

  const quantityAsset = useMemo(
    () => (toBN(formattedAmounts[1]).isNaN() ? BN_ZERO : toBN(formattedAmounts[1])),
    [formattedAmounts]
  )

  const notionalValue = useNotionalValue(quantityAsset.toString(), price)
  const { cva, lf } = useLockedValues(notionalValue)

  const { total: lockedValue } = useLockedValues(notionalValue)
  const tradingFee = useMemo(() => {
    const notionalValueBN = toBN(notionalValue)
    if (!market || notionalValueBN.isNaN()) return '-'
    return market.tradingFee
      ? `${formatPrice(notionalValueBN.times(market.tradingFee).toNumber(), 2, true)} ${collateralCurrency?.symbol}`
      : 'ss-'
  }, [market, notionalValue, collateralCurrency?.symbol])

  // const { callback: tradeCallback, error: tradeCallbackError } = useTradeCallback()
  const { callback: tradeCallback } = useCombinedTrade()

  const liquidationPrice = useGetLiquidationPriceNew({
    selectedMarket: market,
    openedPrice: price,
    positionType: positionType,
    quantity: quantityAsset.toString(),
  })

  const onTrade = useCallback(async () => {
    if (!tradeCallback) return

    let error = ''
    try {
      setAwaitingConfirmation(true)
      await tradeCallback()
      setAwaitingConfirmation(false)
      toggleModal()
    } catch (e) {
      if (e instanceof Error) {
        error = e.message
      } else {
        console.debug(e)

        error = 'An unknown error occurred.'
      }
    }
    if (error) console.log(error)
    toggleModal()
    // setLimitPrice('')
    setTypedValue('', InputField.PRICE)
    setAwaitingConfirmation(false)
  }, [toggleModal, tradeCallback])

  function getActionButtons(): JSX.Element | null {
    if (isPendingTxs) {
      return (
        <MainButton long={positionType === PositionType.LONG} disabled>
          Transacting <DotFlashing />
        </MainButton>
      )
    }

    if (state) {
      return <ErrorButton state={state} disabled={true} exclamationMark={true} />
    }
    {
      /* longOrShort={positionType === PositionType.LONG} */
    }
    return (
      <MainButton long={positionType === PositionType.LONG} onClick={() => onTrade()}>
        {`${titleCase(positionType)} ${symbol}`}
        <IconWrap>
          {positionType === PositionType.LONG ? (
            <LongArrow width={19} height={11} color={theme.green1} style={{ marginLeft: '8px' }} />
          ) : (
            <ShortArrow width={19} height={11} color={theme.red1} style={{ marginLeft: '8px' }} />
          )}
        </IconWrap>
      </MainButton>
    )
  }

  const fillOrKill = useFillOrKillMode()

  const info = useMemo(() => {
    const lockedValueBN = toBN(lockedValue)
    const askPriceBN = toBN(askPrice)
    const bidPriceBN = toBN(bidPrice)

    return [
      {
        title: 'Locked Value:',
        value: `${lockedValueBN.isNaN() ? '0' : lockedValueBN.toFixed(pricePrecision)} ${collateralCurrency?.symbol}`,
      },
      { title: 'Leverage:', value: `${userLeverage} X` },
      {
        title: 'Open Price:',
        value: `${price === '' ? '-' : orderType === OrderType.MARKET ? 'Market' : price}`,
        valueColor: theme.primaryBlue,
      },
      { title: 'Platform Fee:', value: tradingFee },
      {
        title: 'Order Expire Time:',
        value: `${orderType === OrderType.MARKET && fillOrKill ? `${MARKET_ORDER_DEADLINE} seconds` : 'Unlimited'}`,
      },
      {
        title: 'Maintenance Margin (CVA):',
        value: `${!toBN(cva).isNaN() && !toBN(lf).isNaN() ? formatAmount(toBN(cva).plus(lf)) : '0'} ${
          collateralCurrency?.symbol
        }`,
      },
      {
        title: 'Estimated Liquidation Price:',
        value: liquidationPrice ? `${formatAmount(liquidationPrice, pricePrecision)}` : '-',
      },
      orderType === OrderType.MARKET && {
        title: 'Selected Slippage:',
        value: `${slippage === 'auto' ? 'Auto' : `${formatPrice(slippage, 2, true, RoundMode.ROUND_UP)}%`}`,
      },
      /* orderType === OrderType.MARKET && {
        title: 'Estimated Slippage:',
        value: `${`${formatPrice(estimatedSlippage, 2, true)}%`}`,
      },  */
      positionType === PositionType.LONG && {
        title: 'Ask Price:',
        value: `${askPrice === '' ? '-' : askPrice}`,
      },
      positionType === PositionType.SHORT && {
        title: 'Bid Price:',
        value: `${bidPrice === '' ? '-' : bidPrice}`,
      },
    ]
  }, [
    lockedValue,
    askPrice,
    bidPrice,
    pricePrecision,
    collateralCurrency?.symbol,
    userLeverage,
    price,
    orderType,
    theme.primaryBlue,
    tradingFee,
    fillOrKill,
    cva,
    lf,
    liquidationPrice,
    slippage,
    positionType,
  ])

  const infoLengh = info.length

  return (
    <Modal isOpen={modalOpen} onBackgroundClick={toggleModal} onEscapeKeydown={toggleModal}>
      <ModalHeader onClose={toggleModal} title={`${positionType} ${symbol}`} positionType={positionType} />
      {awaitingConfirmation ? (
        <AwaitingWrapper>
          <RowCenter>
            <Loader />
          </RowCenter>

          <RowCenter>
            <SummaryWrap>{summary}</SummaryWrap>
          </RowCenter>

          <RowCenter>
            <ConfirmWrap>
              {applicationConnectionStatus === ApplicationConnectionStatus.ACCOUNT_ABSTRACTION
                ? 'Creating operation'
                : 'Confirm this transaction in your wallet'}
            </ConfirmWrap>
          </RowCenter>
        </AwaitingWrapper>
      ) : (
        <Wrapper>
          <LabelsWrapper>
            <div>
              <div>Position Value</div>
              <DisplayLabel
                label="Position Value"
                value={toBN(lockedValue).toFixed(pricePrecision)}
                leverage={userLeverage}
                symbol={collateralCurrency?.symbol}
                precision={pricePrecision}
              />
            </div>
            <div>
              <div>Receive</div>
              <DisplayLabel label="Receive" value={formattedAmounts[1]} symbol={symbol} />
            </div>
          </LabelsWrapper>
          <Info>
            {info.map((info, index, data) => {
              return (
                <>
                  <InfoItem label={info.title} amount={info.value} valueColor={info?.valueColor} key={index} />
                  {index != data.length - 1 && <SeparatorInfo />}
                </>
              )
            })}
          </Info>
          {data && (
            <>
              <Separator />
              <Data>{data}</Data>
            </>
          )}
          {typeof slippage === 'number' && estimatedSlippage !== 0 && estimatedSlippage > slippage && (
            <div
              style={{
                fontSize: 12,
                color: '#bf1e31',
              }}
            >
              Your Selected Slippage is less than the Estimated Slippage, your transaction might not go through, please
              consider modifying your slippage.
            </div>
          )}
          {!awaitingConfirmation && getActionButtons()}
        </Wrapper>
      )}
    </Modal>
  )
}
