import { Row } from 'components/Row'
import { ArrowRight } from 'react-feather'
import styled from 'styled-components'

import { useIsLaptop, useIsMobile } from 'lib/hooks/useWindowSize'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'

import Head from 'next/head'

import SpotTradeDetails from 'components/App/Conversion/ConversionDetails'
import SpotTradeForm from 'components/App/Conversion/ConversionForm'
import SpotTradingHeader from 'components/App/Conversion/ConversionHeader'
import { AdvancedGradientButton } from 'components/Button/GradientButton'
import Orbs from 'components/Icons/Orbs'
import SpotTradingSettingsModal from 'components/Modals/Conversion/SpotTradingSettingsModal'
import TokenSelectionModal from 'components/Modals/Conversion/TokenSelectionModal'
import WavesBackground from 'components/WavesBackground'

import { Squid } from '@0xsquid/sdk'
import { ChainData, Estimate, RouteRequest, SquidData, Token } from '@0xsquid/squid-types'
import BigNumber from 'bignumber.js'
import useCombinedExecute from 'callbacks/combined/generic/useCombinedExecute'
import ChainSelectionModal from 'components/Modals/Conversion/ChainSelectionModal'
import { SupportedChainId } from 'constants/chains'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import useDebounce from 'lib/hooks/useDebounce'
import { LoaderIcon } from 'react-hot-toast'

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  min-height: calc(110vh - 90px);
  background: #131518;
`

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 60px;
  margin: 8rem 0;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    gap: 20px;
    margin: 6rem 0;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 0 24px;
  margin: 6rem 0 4rem 0;
  flex-direction: column;
  align-items: center;
  `};
`

const ContentWrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: 1500px;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    max-width: 1200px;
  `};
`

const HeaderBackground = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  overflow: hidden;
`

const BackgroundGradient = styled.div`
  position: absolute;
  bottom: 0;
  background: linear-gradient(180deg, #131518 25%, rgba(19, 21, 24, 0.3) 45%);
  width: 100%;
  height: 100%;
  transform: matrix(1, 0, 0, -1, 0, 0);
`

const BottomBackgroundGradient = styled.div`
  position: absolute;
  bottom: 0;
  height: 177px;
  width: 100%;
  background: linear-gradient(180deg, #131518 50%, rgba(19, 21, 24, 0) 100%);
  transform: matrix(1, 0, 0, -1, 0, 0);
`

const BackgroundHighlight = styled.div`
  position: absolute;
  width: 800px;
  height: 800px;
  left: 20%;
  top: -350px;
  background-size: 50%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(189, 39, 56, 0.4) 0%, rgba(189, 39, 56, 0) 100%);
  filter: blur(90.5px);
  border-radius: 50%;
`

const Label = styled.span<{ size?: number; weight?: string; reducedOpacity?: boolean }>`
  font-weight: ${({ weight }) => weight ?? '400'};
  font-size: ${({ size }) => `${size}px` ?? '14px'};
  color: ${({ theme }) => theme.white};
  opacity: ${({ reducedOpacity }) => (reducedOpacity ? '0.5' : '1')};

  ${({ theme, size }) => theme.mediaWidth.upToExtraLarge`
  font-size: ${size ? `${size * 0.7}px` : '10px'};
`};
`

const ErrorLabel = styled.span<{ size?: number; weight?: string; reducedOpacity?: boolean }>`
  font-weight: ${({ weight }) => weight ?? '400'};
  font-size: ${({ size }) => `${size}px` ?? '14px'};
  color: ${({ theme }) => theme.red};
  opacity: ${({ reducedOpacity }) => (reducedOpacity ? '0.5' : '1')};

  ${({ theme, size }) => theme.mediaWidth.upToExtraLarge`
  font-size: ${size ? `${size * 0.7}px` : '10px'};
`};
`

const gradient = 'linear-gradient(179.35deg, #BC2738 0.53%, #6E1620 26.83%, rgba(110, 22, 32, 0) 99.43%)'

const GradientContainer = styled.div`
  background: #171a1f;
  position: relative;
  border-radius: 10px;
  z-index: 99;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 10px;
    padding: 1px;
    background: ${gradient};
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
  `};
`

const TradeSettings = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
  width: 100%;
`

const HistoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 24px 0 24px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 16px 16px 0 16px;
`};
`

const WavesWrapper = styled.div`
  width: 100%;
  top: 100px;
  position: relative;
  opacity: 0.05;
`

const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0 0 5px 5px;
  padding: 12px 16px;
  gap: 12px;
`

export enum AvailableFields {
  FROM = 'from',
  TO = 'to',
}

export default function SpotTradingPage() {
  const isMobile = useIsMobile()
  const isLaptop = useIsLaptop()
  const showSettingModal = useModalOpen(ApplicationModal.SPOT_SETTINGS)
  const showTokenSelectionModal = useModalOpen(ApplicationModal.TOKEN_SELECTION)
  const showChainSelectionModal = useModalOpen(ApplicationModal.CHAIN_SELECTION)
  const toggleTokenSelectionModal = useToggleModal(ApplicationModal.TOKEN_SELECTION)
  const toggleChainSelectionModal = useToggleModal(ApplicationModal.CHAIN_SELECTION)

  const { account } = useActiveConnectionDetails()

  const [fromChain, setFromChain] = useState<ChainData | null>(null)
  const [toChain, setToChain] = useState<ChainData | null>(null)

  const [loadingRoute, setLoadingRoute] = useState(false)
  const [currentRoute, setCurrentRoute] = useState<
    | {
        estimate: Estimate
        transactionRequest?: SquidData | undefined
        params: RouteRequest
      }
    | undefined
  >()
  const [requestId, setRequestId] = useState<string>('')

  const [selectedField, setSelectedField] = useState<AvailableFields>(AvailableFields.FROM)

  const [fromToken, setFromToken] = useState<Token | null>(null)

  const [toToken, setToToken] = useState<Token | null>(null)

  const [tokenQuantity, setTokenQuantity] = useState({
    from: '0',
    to: '0',
  })
  const [typedTokenQuantity, setTypedTokenQuantity] = useState({
    from: '',
    to: '',
  })
  const debouncedTypedTokenQuantity: {
    from: string
    to: string
  } = useDebounce(typedTokenQuantity, 500)

  const debouncedFromChain = useDebounce(fromChain, 550)
  const debouncedToChain = useDebounce(toChain, 550)

  const debouncedFromToken = useDebounce(fromToken, 550)
  const debouncedToToken = useDebounce(toToken, 550)

  const [squidInstance, setSquidInstance] = useState<Squid | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string>('')
  const [ordersData, setOrdersData] = useState<any[]>([])
  const [lastModifiedAmount, setLastModifiedAmount] = useState<AvailableFields>(AvailableFields.FROM)
  const [routeFailed, setRouteFailed] = useState<boolean>(false)

  const calculateRouteFrom = useCallback(async () => {
    if (
      !debouncedFromToken ||
      !debouncedToToken ||
      !squidInstance ||
      !fromToken ||
      !debouncedFromChain ||
      !debouncedToChain ||
      tokenQuantity.from === '0'
    )
      return

    setLoadingRoute(true)
    console.debug('Using params')
    console.table({
      fromToken: debouncedFromToken,
      toToken: debouncedToToken,
      fromChain: debouncedFromChain,
      toChain: debouncedToChain,
      tokenQuantity,
      account,
    })

    const params: RouteRequest = {
      fromChain: debouncedFromChain.chainId,
      toChain: debouncedToChain.chainId,
      fromToken: fromToken.address,
      toToken: debouncedToToken.address,
      fromAmount: tokenQuantity.from.toString(),
      fromAddress: account,
      toAddress: account,
      slippageConfig: {
        autoMode: 1,
      },
      quoteOnly: false,
    }

    try {
      const { route, requestId } = await squidInstance.getRoute(params)

      console.debug('Got route ', route)

      if (route) {
        setCurrentRoute(route)
      }
      if (requestId) {
        setRequestId(requestId)
      }

      // Updating quantities and typed ones

      if (lastModifiedAmount === AvailableFields.FROM) {
        const toAmount = route.estimate.toAmount
        const toAmountUSD = route.estimate.toAmountUSD
        const toDecimals = debouncedToToken.decimals

        const toHumanAmount = BigNumber(toAmount)
          .div(10 ** toDecimals)
          .toString()

        setTypedTokenQuantity({
          from: typedTokenQuantity.from,
          to: toHumanAmount,
        })
      }

      setRouteFailed(false)
    } catch (err) {
      console.log('Route failed ', err)
      setRouteFailed(true)
    }

    setLoadingRoute(false)
  }, [
    debouncedFromToken,
    debouncedToToken,
    squidInstance,
    fromToken,
    debouncedFromChain,
    debouncedToChain,
    tokenQuantity,
    account,
    lastModifiedAmount,
    typedTokenQuantity.from,
  ])

  useEffect(() => {
    if (!fromToken) return

    // Parsing into token amount
    const decimals = fromToken.decimals
    const amount = BigNumber(Number(debouncedTypedTokenQuantity.from))
      .times(10 ** decimals)
      .toString()

    if (amount === tokenQuantity.from) return

    const updatedQuantities = {
      ...tokenQuantity,
      from: amount,
    }

    setTokenQuantity(updatedQuantities)
  }, [debouncedTypedTokenQuantity.from, fromToken, tokenQuantity])

  useEffect(() => {
    if (!toToken) return

    // Parsing into token amount
    const decimals = toToken.decimals
    const amount = BigNumber(Number(debouncedTypedTokenQuantity.to))
      .times(10 ** decimals)
      .toString()

    if (amount === tokenQuantity.to) return

    const updatedQuantities = {
      ...tokenQuantity,
      to: amount,
    }

    setTokenQuantity(updatedQuantities)
  }, [debouncedTypedTokenQuantity.to, toToken, tokenQuantity])

  useEffect(() => {
    calculateRouteFrom()
  }, [calculateRouteFrom])

  const updateFromTokenAmount = (value: string): void => {
    setLastModifiedAmount(AvailableFields.FROM)
    setTypedTokenQuantity({
      ...typedTokenQuantity,
      from: value,
    })
  }

  const updateToTokenAmount = (value: string): void => {
    setLastModifiedAmount(AvailableFields.TO)
    /* setTypedTokenQuantity({
      ...typedTokenQuantity,
      to: value,
    }) */
  }

  const handleSwapClick = useCallback(() => {
    if (!fromToken || !toToken || !fromChain || !toChain) return

    const tempToken = { ...fromToken }
    setFromToken({ ...toToken })
    setToToken(tempToken)

    const tempChain = { ...fromChain }
    setFromChain(toChain)
    setToChain(tempChain)

    setTypedTokenQuantity({
      ...typedTokenQuantity,
      from: typedTokenQuantity.to,
    })
  }, [fromChain, fromToken, toChain, toToken, typedTokenQuantity])

  const updateSelectedFilter = (filter: string): void => {
    if (filter === selectedFilter) {
      setSelectedFilter('')
    } else {
      setSelectedFilter(filter)
    }
  }

  /* useEffect(() => {
    if (selectedFilter && selectedFilter !== '') {
      setOrdersData(mockOrdersList.filter((order) => order.orderType === selectedFilter))
    } else {
      setOrdersData(mockOrdersList)
    }
  }, [selectedFilter, mockOrdersList]) */

  // SQUIDS INTEGRATION STUFF
  const { chainId } = useActiveConnectionDetails()
  const initializeSquid = useCallback(async () => {
    const squid = new Squid({
      baseUrl: 'https://v2.api.squidrouter.com',
      integratorId: 'intentx-swap-integration',
    })
    await squid.init()
    setSquidInstance(squid)

    let fromChainId = chainId ?? SupportedChainId.BASE
    let targetChainId = SupportedChainId.BASE
    if (chainId === SupportedChainId.BASE) {
      fromChainId = SupportedChainId.BASE
      targetChainId = SupportedChainId.ARBITRUM
    }

    console.log('SQuid stuff')
    console.log(squid.chains)
    console.log(squid.tokens)

    const fc = squid.chains.find((chain) => chain.chainId === fromChainId.toString()) ?? null
    const tc = squid.chains.find((chain) => chain.chainId === targetChainId.toString()) ?? null
    setFromChain(fc)
    setToChain(tc)

    // Using ETH -> USDC as default
    setFromToken(
      squid.tokens.find(
        (token) => token.chainId === fromChainId.toString() && token.symbol === fc?.nativeCurrency.symbol
      ) ?? null
    )

    setToToken(
      squid.tokens.find(
        (token) => token.chainId === targetChainId.toString() && token.symbol === tc?.nativeCurrency.symbol
      ) ?? null
    )
  }, [chainId])

  useEffect(() => {
    initializeSquid()
  }, [initializeSquid])

  const availableTokensFrom = useMemo(() => {
    if (!squidInstance || !chainId) return []
    return squidInstance.tokens.filter((token) => token.chainId === chainId.toString())
  }, [squidInstance, chainId])

  const availableTokensTo = useMemo(() => {
    if (!squidInstance || !chainId) return []
    return squidInstance.tokens.filter((token) => token.chainId === chainId.toString())
  }, [chainId, squidInstance])

  const availableChainsFrom = useMemo(() => {
    if (!squidInstance || !chainId) return []
    return squidInstance.chains
  }, [chainId, squidInstance])

  const availableChainsTo = useMemo(() => {
    if (!squidInstance || !chainId) return []
    return squidInstance.chains
  }, [chainId, squidInstance])

  const availableModalTokens = useMemo(() => {
    if (selectedField === AvailableFields.FROM) {
      return availableTokensFrom
    }
    return availableTokensTo
  }, [availableTokensFrom, availableTokensTo, selectedField])

  const availableModalChains = useMemo(() => {
    if (selectedField === AvailableFields.FROM) {
      return availableChainsFrom
    }
    return availableChainsTo
  }, [availableChainsFrom, availableChainsTo, selectedField])

  const onTokenSelect = useCallback(
    (token: Token) => {
      if (token.address === fromToken?.address || token.address === toToken?.address) {
        handleSwapClick()
      } else {
        if (selectedField === AvailableFields.FROM) {
          setFromToken(token)
        } else {
          setToToken(token)
        }
      }

      toggleTokenSelectionModal()
    },
    [fromToken?.address, handleSwapClick, selectedField, toToken?.address, toggleTokenSelectionModal]
  )

  const onChainSelect = useCallback(
    (chain: ChainData) => {
      if (selectedField === AvailableFields.FROM) {
        setFromChain(chain)
      } else {
        setToChain(chain)
      }
      toggleChainSelectionModal()
    },
    [selectedField, toggleChainSelectionModal]
  )

  const swapDisabled = useMemo(() => {
    return !fromToken || routeFailed || !currentRoute
  }, [fromToken, routeFailed, currentRoute])

  const { callback: executeCurrentRouteCallback } = useCombinedExecute(
    currentRoute?.transactionRequest?.target,
    currentRoute?.transactionRequest?.data,
    currentRoute?.transactionRequest?.value
  )

  return (
    <PageWrapper>
      <Head>
        <title>Cross Chain | IntentX</title>
      </Head>
      <ContentWrapper>
        <Wrapper>
          <HeaderBackground>
            <WavesWrapper>
              <WavesBackground />
            </WavesWrapper>
            <BackgroundGradient />
            <BottomBackgroundGradient />
            <BackgroundHighlight />
          </HeaderBackground>
          <GradientContainer>
            <TradeSettings>
              <SpotTradingHeader onReload={() => {}} />
              <SpotTradeForm
                tokenQuantity={tokenQuantity}
                currentRoute={currentRoute}
                typedQuantities={typedTokenQuantity}
                onUpdateFromToken={updateFromTokenAmount}
                onUpdateToToken={updateToTokenAmount}
                onClickSwap={handleSwapClick}
                tokenFrom={fromToken}
                tokenTo={toToken}
                chainFrom={fromChain}
                chainTo={toChain}
                selectedField={selectedField}
                setSelectedField={setSelectedField}
              />
            </TradeSettings>
            <SpotTradeDetails currentRoute={currentRoute} loadingRoute={loadingRoute} />
            <FooterContainer>
              <AdvancedGradientButton
                label=""
                onClick={() => {
                  if (swapDisabled) return

                  if (executeCurrentRouteCallback) {
                    executeCurrentRouteCallback()
                  }
                }}
                size="100%"
                height={isLaptop || isMobile ? '42px' : '60px'}
                secondary={swapDisabled}
              >
                <Row gap="10px">
                  <Label>Trade Now</Label>
                  <Row width="fit-content" marginTop="2px">
                    <ArrowRight width={19} height={19} color={'#fff'} />
                  </Row>
                </Row>
              </AdvancedGradientButton>
              {loadingRoute && <LoaderIcon />}
              {routeFailed && <ErrorLabel>An error ocured calculating the route. Please, try again later</ErrorLabel>}
              <Row width="fit-content" gap="10px">
                <Label size={12}> Powered by Orbs</Label>
                <Orbs size={isLaptop || isMobile ? '16' : '24'} />
              </Row>
            </FooterContainer>
          </GradientContainer>
        </Wrapper>
      </ContentWrapper>
      {showSettingModal && <SpotTradingSettingsModal />}
      {showTokenSelectionModal && (
        <TokenSelectionModal availableTokens={availableModalTokens} handleSelectToken={onTokenSelect} />
      )}
      {showChainSelectionModal && (
        <ChainSelectionModal availableChains={availableModalChains} handleSelectChain={onChainSelect} />
      )}
    </PageWrapper>
  )
}
