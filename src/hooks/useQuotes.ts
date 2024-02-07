import { useMemo } from 'react'

import { useSingleContractMultipleMethods } from 'lib/hooks/multicall'
import { Quote, QuoteStatus } from 'types/quote'
import { OrderType, PositionType } from 'types/trade'
import { BN_ZERO, fromWei, toBN } from 'utils/numbers'

import { usePartialFillNotifications } from 'state/notifications/hooks'
import { NotificationDetails, NotificationType } from 'state/notifications/types'
import {
  useAccountPartyAStat,
  useAccountUpnl,
  useActiveAccount,
  useActiveAccountAddress,
  useSlippageTolerance,
} from 'state/user/hooks'

import { useDiamondContract } from 'hooks/useContract'
import { useMarket } from 'hooks/useMarkets'
import useDebounce from 'lib/hooks/useDebounce'
import { useSupportedChainId } from 'lib/hooks/useSupportedChainId'
import { useMarketData, useMarkets, usePrices } from 'state/hedger/hooks'
import { useAllQuotes } from 'state/quotes/hooks'
import { ApiState } from 'types/api'
import { Market } from 'types/market'
import useAccountData from './useAccountData'
import useBidAskPrice from './useBidAskPrice'
import { useLockedValues, useNotionalValue } from './useTradePage'
import { MARKET_PRICE_COEFFICIENT } from 'config/index'

export function getPositionTypeByIndex(x: number): PositionType {
  return PositionType[Object.keys(PositionType).find((key, index) => index === x) as keyof typeof PositionType]
}

export function getQuoteStateByIndex(x: number): QuoteStatus {
  return QuoteStatus[Object.keys(QuoteStatus).find((key, index) => index === x) as keyof typeof QuoteStatus]
}

export function sortQuotesByModifyTimestamp(a: Quote, b: Quote) {
  return Number(b.statusModifyTimestamp) - Number(a.statusModifyTimestamp)
}

export function useGetPositions(): {
  positions: Quote[] | undefined
  loading: boolean
} {
  const isSupportedChainId = useSupportedChainId()
  const activeAccountAddress = useActiveAccountAddress()

  const { positionsCount } = useAccountPartyAStat(activeAccountAddress)

  const DiamondContract = useDiamondContract()

  const [start, size] = [0, positionsCount + 1]
  const calls = useMemo(
    () =>
      isSupportedChainId
        ? activeAccountAddress
          ? [{ functionName: 'getPartyAOpenPositions', callInputs: [activeAccountAddress, start, size] }]
          : []
        : [],
    [isSupportedChainId, activeAccountAddress, start, size]
  )

  //we need ~70K for each quote id
  const estimateGasRequirement = { gasRequired: size * 100_000 }
  const {
    data: quoteResults,
    isLoading: isQuoteLoading,
    isSuccess: isQuoteSuccess,
  } = useSingleContractMultipleMethods(DiamondContract, calls)

  const loading = useDebounce(isQuoteLoading, 1000)

  const quotesValue = useMemo(
    () => (isQuoteSuccess && quoteResults?.[0]?.status === 'success' ? (quoteResults[0].result as any[]) : []),
    [isQuoteSuccess, quoteResults]
  )

  const quotes: Quote[] = useMemo(() => {
    return (
      quotesValue
        ?.filter((quote: any) => quote[0]?.toString() !== '0') //remove garbage outputs
        .map((quote: any) => toQuote(quote))
        .sort(sortQuotesByModifyTimestamp) || []
    )
  }, [quotesValue])

  return useMemo(
    () => ({
      positions: quotes.length > 0 ? quotes : [],
      loading,
    }),
    [loading, quotes]
  )
}

export function useGetQuoteByIds(ids: number[]): {
  quotes: Quote[]
  loading: boolean
} {
  const DiamondContract = useDiamondContract()
  const isSupportedChainId = useSupportedChainId()

  const size = ids.length
  const calls = useMemo(
    () => (isSupportedChainId ? ids.map((id) => ({ functionName: 'getQuote', callInputs: [id] })) : []),
    [ids, isSupportedChainId]
  )

  //we need ~60K for each quote id
  const estimateGasRequirement = { gasRequired: size * 100_000 }

  const { data: quoteResults, isLoading, isSuccess } = useSingleContractMultipleMethods(DiamondContract, calls)
  const loading = useDebounce(isLoading, 1000)

  //TODO: is it correct?
  const quotesValue = useMemo(
    () =>
      isSuccess && quoteResults?.[0]?.status === 'success' && quoteResults !== undefined
        ? (quoteResults as any[])?.map((qs) => {
            return qs.result ? qs.result : null
          })
        : [],
    [isSuccess, quoteResults]
  )

  const quotes: Quote[] = useMemo(() => {
    return quotesValue
      .filter((quote: any) => quote)
      .filter((quote: any) => quote.toString() !== '0') //remove garbage outputs
      .map((quote: any) => toQuote(quote))
      .sort(sortQuotesByModifyTimestamp)
  }, [quotesValue])

  return useMemo(
    () => ({
      quotes,
      loading,
    }),
    [loading, quotes]
  )
}

export function useGetPendingIds(): {
  pendingIds: number[]
  loading: boolean
} {
  const isSupportedChainId = useSupportedChainId()
  const activeAccountAddress = useActiveAccountAddress()

  const DiamondContract = useDiamondContract()

  const calls = useMemo(
    () =>
      isSupportedChainId
        ? activeAccountAddress
          ? [{ functionName: 'getPartyAPendingQuotes', callInputs: [activeAccountAddress] }]
          : []
        : [],
    [activeAccountAddress, isSupportedChainId]
  )

  const { data: quoteResults, isLoading, isSuccess } = useSingleContractMultipleMethods(DiamondContract, calls)

  const loading = useDebounce(isLoading, 1000)

  const quoteIdsValue = useMemo(
    () => (isSuccess && quoteResults?.[0]?.status === 'success' ? (quoteResults[0].result as any[]) : []),
    [isSuccess, quoteResults]
  )

  const quoteIds: number[] = useMemo(() => {
    return quoteIdsValue
      .map((quoteId: any) => toBN(quoteId.toString()).toNumber())
      .sort((a: number, b: number) => b - a)
  }, [quoteIdsValue])

  return useMemo(
    () => ({
      pendingIds: quoteIds,
      loading,
    }),
    [loading, quoteIds]
  )
}

export function useQuoteUpnlAndPnl(
  quote: Quote,
  currentPrice: string | number,
  quantityToClose?: string | number,
  closedPrice?: string | number,
  precision?: number
): string[] {
  // return upnl and pnl [upnl , pnl]
  const {
    openedPrice,
    positionType,
    avgClosedPrice,
    closedAmount,
    quoteStatus,
    quantity,
    liquidateAmount,
    liquidatePrice,
  } = quote

  const pnl =
    toBN(closedPrice ?? avgClosedPrice)
      .minus(openedPrice)
      .times(quantityToClose ?? closedAmount)
      .times(positionType === PositionType.SHORT ? -1 : 1)
      .toString() || BN_ZERO.toString()

  const upnl =
    toBN(quantity)
      .minus(closedAmount)
      .times(toBN(currentPrice).minus(openedPrice))
      .times(positionType === PositionType.SHORT ? -1 : 1)
      .toString() || BN_ZERO.toString()

  if (
    quoteStatus === QuoteStatus.CLOSE_PENDING ||
    quoteStatus === QuoteStatus.CANCEL_CLOSE_PENDING ||
    quoteStatus === QuoteStatus.OPENED
  ) {
    return [upnl, pnl]
  } else if (quoteStatus === QuoteStatus.CLOSED) {
    return [BN_ZERO.toString(), pnl]
  } else if (quoteStatus === QuoteStatus.LIQUIDATED) {
    if (quantityToClose) return [BN_ZERO.toString(), pnl]

    const averagePrice = toBN(liquidatePrice)
      .times(liquidateAmount)
      .plus(toBN(avgClosedPrice).times(closedAmount))
      .div(quantity)
    return [
      BN_ZERO.toString(),
      toBN(averagePrice)
        .minus(openedPrice)
        .times(quantity)
        .times(positionType === PositionType.SHORT ? -1 : 1)
        .toString() || BN_ZERO.toString(),
    ]
  } else {
    return [BN_ZERO.toString(), BN_ZERO.toString()]
  }
}

export function useLiquidationPriceForPosition(marketId: number | undefined): string | null {
  const { accountAddress } = useActiveAccount() || {}
  const { lockedPartyAMM, pendingLockedCVA, pendingLockedLF, pendingLockedPartyAMM } =
    useAccountPartyAStat(accountAddress)
  const totalPendingLocked = toBN(pendingLockedCVA).plus(pendingLockedLF).plus(pendingLockedPartyAMM).toString()
  const { availableForOrder } = useAccountData()
  const allQuotes = useAllQuotes()
  const prices = usePrices()
  const markets = useMarkets()

  const accountUpnl = useAccountUpnl() // del webhook(?)

  const openQuotes = useMemo(() => {
    if (allQuotes.state !== ApiState.OK) return []
    return allQuotes.quotes.filter((quote) => quote.quoteStatus === QuoteStatus.OPENED)
  }, [allQuotes.quotes, allQuotes.state])

  const pairQuotes = useMemo(() => {
    if (openQuotes.length === 0) return null
    return openQuotes.filter((quote) => {
      return quote.marketId === marketId
    })
  }, [openQuotes, marketId])

  const totalAccountValue = useMemo(() => {
    // return toBN(lockedPartyAMM).plus(totalPendingLocked).plus(availableForOrder).toString()
    return toBN(accountUpnl.available_balance)
      .minus(accountUpnl.upnl)
      .minus(accountUpnl.pending_cva)
      .minus(accountUpnl.pending_lf)
      .toString()
  }, [accountUpnl.available_balance, accountUpnl.pending_cva, accountUpnl.pending_lf, accountUpnl.upnl])

  const pairPrice = useMemo(() => {
    const quoteMarket: Market | undefined = markets.find((market) => market.id === marketId)
    if (!quoteMarket) return null
    return prices[quoteMarket?.name]?.markPrice
  }, [markets, marketId, prices])

  const partialUpnl = useMemo(() => {
    if (openQuotes.length === 0) return toBN(0).toString()
    // for each quote we calculate the upnl and we sum them
    const totalUpnl = openQuotes.reduce(
      (acc, quote) => {
        const { openedPrice, positionType, quantity, closedAmount } = quote
        const quoteMarket: Market | undefined = markets.find((market) => market.id === quote.marketId)
        if (quote.marketId === marketId) return { upnl: acc.upnl, skip: false }

        if (!quoteMarket) return { upnl: acc.upnl, skip: true }
        const currentPrice = prices[quoteMarket?.name]?.markPrice

        if (!currentPrice || acc.skip) return { upnl: acc.upnl, skip: true }

        const upnl =
          toBN(quantity)
            .minus(closedAmount)
            .times(toBN(currentPrice).minus(openedPrice))
            .times(positionType === PositionType.SHORT ? -1 : 1)
            .toString() || BN_ZERO.toString()

        return { upnl: toBN(acc.upnl).plus(upnl).toString(), skip: false }
      },
      { upnl: BN_ZERO.toString(), skip: false }
    )

    return totalUpnl.skip ? null : totalUpnl.upnl
  }, [openQuotes, markets, marketId, prices])

  const liquidationPrice = useMemo(() => {
    if (!pairPrice) return null
    if (!accountUpnl) return null
    if (!pairQuotes) return null
    if (!partialUpnl) return null
    if (!totalAccountValue) return null

    let numerator = toBN(partialUpnl).plus(toBN(totalAccountValue).negated())
    let denominator = toBN(0)

    pairQuotes.forEach((position) => {
      numerator = numerator.plus(
        toBN(position.quantity)
          .times(position.openedPrice)
          .times(toBN(position.positionType === PositionType.SHORT ? -1 : 1))
      )
      denominator = denominator.plus(
        toBN(position.quantity).times(toBN(position.positionType === PositionType.SHORT ? -1 : 1))
      )
    })

    return !denominator.isZero() ? numerator.div(denominator).toString() : null
  }, [pairPrice, accountUpnl, pairQuotes, totalAccountValue, partialUpnl])

  // console.log('=================================position=================================================')
  // console.table(accountUpnl)
  // console.table({
  //   liquidationPrice,
  //   totalAccountValue,
  //   partialUpnl,
  //   // pairQuotes,
  //   availableForOrder,
  // })
  // console.log(pairQuotes)

  if (liquidationPrice && parseFloat(liquidationPrice) < 0) {
    return null
  }
  return liquidationPrice
}

// Get a liquidation price for a new position
export function useGetLiquidationPriceNew({ selectedMarket, openedPrice, positionType, quantity }): string | null {
  const { accountAddress } = useActiveAccount() || {}
  const { lockedPartyAMM, pendingLockedCVA, pendingLockedLF, pendingLockedPartyAMM } =
    useAccountPartyAStat(accountAddress)
  const totalPendingLocked = toBN(pendingLockedCVA).plus(pendingLockedLF).plus(pendingLockedPartyAMM).toString()
  const { availableForOrder } = useAccountData()
  const allQuotes = useAllQuotes()
  const prices = usePrices()
  const markets = useMarkets()

  const accountUpnl = useAccountUpnl()

  const notionalValue = useNotionalValue(quantity.toString(), openedPrice)
  const { cva, lf } = useLockedValues(notionalValue)

  const openQuotes = useMemo(() => {
    if (allQuotes.state !== ApiState.OK) return []
    return allQuotes.quotes.filter((quote) => quote.quoteStatus === QuoteStatus.OPENED)
  }, [allQuotes.quotes, allQuotes.state])

  const pairQuotes = useMemo(() => {
    if (!selectedMarket) return null
    if (openQuotes.length === 0) return []
    return openQuotes.filter((quote) => {
      return quote.marketId === selectedMarket.id
    })
  }, [openQuotes, selectedMarket])

  const totalAccountValue = useMemo(() => {
    // return toBN(lockedPartyAMM).plus(totalPendingLocked).plus(availableForOrder).toString()
    return toBN(accountUpnl.available_balance)
      .minus(accountUpnl.upnl)
      .minus(accountUpnl.pending_cva)
      .minus(accountUpnl.pending_lf)
      .minus(lf)
      .minus(cva)
      .toString()
  }, [accountUpnl.available_balance, accountUpnl.pending_cva, accountUpnl.pending_lf, accountUpnl.upnl, cva, lf])

  const pairPrice = useMemo(() => {
    if (!selectedMarket) return null
    const quoteMarket: Market | undefined = markets.find((market) => market.id === selectedMarket.id)
    if (!quoteMarket) return null
    return prices[quoteMarket?.name]?.markPrice
  }, [markets, selectedMarket, prices])

  const partialUpnl = useMemo(() => {
    if (!selectedMarket) return toBN(0).toString()
    if (openQuotes.length === 0) return toBN(0).toString()
    // for each quote we calculate the upnl and we sum them
    const totalUpnl = openQuotes.reduce(
      (acc, quote) => {
        const { openedPrice: _openedPrice, positionType: _positionType, quantity: _quantity, closedAmount } = quote
        const quoteMarket: Market | undefined = markets.find((market) => market.id === quote.marketId)
        if (quote.marketId === selectedMarket.id) return { upnl: acc.upnl, skip: false }

        if (!quoteMarket) return { upnl: acc.upnl, skip: true }
        const currentPrice = prices[quoteMarket?.name]?.markPrice

        if (!currentPrice || acc.skip) return { upnl: acc.upnl, skip: true }

        const upnl =
          toBN(_quantity)
            .minus(closedAmount)
            .times(toBN(currentPrice).minus(_openedPrice))
            .times(_positionType === PositionType.SHORT ? -1 : 1)
            .toString() || BN_ZERO.toString()

        return { upnl: toBN(acc.upnl).plus(upnl).toString(), skip: false }
      },
      { upnl: BN_ZERO.toString(), skip: false }
    )

    return totalUpnl.skip ? null : totalUpnl.upnl
  }, [openQuotes, markets, selectedMarket, prices])

  const liquidationPrice = useMemo(() => {
    if (!pairPrice) return null
    if (!accountUpnl) return null
    if (!pairQuotes) return null
    if (!partialUpnl) return null
    if (!totalAccountValue) return null

    let numerator = toBN(partialUpnl).plus(toBN(totalAccountValue).negated())
    let denominator = toBN(0)

    pairQuotes.forEach((position) => {
      numerator = numerator.plus(
        toBN(position.quantity)
          .times(position.openedPrice)
          .times(toBN(position.positionType === PositionType.SHORT ? -1 : 1))
      )
      denominator = denominator.plus(
        toBN(position.quantity).times(toBN(position.positionType === PositionType.SHORT ? -1 : 1))
      )
    })

    numerator = numerator.plus(
      toBN(quantity)
        .times(openedPrice)
        .times(toBN(positionType === PositionType.SHORT ? -1 : 1))
    )
    denominator = denominator.plus(toBN(quantity).times(toBN(positionType === PositionType.SHORT ? -1 : 1)))

    return !denominator.isZero() ? numerator.div(denominator).toString() : null
  }, [pairPrice, accountUpnl, pairQuotes, partialUpnl, totalAccountValue, quantity, openedPrice, positionType])

  if (liquidationPrice && parseFloat(liquidationPrice) < 0) {
    return null
  }

  if (liquidationPrice && isNaN(parseFloat(liquidationPrice))) {
    return null
  }

  // In long orders, liquidation price must be lower than the current price
  if (positionType === PositionType.LONG && liquidationPrice && parseFloat(liquidationPrice) > pairPrice) {
    return null
  }

  // In short orders, liquidation price must be higher than the current price
  if (positionType === PositionType.SHORT && liquidationPrice && parseFloat(liquidationPrice) < pairPrice) {
    return null
  }

  return liquidationPrice
}

export function useQuoteSize(quote: Quote): string {
  const { quoteStatus, quantity, closedAmount, marketId } = quote
  const { quantityPrecision } = useMarket(marketId) || {}
  return useMemo(() => {
    if (
      quoteStatus === QuoteStatus.CLOSED ||
      quoteStatus === QuoteStatus.LIQUIDATED ||
      quoteStatus === QuoteStatus.CANCELED
    )
      return quantity
    return toBN(quantity)
      .minus(closedAmount)
      .toFixed(quantityPrecision || 6)
  }, [closedAmount, quantity, quantityPrecision, quoteStatus])
}

export function useQuoteLeverage(quote: Quote): string {
  const {
    orderType,
    quantity,
    marketPrice,
    requestedOpenPrice,
    quoteStatus,
    openedPrice,
    initialCVA,
    initialLF,
    initialPartyAMM,
  } = quote

  const quoteSize = useQuoteSize(quote)
  const lockedMargin = useLockedMargin(quote)
  const initialLockedMargin = toBN(initialCVA).plus(initialPartyAMM).plus(initialLF).toString()

  switch (quoteStatus) {
    case QuoteStatus.OPENED:
    case QuoteStatus.CLOSE_PENDING:
    case QuoteStatus.CANCEL_CLOSE_PENDING:
      return toBN(quoteSize).times(openedPrice).div(lockedMargin).toFixed(0)

    case QuoteStatus.PENDING:
    case QuoteStatus.LOCKED:
    case QuoteStatus.CANCEL_PENDING:
    case QuoteStatus.CANCELED:
    case QuoteStatus.EXPIRED:
      return toBN(quantity).times(requestedOpenPrice).div(initialLockedMargin).toFixed(0)

    case QuoteStatus.CLOSED:
    case QuoteStatus.LIQUIDATED:
      return toBN(quantity).times(requestedOpenPrice).div(initialLockedMargin).toFixed(0)
  }
}

export function useQuoteFillAmount(quote: Quote): string | null {
  const { quoteStatus, orderType, id, statusModifyTimestamp } = quote
  const partiallyFillNotifications: NotificationDetails[] = usePartialFillNotifications()
  let foundNotification: NotificationDetails | undefined | null
  try {
    foundNotification = partiallyFillNotifications.find(
      (notification) =>
        notification.quoteId === id.toString() &&
        notification.notificationType === NotificationType.PARTIAL_FILL &&
        toBN(statusModifyTimestamp).lt(notification.modifyTime)
    )
  } catch (error) {
    foundNotification = null
  }

  return useMemo(() => {
    if (quoteStatus === QuoteStatus.CLOSE_PENDING || quoteStatus === QuoteStatus.CANCEL_CLOSE_PENDING) {
      return orderType === OrderType.LIMIT && foundNotification && foundNotification.filledAmountClose
        ? toBN(foundNotification.filledAmountClose).toString()
        : null
    } else if (quoteStatus === QuoteStatus.LOCKED || quoteStatus === QuoteStatus.PENDING) {
      return orderType === OrderType.LIMIT && foundNotification && foundNotification.filledAmountOpen
        ? toBN(foundNotification.filledAmountOpen).toString()
        : null
    } else {
      return null
    }
  }, [foundNotification, orderType, quoteStatus])
}

export function useClosingLastMarketPrice(quote: Quote | null, marketName?: string, precision?: number): string {
  // market price for closing position

  const { bid, ask } = useBidAskPrice(marketName, precision)
  const price = useMarketData(marketName)?.markPrice
  if (quote) {
    if (quote.positionType === PositionType.LONG) {
      return toBN(bid).isZero() && price ? price : ask
    } else {
      return toBN(ask).isZero() && price ? price : bid
    }
  }

  return '0'
}

export function useOpeningLastMarketPrice(quote: Quote | null, marketName?: string, precision?: number): string {
  // market price for opening position
  const { bid, ask } = useBidAskPrice(marketName, precision)
  const price = useMarketData(marketName)?.markPrice
  if (quote) {
    if (quote.positionType === PositionType.LONG) {
      return toBN(bid).isZero() && price ? price : ask
    } else {
      return toBN(ask).isZero() && price ? price : bid
    }
  }

  return '0'
}

function toQuote(quote: any) {
  return {
    id: Number(quote['id'].toString()),
    partyBsWhiteList: quote['partyBsWhiteList'],
    marketId: Number(quote['symbolId'].toString()),
    positionType: getPositionTypeByIndex(Number(quote['positionType'].toString())),
    orderType: Number(quote['orderType'].toString()) === 1 ? OrderType.MARKET : OrderType.LIMIT,

    // Price of quote which PartyB opened in 18 decimals
    openedPrice: fromWei(quote['openedPrice'].toString()),

    // Price of quote which PartyA requested in 18 decimals
    initialOpenedPrice: fromWei(quote['initialOpenedPrice'].toString()),
    requestedOpenPrice: fromWei(quote['requestedOpenPrice'].toString()),
    marketPrice: fromWei(quote['marketPrice'].toString()),

    // Quantity of quote which PartyA requested in 18 decimals
    quantity: fromWei(quote['quantity'].toString()),
    closedAmount: fromWei(quote['closedAmount'].toString()),

    initialCVA: fromWei(quote['initialLockedValues']['cva'].toString()),
    initialLF: fromWei(quote['initialLockedValues']['lf'].toString()),
    initialPartyAMM: fromWei(quote['initialLockedValues']['partyAmm'].toString()),
    initialPartyBMM: fromWei(quote['initialLockedValues']['partyBmm'].toString()),

    CVA: fromWei(quote['lockedValues']['cva'].toString()),
    LF: fromWei(quote['lockedValues']['lf'].toString()),
    partyAMM: fromWei(quote['lockedValues']['partyAmm'].toString()),
    partyBMM: fromWei(quote['lockedValues']['partyBmm'].toString()),

    maxFundingRate: fromWei(quote['maxFundingRate'].toString()),
    partyA: quote['partyA'].toString(),
    partyB: quote['partyB'].toString(),
    quoteStatus: getQuoteStateByIndex(Number(quote['quoteStatus'].toString())),
    avgClosedPrice: fromWei(quote['avgClosedPrice'].toString()),
    requestedCloseLimitPrice: fromWei(quote['requestedClosePrice'].toString()),
    quantityToClose: fromWei(quote['quantityToClose'].toString()),

    // handle partially open position
    parentId: quote['parentId'].toString(),
    createTimestamp: Number(quote['createTimestamp'].toString()),
    statusModifyTimestamp: Number(quote['statusModifyTimestamp'].toString()),
    lastFundingPaymentTimestamp: Number(quote['lastFundingPaymentTimestamp'].toString()),
    deadline: Number(quote['deadline'].toString()),
    tradingFee: Number(quote['tradingFee'].toString()),
  } as Quote
}

export function useSlippagedClosePrice(quote: Quote): string {
  const slippage = useSlippageTolerance()
  const marketPriceBN = toBN(quote.marketPrice)
  const market = useMarket(quote.marketId)

  const autoSlippage = market ? market.autoSlippage : MARKET_PRICE_COEFFICIENT

  if (slippage === 'auto') {
    return quote.positionType === PositionType.LONG
      ? marketPriceBN.div(autoSlippage).toString()
      : marketPriceBN.times(autoSlippage).toString()
  }
  const spSigned = quote.positionType === PositionType.LONG ? slippage : slippage * -1
  const slippageFactored = toBN(100 - spSigned).div(100)

  return marketPriceBN.times(slippageFactored).toString()
}

export function useLockedMargin(quote: Quote): string {
  return toBN(quote.CVA).plus(quote.partyAMM).plus(quote.LF).toString()
}
