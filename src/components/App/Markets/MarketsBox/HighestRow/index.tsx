import { RowBetween, RowEnd } from 'components/Row'
import React from 'react'
import styled from 'styled-components'
import { toBN } from 'utils/numbers'

const Container = styled(RowBetween)`
  transition: background-color 0.3s linear;
  padding: 5px;
  border-radius: 5px;
  height: 45px;
  &:hover {
    background: ${({ theme }) => theme.bg4};
  }
`

const MarketText = styled.div`
  display: inline-flex;
  gap: 7px;
`
const Market = styled.div<{ color: string | undefined }>`
  color: ${({ color }) => color};
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0em;
`
const ColorLabel = styled.div<{ color: 'green' | 'red' | 'gray' | 'white' }>`
  color: ${({ color, theme }) =>
    color === 'green' ? theme.green1 : color === 'red' ? theme.red1 : color === 'white' ? theme.white : theme.text2};
`

export default function HighestRow({
  market,
  marketSub,
  variation,
}: {
  market: string
  marketSub: string
  variation: number
}): JSX.Element | null {
  return (
    <Container>
      <MarketText>
        <Market color="white">{market}</Market>
        <Market color="gray">{marketSub}</Market>
      </MarketText>
      <RowEnd>
        <ColorLabel color={variation ? (toBN(variation).isGreaterThan(0) ? 'green' : 'red') : 'gray'}>
          <span>
            {(() => {
              if (!variation) return '-'
              // return `${toBN(variation).isGreaterThan(0) ? '+' : ''}${variation}%`
              return `${variation}%`
            })()}
          </span>
        </ColorLabel>
      </RowEnd>
    </Container>
  )
}
