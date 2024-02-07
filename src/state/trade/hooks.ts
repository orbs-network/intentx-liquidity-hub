import { useCallback, useMemo } from 'react'
import { toast } from 'react-hot-toast'

import { useAppDispatch, useAppSelector } from 'state'
import { InputField, OrderType, PositionType, TradeView } from 'types/trade'
import { BN_ZERO, formatPrice, toBN } from 'utils/numbers'
import { Market } from 'types/market'

import { useHedgerInfo, useMarketData } from 'state/hedger/hooks'
import {
  updateOrderType,
  updateLimitPrice,
  updateMarketId,
  updateInputField,
  updateTypedValue,
  updatePositionType,
  updateLockedPercentages,
  updateEstimatedSlippage,
  updateSelectedTab,
} from './actions'

import { useMarket } from 'hooks/useMarkets'
import { makeHttpRequest } from 'utils/http'
import { StateTabs } from 'components/App/UserPanel/OrdersTab'

export function useActiveMarketId(): number | undefined {
  const marketId = useAppSelector((state) => state.trade.marketId)
  return marketId
}

export function useActiveMarket(): Market | undefined {
  const marketId = useActiveMarketId()
  return useMarket(marketId)
}

export function useActiveMarketPrice(): string {
  const market = useActiveMarket()
  const marketData = useMarketData(market?.name)
  return useMemo(
    () => (!marketData ? BN_ZERO.toString() : formatPrice(marketData.markPrice, market?.pricePrecision)),
    [market?.pricePrecision, marketData]
  )
}

export function usePositionType() {
  const positionType = useAppSelector((state) => state.trade.positionType)
  return positionType
}

export function useOrderType() {
  const orderType = useAppSelector((state) => state.trade.orderType)
  return orderType
}

export function useSelectedTab() {
  const selectedTab = useAppSelector((state) => state.trade.selectedTab)
  return selectedTab
}

export function useTypedValue() {
  const typedValue = useAppSelector((state) => state.trade.typedValue)
  return typedValue
}
export function useInputField() {
  const inputField = useAppSelector((state) => state.trade.inputField)
  return inputField
}

export function useLimitPrice(): string {
  const limitPrice = useAppSelector((state) => state.trade.limitPrice)
  return limitPrice
}

export function useLockedPercentages(): {
  cva: string | undefined
  partyAmm: string | undefined
  partyBmm: string | undefined
  lf: string | undefined
} {
  const cva = useAppSelector((state) => state.trade.cva)
  const partyAmm = useAppSelector((state) => state.trade.partyAmm)
  const partyBmm = useAppSelector((state) => state.trade.partyBmm)
  const lf = useAppSelector((state) => state.trade.lf)
  return useMemo(
    () => ({
      cva,
      partyAmm,
      partyBmm,
      lf,
    }),
    [cva, lf, partyAmm, partyBmm]
  )
}

export function useSetOrderType(): (orderType: OrderType) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (orderType: OrderType) => {
      dispatch(updateOrderType(orderType))
    },
    [dispatch]
  )
}
export function useSetInputField(): (inputField: InputField) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (inputField: InputField) => {
      dispatch(updateInputField(inputField))
    },
    [dispatch]
  )
}

export function useSetPositionType() {
  const dispatch = useAppDispatch()
  return useCallback(
    (type: PositionType) => {
      dispatch(updatePositionType(type))
    },
    [dispatch]
  )
}

export function useSetLimitPrice() {
  const dispatch = useAppDispatch()
  return useCallback(
    (price: string) => {
      dispatch(updateLimitPrice(price))
    },
    [dispatch]
  )
}

export function useSetTypedValue() {
  const dispatch = useAppDispatch()
  return useCallback(
    (value: string, inputField: InputField) => {
      dispatch(updateInputField(inputField))
      dispatch(updateTypedValue(value))
    },
    [dispatch]
  )
}

export function useSetSelectedTab() {
  const dispatch = useAppDispatch()
  return useCallback(
    (tab: StateTabs) => {
      dispatch(updateSelectedTab(tab))
    },
    [dispatch]
  )
}

export function useSetMarketId(): (id: number) => void {
  const dispatch = useAppDispatch()
  const marketId = useAppSelector((state) => state.trade.marketId)

  return useCallback(
    (id: number) => {
      if (marketId !== id) {
        dispatch(updateMarketId({ id }))
      }
    },
    [dispatch, marketId]
  )
}

export function useGetLockedPercentages(leverage: number): (options: { [x: string]: any }) => Promise<any> {
  const market = useActiveMarket()
  const dispatch = useAppDispatch()
  const { baseUrl } = useHedgerInfo() || {}

  return useCallback(
    async (options: { [x: string]: any }) => {
      try {
        if (!baseUrl || !market) throw new Error('missing parameters')
        const { href: url } = new URL(`/get_locked_params/${market.name}?leverage=${leverage}`, baseUrl)

        const response: { cva: string; partyAmm: string; partyBmm: string; lf: string; leverage: string } | null =
          await makeHttpRequest(url, options)
        if (response) dispatch(updateLockedPercentages({ ...response }))
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log(error.message)
        } else {
          toast.error('Unable to fetch locked params')
        }
      }
    },
    [baseUrl, dispatch, leverage, market]
  )
}

export function useSetEstimatedSlippageValue() {
  const dispatch = useAppDispatch()
  return useCallback(
    (value: number) => {
      dispatch(updateEstimatedSlippage(value))
    },
    [dispatch]
  )
}

export function useEstimatedSlippage() {
  const estimatedSlippage = useAppSelector((state) => state.trade.estimatedSlippage)
  return estimatedSlippage
}
