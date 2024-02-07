import { useEffect, useMemo } from 'react'
import styled, { useTheme } from 'styled-components'

import { Loader, CircleCheck, LongArrow, ShortArrow } from 'components/Icons'

import { OrderType, PositionType } from 'types/trade'
import { Quote, QuoteStatus } from 'types/quote'
import { useMarketById, useMarketsInfo } from 'state/hedger/hooks'
import { formatAmount, toBN } from 'utils/numbers'

export enum ProcessingTradeNotificationStatus {
  SUBMITED = 'SUBMITED',
  RECEIVED = 'RECEIVED',
  SUCCESSFUL = 'SUCCESSFUL',
}

interface IProps {
  quote: Quote
}

const Wrapper = styled.div`
  color: white;
  width: 237px;
  height: 215px;
  border-radius: 5px;
  background: rgba(35, 41, 51);
  box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 9999;
  right: 20px;
  top: 80px;
`

const Header = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  padding: 11px 14px 13px 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`

const TradeID = styled.div`
  display: inline-flex;
  padding: 0.5px 9px;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  border: 1px solid rgba(128, 138, 156, 0.3);
  color: #808a9c;
  font-weight: 500;
  line-height: normal;
  font-size: 10px;
  margin-left: auto;
`

const Body = styled.div`
  width: 237px;
  height: 110px;
  border-radius: 5px;
  background: rgba(32, 37, 46, 0.95);
  box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.08);
  padding: 0 17px 11px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const DetailsWrapper = styled.div`
  border-radius: 5px;
  background: rgba(85, 102, 131, 0.3);
  box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 5px 3px;
  text-align: center;
  font-size: 11px;
  font-weight: 500;
  line-height: normal;
`
const Divisor = styled.div`
  width: 1px;
  height: 21px;
  background: rgba(0, 0, 0, 0.24);
  margin: 0 5px;
`

const PercentBar = styled.div<{ progress: number }>`
  height: 5px;
  width: 100%;
  border-radius: 100px;
  background: #12161c;
  position: relative;
  margin: 8px 0 4px;

  &:after {
    content: '';
    position: absolute;
    height: 5px;
    width: ${({ progress }) => progress}%;
    transition: width 0.3s ease-in-out;
    border-radius: 100px;
    background: ${({ theme }) => theme.gradCustom1};
  }
`

const PercentText = styled.div`
  color: #808a9c;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  text-align: center;
`

const TradeType = styled.div`
  line-height: 0;
`
const TradeSymbol = styled.div``
const TradeLeverage = styled.div``
const TradeAmount = styled.div``

const StatusAnimWrapper = styled.div`
  width: 100%;
  height: 100px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 16px;
    background: linear-gradient(180deg, #20252e 0%, rgba(32, 37, 46, 0.84) 16.15%, rgba(32, 37, 46, 0) 100%);
  }
`

const StatusAnimInner = styled.div<{ y: number }>`
  transition: transform 0.5s ease-in-out;
  transform: ${({ y }) => `translateY(-${y}px)`};
`

const StatusWraper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 16px;
  gap: 4px;
  height: 100px;
`

const StatusSVGWrapper = styled.div`
  line-height: 0;
  position: relative;
  border-radius: 100%;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    opacity: 0.1;
    background: linear-gradient(90deg, rgba(217, 217, 217, 0) 0%, #fff 47.92%, rgba(217, 217, 217, 0) 100%);
    mix-blend-mode: overlay;
    width: 41px;
    height: 82px;
    left: -40px;
    animation: translate 4s ease-in-out infinite;
  }

  @keyframes translate {
    0% {
      /* transform: translateX(-40px); */
      left: -40px;
    }

    50%,
    100% {
      /* transform: translateX(40px); */
      left: 60px;
    }
  }
`

const StatusText = styled.div`
  color: #fff;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
`

const Submited = () => {
  return (
    <StatusWraper>
      <StatusSVGWrapper>
        <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M53.1666 27.2068C53.1666 41.5529 41.6628 53.1599 27.4999 53.1599C13.3371 53.1599 1.83328 41.5529 1.83328 27.2068C1.83328 12.8607 13.3371 1.25369 27.4999 1.25369C41.6628 1.25369 53.1666 12.8607 53.1666 27.2068Z"
            fill="url(#paint0_linear_10912_39498)"
            fillOpacity="0.3"
            stroke="url(#paint1_linear_10912_39498)"
            strokeWidth="2.50737"
          />
          <path
            d="M33.3611 21.635L34.9661 23.24L29.5269 28.6792L25.8599 25.0122C25.7568 24.9089 25.6343 24.8269 25.4995 24.771C25.3647 24.715 25.2201 24.6863 25.0742 24.6863C24.9282 24.6863 24.7836 24.715 24.6488 24.771C24.514 24.8269 24.3915 24.9089 24.2884 25.0122L17.6009 31.7109C17.4977 31.814 17.4158 31.9366 17.36 32.0714C17.3041 32.2062 17.2754 32.3507 17.2754 32.4966C17.2754 32.6426 17.3041 32.7871 17.36 32.9219C17.4158 33.0567 17.4977 33.1792 17.6009 33.2824C17.7041 33.3856 17.8266 33.4675 17.9614 33.5233C18.0962 33.5792 18.2407 33.6079 18.3867 33.6079C18.5326 33.6079 18.6771 33.5792 18.8119 33.5233C18.9467 33.4675 19.0692 33.3856 19.1724 33.2824L25.0686 27.3751L28.7356 31.0421C29.1702 31.4768 29.8724 31.4768 30.3071 31.0421L36.5376 24.8227L38.1426 26.4277C38.2205 26.5041 38.3191 26.5559 38.4262 26.5768C38.5333 26.5977 38.6441 26.5866 38.745 26.5451C38.8459 26.5036 38.9323 26.4334 38.9937 26.3431C39.055 26.2529 39.0885 26.1467 39.09 26.0376V21.2449C39.0931 21.1719 39.0812 21.0989 39.0549 21.0307C39.0287 20.9624 38.9888 20.9003 38.9376 20.848C38.8864 20.7958 38.8251 20.7546 38.7574 20.727C38.6897 20.6995 38.617 20.686 38.5439 20.6876H33.7623C33.6523 20.687 33.5446 20.7189 33.4526 20.7794C33.3607 20.8399 33.2888 20.9263 33.2459 21.0276C33.203 21.1289 33.191 21.2406 33.2115 21.3487C33.232 21.4568 33.2841 21.5564 33.3611 21.635Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_10912_39498"
              x1="0.57959"
              y1="33.8426"
              x2="69.5335"
              y2="33.8426"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#BC2738" />
              <stop offset="1" stopColor="#6E1620" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_10912_39498"
              x1="27.4999"
              y1="0"
              x2="27.4999"
              y2="54.4136"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF0420" />
              <stop offset="1" stopColor="#BD2738" />
            </linearGradient>
          </defs>
        </svg>
      </StatusSVGWrapper>

      <StatusText>Order Submitted</StatusText>
    </StatusWraper>
  )
}

const Received = () => {
  return (
    <StatusWraper>
      <StatusSVGWrapper>
        <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M53.1666 27.6209C53.1666 41.9669 41.6628 53.574 27.4999 53.574C13.3371 53.574 1.83328 41.9669 1.83328 27.6209C1.83328 13.2748 13.3371 1.66775 27.4999 1.66775C41.6628 1.66775 53.1666 13.2748 53.1666 27.6209Z"
            fill="url(#paint0_linear_10978_46646)"
            fillOpacity="0.3"
            stroke="url(#paint1_linear_10978_46646)"
            strokeWidth="2.50737"
          />
          <path
            d="M32.4126 16.6426C29.3363 16.6426 26.8397 19.1392 26.8397 22.2155C26.8397 25.2917 29.3363 27.7884 32.4126 27.7884C35.4888 27.7884 37.9855 25.2917 37.9855 22.2155C37.9855 19.1392 35.4888 16.6426 32.4126 16.6426ZM32.4126 25.5592C30.5624 25.5592 29.0688 24.0657 29.0688 22.2155C29.0688 20.3653 30.5624 18.8717 32.4126 18.8717C34.2628 18.8717 35.7563 20.3653 35.7563 22.2155C35.7563 24.0657 34.2628 25.5592 32.4126 25.5592ZM35.7563 32.2467H33.5272C33.5272 30.9092 32.6912 29.7055 31.4429 29.2374L24.5771 26.6738H15.6938V38.9342H22.3813V37.3292L30.1834 39.4915L39.1001 36.7051V35.5905C39.1001 33.7403 37.6066 32.2467 35.7563 32.2467ZM20.1522 36.7051H17.923V28.903H20.1522V36.7051ZM30.15 37.1621L22.3813 35.0332V28.903H24.1758L30.6627 31.3216C31.0417 31.4665 31.298 31.8343 31.298 32.2467C31.298 32.2467 29.0688 32.191 28.7345 32.0796L26.0818 31.199L25.3796 33.3167L28.0323 34.1973C28.6007 34.3867 29.1915 34.4759 29.7933 34.4759H35.7563C36.191 34.4759 36.5811 34.7434 36.7595 35.1112L30.15 37.1621Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_10978_46646"
              x1="0.57959"
              y1="34.2567"
              x2="69.5335"
              y2="34.2567"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#BC2738" />
              <stop offset="1" stopColor="#6E1620" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_10978_46646"
              x1="27.4999"
              y1="0.414062"
              x2="27.4999"
              y2="54.8277"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF0420" />
              <stop offset="1" stopColor="#BD2738" />
            </linearGradient>
          </defs>
        </svg>
      </StatusSVGWrapper>

      <StatusText>Order Received</StatusText>
    </StatusWraper>
  )
}

const Successful = () => {
  return (
    <StatusWraper>
      <StatusSVGWrapper>
        <svg width="54" height="56" viewBox="0 0 54 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M52.6666 28.0349C52.6666 42.381 41.1628 53.988 26.9999 53.988C12.8371 53.988 1.33328 42.381 1.33328 28.0349C1.33328 13.6889 12.8371 2.08181 26.9999 2.08181C41.1628 2.08181 52.6666 13.6889 52.6666 28.0349Z"
            fill="url(#paint0_linear_10978_47356)"
            fillOpacity="0.3"
            stroke="url(#paint1_linear_10978_47356)"
            strokeWidth="2.50737"
          />
          <path
            d="M25.3226 32.1421L21.0796 27.8981L22.4936 26.4841L25.3226 29.3121L30.9786 23.6551L32.3936 25.0701L25.3226 32.1401V32.1421Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.0796 27.8281C16.0796 21.7531 21.0046 16.8281 27.0796 16.8281C33.1546 16.8281 38.0796 21.7531 38.0796 27.8281C38.0796 33.9031 33.1546 38.8281 27.0796 38.8281C21.0046 38.8281 16.0796 33.9031 16.0796 27.8281ZM27.0796 36.8281C25.8977 36.8281 24.7274 36.5953 23.6354 36.143C22.5435 35.6908 21.5514 35.0278 20.7156 34.1921C19.8799 33.3564 19.217 32.3642 18.7647 31.2723C18.3124 30.1803 18.0796 29.01 18.0796 27.8281C18.0796 26.6462 18.3124 25.4759 18.7647 24.384C19.217 23.292 19.8799 22.2999 20.7156 21.4642C21.5514 20.6284 22.5435 19.9655 23.6354 19.5132C24.7274 19.0609 25.8977 18.8281 27.0796 18.8281C29.4665 18.8281 31.7557 19.7763 33.4436 21.4642C35.1314 23.152 36.0796 25.4412 36.0796 27.8281C36.0796 30.2151 35.1314 32.5043 33.4436 34.1921C31.7557 35.8799 29.4665 36.8281 27.0796 36.8281Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_10978_47356"
              x1="0.0795898"
              y1="34.6707"
              x2="69.0335"
              y2="34.6707"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#BC2738" />
              <stop offset="1" stopColor="#6E1620" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_10978_47356"
              x1="26.9999"
              y1="0.828125"
              x2="26.9999"
              y2="55.2417"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF0420" />
              <stop offset="1" stopColor="#BD2738" />
            </linearGradient>
          </defs>
        </svg>
      </StatusSVGWrapper>

      <StatusText>Order Successful</StatusText>
    </StatusWraper>
  )
}

export default function ProcessingTradeNotification({ quote }: IProps) {
  const {
    positionType,
    marketId,
    leverage,
    quantity,
    quoteStatus,
    openedPrice,
    id,
    orderType,
    createTimestamp,
    statusModifyTimestamp,
  } = quote

  const theme = useTheme()
  const quoteMarket = useMarketById(marketId.toString())

  const progess = useMemo(() => {
    if (orderType === OrderType.LIMIT) {
      if (quoteStatus === QuoteStatus.PENDING) return 50
      if (quoteStatus === QuoteStatus.OPENED || quoteStatus === QuoteStatus.LOCKED) return 100
    }

    if (orderType === OrderType.MARKET) {
      if (quoteStatus === QuoteStatus.PENDING) return 50
      if (quoteStatus === QuoteStatus.OPENED) return 100
    }

    return 0
  }, [orderType, quoteStatus])

  const translate = useMemo(() => {
    if (quoteStatus === QuoteStatus.PENDING) return 100
    if (quoteStatus === QuoteStatus.OPENED) return 200

    return 0
  }, [quoteStatus])

  const isQuoteSuccessfull = useMemo(() => {
    if (orderType === OrderType.LIMIT) {
      if (quoteStatus === QuoteStatus.OPENED || quoteStatus === QuoteStatus.LOCKED) return true
    }

    if (orderType === OrderType.MARKET) {
      if (quoteStatus === QuoteStatus.OPENED) return true
    }

    return false
  }, [quoteStatus, orderType])

  // If the order is in locked state more than 5 seconds, we consider it as finished so we don't show any processing notification
  const shouldBeShown = useMemo(() => {
    // const currentTimestamp = Math.floor(Date.now() / 1000)
    const isLocked = quoteStatus === QuoteStatus.LOCKED && +5 < statusModifyTimestamp

    return !isLocked
  }, [quoteStatus, statusModifyTimestamp])

  if (!shouldBeShown) {
    return <></>
  }

  return (
    <Wrapper>
      <Header>
        {isQuoteSuccessfull ? (
          <div
            style={{
              marginRight: '6px',
            }}
          >
            <CircleCheck width={12} height={12} />
          </div>
        ) : (
          <Loader
            style={{
              marginRight: '6px',
            }}
            size="11px"
          />
        )}
        <span>Processing Trade...</span>
        <TradeID>ID: {id}</TradeID>
      </Header>
      <Body>
        <StatusAnimWrapper>
          <StatusAnimInner y={translate}>
            <Submited />
            <Received />
            <Successful />
          </StatusAnimInner>
        </StatusAnimWrapper>
        <DetailsWrapper>
          <TradeType>
            {positionType === PositionType.LONG ? (
              <LongArrow width={16} height={16} color={theme.green1} />
            ) : (
              <ShortArrow width={16} height={16} color={theme.red1} />
            )}
          </TradeType>
          <Divisor />
          <TradeSymbol>{quoteMarket?.symbol}</TradeSymbol>
          <Divisor />
          <TradeLeverage>{leverage}</TradeLeverage>
          <Divisor />
          <TradeAmount>{formatAmount(toBN(quote.quantity).times(toBN(quote.requestedOpenPrice)))}</TradeAmount>
        </DetailsWrapper>
        <PercentBar progress={progess} />
        <PercentText>{progess}%</PercentText>
      </Body>
    </Wrapper>
  )
}
