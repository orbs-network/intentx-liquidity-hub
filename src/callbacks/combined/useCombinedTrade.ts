import { DEFAULT_PRECISION, LIMIT_ORDER_DEADLINE, MARKET_ORDER_DEADLINE } from 'config/index'
import { COLLATERAL_ADDRESS, PARTY_B_WHITELIST } from 'constants/addresses'
import { FALLBACK_CHAIN_ID } from 'constants/chains'
import useCombinedTransaction from 'hooks/useCombinedTransaction'
import { useDiamondContract, useMultiAccountContract } from 'hooks/useContract'
import { useMarket } from 'hooks/useMarkets'
import useTradePage, {
  useLockedCVA,
  useLockedLF,
  useMaxFundingRate,
  useNotionalValue,
  usePartyALockedMM,
  usePartyBLockedMM,
} from 'hooks/useTradePage'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useSupportedChainId } from 'lib/hooks/useSupportedChainId'
import { useCurrency } from 'lib/hooks/useTokens'
import { SendOrCloseQuoteClient } from 'lib/muon'
import { useCallback, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { useHedgerInfo } from 'state/hedger/hooks'
import {
  useActiveMarketId,
  useActiveMarketPrice,
  useLockedPercentages,
  useOrderType,
  usePositionType,
} from 'state/trade/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TradeTransactionInfo, TransactionType } from 'state/transactions/types'
import { useActiveAccountAddress, useFillOrKillMode, useLeverage, useSlippageTolerance } from 'state/user/hooks'
import { OrderType, PositionType, TradeState } from 'types/trade'
import { CombinedTransactionData } from 'types/web3'
import { makeHttpRequest } from 'utils/http'
import { BN_ZERO, formatPrice, removeTrailingZeros, toBN, toWei } from 'utils/numbers'
import { Address, encodeFunctionData } from 'viem'
import { usePublicClient } from 'wagmi'

export function useCombinedTrade() {
  const { account, chainId } = useActiveConnectionDetails()
  const addTransaction = useTransactionAdder()

  const publicClient = usePublicClient()

  // const userExpertMode = useExpertMode()
  const activeAccountAddress = useActiveAccountAddress()
  const isSupportedChainId = useSupportedChainId()

  const diamondContract = useDiamondContract()
  const multiAccountContract = useMultiAccountContract()
  const functionName = 'sendQuote'

  const collateralCurrency = useCurrency(chainId ? COLLATERAL_ADDRESS[chainId] : undefined)
  const orderType = useOrderType()
  const positionType = usePositionType()
  const { price, formattedAmounts } = useTradePage()
  const leverage = useLeverage()

  const marketId = useActiveMarketId()
  const market = useMarket(marketId)
  const marketPrice = useActiveMarketPrice()
  const slippage = useSlippageTolerance()
  const pricePrecision = useMemo(() => market?.pricePrecision ?? DEFAULT_PRECISION, [market])
  const openPriceBN = useMemo(() => (price ? toBN(price) : BN_ZERO), [price])

  const fillOrKill = useFillOrKillMode()

  const openPriceWied = useMemo(() => toWei(formatPrice(openPriceBN, pricePrecision)), [openPriceBN, pricePrecision])

  const quantityAsset = useMemo(
    () => (toBN(formattedAmounts[1]).isNaN() ? toBN(0) : toBN(formattedAmounts[1])),
    [formattedAmounts]
  )

  const notionalValue = useNotionalValue(quantityAsset.toString(), formatPrice(openPriceBN, pricePrecision))
  const lockedCVA = useLockedCVA(notionalValue)
  const lockedPartyAMM = usePartyALockedMM(notionalValue)
  const lockedPartyBMM = usePartyBLockedMM(notionalValue)
  const lockedLF = useLockedLF(notionalValue)
  const { cva, partyAmm, partyBmm, lf } = useLockedPercentages()

  const maxFundingRate = useMaxFundingRate()
  const { baseUrl } = useHedgerInfo() || {}
  const partyBWhiteList = useMemo(() => PARTY_B_WHITELIST[chainId ?? FALLBACK_CHAIN_ID], [chainId])

  const fillOrKillMode = useFillOrKillMode()

  const dispatch = useAppDispatch()

  const getSignature = useCallback(async () => {
    if (!SendOrCloseQuoteClient) {
      throw new Error('Missing Client')
    }

    if (!activeAccountAddress || !chainId || !diamondContract || !marketId) {
      throw new Error('Missing muon params')
    }

    const { success, signature, error } = await SendOrCloseQuoteClient.getMuonSig(
      activeAccountAddress,
      chainId,
      diamondContract.address,
      marketId
    )

    if (success === false || !signature) {
      throw new Error(`Unable to fetch Muon signature: ${error}`)
    }
    return { signature }
  }, [diamondContract, activeAccountAddress, chainId, marketId])

  const getNotionalCap = useCallback(async () => {
    if (!market || !multiAccountContract) {
      throw new Error('missing params')
    }
    const { href: notionalCapUrl } = new URL(`notional_cap/${market.id}/${multiAccountContract.address}`, baseUrl)
    const { total_cap, used }: { total_cap: number; used: number } = await makeHttpRequest(notionalCapUrl)
    const freeCap = toBN(total_cap).minus(used)
    const notionalValue = openPriceBN.times(quantityAsset)

    if (freeCap.minus(notionalValue).lte(0)) throw new Error('Cap is reached.')
  }, [baseUrl, market, multiAccountContract, openPriceBN, quantityAsset])

  const callDataCallback = useCallback<() => Promise<CombinedTransactionData | undefined>>(async () => {
    if (
      !account ||
      !diamondContract ||
      !marketId ||
      !collateralCurrency ||
      !partyBWhiteList ||
      !isSupportedChainId ||
      !cva ||
      !partyAmm ||
      !partyBmm ||
      !lf ||
      !multiAccountContract
    ) {
      throw new Error('Missing dependencies.')
    }

    await getNotionalCap()
    const { signature } = await getSignature()

    if (!signature) {
      throw new Error('Missing signature for constructCall.')
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

    const args = [
      partyBWhiteList,
      BigInt(marketId),
      (positionType === PositionType.SHORT ? 1 : 0) as number,
      fillOrKillMode ? ((orderType === OrderType.MARKET ? 1 : 0) as number) : 0,
      BigInt(openPriceWied),
      BigInt(toWei(quantityAsset, 18)),
      toWei(lockedCVA),
      toWei(lockedLF),
      toWei(lockedPartyAMM), // partyAmm
      toWei(lockedPartyBMM), // partyBmm
      toWei(maxFundingRate),

      BigInt(deadline),
      signature,
    ] as const

    const proxiedData = encodeFunctionData({
      abi: diamondContract.abi,
      functionName: 'sendQuote',
      args,
    })

    if (!account || !chainId || !diamondContract || !market || !orderType || !quantityAsset || !activeAccountAddress) {
      throw new Error("Missing dependencies for 'constructCall'")
    }

    if (openPriceBN.lte(0)) {
      throw new Error("Missing openPriceBN for 'constructCall'")
    }
    if (quantityAsset.lte(0)) {
      throw new Error("Missing quantityAsset for 'constructCall'")
    }

    // Wrapping into multiaccount
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
    diamondContract,
    marketId,
    collateralCurrency,
    partyBWhiteList,
    isSupportedChainId,
    cva,
    partyAmm,
    partyBmm,
    lf,
    multiAccountContract,
    getNotionalCap,
    getSignature,
    fillOrKillMode,
    positionType,
    orderType,
    openPriceWied,
    quantityAsset,
    lockedCVA,
    lockedLF,
    lockedPartyAMM,
    lockedPartyBMM,
    maxFundingRate,
    chainId,
    market,
    activeAccountAddress,
    openPriceBN,
  ])

  const txInfo = {
    type: TransactionType.TRADE,
    name: market?.name,
    amount: removeTrailingZeros(quantityAsset),
    price: formatPrice(price, pricePrecision, true),
    state: TradeState.OPEN,
    slippage: orderType === OrderType.LIMIT ? null : slippage,
    hedger: '',
    positionType,
  } as TradeTransactionInfo

  const summary = `${txInfo.name} Open Order`

  return useCombinedTransaction(callDataCallback, txInfo, summary)
}
