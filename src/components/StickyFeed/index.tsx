import React, { useEffect, useMemo, useState } from 'react'
import { Row } from 'components/Row'
import styled from 'styled-components'
import { Z_INDEX } from 'theme'
import FeedElement from './FeedElement'
import { useMarkets, useMarketsInfo, useSetMarketsInfo } from 'state/hedger/hooks'
import { Market } from 'types/market'
import { getMarketsInfo } from 'state/hedger/thunks'

const Wrapper = styled.div`
  background: #161a1e;
  width: 100%;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #252930;
  position: fixed;
  z-index: ${Z_INDEX.modal};
  left: 0;
  bottom: 0;
  gap: 12px;
`

const Divider = styled.div<{ size?: string }>`
  height: ${({ size }) => (size ? size : '15px')};
  width: 1px;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
`

export default function StickyFeed() {
  const markets = useMarkets()
  const marketsInfo = useMarketsInfo()
  const getMarketsInfo = useSetMarketsInfo()

  const filteredMarkets: Market[] | null = useMemo(() => {
    return markets && marketsInfo
      ? markets
          .slice()
          .sort((a, b) => {
            if (!marketsInfo[b.name] || !marketsInfo[a.name]) return 0
            return (
              parseFloat(marketsInfo[b.name].priceChangePercent) - parseFloat(marketsInfo[a.name].priceChangePercent)
            )
          })
          .slice(0, 5)
      : null
  }, [markets, marketsInfo])

  useEffect(() => {
    getMarketsInfo()
  }, [getMarketsInfo])

  return (
    <Wrapper>
      {filteredMarkets?.map((market, index) => {
        const priceChange = marketsInfo[market.name] ? parseFloat(marketsInfo[market.name].priceChangePercent) : 0
        if (priceChange != 0) {
          return (
            <>
              <FeedElement
                title={market.name}
                value={marketsInfo[market.name] && marketsInfo[market.name].price}
                percentageChange={priceChange}
              />
              {index < filteredMarkets.length - 1 && <Divider />}
            </>
          )
        } else {
          return null
        }
      })}
    </Wrapper>
  )
}
