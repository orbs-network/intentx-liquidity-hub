import { useEffect, useMemo, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { JsonValue } from 'react-use-websocket/dist/lib/types'

import useIsWindowVisible from 'lib/hooks/useIsWindowVisible'

import { ConnectionStatus } from 'state/user/types'
import { FundingRateData, FundingRateMap } from 'state/hedger/types'
import { useFundingRateData, useHedgerInfo } from 'state/hedger/hooks'
import { ApiState } from 'types/api'
import { AppThunkDispatch, useAppDispatch } from 'state'
import { getPaidAmount } from 'state/hedger/thunks'

import { useActiveMarket } from 'state/trade/hooks'
import { PositionType } from 'types/trade'
import { toBN } from 'utils/numbers'

export default function useFetchFundingRate(name?: string) {
  const { webSocketFundingRateUrl } = useHedgerInfo() || {}
  const windowVisible = useIsWindowVisible()
  const [fundingRate, setFundingRate] = useState({} as FundingRateData)
  const activeMarket = useActiveMarket()
  const fundingRateData = useFundingRateData(name)

  const url =
    !name || webSocketFundingRateUrl === '' || !webSocketFundingRateUrl || activeMarket?.name === name
      ? null
      : webSocketFundingRateUrl

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url, {
    reconnectAttempts: 10,
    shouldReconnect: () => true,
    onOpen: () => {
      console.log('Funding Rate established.')
    },
    onClose: () => console.log('Funding Rate closed'),
    onError: (e) => console.log('Funding Rate has error ', e),
  })

  const connectionStatus = useMemo(() => {
    if (readyState === ReadyState.OPEN) {
      return ConnectionStatus.OPEN
    } else {
      return ConnectionStatus.CLOSED
    }
  }, [readyState])

  useEffect(() => {
    if (connectionStatus === ConnectionStatus.OPEN) {
      const json = {
        symbols: windowVisible ? [name] : [],
      }
      sendJsonMessage(json as unknown as JsonValue)
    }
  }, [connectionStatus, name, sendJsonMessage, windowVisible])

  useEffect(() => {
    try {
      const lastMessage = lastJsonMessage as any
      //don't update anything if user is idle instead of updating to empty prices
      if (!windowVisible) return
      const response = (lastMessage ?? {}) as FundingRateMap

      if (Object.values(response).length) {
        setFundingRate(Object.values(response)[0])
      }
    } catch (err) {
      console.log({ err })
    }
  }, [lastJsonMessage, connectionStatus, windowVisible])

  if (activeMarket && activeMarket.name === name && fundingRateData) return fundingRateData
  return fundingRate
}

export function useGetPaidAmount(quoteId: number) {
  const [paidAmount, setPaidAmount] = useState('')
  const [status, setStatus] = useState<ApiState>(ApiState.OK)

  const dispatch: AppThunkDispatch = useAppDispatch()

  useEffect(() => {
    setStatus(ApiState.LOADING)
    dispatch(getPaidAmount({ quoteId }))
      .unwrap()
      .then((res) => {
        setPaidAmount(res.fee)
        setStatus(ApiState.OK)
      })
      .catch(() => {
        setPaidAmount('')
        setStatus(ApiState.ERROR)
      })
  }, [dispatch, quoteId])

  return { paidAmount, status }
}

export function shouldPayFundingRate(positionType: PositionType, longRate: string, shortRate: string) {
  if (positionType === PositionType.LONG) {
    return toBN(longRate).isGreaterThan(0) ? false : true
  } else {
    return toBN(shortRate).isLessThan(0) ? true : false
  }
}
