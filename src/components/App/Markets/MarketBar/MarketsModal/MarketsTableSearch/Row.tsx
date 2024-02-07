import Image from 'next/image'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { Market } from 'types/market'
import { formatDollarAmount, toBN } from 'utils/numbers'

import useCurrencyLogo from 'lib/hooks/useCurrencyLogo'
import { useFavorites, useToggleUserFavoriteCallback } from 'state/user/hooks'

import { ChevronDown, Star } from 'components/Icons'
import { Row, RowBetween, RowCenter, RowStart } from 'components/Row'
import { useIsMobile } from 'lib/hooks/useWindowSize'
import { useCallback, useMemo, useState } from 'react'
import { useActiveMarket } from 'state/trade/hooks'

const TableStructure = styled(RowBetween)`
  font-size: 12px;
  font-weight: 500;
  text-align: left;

  & > * {
    flex-shrink: 0;
    width: 100px;

    &:first-child {
      width: 150px;
    }

    &:last-child {
      width: 45px;
    }
  }

  /* & > * {
    width: 18%;

    &:nth-child(1) {
      width: 30%;
      margin-right: 14px;
    }
    &:nth-child(2) {
      width: 40%;
    }
    &:nth-child(3) {
      width: 40%;
    }
    &:nth-child(4) {
      width: 35%;
    }
    &:nth-child(5) {
      width: 35%;
    }
    &:nth-child(6) {
      width: 30%;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    & > * {
      &:nth-child(1) {
        width: 60%;
        margin-right: 1px;
      }
      &:nth-child(2) {
        width: 40%;
      }
      &:nth-child(3) {
        width: 40%;
      }
      &:nth-child(4) {
        text-align: center;
      }
    }
  `} */

  /* ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 9px;
  margin-left: 9px;
`}; */
`

const RowWrap = styled(TableStructure)<{ isExpanded?: boolean }>`
  justify-content: flex-start;
  height: 60px;
  color: ${({ theme }) => theme.text0};
  padding: 13px 24px;
  cursor: pointer;

  & > * {
    &:nth-child(1) {
      height: 100%;
    }
  }
  &:hover {
    background: linear-gradient(90deg, rgba(35, 39, 47, 0.4) 0%, rgba(57, 30, 30, 0.4) 100%);
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 24px 12px 0px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  height: 45px;
  padding: 9px;
`};
`

const StarWrapper = styled(RowCenter)`
  &:hover {
    cursor: pointer;
  }
`

const StarWrapperMobile = styled.div`
  &:hover {
    cursor: pointer;
  }
  position: relative;
  left: -5px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  left: -3.75px;
`};
`

const Interest = styled.div`
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0em;
  color: gray;
`

const ColorLabel = styled(Row)<{ color: 'green' | 'red' | 'gray' | 'white' }>`
  color: ${({ color, theme }) =>
    color === 'green' ? theme.green1 : color === 'red' ? theme.red1 : color === 'white' ? theme.white : theme.text2};
`

const Chevron = styled(ChevronDown)<{
  open: boolean
}>`
  transform: rotateX(${({ open }) => (open ? '180deg' : '0deg')});
  transition: 0.5s;
`

const SymbolContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`

export default function MarketRow({
  market,
  marketInfo,
  onDismiss,
}: {
  market: Market
  marketInfo?: {
    price: string
    priceChangePercent: string
    tradeVolume: string
    notionalCap: string
    marketCap: string
  }
  onDismiss: () => void
}) {
  const { symbol, name, pricePrecision } = market
  const { price, priceChangePercent, tradeVolume, notionalCap, marketCap } = marketInfo || {}

  const router = useRouter()
  const favorites = useFavorites()
  const [isExpanded, setIsExpanded] = useState(false)
  const activeMarket = useActiveMarket()
  const isFavorite = favorites?.includes(symbol)
  const icon = useCurrencyLogo(symbol)
  const isActive = useMemo(() => market.symbol === activeMarket?.symbol, [market, activeMarket])
  const toggleFavorite = useToggleUserFavoriteCallback(symbol)

  const onClick = useCallback(() => {
    router.push(`/trade/${market.name}`)
    onDismiss()
  }, [router, market.name, onDismiss])

  function getMobileContent() {
    return (
      <RowWrap>
        <RowStart
          style={{
            whiteSpace: 'nowrap',
          }}
          gap={'3px'}
        >
          <StarWrapperMobile onClick={toggleFavorite}>
            <Star size={13} isFavorite={isFavorite} />
          </StarWrapperMobile>
          <SymbolContainer
            style={{
              whiteSpace: 'nowrap',
            }}
            onClick={onClick}
          >
            <Image unoptimized={true} src={icon} alt={symbol} width={14} height={14} />
            {market.symbol} / {market.asset}
          </SymbolContainer>
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
        {/* <div>{formatDollarAmount(notionalCap)}</div> */}
      </RowWrap>
    )
  }

  function getDefaultContent() {
    return (
      <RowWrap onClick={onClick}>
        <RowStart
          style={{
            whiteSpace: 'nowrap',
          }}
          gap={'10px'}
        >
          <SymbolContainer>
            <Image unoptimized={true} src={icon} alt={symbol} width={25} height={25} />
          </SymbolContainer>
          {market.symbol} / {market.asset}
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
        <div>{formatDollarAmount(marketCap, true, 0)}</div>
        <div>{formatDollarAmount(tradeVolume)}</div>
        {/* <div>{formatDollarAmount(notionalCap)}</div> */}
        <StarWrapper
          onClick={(event) => {
            event.stopPropagation()
            toggleFavorite()
          }}
        >
          <Star isFavorite={isFavorite} />
        </StarWrapper>
      </RowWrap>
    )
  }

  const isMobile = useIsMobile()
  return isMobile ? getMobileContent() : getDefaultContent()
}
function onDismiss() {
  throw new Error('Function not implemented.')
}
