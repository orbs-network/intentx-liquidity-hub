import styled from 'styled-components'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { formatDollarAmount, toBN } from 'utils/numbers'
import { Market } from 'types/market'

import useCurrencyLogo from 'lib/hooks/useCurrencyLogo'
import { useFavorites, useToggleUserFavoriteCallback } from 'state/user/hooks'

import { ChevronDown, Star } from 'components/Icons'
import { Row, RowBetween, RowCenter, RowStart } from 'components/Row'
import { RedButton } from 'components/Button'
import { useIsMobile } from 'lib/hooks/useWindowSize'
import { useState } from 'react'
import { ColumnCenter } from 'components/Column'

const TableStructure = styled(RowBetween)`
  font-size: 12px;
  font-weight: 500;
  text-align: left;

  & > * {
    width: 18%;

    &:nth-child(1) {
      width: 28px;
      margin-right: 14px;
    }
    &:nth-child(2) {
      width: 14%;
    }
    &:nth-child(3) {
      width: 13%;
    }
  }
`

const RowWrap = styled(TableStructure)<{ isExpanded?: boolean }>`
  height: 93px;
  color: ${({ theme }) => theme.text0};
  padding: 12px 24px 12px 12px;
  border-top: 1px solid #d9d9d933;

  & > * {
    &:nth-child(1) {
      height: 100%;
    }
  }
  &:hover {
    background: linear-gradient(90deg, rgba(35, 39, 47, 0.4) 0%, rgba(57, 30, 30, 0.4) 100%);
  }
`

const StarWrapper = styled(RowCenter)`
  &:hover {
    cursor: pointer;
  }
`

const Symbol = styled.div<{ fontSize?: string }>`
  margin-bottom: 4px;
  font-size: ${({ fontSize }) => fontSize};
`

const Interest = styled.div`
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0em;
  color: gray;
`

const MarketName = styled.div<{ fontSize?: string; isMobile?: boolean }>`
  font-size: ${({ fontSize }) => fontSize};
  background: rgba(189, 39, 56, 0.5);
  height: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-weight: 200;
  padding: 10px 5px;
`
const StyledColumnCenter = styled(ColumnCenter)<{ isExpanded?: boolean }>`
  padding: 20px 12px;
  border-top: 1px solid #d9d9d933;
  gap: ${({ isExpanded }) => (isExpanded ? '15px' : '0')};
  transition: gap 0.3s ease-in-out;
`

const ColorLabel = styled(Row)<{ color: 'green' | 'red' | 'gray' | 'white' }>`
  color: ${({ color, theme }) =>
    color === 'green' ? theme.green1 : color === 'red' ? theme.red1 : color === 'white' ? theme.white : theme.text2};
`

const SignButton = styled(RedButton)<{ height?: string; width?: string }>`
  font-size: 11px;
  font-weight: 200;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  padding: 15px;
  display: flex;
  overflow: unset;
  z-index: 0;
  text-wrap: nowrap;
`

const ExpandingContent = styled(RowBetween)<{ isExpanded?: boolean }>`
  max-height: ${({ isExpanded }) => (isExpanded ? '600px' : '0')};
  border-radius: 0;
  gap: 8px;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
`

const Chevron = styled(ChevronDown)<{
  open: boolean
}>`
  transform: rotateX(${({ open }) => (open ? '180deg' : '0deg')});
  transition: 0.5s;
`

const RowMobile = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 3fr 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 1px;
  align-items: center;
  justify-items: center;
  width: 100%;
`
const MobileInfo = styled.div<{ height?: string }>`
  background: #171a1f;
  width: 109px;
  height: ${({ height }) => height};
  border-radius: 5px;
  font-size: 13px;
  padding: 2px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
`

export default function MarketRow({
  market,
  marketInfo,
}: {
  market: Market
  marketInfo?: {
    price: string
    priceChangePercent: string
    tradeVolume: string
    notionalCap: string
  }
}) {
  const { symbol, name, pricePrecision } = market
  const { price, priceChangePercent, tradeVolume, notionalCap } = marketInfo || {}
  const router = useRouter()
  const favorites = useFavorites()
  const [isExpanded, setIsExpanded] = useState(false)
  const isFavorite = favorites?.includes(symbol)
  const icon = useCurrencyLogo(symbol)
  const toggleFavorite = useToggleUserFavoriteCallback(symbol)
  const onTradeClick = () => {
    router.push(`/trade/${name}`)
  }

  function getMobileContent() {
    return (
      <StyledColumnCenter onClick={() => setIsExpanded((prev) => !prev)} isExpanded={isExpanded}>
        <RowMobile>
          <StarWrapper onClick={toggleFavorite}>
            <Star size={20} isFavorite={isFavorite} />
          </StarWrapper>
          <RowStart gap={'8px'}>
            <Image unoptimized={true} src={icon} alt={symbol} width={32} height={32} />
            <div>
              <Symbol fontSize="12px">{symbol}</Symbol>
              <MarketName fontSize="9px">{name}</MarketName>
            </div>
          </RowStart>
          <MobileInfo height="45px">
            <ColorLabel color={'gray'}>Price</ColorLabel>
            <ColorLabel
              color={priceChangePercent ? (toBN(priceChangePercent).isGreaterThan(0) ? 'green' : 'red') : 'gray'}
              gap={'2px'}
            >
              <div>{price ? `$${parseFloat(price).toFixed(pricePrecision)}` : '-'}</div>
            </ColorLabel>
          </MobileInfo>
          <Chevron open={isExpanded} />
        </RowMobile>

        <ExpandingContent isExpanded={isExpanded}>
          <RowBetween gap="8px">
            <MobileInfo height="70px">
              <ColorLabel color={'gray'}>24h / 7d Change</ColorLabel>
              <ColorLabel
                color={priceChangePercent ? (toBN(priceChangePercent).isGreaterThan(0) ? 'green' : 'red') : 'gray'}
                gap={'2px'}
              >
                <span>
                  {(() => {
                    if (!priceChangePercent) return '-'
                    return `${toBN(priceChangePercent).isGreaterThan(0) ? '+' : ''}${priceChangePercent}%`
                  })()}
                </span>
              </ColorLabel>
            </MobileInfo>
            <MobileInfo height="70px">
              <ColorLabel color={'gray'}>
                24h <br /> volume
              </ColorLabel>
              <div>{formatDollarAmount(tradeVolume)}</div>
            </MobileInfo>
            <MobileInfo height="70px">
              <ColorLabel color={'gray'}>
                Market
                <br /> cap
              </ColorLabel>
              <div>{formatDollarAmount(notionalCap)}</div>
            </MobileInfo>
          </RowBetween>
          <SignButton height="30px" width="100%" onClick={onTradeClick}>
            Trade
          </SignButton>
        </ExpandingContent>
      </StyledColumnCenter>
    )
  }

  function getDefaultContent() {
    return (
      <RowWrap>
        <StarWrapper onClick={toggleFavorite}>
          <Star size={20} isFavorite={isFavorite} />
        </StarWrapper>
        <RowStart gap={'8px'}>
          <Image unoptimized={true} src={icon} alt={symbol} width={36} height={36} />
          <div>
            <Symbol>{symbol}</Symbol>
            <MarketName fontSize="11px">{name}</MarketName>
          </div>
        </RowStart>
        <ColorLabel
          color={priceChangePercent ? (toBN(priceChangePercent).isGreaterThan(0) ? 'green' : 'red') : 'gray'}
          gap={'2px'}
        >
          <div>{price ? `$${parseFloat(price).toFixed(pricePrecision)}` : '-'}</div>
        </ColorLabel>
        <ColorLabel
          color={priceChangePercent ? (toBN(priceChangePercent).isGreaterThan(0) ? 'green' : 'red') : 'gray'}
          gap={'2px'}
        >
          <span>
            {(() => {
              if (!priceChangePercent) return '-'
              return `${toBN(priceChangePercent).isGreaterThan(0) ? '+' : ''}${priceChangePercent}%`
            })()}
          </span>
        </ColorLabel>
        <Interest>Available</Interest>
        <div>{formatDollarAmount(tradeVolume)}</div>
        <div>{formatDollarAmount(notionalCap)}</div>
        <SignButton width="87px" height="48px" onClick={onTradeClick}>
          Trade Now
        </SignButton>
      </RowWrap>
    )
  }

  const isMobile = useIsMobile()
  return isMobile ? getMobileContent() : getDefaultContent()
}
