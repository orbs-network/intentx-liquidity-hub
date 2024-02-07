import { useCallback, useMemo } from 'react'

import { DEFAULT_PRECISION, LIMIT_ORDER_DEADLINE, MARKET_ORDER_DEADLINE, MARKET_PRICE_COEFFICIENT } from 'config'
import { Quote } from 'types/quote'
import { OrderType, PositionType, TradeState } from 'types/trade'
import { BN_ZERO, RoundMode, formatPrice, fromWei, removeTrailingZeros, toBN, toWei, toWeiBN } from 'utils/numbers'

import { useMarketData } from 'state/hedger/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TradeTransactionInfo, TransactionType } from 'state/transactions/types'
import { useActiveAccountAddress, useFillOrKillMode, useSlippageTolerance } from 'state/user/hooks'

import { useDiamondContract, useMultiAccountContract } from 'hooks/useContract'
import { useMarket } from 'hooks/useMarkets'

import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import useCombinedTransaction from 'hooks/useCombinedTransaction'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { Address, encodeFunctionData } from 'viem'

export default function useCombinedClosePosition(
  quote: Quote | null,
  orderType: OrderType,
  typedPrice: string,
  quantityToClose: string
) {
  const { account, chainId } = useActiveConnectionDetails()
  const addTransaction = useTransactionAdder()
  const addRecentTransaction = useAddRecentTransaction()

  const diamondContract = useDiamondContract()
  const multiAccountContract = useMultiAccountContract()

  const activeAccountAddress = useActiveAccountAddress()

  const market = useMarket(quote?.marketId)
  const marketData = useMarketData(market?.name)
  const positionType = quote?.positionType
  const pricePrecision = useMemo(() => market?.pricePrecision ?? DEFAULT_PRECISION, [market])

  const slippage = useSlippageTolerance()
  const autoSlippage = market ? market.autoSlippage : MARKET_PRICE_COEFFICIENT

  const fillOrKillMode = useFillOrKillMode()

  const markPriceBN = useMemo(() => {
    if (!marketData || !marketData.markPrice) return BN_ZERO
    return toWeiBN(toBN(marketData.markPrice).toFixed(pricePrecision, RoundMode.ROUND_DOWN))
  }, [marketData, pricePrecision])

  const typedPriceBN = useMemo(
    () => toWeiBN(toBN(typedPrice).toFixed(pricePrecision, RoundMode.ROUND_DOWN)),
    [typedPrice, pricePrecision]
  )

  const closePriceBN = useMemo(
    () => (orderType === OrderType.MARKET ? markPriceBN : typedPriceBN),
    [orderType, markPriceBN, typedPriceBN]
  )

  const closePriceFinal = useMemo(() => {
    if (orderType === OrderType.LIMIT) return closePriceBN

    if (slippage === 'auto') {
      return positionType === PositionType.SHORT ? closePriceBN.times(autoSlippage) : closePriceBN.div(autoSlippage)
    }

    const spSigned = positionType === PositionType.SHORT ? slippage * -1 : slippage
    const slippageFactored = toBN(100 - spSigned).div(100)
    return toBN(closePriceBN).times(slippageFactored)
  }, [closePriceBN, slippage, positionType, orderType, autoSlippage])

  //TODO: remove this way
  const closePriceWied = useMemo(
    () => toWei(formatPrice(fromWei(closePriceFinal), pricePrecision)),
    [closePriceFinal, pricePrecision]
  )

  const callDataCallback = useCallback(async () => {
    if (!account || !diamondContract || !quote || !quantityToClose || !multiAccountContract) {
      throw new Error('Missing dependencies for constructCall.')
    }

    let deadline
    if (fillOrKillMode) {
      deadline =
        orderType === OrderType.MARKET
          ? Math.floor(Date.now() / 1000) + MARKET_ORDER_DEADLINE
          : Math.floor(Date.now() / 1000) + LIMIT_ORDER_DEADLINE
    } else {
      deadline = Math.floor(Date.now() / 1000) + LIMIT_ORDER_DEADLINE
    }

    const proxiedData = encodeFunctionData({
      abi: diamondContract.abi,
      functionName: 'requestToClosePosition',
      args: [
        BigInt(quote.id),
        BigInt(closePriceWied),
        BigInt(toWei(quantityToClose)),
        fillOrKillMode ? ((orderType === OrderType.MARKET ? 1 : 0) as number) : 0,
        BigInt(deadline),
      ],
    })

    const data = encodeFunctionData({
      abi: multiAccountContract.abi,
      functionName: '_call',
      args: [activeAccountAddress as Address, [proxiedData]],
    })

    return {
      to: multiAccountContract.address,
      data,
      value: '0',
    }
  }, [
    account,
    activeAccountAddress,
    closePriceWied,
    diamondContract,
    fillOrKillMode,
    multiAccountContract,
    orderType,
    quantityToClose,
    quote,
  ])

  const txInfo = {
    type: TransactionType.TRADE,
    name: market?.name,
    amount: removeTrailingZeros(quantityToClose),
    price: closePriceBN.div(1e18).toFormat(),
    state: TradeState.CLOSE,
    slippage: orderType === OrderType.LIMIT ? null : slippage,
    hedger: '',
    positionType: quote?.positionType,
    id: quote?.id.toString(),
  } as TradeTransactionInfo
  const summary = `${txInfo.name}-Q${txInfo.id} Close Position`

  return useCombinedTransaction(callDataCallback, txInfo, summary)
}
