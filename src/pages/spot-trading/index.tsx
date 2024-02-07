import { Row } from 'components/Row'
import { ArrowRight } from 'react-feather'
import styled from 'styled-components'

import { useIsLaptop, useIsMobile } from 'lib/hooks/useWindowSize'
import { useEffect, useMemo, useState } from 'react'

import { useModalOpen } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'

import Head from 'next/head'

import SpotTradeDetails from 'components/App/SpotTrading/SpotTradeDetails'
import SpotTradeForm from 'components/App/SpotTrading/SpotTradeForm'
import SpotTradingHeader from 'components/App/SpotTrading/SpotTradingHeader'
import { AdvancedGradientButton } from 'components/Button/GradientButton'
import Orbs from 'components/Icons/Orbs'
import SpotTradingSettingsModal from 'components/Modals/SpotTrading/SpotTradingSettingsModal'
import TokenSelectionModal from 'components/Modals/SpotTrading/TokenSelectionModal'
import OrdersFilter from 'components/OrdersFilter'
import OrdersList from 'components/OrdersList'
import WavesBackground from 'components/WavesBackground'

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

export default function SpotTradingPage() {
  const isMobile = useIsMobile()
  const isLaptop = useIsLaptop()
  const showSettingModal = useModalOpen(ApplicationModal.SPOT_SETTINGS)
  const showTokenSelectionModal = useModalOpen(ApplicationModal.TOKEN_SELECTION)
  const showChainSelectionModal = useModalOpen(ApplicationModal.CHAIN_SELECTION)

  const [tokenFrom, setTokenFrom] = useState<any>({ name: 'BTC', value: '', balance: '2,323.23' })
  const [tokenTo, setTokenTo] = useState<any>({ name: 'USDC', value: '', balance: '99,123.23' })
  const [selectedFilter, setSelectedFilter] = useState<string>('')

  const [ordersData, setOrdersData] = useState<any[]>([])

  const updateFromTokenAmount = (value: string): void => {
    setTokenFrom((prev) => ({ ...prev, value }))
  }

  const updateToTokenAmount = (value: string): void => {
    setTokenTo((prev) => ({ ...prev, value }))
  }

  const handleSwapClick = () => {
    const tempToken = { ...tokenFrom }
    setTokenFrom({ ...tokenTo })
    setTokenTo(tempToken)
  }

  const updateSelectedFilter = (filter: string): void => {
    if (filter === selectedFilter) {
      setSelectedFilter('')
    } else {
      setSelectedFilter(filter)
    }
  }

  const mockOrdersList = [
    {
      token1: 'BTC',
      token2: 'USDC',
      orderType: 'SWAP',
      date: '12/11/2023, 21:33',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'BTC',
      token2: 'USDC',
      orderType: 'SWAP',
      date: '12/11/2023, 21:33',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'BTC',
      token2: 'USDC',
      orderType: 'SWAP',
      date: '12/11/2023, 21:33',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'BTC',
      token2: 'USDC',
      orderType: 'SWAP',
      date: '12/11/2023, 21:33',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'USDC',
      orderType: 'DEPOSIT',
      date: '12/11/2023',
      from: 'Spot',
      to: 'Futures',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'USDC',
      orderType: 'WITHDRAW',
      date: '12/11/2023',
      from: 'Futures',
      to: 'Spot',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'USDC',
      orderType: 'DEPOSIT',
      date: '12/11/2023',
      from: 'Spot',
      to: 'Futures',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'USDC',
      orderType: 'DEPOSIT',
      date: '12/11/2023',
      from: 'Spot',
      to: 'Futures',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'USDC',
      orderType: 'WITHDRAW',
      date: '12/11/2023',
      from: 'Futures',
      to: 'Spot',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'USDC',
      orderType: 'WITHDRAW',
      date: '12/11/2023',
      from: 'Futures',
      to: 'Spot',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'BTC',
      token2: 'USDC',
      orderType: 'SWAP',
      date: '12/11/2023, 21:33',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'BTC',
      token2: 'USDC',
      orderType: 'SWAP',
      date: '12/11/2023, 21:33',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'BTC',
      token2: 'USDC',
      orderType: 'SWAP',
      date: '12/11/2023, 21:33',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'BTC',
      token2: 'USDC',
      orderType: 'SWAP',
      date: '12/11/2023, 21:33',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'USDC',
      orderType: 'DEPOSIT',
      date: '12/11/2023',
      from: 'Spot',
      to: 'Futures',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'USDC',
      orderType: 'WITHDRAW',
      date: '12/11/2023',
      from: 'Futures',
      to: 'Spot',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'USDC',
      orderType: 'DEPOSIT',
      date: '12/11/2023',
      from: 'Spot',
      to: 'Futures',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'USDC',
      orderType: 'DEPOSIT',
      date: '12/11/2023',
      from: 'Spot',
      to: 'Futures',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'USDC',
      orderType: 'WITHDRAW',
      date: '12/11/2023',
      from: 'Futures',
      to: 'Spot',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
    {
      token1: 'USDC',
      orderType: 'WITHDRAW',
      date: '12/11/2023',
      from: 'Futures',
      to: 'Spot',
      value: '938',
      secondaryValue: '941.32',
      url: '',
    },
  ]

  useEffect(() => {
    if (selectedFilter && selectedFilter !== '') {
      setOrdersData(mockOrdersList.filter((order) => order.orderType === selectedFilter))
    } else {
      setOrdersData(mockOrdersList)
    }
  }, [selectedFilter, mockOrdersList])

  const availableTokensFrom = useMemo(() => {}, [])

  const availableTokensTo = useMemo(() => {}, [])

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
              <SpotTradingHeader onReload={() => {}} />
              <SpotTradeForm
                onUpdateFromToken={updateFromTokenAmount}
                onUpdateToToken={updateToTokenAmount}
                onClickSwap={handleSwapClick}
                tokenFrom={tokenFrom}
                tokenTo={tokenTo}
              />
            </TradeSettings>
            <SpotTradeDetails />
            <FooterContainer>
              <AdvancedGradientButton
                label=""
                onClick={() => {}}
                size="100%"
                height={isLaptop || isMobile ? '42px' : '60px'}
                secondary={tokenFrom.value === ''}
              >
                <Row gap="10px">
                  <Label>Trade Now</Label>
                  <Row width="fit-content" marginTop="2px">
                    <ArrowRight width={19} height={19} color={'#fff'} />
                  </Row>
                </Row>
              </AdvancedGradientButton>
              <Row width="fit-content" gap="10px">
                <Label size={12}> Powered by Orbs</Label>
                <Orbs size={isLaptop || isMobile ? '16' : '24'} />
              </Row>
            </FooterContainer>
          </GradientContainer>
          <GradientContainer>
            <HistoryWrapper>
              <Row marginBottom="10px">
                <Label size={16}>Order History</Label>
              </Row>
              <OrdersFilter selectedFilter={selectedFilter} onFilterChange={updateSelectedFilter} />
            </HistoryWrapper>
            <OrdersList data={ordersData} />
          </GradientContainer>
        </Wrapper>
      </ContentWrapper>
      {showSettingModal && <SpotTradingSettingsModal />}
      {showTokenSelectionModal && <TokenSelectionModal />}
    </PageWrapper>
  )
}
