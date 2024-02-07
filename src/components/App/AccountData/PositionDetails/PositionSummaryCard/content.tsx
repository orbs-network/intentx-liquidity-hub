import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import styled, { useTheme, css } from 'styled-components'
import { toPng } from 'html-to-image'
import { toast } from 'react-hot-toast'
import QRCode from 'react-qr-code'
import ExpandArrow from 'components/Icons/ExpandArrow'
import { Quote, QuoteStatus } from 'types/quote'
import { useMarketData } from 'state/hedger/hooks'
import { useLockedMargin, useQuoteLeverage, useQuoteSize, useQuoteUpnlAndPnl } from 'hooks/useQuotes'
import { getTokenWithFallbackChainId } from 'utils/token'
import { COLLATERAL_TOKEN } from 'constants/tokens'
import useBidAskPrice from 'hooks/useBidAskPrice'
import { useMarket } from 'hooks/useMarkets'
import { PositionType } from 'types/trade'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { RedButton } from 'components/Button'
import Share from 'components/Icons/Share'
import CopyGradient from 'components/Icons/CopyGradient'
import Download from 'components/Icons/Download'
import { Loader } from 'components/Icons'
import { useNotionalValue } from 'hooks/useTradePage'
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react'
import { toBN } from 'utils/numbers'
import { formatAmount } from 'utils/numbers'
import CheckMark from 'components/Icons/CheckMark'
import { useUserReferralAccountInfo } from 'state/referrals/hooks'
import { ApiState } from 'types/api'
import Dropdown from 'components/DropDown'
import Image from 'next/image'
import { SwiperSlide, Swiper } from 'swiper/react'
import { IconWrapper } from 'components/Icons'

import Default from './cards/Default'
import DefaultMobile from './cards/DefaultMobile'
import Risitas from './cards/Risitas'
import PepeTrade from './cards/PepeTrade'
import Wojaksad from './cards/Wojaksad'
import HuellOnMoney from './cards/HuellOnMoney'
import AmazedPepe from './cards/AmazedPepe'
import HappyNewYearPepe from './cards/HappyNewYearPepe'
import ChristmasPepe from './cards/ChristmasPepe'
import { useIsMobile } from 'lib/hooks/useWindowSize'
import ArrowRightTriangle from 'components/Icons/ArrowRightTriangle'

interface PositionSummaryCardContentProps {
  width: number
  quote: Quote
}

const Wrapper = styled.div`
  border-radius: 5px;
  background: ${({ theme }) => theme.bg10}cc;
  overflow: hidden;
`

const Footer = styled.div`
  padding: 24px 28px;
  color: ${({ theme }) => theme.white};
  display: flex;
  justify-content: center;
  width: 100%;

  & > div {
    width: 100%;

    &:last-child {
      max-width: 235px;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 16px 32px 24px;

    & > div:last-child {
      max-width: 100%;
    }
  `}
`

const FooterTitle = styled.div`
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 1px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 14px;
    text-align: center;
  `}
`

const FooterSubtitle = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  opacity: 0.5;
  margin-bottom: 15px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 12px;
    text-align: center;
    margin-bottom: 12px;
  `}
`

const SelectorWrapper = styled.div`
  display: flex;
  background: rgba(14, 16, 21, 0.5);
  overflow: hidden;
  border-radius: 5px;
  width: 189px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 100%;
  `}
`

const SelectorButton = styled(RedButton)<{ active?: boolean }>`
  border-radius: 0;
  background: ${({ active, theme }) => (active ? theme.gradCustom2 : 'transparent')};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  height: 33px;
  padding: 15px;
`

const MinimizeButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 12px;
  `}
`

const BaseButtonCss = (props: any) => css``

const ShareButton = styled(RedButton)<{ disabled?: boolean }>`
  width: 100%;
  height: 46px;
  padding: 15px;
  display: flex;
  border-radius: 5px;
  margin-bottom: 15px;
  gap: 10px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 44px;
    margin-bottom: 11px;
  `}

  position: relative;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 12px;
  `}

  ${({ disabled }) =>
    disabled
      ? css`
          color: ${({ theme }) => theme.white}80;
          cursor: wait;
          pointer-events: none;
        `
      : css`
          cursor: pointer;
        `}
`

const DropDownContainer = styled.div<{ active?: boolean }>`
  background: ${({ active }) =>
    active ? 'linear-gradient(90deg, rgba(188, 39, 56, 0.4) 0%, rgba(110, 22, 32, 0.4) 128.07%)' : 'transparent'};
  color: white;
  padding: 5px 5px;
  border: 1px solid ${({ active }) => (active ? 'red' : 'white')};
  cursor: pointer;
  border-radius: 10px;
  font-size: 15px;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;

  &:hover {
    background: linear-gradient(90deg, rgba(188, 39, 56, 0.4) 0%, rgba(110, 22, 32, 0.4) 128.07%);
    border-color: red;
  }

  // position: absolute;
  // top: 440px;
  // left: 580px;
  justify-content: space-between;
  display: flex;
  align-items: center;
  gap: 10px;

  ${({ theme, active }) => theme.mediaWidth.upToMedium`
    font-size: 12px;
    line-height: 10.5px; 
    border-radius: 7.5px;
    border: 0.75px solid ${active ? 'red' : 'rgba(255, 255, 255, 0.20)'};
  `}
`

const DropDownIcon = styled.div`
  line-height: 1;
  font-size: 16px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 12px;
  `}
`

const SuperContainer = styled.div<{ active?: boolean }>`
  position: absolute;
  top: 440px;
  left: 430px;
  justify-content: space-between;
  display: flex;
  align-items: center;
  gap: 10px;

  ${({ theme, active }) => theme.mediaWidth.upToMedium`
    position: relative;
    left: 0;
    top: -8px;
    padding: 0px 31px 16.26px;
    margin: 0 auto;
    ${active ? 'padding-bottom: 4.26px;' : 'border-bottom: 1px solid #353E4B;'}
    max-width: 323px;

    &::after {
      content: '';
      position: absolute;
      left: -13px;
      bottom: calc(100% - 9px);
      width: 350px;
      height: 72.367px;
      background: linear-gradient(180deg, rgba(4, 4, 4, 0.00) 0%, #21262F 100%);
      z-index: 1;
    }

    * {
      z-index: 2;
    }
  `}
`

const SuperContainerThumbs = styled(Image)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 27px;
  `}
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-content: center;
  `}
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-content: center;
  `}
`

const DropDownButton = styled.button`
  // background-color: transparent;
  // color: white;
  // padding: 10px 20px;
  // border: 2px solid white;
  // cursor: pointer;
  // border-radius: 10px;
  font-size: 12px;
  // text-align: center;
  // text-decoration: none;
  // transition: all 0.3s;

  // &:hover {
  //   background: linear-gradient(270deg, rgb(188, 39, 56) 0%, rgb(110, 22, 32) 128.07%);
  //   border-color: red;
  // }

  white-space: nowrap;
`

const CardsShowcase = styled.div<{ active?: boolean }>`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: left;
  padding: 5px 28px;
  width: 100%;
  max-width: 100%;

  ${({ theme, active }) => theme.mediaWidth.upToMedium`
    position: relative;
    flex-direction: column;
    align-items: center;
    ${active ? 'border-bottom: 1px solid #353E4B;' : ''}
    max-width: 323px;
    margin: 0 auto;
    padding-left: 12.71px;
    padding-right: 12.71px;
    padding-bottom: 11px;
  `}

  ${({ theme, active }) => theme.mediaWidth.upToMedium`
    &::after,
    &::before {
      content: '';
        position: absolute;
        bottom: 0;
        width: 52px;
        height: 91px;
        background: linear-gradient(90deg, #232933 25.87%, #22272F 39.76%, rgba(35, 41, 51, 0.00) 100%);
        z-index: 2;
        pointer-events: none;
    }

    &::after {
      left: 0;
    }

    &::before {
      right: 0;
      transform: scaleX(-1);
    }
  `}

  .swiper-slide {
    width: auto !important;
  }
`

const OtherButtonsToShare = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0px 8px;

  & > span {
    background: #fff;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &:hover {
    span {
      background-image: ${({ theme }) => theme.gradCustom1};
    }
  }

  & > svg {
    font-size: 24px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0px 5px;

    & > svg {
      font-size: 20px;
    }
  `}

  position: relative;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 12px;
  `}

  ${({ disabled }) =>
    disabled
      ? css`
          color: ${({ theme }) => theme.white}80;
          cursor: wait;
          pointer-events: none;
        `
      : css`
          cursor: pointer;
        `}
`

const CopyButton = styled(OtherButtonsToShare)``
const DownloadSVG = styled(OtherButtonsToShare)``

const LoaderWrapper = styled.div`
  position: absolute;
  /* top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bg10}b3;
`

const SVGWrapperDesktop = styled.div`
  line-height: 0;
`

const SVGMobile = styled.svg`
  display: none;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: block;
  `}
`

const CheckboxReferralWrapper = styled.div<{ active: boolean }>`
  display: flex;
  padding: 5px 10px 5px 5px;
  align-items: center;
  gap: 5px;
  border-radius: 5px;
  --bg-opacity: 0.2;
  background: ${({ theme, active }) => (active ? theme.gradCustom1Opacity : `rgba(24, 28, 34, 0.50)`)};
  gap: 5px;
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 5px 10px;
    gap: 10px;
  `}
`

const CheckboxReferral = styled.div<{ active: boolean }>`
  width: 23px;
  height: 23px;
  border-radius: 10px;
  --bg-opacity: 0.5;
  border: 1px solid ${({ active }) => (active ? `#BC2738` : `#757F8F`)};
  background: ${({ theme, active }) => (active ? theme.gradCustom1Opacity : `transparent`)};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const CheckboxReferralText = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`

const ActiosnWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;
  `}
`

const CardSliderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`

// styled Image
const RoundedImage = styled(Image)`
  border-radius: 5%;
  user-select: none;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 97.48px;
    height: 64.706px;
    border-radius: 8.403px;
  `}
`

const CarouselContainer = styled.div`
  display: flex;
  align-items: center;
`

const ArrowWrapper = styled.button<{ left?: boolean; active?: boolean }>`
  transform: rotate(${({ left }) => (left ? '180deg' : '0')});
  opacity: ${({ active }) => (active ? '1' : '0.5')};
  &:hover {
    cursor: ${({ active }) => (active ? 'pointer' : 'default')};
  }
`

function Selector({
  value,
  onChange,
}: {
  value: 'percentage' | 'figures'
  onChange: (value: 'percentage' | 'figures') => void
}) {
  return (
    <SelectorWrapper>
      <SelectorButton active={value === 'percentage'} onClick={() => onChange('percentage')}>
        Percentage
      </SelectorButton>
      <SelectorButton active={value === 'figures'} onClick={() => onChange('figures')}>
        Figures
      </SelectorButton>
    </SelectorWrapper>
  )
}

function CheckboxReferralCode({ value, onClick }: { value: boolean; onClick: () => void }) {
  return (
    <CheckboxReferralWrapper active={value} onClick={onClick}>
      <CheckboxReferral active={value}>{value && <CheckMark size={11} color="#fff" />}</CheckboxReferral>
      <CheckboxReferralText>Show Referral Code</CheckboxReferralText>
    </CheckboxReferralWrapper>
  )
}

enum Card {
  NONE = 'none',
  AMAZED_PEPE = 'amazed_pepe',
  HUELL_ON_MONEY = 'huell_on_money',
  PEPE_TRADE = 'pepe_trade',
  WOJAKSAD = 'wojaksad',
  PEPE_ANO_NUEVO = 'pepe_ano_nuevo',
  RISITAS = 'risitas',
  CHRISTMAS_PEPE = 'christmas_pepe',
}

const cardImages = {
  none: {
    card: Card.NONE,
    src: '/images/position-summary-card/styled-cards/thumbnail/image42.png',
    alt: 'Asset 0',
    width: 100,
    height: 100,
    onlyOnProfit: false,
    onlyOnLose: false,
  },
  image1: {
    card: Card.RISITAS,
    src: '/images/position-summary-card/styled-cards/thumbnail/image43.png',
    alt: 'Asset 1',
    width: 174,
    height: 135,
    onlyOnProfit: false,
    onlyOnLose: true,
  },
  image2: {
    card: Card.WOJAKSAD,
    src: '/images/position-summary-card/styled-cards/thumbnail/image44.png',
    alt: 'Asset 2',
    width: 174,
    height: 135,
    onlyOnProfit: false,
    onlyOnLose: true,
  },
  image3: {
    card: Card.PEPE_TRADE,
    src: '/images/position-summary-card/styled-cards/thumbnail/image45.png',
    alt: 'Asset 3',
    width: 174,
    height: 135,
    onlyOnProfit: true,
    onlyOnLose: false,
  },
  image4: {
    card: Card.AMAZED_PEPE,
    src: '/images/position-summary-card/styled-cards/thumbnail/image46.png',
    alt: 'Asset 4',
    width: 174,
    height: 135,
    onlyOnProfit: true,
    onlyOnLose: false,
  },
  image5: {
    card: Card.HUELL_ON_MONEY,
    src: '/images/position-summary-card/styled-cards/thumbnail/image47.png',
    alt: 'Asset 5',
    width: 174,
    height: 135,
    onlyOnProfit: true,
    onlyOnLose: false,
  },
  image6: {
    card: Card.CHRISTMAS_PEPE,
    src: '/images/position-summary-card/styled-cards/thumbnail/image48.png',
    alt: 'Asset 6',
    width: 174,
    height: 135,
    onlyOnProfit: false,
    onlyOnLose: false,
  },
  image7: {
    card: Card.PEPE_ANO_NUEVO,
    src: '/images/position-summary-card/styled-cards/thumbnail/image49.png',
    alt: 'Asset 7',
    width: 174,
    height: 135,
    onlyOnProfit: false,
    onlyOnLose: false,
  },
}

const OPTIONS: EmblaOptionsType = { align: 'start', loop: true, dragFree: true }

type PropType = {
  options?: EmblaOptionsType
  setSelectedCard: (card: Card) => void
  isMobile?: boolean
  isPositivePNL: boolean
}

const Carousel = (props: PropType) => {
  const { options = OPTIONS, setSelectedCard, isMobile } = props
  const slides = useMemo(() => Object.values(cardImages), [])
  const [swipper, setSwipper] = useState<any>(null)

  return (
    <CarouselContainer>
      <ArrowWrapper
        active={!swipper?.isBeginning}
        left={true}
        onClick={() => {
          swipper && swipper.slidePrev()
        }}
      >
        <IconWrapper size={'48px'}>
          <ArrowRightTriangle width={10} height={18} />
        </IconWrapper>
      </ArrowWrapper>
      <Swiper onSwiper={setSwipper} freeMode slidesPerView={'auto'} spaceBetween={10}>
        {Object.values(cardImages).map((image, index) => (
          <SwiperSlide key={index}>
            <button
              onClick={() => {
                if (props.isPositivePNL && image.onlyOnLose) return
                if (!props.isPositivePNL && image.onlyOnProfit) return
                setSelectedCard(image.card)
              }}
            >
              <RoundedImage
                style={{
                  opacity:
                    (props.isPositivePNL && image.onlyOnLose) || (!props.isPositivePNL && image.onlyOnProfit) ? 0.1 : 1,
                }}
                unoptimized={true}
                src={image.src}
                alt={image.alt}
                width={140}
                height={90}
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
      <ArrowWrapper
        left={false}
        onClick={() => {
          swipper && swipper.slideNext()
        }}
        active={!swipper?.isEnd}
      >
        <IconWrapper size={'48px'}>
          <ArrowRightTriangle width={10} height={18} />
        </IconWrapper>
      </ArrowWrapper>
    </CarouselContainer>
  )
}

export default function PositionSummaryCardContent({ width, quote }: PositionSummaryCardContentProps) {
  const { chainId } = useActiveConnectionDetails()
  const {
    id,
    quantity,
    positionType,

    marketId,
    openedPrice,
    quoteStatus,
    avgClosedPrice,
    createTimestamp,
    statusModifyTimestamp,
  } = quote
  const theme = useTheme()
  const { symbol, name, asset, pricePrecision } = useMarket(marketId) || {}
  const { ask: askPrice, bid: bidPrice } = useBidAskPrice(name, pricePrecision)
  const collateralCurrency = getTokenWithFallbackChainId(COLLATERAL_TOKEN, chainId)
  const marketData = useMarketData(name)
  const referralAccountInfo = useUserReferralAccountInfo()
  const isReferralCodeEnabled =
    referralAccountInfo.fetchStatus === ApiState.OK && referralAccountInfo.accountInfo?.isRegistered
  const quoteSize = useQuoteSize(quote)
  const leverage = useQuoteLeverage(quote)
  const lockedAmount = useLockedMargin(quote)
  const notionalValue = useNotionalValue(quoteSize, marketData?.markPrice || 0)
  const closePositionValue = toBN(avgClosedPrice).times(quoteSize)
  const [upnl, pnl] = useQuoteUpnlAndPnl(quote, marketData?.markPrice || 0, undefined, undefined, pricePrecision)
  const [openCards, setOpenCards] = useState(false)
  const [selectedCard, setSelectedCard] = useState<Card>(Card.NONE)
  // const upnlPercent = useMemo(() => {
  //   return parseFloat(toBN(pnl).div(quantity).div(openedPrice).times(leverage).times(100).toFixed(2))
  // }, [leverage, pnl, openedPrice, quantity])

  const getPnlData = useCallback(
    (value: string) => {
      const valueBN = toBN(value)
      const valuePercent = valueBN.div(quoteSize).div(openedPrice).times(leverage).times(100).abs().toFixed(2)
      if (!marketData?.markPrice) return ['-', '-', theme.text0]
      if (valueBN.isGreaterThan(0))
        return [`+$${formatAmount(valueBN, 2, true)}`, `+${formatAmount(valuePercent, 2, true)}%`, theme.green]
      else if (valueBN.isLessThan(0))
        return [
          `-$${formatAmount(Math.abs(valueBN.toNumber()), 2, true)}`,
          `-${formatAmount(valuePercent, 2, true)}%`,
          'url(#paint0_linear_1990_5)',
        ]
      return [`$${formatAmount(valueBN, 2, true)}`, `${formatAmount(valuePercent, 2, true)}%`, theme.text1]
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [openedPrice, quoteSize, theme.green, theme.red1, theme.text0, theme.text1]
  )

  const [uPnl, upnlPercent, upnlColor] = getPnlData(upnl)
  const [PNL, PNLPercent, PNLColor] = getPnlData(pnl)

  // const [PNL, PNLPercent, PNLColor] = useMemo(() => {
  //   const valueBN = toBN(pnl)
  //   const valuePercent = valueBN.div(quoteSize).div(openedPrice).times(leverage).times(100).toFixed(2)

  //   if (!marketData?.markPrice) return ['-', '-', theme.text0]

  //   if (valueBN.isGreaterThan(0)) {
  //     return [`+$${formatAmount(valueBN, 2, true)}`, `+${formatAmount(valuePercent, 2, true)}%`, theme.green]
  //   } else if (valueBN.isLessThan(0)) {
  //     return [
  //       `-$${formatAmount(Math.abs(valueBN.toNumber()), 2, true)}`,
  //       `-${formatAmount(valuePercent, 2, true)}%`,
  //       theme.red1,
  //     ]
  //   }

  //   return [`$${formatAmount(valueBN, 2, true)}`, `${formatAmount(valuePercent, 2, true)}%`, theme.text1]
  // }, [pnl, leverage, marketData?.markPrice, openedPrice, quoteSize, theme.green, theme.red1, theme.text0, theme.text1])

  const [leverageContainerWidthMobile, setLeverageContainerWidthMobile] = useState(0)
  const [symbolContainerWidthMobile, setSymbolContainerWidthMobile] = useState(0)
  const [leverageContainerWidth, setLeverageContainerWidth] = useState(0)
  const [symbolContainerWidth, setSymbolContainerWidth] = useState(0)
  const [displayUPNLAs, setDisplayUPNLAs] = useState<'percentage' | 'figures'>('percentage')
  const [datToShare, setDatToShare] = useState<ShareData | null>(null)
  const [svgAsPng, setSvgAsPng] = useState<string | null>(null)
  const [showReferralCode, setShowReferralCode] = useState(false)
  const [loading, setLoading] = useState(false)

  const leverageTextRef = useRef<SVGTextElement>(null)
  const symbolTextRef = useRef<SVGTextElement>(null)
  const SVGRef = useRef<any>(null)
  const leverageTextRefMobile = useRef<SVGTextElement>(null)
  const symbolTextRefMobile = useRef<SVGTextElement>(null)
  const cachedImages = useRef<{ png: string | null; share: ShareData | null }>({ png: null, share: null })
  const isMobile = useIsMobile()

  useEffect(() => {
    if (leverageTextRef.current) {
      setLeverageContainerWidth(leverageTextRef.current.getComputedTextLength() + 25.64)
    }

    if (symbolTextRef.current) {
      setSymbolContainerWidth(symbolTextRef.current.getComputedTextLength() + 25.64)
    }

    if (leverageTextRefMobile.current) {
      setLeverageContainerWidthMobile(leverageTextRefMobile.current.getComputedTextLength() + 15.28)
    }

    if (symbolTextRefMobile.current) {
      setSymbolContainerWidthMobile(symbolTextRefMobile.current.getComputedTextLength() + 15.28)
    }
  }, [])

  const referralURL = useMemo(() => {
    if (!referralAccountInfo?.accountInfo?.referralCode) return 'https://app.intentx.io'
    return (
      (process.env.NEXT_PUBLIC_APP_URL || 'https://app.intentx.io') +
      '/?referral=' +
      referralAccountInfo.accountInfo.referralCode
    )
  }, [referralAccountInfo])

  const referralCode = useMemo(() => {
    return referralAccountInfo?.accountInfo?.referralCode
  }, [referralAccountInfo])

  const parsedOpenTimestamp = useMemo(() => {
    const date = new Date(createTimestamp * 1000)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    const parsed = `${day}/${month}/${year}`

    return parsed
  }, [createTimestamp])

  const parsedCloseTimestamp = useMemo(() => {
    const date = new Date(statusModifyTimestamp * 1000)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    const parsed = `${day}/${month}/${year}`

    return parsed
  }, [statusModifyTimestamp])

  // useEffect(() => {
  //   setSvgAsPng(null)

  //   if (SVGRef.current) {
  //     toPng(SVGRef.current, { quality: 1 }).then((png: any) => {
  //       setSvgAsPng(png)
  //     })
  //   }
  // }, [displayUPNLAs, leverageContainerWidth, symbolContainerWidth, showReferralCode, selectedCard])

  useEffect(() => {
    cachedImages.current = { png: null, share: null }
  }, [displayUPNLAs, leverageContainerWidth, symbolContainerWidth, showReferralCode, selectedCard])

  const parseSVG = async (): Promise<{
    png: string | null
    share: ShareData | null
  }> => {
    const returnData: {
      png: string | null
      share: ShareData | null
    } = { png: null, share: null }

    if (!SVGRef.current) return returnData

    if (cachedImages.current.png && cachedImages.current.share) {
      return cachedImages.current
    }

    setLoading(true)

    return new Promise((res) => {
      toPng(SVGRef.current, { quality: 1, width: 769, height: 513 }).then((png: any) => {
        fetch(png)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], 'image.png', { type: 'image/png' })
            const filesArray = [file]

            const data = {
              png,
              share: {
                files: filesArray,
                title: '',
                text: '',
              },
            }

            setLoading(false)
            cachedImages.current = data
            res(data)
          })
      })
    })
  }

  const handleShare = async () => {
    if (loading) return

    const { share } = await parseSVG()

    if (!share) return toast.error('Failed to share image.')

    if (!canShare) return toast.error('Sharing is not supported on this browser.')

    try {
      await navigator.share(share)
    } catch (error) {
      console.log('Sharing failed.', error)
    }
  }

  const handleCopy = async () => {
    if (loading) return

    const { png } = await parseSVG()

    if (!png) return

    try {
      const blob = await fetch(png).then((res) => res.blob())

      const clipboardItem = new ClipboardItem({ 'image/png': blob })

      await navigator.clipboard.write([clipboardItem])
      toast.success('Image copied to clipboard.')
    } catch (error) {
      console.log(error)
      toast.error('Failed to copy image.')
    }
  }

  const handleDownloadPng = async () => {
    if (loading) return

    const { png } = await parseSVG()

    if (!png) return

    try {
      toast.loading('Downloading image')

      setTimeout(() => {
        toast.dismiss()
      }, 2000)

      const filename = 'image.png'
      const link = document.createElement('a')
      link.download = filename
      link.href = png
      link.click()
    } catch (error) {
      toast.error('Failed to download image')
    }
  }

  const canShare = useMemo(() => {
    return !!navigator.share
  }, [])

  const canCopy = useMemo(() => {
    return !!navigator.clipboard
  }, [])

  return (
    <Wrapper>
      <SVGWrapperDesktop>
        <svg
          width="769"
          height="513"
          style={{ width: isMobile ? 350 : 769, height: isMobile ? 234 : 513 }}
          viewBox="0 0 769 513"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          ref={SVGRef}
        >
          <g clipPath="url(#clip0_7909_17780)">
            <path
              d="M0 5C0 2.23858 2.23858 0 5 0H758.451C764.277 0 769 4.72281 769 10.5487V512.667H0V5Z"
              fill="#14171C"
            />

            <image
              x="-10"
              y="0"
              width="792"
              height="520"
              xlinkHref="/images/position-summary-card/styled-cards/flash.png"
            />

            {selectedCard !== Card.NONE && (
              <image
                x="55"
                y="0"
                width="792"
                height="520"
                xlinkHref="/images/position-summary-card/styled-cards/decorator-1.png"
              />
            )}

            {selectedCard === Card.NONE && <Default />}
            {selectedCard === Card.RISITAS && <Risitas />}
            {selectedCard === Card.CHRISTMAS_PEPE && <ChristmasPepe />}
            {selectedCard === Card.PEPE_TRADE && <PepeTrade />}
            {selectedCard === Card.WOJAKSAD && <Wojaksad />}
            {selectedCard === Card.HUELL_ON_MONEY && <HuellOnMoney />}
            {selectedCard === Card.AMAZED_PEPE && <AmazedPepe />}
            {selectedCard === Card.PEPE_ANO_NUEVO && <HappyNewYearPepe />}

            <g style={{ mixBlendMode: 'exclusion' }} opacity="0.5">
              <rect x="-80.7422" y="7.68945" width="504.977" height="504.977" fill="url(#pattern1)" />
            </g>
            <path
              d="M62.4219 76.2495C62.2558 76.4195 62.0565 76.5535 61.8365 76.6431C61.6165 76.7327 61.3804 76.7761 61.143 76.7704C60.9056 76.7761 60.6696 76.7327 60.4496 76.6431C60.2296 76.5535 60.0303 76.4195 59.8641 76.2495C59.6945 76.0829 59.5608 75.8832 59.4713 75.6628C59.3819 75.4423 59.3386 75.2058 59.3442 74.9678V62.1482C59.3433 61.911 59.3891 61.676 59.479 61.4566C59.5689 61.2372 59.7011 61.0378 59.868 60.8697C60.035 60.7016 60.2334 60.5681 60.4519 60.477C60.6703 60.3859 60.9046 60.3389 61.1413 60.3386C61.3788 60.3375 61.6142 60.3835 61.8339 60.474C62.0536 60.5645 62.2533 60.6977 62.4213 60.866C62.5893 61.0342 62.7225 61.2341 62.813 61.4542C62.9035 61.6743 62.9497 61.9102 62.9488 62.1482V74.9678C62.9529 75.2062 62.9084 75.4429 62.8178 75.6633C62.7271 75.8837 62.5924 76.0832 62.4219 76.2495Z"
              fill="white"
            />
            <path
              d="M92.1588 67.07C92.0491 66.5349 91.8315 66.0278 91.5194 65.5799C91.1788 65.1035 90.7351 64.7105 90.2214 64.4303C89.6692 64.1154 88.9668 63.958 88.1142 63.958H74.5348C73.6568 63.958 72.948 64.1154 72.4085 64.4303C71.9027 64.7141 71.4659 65.1068 71.1296 65.5799C70.8199 66.0284 70.6047 66.5354 70.497 67.07C70.3887 67.5588 70.3306 68.0575 70.3238 68.5582V74.9681C70.3229 75.3258 70.2165 75.6753 70.0179 75.9726C69.8192 76.2699 69.5373 76.5016 69.2075 76.6386C68.8777 76.7756 68.5148 76.8118 68.1646 76.7426C67.8143 76.6734 67.4923 76.5019 67.2391 76.2497C67.0695 76.0831 66.9358 75.8835 66.8463 75.663C66.7569 75.4425 66.7136 75.206 66.7192 74.9681V68.5582C66.7231 67.5779 66.8816 66.6044 67.1889 65.6737C67.4913 64.7245 67.9525 63.8337 68.5527 63.0393C69.1461 62.2538 69.8873 61.5924 70.7345 61.0925C71.6144 60.583 72.6158 60.3225 73.6319 60.3389H89.4017C90.376 60.3728 91.3239 60.6652 92.1484 61.1863C92.9479 61.6988 93.6435 62.3582 94.1985 63.1296C94.7697 63.9214 95.2081 64.8012 95.4965 65.7345C95.7914 66.648 95.9439 67.6016 95.9488 68.5617V74.9715C95.9488 75.4515 95.7585 75.9117 95.4199 76.2511C95.0813 76.5904 94.622 76.7811 94.1431 76.7811C93.6642 76.7811 93.2049 76.5904 92.8662 76.2511C92.5276 75.9117 92.3373 75.4515 92.3373 74.9715V68.5582C92.3288 68.0573 92.269 67.5586 92.1588 67.07Z"
              fill="white"
            />
            <path
              d="M128.94 60.8666C129.194 61.1197 129.366 61.4425 129.436 61.7941C129.506 62.1457 129.471 62.5102 129.334 62.8413C129.197 63.1725 128.965 63.4554 128.667 63.6542C128.369 63.853 128.019 63.9586 127.661 63.9578H116.524V74.9679C116.524 75.2056 116.477 75.4409 116.386 75.6604C116.296 75.8799 116.163 76.0794 115.995 76.2475C115.827 76.4155 115.628 76.5488 115.409 76.6397C115.19 76.7307 114.955 76.7775 114.718 76.7775C114.481 76.7775 114.246 76.7307 114.027 76.6397C113.808 76.5488 113.609 76.4155 113.441 76.2475C113.274 76.0794 113.141 75.8799 113.05 75.6604C112.959 75.4409 112.912 75.2056 112.912 74.9679V63.9578H101.624C101.178 63.9107 100.763 63.7035 100.458 63.3743C100.299 63.2127 100.174 63.021 100.09 62.8105C100.006 62.6 99.9651 62.3749 99.969 62.1483C99.9681 61.9104 100.014 61.6747 100.105 61.4547C100.195 61.2347 100.328 61.0349 100.496 60.8667C100.664 60.6985 100.863 60.5652 101.083 60.4746C101.302 60.384 101.537 60.3378 101.775 60.3387H127.661C127.899 60.334 128.136 60.3784 128.356 60.4693C128.576 60.5601 128.775 60.6954 128.94 60.8666Z"
              fill="white"
            />
            <path
              d="M140.976 63.9579C140.097 63.9579 139.388 64.1154 138.85 64.4303C138.344 64.7141 137.907 65.1067 137.571 65.5799C137.259 66.0278 137.041 66.5348 136.932 67.0699C136.705 68.0497 136.705 69.0684 136.932 70.0482C137.042 70.5827 137.259 71.0891 137.571 71.5365C137.907 72.0101 138.344 72.4028 138.85 72.6861C139.389 73.0022 140.098 73.1596 140.976 73.1585H161.707C161.945 73.1585 162.179 73.2053 162.399 73.2962C162.618 73.3872 162.817 73.5205 162.984 73.6885C163.152 73.8565 163.285 74.056 163.376 74.2756C163.467 74.4951 163.513 74.7304 163.513 74.968C163.513 75.2057 163.467 75.441 163.376 75.6605C163.285 75.8801 163.152 76.0796 162.984 76.2476C162.817 76.4156 162.618 76.5489 162.399 76.6398C162.179 76.7308 161.945 76.7776 161.707 76.7776H139.772C138.803 76.7947 137.85 76.5331 137.025 76.0239C136.22 75.5191 135.523 74.8591 134.975 74.0824C134.402 73.2723 133.963 72.3744 133.677 71.4236C133.384 70.4965 133.232 69.5306 133.227 68.5582C133.23 67.5779 133.389 66.6044 133.696 65.6737C134.001 64.7224 134.465 63.8298 135.069 63.0341C135.663 62.2504 136.405 61.5908 137.252 61.0925C138.132 60.5832 139.132 60.3227 140.148 60.3388H161.707C162.186 60.3388 162.646 60.5295 162.984 60.8688C163.323 61.2082 163.513 61.6685 163.513 62.1484C163.513 62.6283 163.323 63.0886 162.984 63.4279C162.646 63.7673 162.186 63.9579 161.707 63.9579H140.976ZM161.408 67.2766C161.661 67.5298 161.834 67.8527 161.904 68.2045C161.974 68.5562 161.938 68.9208 161.801 69.2521C161.663 69.5833 161.431 69.8662 161.133 70.0649C160.835 70.2635 160.485 70.3689 160.127 70.3678H141.39C140.912 70.3678 140.452 70.1771 140.114 69.8378C139.775 69.4984 139.585 69.0381 139.585 68.5582C139.585 68.0783 139.775 67.618 140.114 67.2787C140.452 66.9393 140.912 66.7487 141.39 66.7487H160.127C160.365 66.7444 160.602 66.7891 160.822 66.8799C161.042 66.9707 161.241 67.1057 161.408 67.2766Z"
              fill="white"
            />
            <path
              d="M193.43 60.8665C193.682 60.6126 194.004 60.4396 194.355 60.3694C194.706 60.2992 195.07 60.3351 195.4 60.4724C195.731 60.6097 196.013 60.8423 196.211 61.1406C196.41 61.4389 196.515 61.7896 196.514 62.1481V73.12C196.526 73.6021 196.44 74.0815 196.261 74.5292C196.082 74.9769 195.815 75.3837 195.475 75.7249C195.141 76.0699 194.74 76.3418 194.297 76.5235C193.853 76.7053 193.377 76.7929 192.898 76.7808C192.206 76.7778 191.529 76.5824 190.941 76.2164L173.709 65.6578C173.232 65.3817 172.842 65.1629 172.524 64.9979C172.289 64.8582 172.025 64.7744 171.752 64.753C171.376 64.753 171.137 64.9927 171.038 65.4702C170.921 66.1549 170.871 66.8493 170.888 67.5437V74.9712C170.895 75.2137 170.854 75.4552 170.767 75.6814C170.679 75.9076 170.547 76.1139 170.379 76.2881C170.21 76.4623 170.009 76.6007 169.786 76.6953C169.563 76.7899 169.323 76.8386 169.081 76.8386C168.839 76.8386 168.599 76.7899 168.376 76.6953C168.154 76.6007 167.952 76.4623 167.783 76.2881C167.615 76.1139 167.483 75.9076 167.396 75.6814C167.308 75.4552 167.267 75.2137 167.274 74.9712V63.9959C167.263 63.5137 167.349 63.0343 167.528 62.5865C167.706 62.1388 167.974 61.732 168.314 61.3909C168.648 61.046 169.049 60.7741 169.492 60.5923C169.936 60.4106 170.412 60.323 170.891 60.3351C171.243 60.3346 171.593 60.3855 171.931 60.4862C172.256 60.5814 172.566 60.7211 172.853 60.9012L190.083 71.4581C190.561 71.7336 190.956 71.9536 191.269 72.118C191.504 72.2577 191.769 72.3415 192.042 72.3628C192.418 72.3628 192.655 72.1249 192.756 71.6456C192.873 70.961 192.923 70.2665 192.906 69.5721V62.1481C192.901 61.9099 192.945 61.6732 193.035 61.4528C193.125 61.2323 193.259 61.0327 193.43 60.8665Z"
              fill="white"
            />
            <path
              d="M229.245 60.8666C229.498 61.1197 229.671 61.4425 229.741 61.7941C229.811 62.1457 229.775 62.5102 229.638 62.8413C229.501 63.1725 229.269 63.4554 228.971 63.6542C228.674 63.853 228.324 63.9586 227.966 63.9578H216.828V74.9679C216.828 75.4478 216.638 75.9081 216.3 76.2475C215.961 76.5868 215.502 76.7775 215.023 76.7775C214.544 76.7775 214.085 76.5868 213.746 76.2475C213.407 75.9081 213.217 75.4478 213.217 74.9679V63.9578H201.93C201.483 63.9111 201.069 63.7038 200.762 63.3743C200.604 63.2127 200.479 63.021 200.395 62.8105C200.311 62.6 200.27 62.3749 200.274 62.1483C200.273 61.9104 200.319 61.6747 200.409 61.4547C200.5 61.2347 200.633 61.0349 200.801 60.8667C200.968 60.6985 201.168 60.5652 201.387 60.4746C201.607 60.384 201.842 60.3378 202.079 60.3387H227.966C228.204 60.334 228.44 60.3784 228.66 60.4693C228.88 60.5601 229.079 60.6954 229.245 60.8666Z"
              fill="white"
            />
            <path
              d="M263.558 64.5303L266.181 66.8591L275.158 59.324V47.0618L272.403 49.0641L271.001 50.0887L269.51 51.1775L269.174 51.4224C266.681 53.2406 263.854 55.3002 261.246 57.5648L260.86 57.8947C259.905 58.7057 258.823 59.6313 258.208 61.1214C257.562 62.6706 257.523 64.4071 258.099 65.9839C258.915 68.1303 260.641 69.4293 262.165 70.5755C262.492 70.8221 262.801 71.0548 263.093 71.2892C265.043 72.8522 267.034 74.4307 268.959 75.9537L271.223 77.7477V81.8825L257.68 71.2006L257.69 75.5422L274.694 89.1086V76.0631L274.037 75.5422L271.112 73.2255C269.19 71.7043 267.204 70.1326 265.263 68.5731C264.929 68.3057 264.584 68.0522 264.248 67.7934C262.991 66.847 261.802 65.9526 261.343 64.7457C261.079 63.9971 261.105 63.1762 261.418 62.4464C261.712 61.7309 262.326 61.2099 263.104 60.5483C263.242 60.4325 263.381 60.3167 263.52 60.201C266.015 58.0337 268.777 56.0192 271.216 54.2426L271.552 53.9978L271.687 53.8988V57.7002L263.558 64.5303Z"
              fill="url(#paint0_linear_7909_17780)"
            />
            <path
              d="M255.791 65.2167L255.779 60.8751L238.77 47.314V60.349L239.427 60.8699C240.401 61.6445 241.376 62.4173 242.352 63.1883C244.272 64.7096 246.26 66.2812 248.199 67.839C248.535 68.1081 248.88 68.3686 249.214 68.6204C250.473 69.5669 251.661 70.4612 252.121 71.6682C252.384 72.4169 252.357 73.2374 252.046 73.9674C251.751 74.6829 251.136 75.2039 250.36 75.8638L249.944 76.2198C247.449 78.3871 244.686 80.4016 242.248 82.1781L241.912 82.423L241.777 82.5202V78.7171L249.913 71.8957L247.289 69.5599L238.312 77.102V89.3608L241.068 87.3567L242.47 86.3321L243.96 85.245L244.296 85.0001C246.79 83.1819 249.616 81.1223 252.225 78.8577C252.353 78.7466 252.481 78.6355 252.611 78.5278C253.564 77.7168 254.647 76.7912 255.262 75.2994C255.908 73.7502 255.947 72.0137 255.372 70.4369C254.554 68.2905 252.829 66.9932 251.306 65.8471C250.979 65.6005 250.67 65.3678 250.377 65.1333C248.428 63.5704 246.437 61.9918 244.51 60.467L242.257 58.6749V54.5296L255.791 65.2167Z"
              fill="url(#paint1_linear_7909_17780)"
            />

            {isReferralCodeEnabled && showReferralCode && (
              <g>
                <g style={{ mixBlendMode: 'lighten' }}>
                  <QRCode value={referralURL} x="63.9962" y="399.824" size={50.9017} />
                  <rect
                    x="57.9962"
                    y="393.824"
                    width="62.8017"
                    height="62.1608"
                    stroke="url(#paint2_linear_7909_17780)"
                    strokeWidth="0.640833"
                  />
                </g>
                <path
                  d="M141.559 406.986L138.996 402.532H137.602V406.986H135.776V395.851H139.621C140.475 395.851 141.196 396.001 141.784 396.3C142.382 396.599 142.825 397 143.113 397.502C143.412 398.003 143.562 398.564 143.562 399.184C143.562 399.91 143.348 400.572 142.921 401.17C142.505 401.758 141.858 402.158 140.983 402.372L143.738 406.986H141.559ZM137.602 401.074H139.621C140.304 401.074 140.817 400.903 141.159 400.561C141.511 400.22 141.687 399.76 141.687 399.184C141.687 398.607 141.517 398.158 141.175 397.838C140.833 397.507 140.315 397.341 139.621 397.341H137.602V401.074ZM153.989 402.356C153.989 402.687 153.967 402.986 153.925 403.253H147.18C147.233 403.958 147.495 404.524 147.965 404.951C148.435 405.378 149.012 405.592 149.695 405.592C150.678 405.592 151.372 405.181 151.778 404.358H153.749C153.482 405.17 152.996 405.838 152.291 406.361C151.596 406.874 150.731 407.13 149.695 407.13C148.851 407.13 148.093 406.943 147.42 406.569C146.758 406.185 146.235 405.651 145.85 404.967C145.476 404.273 145.29 403.472 145.29 402.564C145.29 401.656 145.471 400.861 145.834 400.177C146.208 399.483 146.726 398.949 147.388 398.575C148.061 398.201 148.83 398.014 149.695 398.014C150.528 398.014 151.271 398.196 151.922 398.559C152.574 398.922 153.081 399.435 153.444 400.097C153.807 400.748 153.989 401.501 153.989 402.356ZM152.082 401.779C152.072 401.106 151.831 400.567 151.361 400.161C150.891 399.755 150.309 399.552 149.615 399.552C148.985 399.552 148.446 399.755 147.997 400.161C147.548 400.556 147.281 401.096 147.196 401.779H152.082ZM159.487 399.648H157.853V406.986H156.01V399.648H154.969V398.158H156.01V397.534C156.01 396.519 156.277 395.782 156.812 395.323C157.356 394.853 158.205 394.618 159.359 394.618V396.14C158.803 396.14 158.414 396.247 158.189 396.46C157.965 396.663 157.853 397.021 157.853 397.534V398.158H159.487V399.648ZM169.196 402.356C169.196 402.687 169.175 402.986 169.132 403.253H162.387C162.441 403.958 162.702 404.524 163.172 404.951C163.642 405.378 164.219 405.592 164.903 405.592C165.885 405.592 166.579 405.181 166.985 404.358H168.956C168.689 405.17 168.203 405.838 167.498 406.361C166.804 406.874 165.939 407.13 164.903 407.13C164.059 407.13 163.3 406.943 162.628 406.569C161.965 406.185 161.442 405.651 161.058 404.967C160.684 404.273 160.497 403.472 160.497 402.564C160.497 401.656 160.678 400.861 161.042 400.177C161.415 399.483 161.933 398.949 162.596 398.575C163.268 398.201 164.037 398.014 164.903 398.014C165.736 398.014 166.478 398.196 167.129 398.559C167.781 398.922 168.288 399.435 168.651 400.097C169.015 400.748 169.196 401.501 169.196 402.356ZM167.29 401.779C167.279 401.106 167.039 400.567 166.569 400.161C166.099 399.755 165.517 399.552 164.822 399.552C164.192 399.552 163.653 399.755 163.204 400.161C162.756 400.556 162.489 401.096 162.403 401.779H167.29ZM172.82 399.44C173.087 398.991 173.439 398.644 173.877 398.399C174.326 398.142 174.854 398.014 175.463 398.014V399.905H174.999C174.283 399.905 173.738 400.086 173.365 400.449C173.001 400.812 172.82 401.443 172.82 402.34V406.986H170.993V398.158H172.82V399.44ZM178.968 399.44C179.235 398.991 179.588 398.644 180.026 398.399C180.474 398.142 181.003 398.014 181.612 398.014V399.905H181.147C180.432 399.905 179.887 400.086 179.513 400.449C179.15 400.812 178.968 401.443 178.968 402.34V406.986H177.142V398.158H178.968V399.44ZM182.682 402.532C182.682 401.646 182.863 400.861 183.227 400.177C183.6 399.493 184.102 398.965 184.733 398.591C185.373 398.206 186.078 398.014 186.847 398.014C187.542 398.014 188.145 398.153 188.658 398.431C189.181 398.698 189.598 399.034 189.907 399.44V398.158H191.75V406.986H189.907V405.672C189.598 406.089 189.176 406.436 188.642 406.713C188.108 406.991 187.499 407.13 186.815 407.13C186.057 407.13 185.363 406.938 184.733 406.553C184.102 406.158 183.6 405.613 183.227 404.919C182.863 404.214 182.682 403.419 182.682 402.532ZM189.907 402.564C189.907 401.955 189.779 401.427 189.523 400.978C189.277 400.529 188.951 400.188 188.546 399.953C188.14 399.718 187.702 399.6 187.232 399.6C186.762 399.6 186.324 399.718 185.918 399.953C185.512 400.177 185.181 400.513 184.925 400.962C184.679 401.4 184.556 401.923 184.556 402.532C184.556 403.141 184.679 403.675 184.925 404.134C185.181 404.593 185.512 404.946 185.918 405.192C186.335 405.426 186.773 405.544 187.232 405.544C187.702 405.544 188.14 405.426 188.546 405.192C188.951 404.957 189.277 404.615 189.523 404.166C189.779 403.707 189.907 403.173 189.907 402.564ZM195.975 395.13V406.986H194.149V395.13H195.975ZM201.926 401.395C201.926 400.305 202.177 399.328 202.679 398.463C203.191 397.598 203.88 396.925 204.745 396.444C205.621 395.953 206.577 395.707 207.613 395.707C208.799 395.707 209.851 396.001 210.769 396.588C211.698 397.165 212.371 397.987 212.788 399.056H210.593C210.305 398.468 209.904 398.03 209.391 397.742C208.879 397.453 208.286 397.309 207.613 397.309C206.876 397.309 206.219 397.475 205.643 397.806C205.066 398.137 204.612 398.612 204.281 399.232C203.96 399.851 203.8 400.572 203.8 401.395C203.8 402.217 203.96 402.938 204.281 403.557C204.612 404.177 205.066 404.657 205.643 404.999C206.219 405.33 206.876 405.496 207.613 405.496C208.286 405.496 208.879 405.352 209.391 405.063C209.904 404.775 210.305 404.337 210.593 403.75H212.788C212.371 404.818 211.698 405.64 210.769 406.217C209.851 406.794 208.799 407.082 207.613 407.082C206.566 407.082 205.61 406.842 204.745 406.361C203.88 405.87 203.191 405.192 202.679 404.326C202.177 403.461 201.926 402.484 201.926 401.395ZM218.755 407.13C217.921 407.13 217.169 406.943 216.496 406.569C215.823 406.185 215.294 405.651 214.91 404.967C214.525 404.273 214.333 403.472 214.333 402.564C214.333 401.667 214.53 400.871 214.926 400.177C215.321 399.483 215.86 398.949 216.544 398.575C217.227 398.201 217.991 398.014 218.835 398.014C219.678 398.014 220.442 398.201 221.126 398.575C221.809 398.949 222.349 399.483 222.744 400.177C223.139 400.871 223.337 401.667 223.337 402.564C223.337 403.461 223.134 404.257 222.728 404.951C222.322 405.645 221.766 406.185 221.062 406.569C220.367 406.943 219.598 407.13 218.755 407.13ZM218.755 405.544C219.225 405.544 219.662 405.432 220.068 405.208C220.485 404.983 220.821 404.647 221.078 404.198C221.334 403.75 221.462 403.205 221.462 402.564C221.462 401.923 221.339 401.384 221.094 400.946C220.848 400.497 220.522 400.161 220.116 399.937C219.71 399.712 219.273 399.6 218.803 399.6C218.333 399.6 217.895 399.712 217.489 399.937C217.094 400.161 216.779 400.497 216.544 400.946C216.309 401.384 216.191 401.923 216.191 402.564C216.191 403.515 216.432 404.252 216.912 404.775C217.403 405.288 218.018 405.544 218.755 405.544ZM224.533 402.532C224.533 401.646 224.715 400.861 225.078 400.177C225.452 399.493 225.954 398.965 226.584 398.591C227.225 398.206 227.935 398.014 228.715 398.014C229.291 398.014 229.857 398.142 230.413 398.399C230.979 398.644 231.428 398.975 231.759 399.392V395.13H233.601V406.986H231.759V405.656C231.46 406.083 231.043 406.436 230.509 406.713C229.986 406.991 229.382 407.13 228.699 407.13C227.93 407.13 227.225 406.938 226.584 406.553C225.954 406.158 225.452 405.613 225.078 404.919C224.715 404.214 224.533 403.419 224.533 402.532ZM231.759 402.564C231.759 401.955 231.63 401.427 231.374 400.978C231.128 400.529 230.803 400.188 230.397 399.953C229.991 399.718 229.553 399.6 229.083 399.6C228.613 399.6 228.175 399.718 227.769 399.953C227.364 400.177 227.032 400.513 226.776 400.962C226.53 401.4 226.408 401.923 226.408 402.532C226.408 403.141 226.53 403.675 226.776 404.134C227.032 404.593 227.364 404.946 227.769 405.192C228.186 405.426 228.624 405.544 229.083 405.544C229.553 405.544 229.991 405.426 230.397 405.192C230.803 404.957 231.128 404.615 231.374 404.166C231.63 403.707 231.759 403.173 231.759 402.564ZM244.09 402.356C244.09 402.687 244.069 402.986 244.026 403.253H237.282C237.335 403.958 237.597 404.524 238.067 404.951C238.537 405.378 239.113 405.592 239.797 405.592C240.779 405.592 241.474 405.181 241.88 404.358H243.85C243.583 405.17 243.097 405.838 242.392 406.361C241.698 406.874 240.833 407.13 239.797 407.13C238.953 407.13 238.195 406.943 237.522 406.569C236.86 406.185 236.336 405.651 235.952 404.967C235.578 404.273 235.391 403.472 235.391 402.564C235.391 401.656 235.573 400.861 235.936 400.177C236.31 399.483 236.828 398.949 237.49 398.575C238.163 398.201 238.932 398.014 239.797 398.014C240.63 398.014 241.372 398.196 242.024 398.559C242.675 398.922 243.183 399.435 243.546 400.097C243.909 400.748 244.09 401.501 244.09 402.356ZM242.184 401.779C242.173 401.106 241.933 400.567 241.463 400.161C240.993 399.755 240.411 399.552 239.717 399.552C239.087 399.552 238.547 399.755 238.099 400.161C237.65 400.556 237.383 401.096 237.298 401.779H242.184Z"
                  fill="url(#paint3_linear_7909_17780)"
                />
                {/* <path
                  d="M135.882 434.576C139.026 432.218 141.452 430.107 143.161 428.245C144.887 426.365 145.75 424.528 145.75 422.733C145.75 421.554 145.451 420.614 144.853 419.914C144.272 419.196 143.315 418.837 141.982 418.837C140.683 418.837 139.675 419.247 138.958 420.068C138.257 420.871 137.864 421.947 137.778 423.297H136.035C136.138 421.4 136.719 419.931 137.778 418.888C138.855 417.829 140.256 417.299 141.982 417.299C143.64 417.299 144.981 417.769 146.007 418.709C147.032 419.632 147.545 420.948 147.545 422.657C147.545 424.724 146.682 426.732 144.956 428.68C143.247 430.611 141.136 432.5 138.624 434.345H148.109V435.858H135.882V434.576ZM153.293 431.09C153.481 432.201 153.909 433.055 154.575 433.653C155.241 434.251 156.156 434.55 157.318 434.55C158.924 434.55 160.112 433.927 160.881 432.679C161.667 431.415 162.026 429.33 161.957 426.425C161.633 427.364 161.009 428.108 160.086 428.655C159.18 429.184 158.138 429.449 156.959 429.449C155.165 429.449 153.721 428.911 152.627 427.834C151.55 426.758 151.012 425.263 151.012 423.349C151.012 422.204 151.234 421.17 151.678 420.247C152.123 419.324 152.798 418.598 153.703 418.068C154.609 417.538 155.72 417.274 157.036 417.274C159.462 417.274 161.154 418.068 162.111 419.657C163.068 421.23 163.547 423.494 163.547 426.45C163.547 429.646 163.068 432.047 162.111 433.653C161.171 435.26 159.548 436.063 157.241 436.063C155.549 436.063 154.233 435.61 153.293 434.704C152.353 433.781 151.798 432.577 151.627 431.09H153.293ZM157.241 427.911C158.044 427.911 158.779 427.749 159.445 427.424C160.129 427.083 160.676 426.587 161.086 425.938C161.496 425.288 161.701 424.511 161.701 423.605C161.701 422.204 161.3 421.05 160.496 420.144C159.71 419.239 158.574 418.786 157.087 418.786C155.771 418.786 154.712 419.196 153.909 420.016C153.122 420.837 152.729 421.93 152.729 423.297C152.729 424.733 153.122 425.861 153.909 426.681C154.695 427.501 155.805 427.911 157.241 427.911ZM166.853 422.298C166.973 420.743 167.571 419.521 168.648 418.632C169.741 417.726 171.151 417.274 172.877 417.274C174.022 417.274 175.005 417.479 175.825 417.889C176.645 418.299 177.261 418.863 177.671 419.581C178.098 420.281 178.311 421.076 178.311 421.964C178.311 423.041 177.995 423.972 177.363 424.758C176.731 425.545 175.834 426.032 174.672 426.22V426.348C175.885 426.587 176.85 427.117 177.568 427.937C178.286 428.74 178.645 429.8 178.645 431.116C178.645 432.585 178.149 433.79 177.158 434.73C176.184 435.653 174.766 436.114 172.903 436.114C171.126 436.114 169.665 435.653 168.52 434.73C167.375 433.79 166.717 432.466 166.546 430.757H168.289C168.443 431.902 168.921 432.833 169.724 433.551C170.528 434.251 171.587 434.602 172.903 434.602C174.202 434.602 175.193 434.26 175.876 433.576C176.577 432.893 176.927 432.021 176.927 430.962C176.927 428.364 175.056 427.065 171.314 427.065H170.75V425.553H171.339C174.825 425.553 176.568 424.417 176.568 422.144C176.568 421.153 176.244 420.358 175.594 419.76C174.945 419.145 174.022 418.837 172.826 418.837C171.664 418.837 170.698 419.145 169.929 419.76C169.177 420.358 168.733 421.204 168.596 422.298H166.853ZM185.488 426.45C184.428 426.108 183.617 425.57 183.053 424.835C182.506 424.101 182.232 423.212 182.232 422.169C182.232 421.247 182.463 420.426 182.924 419.709C183.403 418.974 184.095 418.401 185.001 417.991C185.907 417.564 186.992 417.35 188.256 417.35C189.521 417.35 190.606 417.564 191.512 417.991C192.417 418.401 193.101 418.974 193.562 419.709C194.041 420.426 194.28 421.247 194.28 422.169C194.28 423.195 193.998 424.083 193.434 424.835C192.887 425.587 192.084 426.126 191.025 426.45C192.187 426.741 193.101 427.296 193.767 428.116C194.434 428.937 194.767 429.936 194.767 431.116C194.767 432.209 194.494 433.166 193.947 433.986C193.417 434.79 192.657 435.413 191.665 435.858C190.691 436.302 189.555 436.524 188.256 436.524C186.957 436.524 185.813 436.302 184.821 435.858C183.847 435.413 183.087 434.79 182.54 433.986C182.01 433.166 181.745 432.209 181.745 431.116C181.745 429.936 182.079 428.937 182.745 428.116C183.412 427.296 184.326 426.741 185.488 426.45ZM192.537 422.375C192.537 421.247 192.152 420.375 191.383 419.76C190.614 419.145 189.572 418.837 188.256 418.837C186.94 418.837 185.898 419.145 185.129 419.76C184.36 420.358 183.975 421.23 183.975 422.375C183.975 423.434 184.369 424.28 185.155 424.912C185.941 425.545 186.975 425.861 188.256 425.861C189.538 425.861 190.572 425.545 191.358 424.912C192.144 424.28 192.537 423.434 192.537 422.375ZM188.256 427.245C186.855 427.245 185.71 427.561 184.821 428.193C183.933 428.826 183.488 429.783 183.488 431.064C183.488 432.295 183.916 433.26 184.77 433.961C185.625 434.661 186.787 435.012 188.256 435.012C189.709 435.012 190.862 434.661 191.717 433.961C192.571 433.243 192.998 432.278 192.998 431.064C192.998 429.8 192.554 428.851 191.665 428.219C190.794 427.57 189.658 427.245 188.256 427.245ZM208.917 419.017L201.766 435.986H199.946L207.174 419.17H196.921V417.632H208.917V419.017ZM210.794 431.628V430.27L220.124 417.709H222.252V430.065H224.995V431.628H222.252V435.986H220.483V431.628H210.794ZM220.56 419.683L212.87 430.065H220.56V419.683ZM230.872 426.45C229.812 426.108 229.001 425.57 228.437 424.835C227.89 424.101 227.616 423.212 227.616 422.169C227.616 421.247 227.847 420.426 228.309 419.709C228.787 418.974 229.479 418.401 230.385 417.991C231.291 417.564 232.376 417.35 233.64 417.35C234.905 417.35 235.99 417.564 236.896 417.991C237.801 418.401 238.485 418.974 238.946 419.709C239.425 420.426 239.664 421.247 239.664 422.169C239.664 423.195 239.382 424.083 238.818 424.835C238.271 425.587 237.468 426.126 236.409 426.45C237.571 426.741 238.485 427.296 239.151 428.116C239.818 428.937 240.151 429.936 240.151 431.116C240.151 432.209 239.878 433.166 239.331 433.986C238.801 434.79 238.041 435.413 237.049 435.858C236.075 436.302 234.939 436.524 233.64 436.524C232.341 436.524 231.197 436.302 230.205 435.858C229.231 435.413 228.471 434.79 227.924 433.986C227.394 433.166 227.129 432.209 227.129 431.116C227.129 429.936 227.463 428.937 228.129 428.116C228.796 427.296 229.71 426.741 230.872 426.45ZM237.921 422.375C237.921 421.247 237.537 420.375 236.768 419.76C235.999 419.145 234.956 418.837 233.64 418.837C232.324 418.837 231.282 419.145 230.513 419.76C229.744 420.358 229.359 421.23 229.359 422.375C229.359 423.434 229.753 424.28 230.539 424.912C231.325 425.545 232.359 425.861 233.64 425.861C234.922 425.861 235.956 425.545 236.742 424.912C237.528 424.28 237.921 423.434 237.921 422.375ZM233.64 427.245C232.239 427.245 231.094 427.561 230.205 428.193C229.317 428.826 228.872 429.783 228.872 431.064C228.872 432.295 229.3 433.26 230.154 433.961C231.009 434.661 232.171 435.012 233.64 435.012C235.093 435.012 236.246 434.661 237.101 433.961C237.955 433.243 238.382 432.278 238.382 431.064C238.382 429.8 237.938 428.851 237.049 428.219C236.178 427.57 235.042 427.245 233.64 427.245ZM242.946 434.576C246.09 432.218 248.517 430.107 250.226 428.245C251.952 426.365 252.815 424.528 252.815 422.733C252.815 421.554 252.516 420.614 251.917 419.914C251.336 419.196 250.379 418.837 249.046 418.837C247.748 418.837 246.739 419.247 246.022 420.068C245.321 420.871 244.928 421.947 244.843 423.297H243.1C243.202 421.4 243.783 419.931 244.843 418.888C245.919 417.829 247.32 417.299 249.046 417.299C250.704 417.299 252.046 417.769 253.071 418.709C254.096 419.632 254.609 420.948 254.609 422.657C254.609 424.724 253.746 426.732 252.02 428.68C250.311 430.611 248.201 432.5 245.689 434.345H255.173V435.858H242.946V434.576ZM261.537 426.45C260.477 426.108 259.665 425.57 259.102 424.835C258.555 424.101 258.281 423.212 258.281 422.169C258.281 421.247 258.512 420.426 258.973 419.709C259.452 418.974 260.144 418.401 261.05 417.991C261.955 417.564 263.041 417.35 264.305 417.35C265.57 417.35 266.655 417.564 267.561 417.991C268.466 418.401 269.15 418.974 269.611 419.709C270.09 420.426 270.329 421.247 270.329 422.169C270.329 423.195 270.047 424.083 269.483 424.835C268.936 425.587 268.133 426.126 267.074 426.45C268.236 426.741 269.15 427.296 269.816 428.116C270.483 428.937 270.816 429.936 270.816 431.116C270.816 432.209 270.543 433.166 269.996 433.986C269.466 434.79 268.706 435.413 267.714 435.858C266.74 436.302 265.604 436.524 264.305 436.524C263.006 436.524 261.861 436.302 260.87 435.858C259.896 435.413 259.136 434.79 258.589 433.986C258.059 433.166 257.794 432.209 257.794 431.116C257.794 429.936 258.127 428.937 258.794 428.116C259.46 427.296 260.375 426.741 261.537 426.45ZM268.586 422.375C268.586 421.247 268.201 420.375 267.432 419.76C266.663 419.145 265.621 418.837 264.305 418.837C262.989 418.837 261.947 419.145 261.178 419.76C260.409 420.358 260.024 421.23 260.024 422.375C260.024 423.434 260.417 424.28 261.203 424.912C261.99 425.545 263.023 425.861 264.305 425.861C265.587 425.861 266.621 425.545 267.407 424.912C268.193 424.28 268.586 423.434 268.586 422.375ZM264.305 427.245C262.904 427.245 261.759 427.561 260.87 428.193C259.982 428.826 259.537 429.783 259.537 431.064C259.537 432.295 259.965 433.26 260.819 433.961C261.673 434.661 262.835 435.012 264.305 435.012C265.758 435.012 266.911 434.661 267.766 433.961C268.62 433.243 269.047 432.278 269.047 431.064C269.047 429.8 268.603 428.851 267.714 428.219C266.843 427.57 265.706 427.245 264.305 427.245Z"
                  fill="white"
                /> */}
                <text
                  fill="#fff"
                  xmlSpace="preserve"
                  style={{
                    whiteSpace: 'pre',
                  }}
                  fontFamily="Poppins"
                  fontSize="25.633"
                  fontWeight="300"
                  letterSpacing="0em"
                >
                  <tspan x="134" y="436">
                    {referralCode}
                  </tspan>
                </text>

                <path
                  d="M137.227 446.877V452.414C137.227 453.021 137.385 453.486 137.701 453.811C138.018 454.127 138.462 454.285 139.034 454.285C139.615 454.285 140.064 454.127 140.38 453.811C140.696 453.486 140.854 453.021 140.854 452.414V446.877H142.662V452.401C142.662 453.162 142.495 453.807 142.162 454.337C141.837 454.858 141.397 455.251 140.842 455.516C140.295 455.781 139.684 455.913 139.009 455.913C138.342 455.913 137.736 455.781 137.189 455.516C136.651 455.251 136.223 454.858 135.907 454.337C135.591 453.807 135.433 453.162 135.433 452.401V446.877H137.227ZM147.112 455.939C146.531 455.939 146.01 455.836 145.549 455.631C145.087 455.417 144.72 455.131 144.446 454.772C144.182 454.413 144.036 454.016 144.011 453.58H145.818C145.852 453.854 145.984 454.08 146.215 454.26C146.454 454.439 146.749 454.529 147.1 454.529C147.441 454.529 147.706 454.46 147.894 454.324C148.091 454.187 148.189 454.012 148.189 453.798C148.189 453.568 148.069 453.397 147.83 453.286C147.599 453.166 147.228 453.038 146.715 452.901C146.185 452.773 145.749 452.64 145.408 452.504C145.074 452.367 144.784 452.158 144.536 451.876C144.297 451.594 144.177 451.214 144.177 450.735C144.177 450.342 144.288 449.983 144.511 449.658C144.741 449.334 145.066 449.077 145.485 448.889C145.912 448.701 146.412 448.607 146.984 448.607C147.83 448.607 148.505 448.821 149.009 449.248C149.513 449.667 149.791 450.235 149.842 450.953H148.125C148.099 450.671 147.98 450.449 147.766 450.286C147.561 450.116 147.283 450.03 146.933 450.03C146.608 450.03 146.356 450.09 146.177 450.21C146.006 450.329 145.92 450.496 145.92 450.709C145.92 450.949 146.04 451.132 146.279 451.261C146.518 451.38 146.89 451.504 147.394 451.632C147.907 451.76 148.33 451.893 148.663 452.03C148.996 452.166 149.283 452.38 149.522 452.67C149.77 452.952 149.898 453.328 149.906 453.798C149.906 454.208 149.791 454.576 149.56 454.9C149.338 455.225 149.013 455.481 148.586 455.669C148.168 455.849 147.676 455.939 147.112 455.939ZM157.98 452.119C157.98 452.376 157.963 452.606 157.929 452.811H152.738C152.781 453.324 152.96 453.726 153.276 454.016C153.592 454.307 153.981 454.452 154.442 454.452C155.109 454.452 155.583 454.166 155.865 453.593H157.8C157.595 454.277 157.202 454.841 156.621 455.285C156.04 455.721 155.327 455.939 154.481 455.939C153.797 455.939 153.182 455.789 152.635 455.49C152.097 455.182 151.674 454.751 151.366 454.196C151.067 453.64 150.918 452.999 150.918 452.273C150.918 451.538 151.067 450.893 151.366 450.338C151.666 449.782 152.084 449.355 152.622 449.056C153.161 448.757 153.78 448.607 154.481 448.607C155.156 448.607 155.758 448.753 156.288 449.043C156.826 449.334 157.241 449.748 157.531 450.286C157.83 450.816 157.98 451.427 157.98 452.119ZM156.121 451.607C156.113 451.145 155.946 450.778 155.622 450.504C155.297 450.222 154.9 450.081 154.43 450.081C153.985 450.081 153.609 450.218 153.302 450.492C153.003 450.756 152.819 451.128 152.751 451.607H156.121ZM163.254 447.877C162.937 447.877 162.672 447.779 162.459 447.582C162.254 447.377 162.151 447.125 162.151 446.826C162.151 446.527 162.254 446.279 162.459 446.083C162.672 445.878 162.937 445.775 163.254 445.775C163.57 445.775 163.83 445.878 164.035 446.083C164.249 446.279 164.356 446.527 164.356 446.826C164.356 447.125 164.249 447.377 164.035 447.582C163.83 447.779 163.57 447.877 163.254 447.877ZM164.138 448.723V455.823H162.344V448.723H164.138ZM168 450.197V453.632C168 453.871 168.055 454.046 168.166 454.157C168.286 454.26 168.483 454.311 168.756 454.311H169.589V455.823H168.461C166.949 455.823 166.193 455.088 166.193 453.619V450.197H165.347V448.723H166.193V446.967H168V448.723H169.589V450.197H168ZM173.472 452.247C173.472 451.53 173.613 450.893 173.895 450.338C174.186 449.782 174.574 449.355 175.061 449.056C175.557 448.757 176.108 448.607 176.715 448.607C177.245 448.607 177.706 448.714 178.099 448.928C178.501 449.141 178.821 449.411 179.06 449.735V448.723H180.867V455.823H179.06V454.785C178.83 455.118 178.509 455.396 178.099 455.618C177.697 455.832 177.232 455.939 176.702 455.939C176.104 455.939 175.557 455.785 175.061 455.477C174.574 455.17 174.186 454.738 173.895 454.183C173.613 453.619 173.472 452.974 173.472 452.247ZM179.06 452.273C179.06 451.837 178.975 451.466 178.804 451.158C178.633 450.842 178.402 450.603 178.112 450.44C177.821 450.269 177.509 450.184 177.176 450.184C176.843 450.184 176.535 450.265 176.253 450.427C175.971 450.59 175.741 450.829 175.561 451.145C175.39 451.453 175.305 451.82 175.305 452.247C175.305 452.675 175.39 453.051 175.561 453.375C175.741 453.691 175.971 453.935 176.253 454.106C176.544 454.277 176.852 454.362 177.176 454.362C177.509 454.362 177.821 454.281 178.112 454.119C178.402 453.948 178.633 453.708 178.804 453.401C178.975 453.085 179.06 452.709 179.06 452.273ZM186.555 448.62C187.401 448.62 188.084 448.889 188.605 449.428C189.126 449.957 189.387 450.701 189.387 451.658V455.823H187.593V451.901C187.593 451.337 187.452 450.906 187.17 450.607C186.888 450.299 186.503 450.145 186.016 450.145C185.521 450.145 185.128 450.299 184.837 450.607C184.555 450.906 184.414 451.337 184.414 451.901V455.823H182.62V448.723H184.414V449.607C184.653 449.3 184.957 449.06 185.324 448.889C185.7 448.71 186.11 448.62 186.555 448.62ZM190.632 452.247C190.632 451.53 190.773 450.893 191.055 450.338C191.345 449.782 191.739 449.355 192.234 449.056C192.73 448.757 193.281 448.607 193.887 448.607C194.349 448.607 194.789 448.71 195.208 448.915C195.626 449.112 195.959 449.376 196.207 449.71V446.339H198.027V455.823H196.207V454.772C195.985 455.123 195.673 455.405 195.272 455.618C194.87 455.832 194.404 455.939 193.875 455.939C193.277 455.939 192.73 455.785 192.234 455.477C191.739 455.17 191.345 454.738 191.055 454.183C190.773 453.619 190.632 452.974 190.632 452.247ZM196.22 452.273C196.22 451.837 196.135 451.466 195.964 451.158C195.793 450.842 195.562 450.603 195.272 450.44C194.981 450.269 194.669 450.184 194.336 450.184C194.003 450.184 193.695 450.265 193.413 450.427C193.131 450.59 192.901 450.829 192.721 451.145C192.55 451.453 192.465 451.82 192.465 452.247C192.465 452.675 192.55 453.051 192.721 453.375C192.901 453.691 193.131 453.935 193.413 454.106C193.704 454.277 194.011 454.362 194.336 454.362C194.669 454.362 194.981 454.281 195.272 454.119C195.562 453.948 195.793 453.708 195.964 453.401C196.135 453.085 196.22 452.709 196.22 452.273ZM205.615 448.607C206.145 448.607 206.61 448.714 207.012 448.928C207.414 449.133 207.73 449.402 207.96 449.735V448.723H209.768V455.875C209.768 456.532 209.635 457.118 209.37 457.63C209.105 458.152 208.708 458.562 208.178 458.861C207.648 459.168 207.008 459.322 206.256 459.322C205.247 459.322 204.419 459.087 203.769 458.617C203.128 458.147 202.765 457.506 202.68 456.695H204.461C204.555 457.019 204.756 457.276 205.064 457.464C205.38 457.66 205.76 457.759 206.204 457.759C206.726 457.759 207.149 457.6 207.473 457.284C207.798 456.977 207.96 456.507 207.96 455.875V454.772C207.73 455.106 207.409 455.383 206.999 455.605C206.598 455.828 206.136 455.939 205.615 455.939C205.017 455.939 204.47 455.785 203.974 455.477C203.479 455.17 203.086 454.738 202.795 454.183C202.513 453.619 202.372 452.974 202.372 452.247C202.372 451.53 202.513 450.893 202.795 450.338C203.086 449.782 203.475 449.355 203.962 449.056C204.457 448.757 205.008 448.607 205.615 448.607ZM207.96 452.273C207.96 451.837 207.875 451.466 207.704 451.158C207.533 450.842 207.302 450.603 207.012 450.44C206.721 450.269 206.41 450.184 206.076 450.184C205.743 450.184 205.435 450.265 205.153 450.427C204.872 450.59 204.641 450.829 204.461 451.145C204.291 451.453 204.205 451.82 204.205 452.247C204.205 452.675 204.291 453.051 204.461 453.375C204.641 453.691 204.872 453.935 205.153 454.106C205.444 454.277 205.752 454.362 206.076 454.362C206.41 454.362 206.721 454.281 207.012 454.119C207.302 453.948 207.533 453.708 207.704 453.401C207.875 453.085 207.96 452.709 207.96 452.273ZM218.121 452.119C218.121 452.376 218.103 452.606 218.069 452.811H212.879C212.921 453.324 213.101 453.726 213.417 454.016C213.733 454.307 214.122 454.452 214.583 454.452C215.25 454.452 215.724 454.166 216.006 453.593H217.941C217.736 454.277 217.343 454.841 216.762 455.285C216.181 455.721 215.468 455.939 214.622 455.939C213.938 455.939 213.323 455.789 212.776 455.49C212.238 455.182 211.815 454.751 211.507 454.196C211.208 453.64 211.059 452.999 211.059 452.273C211.059 451.538 211.208 450.893 211.507 450.338C211.806 449.782 212.225 449.355 212.763 449.056C213.301 448.757 213.921 448.607 214.622 448.607C215.297 448.607 215.899 448.753 216.429 449.043C216.967 449.334 217.381 449.748 217.672 450.286C217.971 450.816 218.121 451.427 218.121 452.119ZM216.262 451.607C216.254 451.145 216.087 450.778 215.762 450.504C215.438 450.222 215.04 450.081 214.57 450.081C214.126 450.081 213.75 450.218 213.442 450.492C213.143 450.756 212.96 451.128 212.891 451.607H216.262ZM221.519 450.197V453.632C221.519 453.871 221.575 454.046 221.686 454.157C221.806 454.26 222.002 454.311 222.276 454.311H223.109V455.823H221.981C220.468 455.823 219.712 455.088 219.712 453.619V450.197H218.866V448.723H219.712V446.967H221.519V448.723H223.109V450.197H221.519ZM229.248 449.761C229.478 449.419 229.794 449.141 230.196 448.928C230.606 448.714 231.072 448.607 231.593 448.607C232.2 448.607 232.746 448.757 233.234 449.056C233.729 449.355 234.118 449.782 234.4 450.338C234.69 450.885 234.836 451.521 234.836 452.247C234.836 452.974 234.69 453.619 234.4 454.183C234.118 454.738 233.729 455.17 233.234 455.477C232.746 455.785 232.2 455.939 231.593 455.939C231.063 455.939 230.598 455.836 230.196 455.631C229.803 455.417 229.487 455.144 229.248 454.811V455.823H227.453V446.339H229.248V449.761ZM233.003 452.247C233.003 451.82 232.913 451.453 232.734 451.145C232.563 450.829 232.332 450.59 232.042 450.427C231.76 450.265 231.452 450.184 231.119 450.184C230.794 450.184 230.486 450.269 230.196 450.44C229.914 450.603 229.683 450.842 229.504 451.158C229.333 451.474 229.248 451.846 229.248 452.273C229.248 452.7 229.333 453.072 229.504 453.388C229.683 453.704 229.914 453.948 230.196 454.119C230.486 454.281 230.794 454.362 231.119 454.362C231.452 454.362 231.76 454.277 232.042 454.106C232.332 453.935 232.563 453.691 232.734 453.375C232.913 453.059 233.003 452.683 233.003 452.247ZM242.74 452.119C242.74 452.376 242.723 452.606 242.689 452.811H237.498C237.541 453.324 237.72 453.726 238.036 454.016C238.353 454.307 238.741 454.452 239.203 454.452C239.869 454.452 240.343 454.166 240.625 453.593H242.561C242.356 454.277 241.963 454.841 241.382 455.285C240.8 455.721 240.087 455.939 239.241 455.939C238.558 455.939 237.942 455.789 237.396 455.49C236.857 455.182 236.434 454.751 236.127 454.196C235.828 453.64 235.678 452.999 235.678 452.273C235.678 451.538 235.828 450.893 236.127 450.338C236.426 449.782 236.844 449.355 237.383 449.056C237.921 448.757 238.54 448.607 239.241 448.607C239.916 448.607 240.519 448.753 241.048 449.043C241.587 449.334 242.001 449.748 242.291 450.286C242.591 450.816 242.74 451.427 242.74 452.119ZM240.882 451.607C240.873 451.145 240.706 450.778 240.382 450.504C240.057 450.222 239.66 450.081 239.19 450.081C238.746 450.081 238.37 450.218 238.062 450.492C237.763 450.756 237.579 451.128 237.511 451.607H240.882ZM247.984 448.62C248.83 448.62 249.514 448.889 250.035 449.428C250.556 449.957 250.817 450.701 250.817 451.658V455.823H249.023V451.901C249.023 451.337 248.882 450.906 248.6 450.607C248.318 450.299 247.933 450.145 247.446 450.145C246.951 450.145 246.558 450.299 246.267 450.607C245.985 450.906 245.844 451.337 245.844 451.901V455.823H244.05V448.723H245.844V449.607C246.083 449.3 246.387 449.06 246.754 448.889C247.13 448.71 247.54 448.62 247.984 448.62ZM259.124 452.119C259.124 452.376 259.107 452.606 259.073 452.811H253.882C253.925 453.324 254.104 453.726 254.42 454.016C254.736 454.307 255.125 454.452 255.586 454.452C256.253 454.452 256.727 454.166 257.009 453.593H258.944C258.739 454.277 258.346 454.841 257.765 455.285C257.184 455.721 256.471 455.939 255.625 455.939C254.941 455.939 254.326 455.789 253.779 455.49C253.241 455.182 252.818 454.751 252.51 454.196C252.211 453.64 252.062 452.999 252.062 452.273C252.062 451.538 252.211 450.893 252.51 450.338C252.81 449.782 253.228 449.355 253.767 449.056C254.305 448.757 254.924 448.607 255.625 448.607C256.3 448.607 256.902 448.753 257.432 449.043C257.97 449.334 258.385 449.748 258.675 450.286C258.974 450.816 259.124 451.427 259.124 452.119ZM257.265 451.607C257.257 451.145 257.09 450.778 256.766 450.504C256.441 450.222 256.044 450.081 255.574 450.081C255.129 450.081 254.753 450.218 254.446 450.492C254.147 450.756 253.963 451.128 253.895 451.607H257.265ZM263.689 450.197H262.446V455.823H260.626V450.197H259.818V448.723H260.626V448.364C260.626 447.492 260.874 446.852 261.369 446.441C261.865 446.031 262.612 445.839 263.612 445.865V447.377C263.176 447.369 262.873 447.441 262.702 447.595C262.531 447.749 262.446 448.026 262.446 448.428V448.723H263.689V450.197ZM265.762 447.877C265.446 447.877 265.181 447.779 264.967 447.582C264.762 447.377 264.66 447.125 264.66 446.826C264.66 446.527 264.762 446.279 264.967 446.083C265.181 445.878 265.446 445.775 265.762 445.775C266.078 445.775 266.339 445.878 266.544 446.083C266.757 446.279 266.864 446.527 266.864 446.826C266.864 447.125 266.757 447.377 266.544 447.582C266.339 447.779 266.078 447.877 265.762 447.877ZM266.646 448.723V455.823H264.852V448.723H266.646ZM270.508 450.197V453.632C270.508 453.871 270.564 454.046 270.675 454.157C270.794 454.26 270.991 454.311 271.264 454.311H272.097V455.823H270.969C269.457 455.823 268.701 455.088 268.701 453.619V450.197H267.855V448.723H268.701V446.967H270.508V448.723H272.097V450.197H270.508ZM276.105 455.939C275.524 455.939 275.003 455.836 274.541 455.631C274.08 455.417 273.713 455.131 273.439 454.772C273.174 454.413 273.029 454.016 273.003 453.58H274.811C274.845 453.854 274.977 454.08 275.208 454.26C275.447 454.439 275.742 454.529 276.092 454.529C276.434 454.529 276.699 454.46 276.887 454.324C277.083 454.187 277.182 454.012 277.182 453.798C277.182 453.568 277.062 453.397 276.823 453.286C276.592 453.166 276.22 453.038 275.708 452.901C275.178 452.773 274.742 452.64 274.4 452.504C274.067 452.367 273.777 452.158 273.529 451.876C273.29 451.594 273.17 451.214 273.17 450.735C273.17 450.342 273.281 449.983 273.503 449.658C273.734 449.334 274.059 449.077 274.477 448.889C274.905 448.701 275.404 448.607 275.977 448.607C276.823 448.607 277.498 448.821 278.002 449.248C278.506 449.667 278.784 450.235 278.835 450.953H277.118C277.092 450.671 276.972 450.449 276.759 450.286C276.554 450.116 276.276 450.03 275.926 450.03C275.601 450.03 275.349 450.09 275.169 450.21C274.999 450.329 274.913 450.496 274.913 450.709C274.913 450.949 275.033 451.132 275.272 451.261C275.511 451.38 275.883 451.504 276.387 451.632C276.9 451.76 277.323 451.893 277.656 452.03C277.989 452.166 278.275 452.38 278.515 452.67C278.762 452.952 278.891 453.328 278.899 453.798C278.899 454.208 278.784 454.576 278.553 454.9C278.331 455.225 278.006 455.481 277.579 455.669C277.16 455.849 276.669 455.939 276.105 455.939ZM282.692 446.723L282.487 452.914H280.974L280.757 446.723H282.692ZM281.769 455.913C281.444 455.913 281.175 455.815 280.962 455.618C280.757 455.413 280.654 455.161 280.654 454.862C280.654 454.563 280.757 454.315 280.962 454.119C281.175 453.914 281.444 453.811 281.769 453.811C282.085 453.811 282.346 453.914 282.551 454.119C282.756 454.315 282.858 454.563 282.858 454.862C282.858 455.161 282.756 455.413 282.551 455.618C282.346 455.815 282.085 455.913 281.769 455.913Z"
                  fill="url(#paint4_linear_7909_17780)"
                />
              </g>
            )}

            {/* <path
              d="M95.6131 215.789H83.5014V228.221H75.0424V215.789H62.9306V207.971H75.0424V195.539H83.5014V207.971H95.6131V215.789ZM104.382 200.281C104.595 196.009 106.09 192.719 108.867 190.412C111.687 188.063 115.382 186.888 119.954 186.888C123.073 186.888 125.743 187.443 127.964 188.554C130.186 189.622 131.852 191.096 132.963 192.976C134.116 194.813 134.693 196.906 134.693 199.256C134.693 201.947 133.988 204.233 132.578 206.113C131.211 207.95 129.566 209.189 127.644 209.83V210.086C130.122 210.855 132.044 212.222 133.411 214.187C134.821 216.152 135.526 218.673 135.526 221.749C135.526 224.312 134.928 226.598 133.732 228.606C132.578 230.614 130.848 232.195 128.541 233.348C126.277 234.459 123.542 235.014 120.338 235.014C115.511 235.014 111.58 233.797 108.547 231.362C105.514 228.926 103.912 225.338 103.741 220.596H112.456C112.541 222.689 113.246 224.376 114.571 225.658C115.938 226.897 117.796 227.517 120.146 227.517C122.325 227.517 123.991 226.918 125.145 225.722C126.341 224.483 126.939 222.903 126.939 220.98C126.939 218.417 126.127 216.58 124.504 215.469C122.88 214.358 120.36 213.803 116.942 213.803H115.083V206.433H116.942C123.008 206.433 126.042 204.404 126.042 200.345C126.042 198.508 125.486 197.077 124.376 196.052C123.307 195.026 121.748 194.514 119.697 194.514C117.689 194.514 116.13 195.069 115.019 196.18C113.951 197.248 113.332 198.615 113.161 200.281H104.382ZM174.017 195.731H153.254V206.689C154.151 205.579 155.432 204.681 157.099 203.998C158.765 203.272 160.538 202.909 162.418 202.909C165.835 202.909 168.634 203.656 170.812 205.151C172.991 206.647 174.572 208.569 175.555 210.919C176.537 213.226 177.029 215.704 177.029 218.353C177.029 223.266 175.619 227.217 172.799 230.208C170.022 233.199 166.049 234.694 160.88 234.694C156.009 234.694 152.121 233.476 149.216 231.041C146.311 228.606 144.666 225.423 144.282 221.493H152.997C153.382 223.202 154.236 224.569 155.561 225.594C156.928 226.619 158.658 227.132 160.751 227.132C163.272 227.132 165.173 226.342 166.455 224.761C167.736 223.18 168.377 221.087 168.377 218.481C168.377 215.832 167.715 213.824 166.391 212.457C165.109 211.047 163.208 210.342 160.687 210.342C158.893 210.342 157.398 210.791 156.201 211.688C155.005 212.585 154.151 213.781 153.638 215.277H145.051V187.849H174.017V195.731ZM208.08 199.64C207.653 197.846 206.906 196.5 205.837 195.603C204.812 194.706 203.317 194.257 201.352 194.257C198.404 194.257 196.225 195.453 194.815 197.846C193.448 200.196 192.743 204.041 192.7 209.381C193.726 207.672 195.221 206.348 197.186 205.408C199.151 204.425 201.288 203.934 203.595 203.934C206.371 203.934 208.828 204.532 210.964 205.728C213.1 206.924 214.766 208.676 215.963 210.983C217.159 213.247 217.757 215.982 217.757 219.186C217.757 222.219 217.137 224.932 215.899 227.324C214.702 229.674 212.929 231.511 210.58 232.835C208.23 234.16 205.432 234.822 202.185 234.822C197.742 234.822 194.238 233.839 191.675 231.874C189.154 229.909 187.381 227.175 186.356 223.672C185.374 220.126 184.882 215.768 184.882 210.599C184.882 202.78 186.228 196.885 188.919 192.912C191.611 188.896 195.862 186.888 201.672 186.888C206.158 186.888 209.64 188.105 212.118 190.54C214.596 192.976 216.027 196.009 216.411 199.64H208.08ZM201.544 211.303C199.28 211.303 197.378 211.966 195.84 213.29C194.302 214.614 193.533 216.537 193.533 219.058C193.533 221.578 194.238 223.565 195.648 225.017C197.101 226.47 199.13 227.196 201.736 227.196C204.043 227.196 205.859 226.491 207.183 225.081C208.55 223.672 209.234 221.77 209.234 219.378C209.234 216.9 208.572 214.935 207.247 213.482C205.966 212.03 204.064 211.303 201.544 211.303ZM229.846 235.142C228.223 235.142 226.877 234.651 225.809 233.669C224.784 232.643 224.271 231.383 224.271 229.888C224.271 228.392 224.784 227.153 225.809 226.171C226.877 225.145 228.223 224.633 229.846 224.633C231.427 224.633 232.73 225.145 233.755 226.171C234.781 227.153 235.293 228.392 235.293 229.888C235.293 231.383 234.781 232.643 233.755 233.669C232.73 234.651 231.427 235.142 229.846 235.142ZM251.876 221.557C252.218 223.437 252.987 224.889 254.183 225.914C255.422 226.897 257.067 227.388 259.117 227.388C261.766 227.388 263.689 226.299 264.885 224.12C266.081 221.899 266.679 218.182 266.679 212.97C265.696 214.337 264.308 215.405 262.514 216.174C260.762 216.943 258.861 217.327 256.81 217.327C254.076 217.327 251.598 216.772 249.377 215.661C247.198 214.508 245.468 212.82 244.186 210.599C242.904 208.334 242.263 205.6 242.263 202.396C242.263 197.654 243.673 193.894 246.493 191.117C249.313 188.298 253.158 186.888 258.028 186.888C264.094 186.888 268.367 188.832 270.845 192.719C273.365 196.607 274.625 202.46 274.625 210.278C274.625 215.832 274.134 220.382 273.152 223.928C272.212 227.474 270.567 230.165 268.217 232.002C265.91 233.839 262.749 234.758 258.733 234.758C255.571 234.758 252.88 234.16 250.658 232.964C248.437 231.725 246.728 230.123 245.532 228.157C244.378 226.149 243.716 223.949 243.545 221.557H251.876ZM258.669 210.022C260.89 210.022 262.642 209.338 263.924 207.971C265.205 206.604 265.846 204.767 265.846 202.46C265.846 199.939 265.162 197.995 263.795 196.628C262.471 195.219 260.655 194.514 258.348 194.514C256.041 194.514 254.204 195.24 252.837 196.692C251.513 198.102 250.851 199.982 250.851 202.332C250.851 204.596 251.491 206.454 252.773 207.907C254.097 209.317 256.063 210.022 258.669 210.022ZM289.427 209.958C285.155 207.736 283.019 204.297 283.019 199.64C283.019 197.333 283.596 195.24 284.749 193.36C285.945 191.438 287.718 189.921 290.068 188.81C292.46 187.657 295.366 187.08 298.783 187.08C302.201 187.08 305.085 187.657 307.435 188.81C309.827 189.921 311.6 191.438 312.754 193.36C313.95 195.24 314.548 197.333 314.548 199.64C314.548 201.99 313.971 204.062 312.818 205.856C311.664 207.608 310.126 208.975 308.204 209.958C310.553 210.983 312.39 212.478 313.715 214.444C315.039 216.409 315.701 218.737 315.701 221.429C315.701 224.334 314.954 226.876 313.458 229.055C312.006 231.191 309.998 232.835 307.435 233.989C304.871 235.142 301.988 235.719 298.783 235.719C295.579 235.719 292.695 235.142 290.132 233.989C287.611 232.835 285.604 231.191 284.108 229.055C282.656 226.876 281.929 224.334 281.929 221.429C281.929 218.737 282.592 216.409 283.916 214.444C285.24 212.436 287.077 210.94 289.427 209.958ZM305.833 200.922C305.833 198.829 305.192 197.205 303.91 196.052C302.671 194.898 300.962 194.321 298.783 194.321C296.647 194.321 294.938 194.898 293.657 196.052C292.418 197.205 291.798 198.85 291.798 200.986C291.798 202.909 292.439 204.447 293.721 205.6C295.045 206.754 296.733 207.33 298.783 207.33C300.834 207.33 302.522 206.754 303.846 205.6C305.17 204.404 305.833 202.844 305.833 200.922ZM298.783 213.867C296.348 213.867 294.362 214.486 292.824 215.725C291.328 216.964 290.581 218.737 290.581 221.044C290.581 223.18 291.307 224.932 292.76 226.299C294.255 227.623 296.263 228.286 298.783 228.286C301.304 228.286 303.291 227.602 304.743 226.235C306.196 224.868 306.922 223.137 306.922 221.044C306.922 218.78 306.174 217.028 304.679 215.789C303.184 214.508 301.219 213.867 298.783 213.867ZM321.762 199.448C321.762 196.201 322.702 193.659 324.582 191.822C326.504 189.985 328.961 189.067 331.951 189.067C334.942 189.067 337.377 189.985 339.257 191.822C341.179 193.659 342.141 196.201 342.141 199.448C342.141 202.738 341.179 205.301 339.257 207.138C337.377 208.975 334.942 209.894 331.951 209.894C328.961 209.894 326.504 208.975 324.582 207.138C322.702 205.301 321.762 202.738 321.762 199.448ZM362.904 189.836L337.719 234.694H329.004L354.124 189.836H362.904ZM331.887 194.45C329.538 194.45 328.363 196.116 328.363 199.448C328.363 202.823 329.538 204.511 331.887 204.511C333.041 204.511 333.938 204.105 334.579 203.293C335.22 202.439 335.54 201.157 335.54 199.448C335.54 196.116 334.323 194.45 331.887 194.45ZM349.895 225.017C349.895 221.728 350.835 219.186 352.714 217.391C354.637 215.554 357.094 214.636 360.084 214.636C363.075 214.636 365.488 215.554 367.325 217.391C369.205 219.186 370.145 221.728 370.145 225.017C370.145 228.307 369.205 230.87 367.325 232.707C365.488 234.544 363.075 235.463 360.084 235.463C357.051 235.463 354.594 234.544 352.714 232.707C350.835 230.87 349.895 228.307 349.895 225.017ZM360.02 220.019C357.585 220.019 356.367 221.685 356.367 225.017C356.367 228.392 357.585 230.08 360.02 230.08C362.412 230.08 363.609 228.392 363.609 225.017C363.609 221.685 362.412 220.019 360.02 220.019Z"
              fill="#27F291"
            /> */}
            <text
              fill={quoteStatus === QuoteStatus.CLOSED ? PNLColor : upnlColor}
              xmlSpace="preserve"
              style={{
                whiteSpace: 'pre',
              }}
              fontFamily="Poppins"
              fontSize="64.083"
              fontWeight="600"
              letterSpacing="0em"
            >
              {quoteStatus === QuoteStatus.CLOSED ? (
                <tspan x="58" y={234 + (showReferralCode ? 0 : 50)}>
                  {displayUPNLAs === 'percentage' ? PNLPercent : PNL}
                </tspan>
              ) : (
                <tspan x="58" y={234 + (showReferralCode ? 0 : 50)}>
                  {displayUPNLAs === 'percentage' ? upnlPercent : uPnl}
                </tspan>
              )}
            </text>

            <path
              d="M80.4267 274.569C79.9239 274.569 79.4417 274.769 79.0862 275.125C78.7307 275.48 78.5309 275.962 78.5309 276.465V295.423C78.5309 295.926 78.7307 296.408 79.0862 296.764C79.4417 297.119 79.9239 297.319 80.4267 297.319C80.9295 297.319 81.4117 297.119 81.7673 296.764C82.1228 296.408 82.3225 295.926 82.3225 295.423V276.465C82.3225 275.962 82.1228 275.48 81.7673 275.125C81.4117 274.769 80.9295 274.569 80.4267 274.569ZM70.9477 285.944C70.4449 285.944 69.9627 286.144 69.6072 286.499C69.2517 286.855 69.0519 287.337 69.0519 287.84V295.423C69.0519 295.926 69.2517 296.408 69.6072 296.764C69.9627 297.119 70.4449 297.319 70.9477 297.319C71.4505 297.319 71.9327 297.119 72.2883 296.764C72.6438 296.408 72.8435 295.926 72.8435 295.423V287.84C72.8435 287.337 72.6438 286.855 72.2883 286.499C71.9327 286.144 71.4505 285.944 70.9477 285.944ZM89.9057 282.152C89.4029 282.152 88.9207 282.352 88.5652 282.708C88.2097 283.063 88.0099 283.545 88.0099 284.048V295.423C88.0099 295.926 88.2097 296.408 88.5652 296.764C88.9207 297.119 89.4029 297.319 89.9057 297.319C90.4085 297.319 90.8907 297.119 91.2463 296.764C91.6018 296.408 91.8015 295.926 91.8015 295.423V284.048C91.8015 283.545 91.6018 283.063 91.2463 282.708C90.8907 282.352 90.4085 282.152 89.9057 282.152ZM93.6973 266.986H67.1561C65.6478 266.986 64.2011 267.585 63.1345 268.652C62.068 269.718 61.4688 271.165 61.4688 272.673V299.215C61.4688 300.723 62.068 302.17 63.1345 303.236C64.2011 304.303 65.6478 304.902 67.1561 304.902H93.6973C95.2057 304.902 96.6523 304.303 97.7189 303.236C98.7855 302.17 99.3847 300.723 99.3847 299.215V272.673C99.3847 271.165 98.7855 269.718 97.7189 268.652C96.6523 267.585 95.2057 266.986 93.6973 266.986ZM95.5931 299.215C95.5931 299.717 95.3934 300.2 95.0379 300.555C94.6823 300.911 94.2001 301.11 93.6973 301.11H67.1561C66.6533 301.11 66.1711 300.911 65.8156 300.555C65.4601 300.2 65.2603 299.717 65.2603 299.215V272.673C65.2603 272.171 65.4601 271.688 65.8156 271.333C66.1711 270.977 66.6533 270.778 67.1561 270.778H93.6973C94.2001 270.778 94.6823 270.977 95.0379 271.333C95.3934 271.688 95.5931 272.171 95.5931 272.673V299.215Z"
              fill="url(#paint5_linear_7909_17780)"
              transform={`translate(0, ${showReferralCode ? 0 : 50})`}
            />

            <text
              fill="#B0BBCE"
              xmlSpace="preserve"
              style={{ whiteSpace: 'pre' }}
              fontFamily="Poppins"
              fontSize="16.021"
              fontWeight="400"
              letterSpacing="0em"
            >
              <tspan x="122" y={278 + (showReferralCode ? 0 : 50)}>
                Entry Price
              </tspan>
              <tspan x="224.25" y={278 + (showReferralCode ? 0 : 50)}>
                Last Price
              </tspan>
            </text>

            <text
              fill="white"
              xmlSpace="preserve"
              style={{ whiteSpace: 'pre' }}
              fontFamily="Poppins"
              fontSize="16.021"
              fontWeight="600"
              letterSpacing="0em"
            >
              <tspan x="122" y={302 + (showReferralCode ? 0 : 50)}>
                {`$${formatAmount(openedPrice, 6, true)}`}
              </tspan>
              <tspan x="224.25" y={302 + (showReferralCode ? 0 : 50)}>
                {quoteStatus === QuoteStatus.CLOSED
                  ? `$${formatAmount(avgClosedPrice, 6, true)}`
                  : `$${formatAmount(marketData?.markPrice, 6, true)}`}
              </tspan>
            </text>

            <path
              d="M76.6605 334.876C76.6605 335.15 76.5091 335.388 76.2784 335.51L70.583 338.711C70.4676 338.798 70.3234 338.841 70.172 338.841C70.0206 338.841 69.8764 338.798 69.7611 338.711L64.0657 335.51C63.9501 335.449 63.8534 335.358 63.786 335.246C63.7187 335.134 63.6832 335.006 63.6836 334.876V328.387C63.6836 328.113 63.835 327.875 64.0657 327.753L69.7611 324.552C69.8764 324.465 70.0206 324.422 70.172 324.422C70.3234 324.422 70.4676 324.465 70.583 324.552L76.2784 327.753C76.5091 327.875 76.6605 328.113 76.6605 328.387V334.876ZM70.172 325.972L65.8752 328.387L70.172 330.802L74.4688 328.387L70.172 325.972ZM65.1255 334.45L69.4511 336.887V332.05L65.1255 329.62V334.45ZM75.2186 334.45V329.62L70.893 332.05V336.887L75.2186 334.45Z"
              fill="url(#paint6_linear_7909_17780)"
              transform={`translate(0, ${showReferralCode ? 0 : 75})`}
            />
            {quoteStatus === QuoteStatus.CLOSED && (
              <path
                d="M227.188 334.876C227.188 335.15 227.036 335.388 226.806 335.51L221.11 338.711C220.995 338.798 220.851 338.841 220.699 338.841C220.548 338.841 220.404 338.798 220.288 338.711L214.593 335.51C214.477 335.449 214.381 335.358 214.313 335.246C214.246 335.134 214.211 335.006 214.211 334.876V328.387C214.211 328.113 214.362 327.875 214.593 327.753L220.288 324.552C220.404 324.465 220.548 324.422 220.699 324.422C220.851 324.422 220.995 324.465 221.11 324.552L226.806 327.753C227.036 327.875 227.188 328.113 227.188 328.387V334.876ZM220.699 325.972L216.403 328.387L220.699 330.802L224.996 328.387L220.699 325.972ZM215.653 334.45L219.978 336.887V332.05L215.653 329.62V334.45ZM225.746 334.45V329.62L221.42 332.05V336.887L225.746 334.45Z"
                fill="url(#paint7_linear_7909_17780)"
                transform={`translate(0, ${showReferralCode ? 0 : 75})`}
              />
            )}
            <text
              fill="#B0BBCE"
              xmlSpace="preserve"
              style={{ whiteSpace: 'pre' }}
              fontFamily="Poppins"
              fontSize="11.535"
              fontWeight="600"
              letterSpacing="0em"
            >
              <tspan x="82" y={335 + (showReferralCode ? 0 : 75)}>
                Opened
              </tspan>
              {quoteStatus === QuoteStatus.CLOSED && (
                <tspan x="232" y={335 + (showReferralCode ? 0 : 75)}>
                  Closed
                </tspan>
              )}
            </text>

            <text
              fill="white"
              xmlSpace="preserve"
              style={{ whiteSpace: 'pre' }}
              fontFamily="Poppins"
              fontSize="11.535"
              fontWeight="400"
              letterSpacing="0em"
            >
              <tspan x="132" y={336 + (showReferralCode ? 0 : 75)}>
                {parsedOpenTimestamp}
              </tspan>
              {quoteStatus === QuoteStatus.CLOSED && (
                <tspan x="277" y={336 + (showReferralCode ? 0 : 75)}>
                  {parsedCloseTimestamp}
                </tspan>
              )}
            </text>

            <rect
              x="57.0312"
              y={122.399 + (showReferralCode ? 0 : 50)}
              width="65.6333"
              height="36.8167"
              rx="9.6125"
              fill="url(#paint8_linear_7909_17780)"
              fillOpacity="0.2"
            />

            <text
              fill={quote.positionType === PositionType.LONG ? theme.green : theme.red1}
              xmlSpace="preserve"
              style={{ whiteSpace: 'pre' }}
              fontFamily="Poppins"
              fontSize="16.021"
              fontWeight="700"
              letterSpacing="0em"
            >
              <tspan x="70" y={146.5 + (showReferralCode ? 0 : 50)}>
                {quote.positionType === PositionType.LONG ? 'Long' : 'Short'}
              </tspan>
            </text>

            <rect
              x="132.277"
              y={122.399 + (showReferralCode ? 0 : 50)}
              width={`${leverageContainerWidth}px`}
              height="36.8167"
              rx="9.6125"
              fill="url(#paint9_linear_7909_17780)"
              fillOpacity="0.2"
            />

            <text
              fill="white"
              xmlSpace="preserve"
              style={{ whiteSpace: 'pre' }}
              fontFamily="Poppins"
              fontSize="16.021"
              fontWeight="400"
              letterSpacing="0em"
              ref={leverageTextRef}
            >
              <tspan x="145.097" y={146 + (showReferralCode ? 0 : 50)}>
                {leverage}x
              </tspan>
            </text>

            <rect
              x={132.277 + leverageContainerWidth + 9.61}
              y={122.399 + (showReferralCode ? 0 : 50)}
              width={symbolContainerWidth}
              height="36.8167"
              rx="9.6125"
              fill="url(#paint10_linear_7909_17780)"
              fillOpacity="0.2"
            />

            <text
              opacity="0.5"
              fill="white"
              xmlSpace="preserve"
              style={{ whiteSpace: 'pre' }}
              fontFamily="Poppins"
              fontSize="16.021"
              fontWeight="400"
              letterSpacing="0em"
              ref={symbolTextRef}
            >
              <tspan x={132.277 + leverageContainerWidth + 9.61 + 12.82} y={147 + (showReferralCode ? 0 : 50)}>
                {symbol} / {asset}
              </tspan>
            </text>
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_1972_8611"
              x1="473.5"
              y1="181"
              x2="687.678"
              y2="13.5431"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#14192C" />
              <stop offset="1" stopColor="#1E2334" stopOpacity="0.14" />
            </linearGradient>

            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlinkHref="#image0_7909_17780" transform="scale(0.000833333)" />
            </pattern>
            <pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlinkHref="#image1_7909_17780" transform="scale(0.000468604)" />
            </pattern>
            <pattern id="pattern2" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlinkHref="#image2_7909_17780" transform="scale(0.001 0.00100806)" />
            </pattern>
            <pattern id="pattern3" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlinkHref="#image3_7909_17780" transform="matrix(0.00148423 0 0 0.00142857 -0.000927628 0)" />
            </pattern>
            <filter
              id="filter0_f_7909_17780"
              x="588.926"
              y="314.008"
              width="338.79"
              height="346.673"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="6.40833" result="effect1_foregroundBlur_7909_17780" />
            </filter>
            <pattern id="pattern4" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlinkHref="#image3_7909_17780" transform="matrix(0.00148423 0 0 0.00142857 -0.000927599 0)" />
            </pattern>
            <pattern id="pattern5" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlinkHref="#image3_7909_17780" transform="matrix(0.00148423 0 0 0.00142857 -0.00092765 0)" />
            </pattern>
            <pattern id="pattern6" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlinkHref="#image3_7909_17780" transform="matrix(0.00148423 0 0 0.00142857 -0.000927628 0)" />
            </pattern>
            <filter
              id="filter1_f_7909_17780"
              x="569.703"
              y="-194.813"
              width="338.79"
              height="346.673"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="6.40833" result="effect1_foregroundBlur_7909_17780" />
            </filter>
            <pattern id="pattern7" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlinkHref="#image3_7909_17780" transform="matrix(0.00148423 0 0 0.00142857 -0.000927599 0)" />
            </pattern>
            <pattern id="pattern8" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlinkHref="#image3_7909_17780" transform="matrix(0.00148423 0 0 0.00142857 -0.000927591 0)" />
            </pattern>
            <filter
              id="filter2_f_7909_17780"
              x="-248.348"
              y="-254.107"
              width="2320.64"
              height="1345.1"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="21" result="effect1_foregroundBlur_7909_17780" />
            </filter>
            <pattern id="pattern9" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlinkHref="#image4_7909_17780" transform="scale(0.000833333 0.00148368)" />
            </pattern>

            <pattern id="wojaksad" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlinkHref="#image_wojaksad" transform="scale(0.001 0.00129368)" />
            </pattern>

            <linearGradient
              id="paint0_linear_7909_17780"
              x1="257.68"
              y1="68.0834"
              x2="275.158"
              y2="68.0834"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF0420" />
              <stop offset="1" stopColor="#BD2738" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_7909_17780"
              x1="238.312"
              y1="68.3321"
              x2="255.791"
              y2="68.3321"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF0420" />
              <stop offset="1" stopColor="#BD2738" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_7909_17780"
              x1="89.397"
              y1="393.504"
              x2="89.397"
              y2="456.305"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF0420" />
              <stop offset="1" stopColor="#BD2738" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_7909_17780"
              x1="190.074"
              y1="388.986"
              x2="190.074"
              y2="412.986"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#73758A" />
              <stop offset="1" stopColor="#393943" />
            </linearGradient>
            <linearGradient
              id="paint4_linear_7909_17780"
              x1="209.574"
              y1="441.823"
              x2="209.574"
              y2="460.823"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF0420" />
              <stop offset="1" stopColor="#BD2738" />
            </linearGradient>
            <linearGradient
              id="paint5_linear_7909_17780"
              x1="80.4267"
              y1="266.986"
              x2="80.4267"
              y2="304.902"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#575A77" />
              <stop offset="1" stopColor="#393943" />
            </linearGradient>
            <linearGradient
              id="paint6_linear_7909_17780"
              x1="70.172"
              y1="324.422"
              x2="70.172"
              y2="338.841"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF0420" />
              <stop offset="1" stopColor="#BD2738" />
            </linearGradient>
            <linearGradient
              id="paint7_linear_7909_17780"
              x1="220.699"
              y1="324.422"
              x2="220.699"
              y2="338.841"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF0420" />
              <stop offset="1" stopColor="#BD2738" />
            </linearGradient>
            <linearGradient
              id="paint8_linear_7909_17780"
              x1="89.8479"
              y1="122.399"
              x2="89.8479"
              y2="159.216"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#575A77" />
              <stop offset="1" stopColor="#393943" />
            </linearGradient>
            <linearGradient
              id="paint9_linear_7909_17780"
              x1="159.094"
              y1="122.399"
              x2="159.094"
              y2="159.216"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#575A77" />
              <stop offset="1" stopColor="#393943" />
            </linearGradient>
            <linearGradient
              id="paint10_linear_7909_17780"
              x1="253.84"
              y1="122.399"
              x2="253.84"
              y2="159.216"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#575A77" />
              <stop offset="1" stopColor="#393943" />
            </linearGradient>
            <linearGradient
              id="paint0_linear_1990_5"
              x1="224.5"
              y1="-35"
              x2="224.5"
              y2="115"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF0420" />
              <stop offset="1" stopColor="#BD2738" />
            </linearGradient>
            <clipPath id="clip0_7909_17780">
              <path
                d="M0 5C0 2.23858 2.23858 0 5 0H758.451C764.277 0 769 4.72281 769 10.5487V512.667H0V5Z"
                fill="white"
              />
            </clipPath>
            <image id="image0_7909_17780" width="1200" height="1200" href="/images/position-summary-card/image-1.png" />
            <image id="image1_7909_17780" width="2134" height="2134" href="/images/position-summary-card/image-2.png" />
            <image id="image3_7909_17780" width="675" height="700" href="/images/position-summary-card/image-3.png" />
            <image id="image4_7909_17780" width="1200" height="674" href="/images/position-summary-card/image-4.png" />
            <image
              id="image_wojaksad"
              width="800"
              height="800"
              xlinkHref="/images/position-summary-card/styled-cards/wojaksad.png"
            />
          </defs>
        </svg>
      </SVGWrapperDesktop>

      <SuperContainer active={openCards}>
        <SuperContainerThumbs
          unoptimized={true}
          src={'/images/position-summary-card/styled-cards/PNL_cards.png'}
          alt={'cards'}
          width={130}
          height={40}
        />
        <DropDownContainer
          active={openCards}
          onClick={() => {
            setOpenCards((prev) => !prev)
          }}
        >
          <DropDownIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1.0625em" viewBox="0 0 16 17" fill="none">
              <path
                d="M12.668 1.1665L11.828 2.99984L10.0013 3.83317L11.828 4.67317L12.668 6.49984L13.5013 4.67317L15.3346 3.83317L13.5013 2.99984M6.0013 3.1665L4.33464 6.83317L0.667969 8.49984L4.33464 10.1665L6.0013 13.8332L7.66797 10.1665L11.3346 8.49984L7.66797 6.83317M12.668 10.4998L11.828 12.3265L10.0013 13.1665L11.828 13.9998L12.668 15.8332L13.5013 13.9998L15.3346 13.1665L13.5013 12.3265"
                fill="white"
              />
            </svg>
          </DropDownIcon>

          <DropDownButton>New PNL Cards</DropDownButton>

          <MinimizeButton>
            <ExpandArrow isExpanded={!openCards} height="1em" width="1em" />
          </MinimizeButton>
        </DropDownContainer>
      </SuperContainer>

      <Column>
        {openCards && (
          <Row>
            <CardsShowcase active={openCards}>
              <FooterTitle>Select a Card!</FooterTitle>
              <FooterSubtitle>Share your Profits and Losses with style!</FooterSubtitle>
              <div style={{ maxWidth: '100%' }}>
                <Carousel
                  isPositivePNL={parseFloat(pnl) > 0}
                  options={OPTIONS}
                  setSelectedCard={setSelectedCard}
                  isMobile={isMobile}
                />
              </div>
            </CardsShowcase>
          </Row>
        )}

        <Row>
          <Footer>
            <div>
              <FooterTitle>Summary Position Card</FooterTitle>
              <FooterSubtitle>Share your position results with your friends!</FooterSubtitle>
              <ActiosnWrapper>
                <Selector value={displayUPNLAs} onChange={(value) => setDisplayUPNLAs(value)} />

                {isReferralCodeEnabled && referralCode && (
                  <CheckboxReferralCode
                    value={showReferralCode}
                    onClick={() => setShowReferralCode(!showReferralCode)}
                  />
                )}
              </ActiosnWrapper>
            </div>
            <div>
              <ShareButton onClick={handleShare} disabled={loading || !canShare}>
                <span>Share</span>
                <Share size={20} color="currentColor" />
                {loading && (
                  <LoaderWrapper>
                    <Loader color="#fff" />
                  </LoaderWrapper>
                )}
              </ShareButton>

              <Row>
                {canCopy && (
                  <CopyButton onClick={handleCopy} disabled={loading}>
                    <CopyGradient />

                    <span>Copy</span>
                    {loading && (
                      <LoaderWrapper>
                        <Loader color="#fff" />
                      </LoaderWrapper>
                    )}
                  </CopyButton>
                )}

                <DownloadSVG onClick={handleDownloadPng} disabled={loading}>
                  <Download />
                  <span>Download</span>
                  {loading && (
                    <LoaderWrapper>
                      <Loader color="#fff" />
                    </LoaderWrapper>
                  )}
                </DownloadSVG>
              </Row>
            </div>
          </Footer>
        </Row>
      </Column>
    </Wrapper>
  )
}
