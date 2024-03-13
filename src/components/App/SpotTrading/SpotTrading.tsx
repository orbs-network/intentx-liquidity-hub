'use client'
import { Row } from 'components/Row'
import { ArrowRight } from 'react-feather'
import styled from 'styled-components'
import {
  useShowConfirmationButton,
  LiquidityHubProvider,
  useSwapConfirmation,
  SwapConfirmation,
  useSwapButton,
  supportedChains,
  PoweredByOrbs,
  useFromTokenPanel,
  useToTokenPanel,
  usePriceUsd,
  useOnSwapSuccess,
} from '@orbs-network/liquidity-hub-ui-sdk'
import { useIsLaptop, useIsMobile } from 'lib/hooks/useWindowSize'
import { useModalOpen } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import Head from 'next/head'
import SpotTradeDetails from 'components/App/SpotTrading/SpotTradeDetails'
import SpotTradeForm from 'components/App/SpotTrading/SpotTradeForm'
import SpotTradingHeader from 'components/App/SpotTrading/SpotTradingHeader'
import { AdvancedGradientButton } from 'components/Button/GradientButton'
import SpotTradingSettingsModal from 'components/Modals/SpotTrading/SpotTradingSettingsModal'
import WavesBackground from 'components/WavesBackground'
import { useAccount, useConfig, useNetwork } from 'wagmi'
import { useSlippageTolerance } from 'state/user/hooks'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Modal } from 'components/Modal'
import { ArrowUpLeft, Loader } from 'components/Icons'
import OrdersList from './SpotTradingOrders'

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
  padding: 24px;
  width: 500px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 16px 16px 16px 16px;
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

const BackTo = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text3};
  cursor: pointer;
  gap: 10px;
  &:hover {
    color: ${({ theme }) => theme.red};
  }
`

const Title = styled.h4`
  color: ${({ theme }) => theme.text0};
  font-size: 16px;
  font-weight: 500;
`

const SwapConfirmationContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const SwapModalContaniner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  border-radius: 10px;
`

const StyledPoweredByOrbs = styled(PoweredByOrbs)`
  margin-top: 14px;
  margin-bottom: 10px;
`

const StyledSwapConfirmation = styled(SwapConfirmation)`
.lh-step-loader {
  background: ${({ theme }) => theme.bg0};
}
`

const SwapModal = () => {
  const { showModal, closeModal, swapStatus } = useSwapConfirmation()
  const onSwapSuccess = useOnSwapSuccess()
  const { text, isPending, swap: _swap, showButton } = useSwapButton()

  const swap = () =>  _swap({ onSuccess: onSwapSuccess })

  return (
    <Modal isOpen={showModal} onBackgroundClick={closeModal} onEscapeKeydown={closeModal}>
      <SwapModalContaniner>
        <BackTo onClick={closeModal}>
          <ArrowUpLeft />
          <span>Go Back</span>
        </BackTo>
        <Title>{!swapStatus ? 'Review swap' : ''}</Title>
        <SwapConfirmationContainer>
          <StyledSwapConfirmation />
        </SwapConfirmationContainer>
        {showButton && (
          <AdvancedGradientButton onClick={swap} label="">
            <Label>{isPending ? 'Swapping...' : text}</Label>
          </AdvancedGradientButton>
        )}
      </SwapModalContaniner>
    </Modal>
  )
}

export default function SpotTrading() {
  const chainId = useNetwork().chain?.id
  const { data } = useConfig()
  const { address } = useAccount()
  const slippage = useSlippageTolerance()
  const { openConnectModal } = useConnectModal()
  console.log(slippage);
  
  return (
    <LiquidityHubProvider
      connectWallet={openConnectModal}
      partner="intentx"
      chainId={chainId}
      account={address}
      provider={(data as any)?.provider}
      supportedChains={[supportedChains.base.chainId]}
      slippage={slippage}
      initialFromToken="USDC"
      initialToToken="WETH"
    >
      <SwapModal />
      <Content />
    </LiquidityHubProvider>
  )
}

const Content = () => {
  const showSettingModal = useModalOpen(ApplicationModal.SPOT_SETTINGS)

  return (
    <PageWrapper>
      <Head>
        <title>Spot Trading | IntentX</title>
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
              <SpotTradingHeader />
              <SpotTradeForm />
            </TradeSettings>
            <SpotTradeDetails />
            <FooterContainer>
              <TradeButton />
              <StyledPoweredByOrbs />
            </FooterContainer>
          </GradientContainer>
          <GradientContainer>
            <HistoryWrapper>
              <Row marginBottom="10px">
                <Label size={16}>Order History</Label>
              </Row>
              <OrdersList />
            </HistoryWrapper>
          </GradientContainer>
        </Wrapper>
      </ContentWrapper>
      {showSettingModal && <SpotTradingSettingsModal />}
    </PageWrapper>
  )
}

const TradeButton = () => {
  const isMobile = useIsMobile()
  const isLaptop = useIsLaptop()
  const fromToken = useFromTokenPanel().token
  const toToken = useToTokenPanel().token
  const fromTokenUsd = usePriceUsd({ address: fromToken?.address }).data
  const toTokenUsd = usePriceUsd({ address: toToken?.address }).data
  const { onClick, text, disabled, quoteLoading, switchNetworkLoading } = useShowConfirmationButton(
    fromTokenUsd || '',
    toTokenUsd || ''
  )

  const isLoading = quoteLoading || switchNetworkLoading
  return (
    <AdvancedGradientButton
      label=""
      onClick={() => onClick?.()}
      size="100%"
      height={isLaptop || isMobile ? '42px' : '60px'}
      secondary={disabled || isLoading}
    >
      <Row gap="10px">
        {switchNetworkLoading ? <Loader size="30px" /> : <Label>{quoteLoading ? 'Fetching quote...' : text}</Label>}
        {!isLoading && (
          <Row width="fit-content" marginTop="2px">
            <ArrowRight width={19} height={19} color={'#fff'} />
          </Row>
        )}
      </Row>
    </AdvancedGradientButton>
  )
}
