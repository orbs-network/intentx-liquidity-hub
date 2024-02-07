import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import { Market } from 'types/market'

import { useActiveMarket } from 'state/trade/hooks'
import { useFavorites, useToggleUserFavoriteCallback } from 'state/user/hooks'

import { RowEnd, RowFixed, RowStart } from 'components/Row'
import BlinkingPrice from 'components/App/FavoriteBar/BlinkingPrice'
import Favorite from 'components/Icons/Favorite'
import useCurrencyLogo from 'lib/hooks/useCurrencyLogo'
import Image from 'next/image'

const Row = styled(RowStart)<{ active: boolean }>`
  z-index: 0;
  height: 50px;

  background: ${({ theme, active }) => (active ? theme.bg3 : 'inherit')};
  border: 1px solid #ffffff33;
  margin-bottom: 10px;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.bg3};
  }
`

const StarWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  min-width: 32px;
  height: 32px;
  border-radius: 4px;
`

const InfoMarket = styled.div`
  margin-right: 0.5vw;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const PricePercentaje = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  text-align: left;
`

const Text = styled.div<{ active?: boolean; width?: string }>`
  display: flex;
  font-weight: 300;
  font-size: 14px;
  height: 44px;
  padding: 14px;
  gap: 8px;
  align-items: center;

  width: ${({ width }) => width ?? '100%'};
  color: ${({ theme, active }) => (active ? theme.primaryBlue : theme.white)};

  ${({ theme }) => theme.mediaWidth.upToSmall`
      font-size: 12px;
  
    `};
`

const OverlapLogoContainer = styled.div`
  margin-left: -4px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function MarketRow({ market, onDismiss }: { market: Market; onDismiss: () => void }) {
  const router = useRouter()
  const toggleFavorite = useToggleUserFavoriteCallback(market.symbol)
  const activeMarket = useActiveMarket()

  const favorites = useFavorites()
  const isFavorite = favorites?.includes(market.symbol)

  const isActive = useMemo(() => market.symbol === activeMarket?.symbol, [market, activeMarket])

  const onClick = useCallback(() => {
    router.push(`/trade/${market.name}`)
    onDismiss()
  }, [router, market.name, onDismiss])

  const symbolLogo = useCurrencyLogo(market?.symbol)
  const assetLogo = useCurrencyLogo(market?.asset)

  return (
    <Row active={isActive}>
      <Text onClick={onClick} active={isActive} width={'90%'}>
        {/* <RowFixed>
          <Image src={symbolLogo} alt="currency logo" width={25} />
          <OverlapLogoContainer>
            <Image src={assetLogo} alt="currency logo" width={25} />
          </OverlapLogoContainer>
        </RowFixed> */}
        {market.symbol} / {market.asset}
      </Text>

      <RowEnd width={'10%'} style={{ marginRight: '12px' }}>
        <InfoMarket>
          <BlinkingPrice market={market} />
          {/* <PricePercentaje>+0,54%</PricePercentaje> */}
        </InfoMarket>
        <StarWrap onClick={toggleFavorite}>
          <Favorite
            isFavorite={isFavorite}
            style={{
              zIndex: 99,
            }}
          />
        </StarWrap>
      </RowEnd>
    </Row>
  )
}
