import React from 'react'
import styled, { useTheme } from 'styled-components'

import { BN_ZERO, formatAmount, toBN } from 'utils/numbers'
import { getRemainingTime } from 'utils/time'

import { useFundingRateData } from 'state/hedger/hooks'
import { useActiveMarket } from 'state/trade/hooks'

import { Name } from 'components/App/Markets/MarketBar'
import Column from 'components/Column'
import { Row } from 'components/Row'
import { ToolTipBottomEnd } from 'components/ToolTip'

const DataRow = styled(Row)`
  gap: 4px;
  font-size: 9px;
  line-height: 10px;

  &:first-child {
    margin-bottom: 2px;
  }
`

const HedgerColumn = styled(Column)`
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding-right: 8px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 4px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  min-width: 110px;
  padding-right: 6px;
`};
`

const Value = styled.div<{
  color?: string
  size?: string
}>`
  color: ${({ theme, color }) => color ?? theme.text0};
  ${({ size }) =>
    size &&
    `
  font-size: ${size};
`}

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 10px;
  `};
`

export default function MarketFundingRate() {
  const activeMarket = useActiveMarket()
  const { name } = activeMarket || {}
  const fundingRate = useFundingRateData(name)
  const { diff, hours, minutes, seconds } = getRemainingTime(fundingRate?.next_funding_time || 0)

  const nextFundingRateLongBN = fundingRate ? toBN(fundingRate.next_funding_rate_long) : BN_ZERO
  const nextFundingRateShortBN = fundingRate ? toBN(fundingRate.next_funding_rate_short) : BN_ZERO
  const longColor = useColor(nextFundingRateLongBN.toString())
  const shortColor = useColor(nextFundingRateShortBN.toString())

  return (
    <React.Fragment>
      <HedgerColumn
        data-for="funding-rate"
        data-tip="When the funding countdown goes to 0.
         Green (+) means you get paid.
         Red (-) means you should pay.
         "
      >
        <ToolTipBottomEnd id="funding-rate" />

        <Name>Funding</Name>
        <Column>
          <DataRow>
            <Value size={'11px'} color={longColor}>
              {fundingRate ? `${formatAmount(nextFundingRateLongBN.times(100).toFixed(4))}%` : '-'}
            </Value>
            LONG
          </DataRow>
          <DataRow>
            <Value size={'11px'} color={shortColor}>
              {fundingRate ? `${formatAmount(nextFundingRateShortBN.times(100).toFixed(4))}%` : '-'}
            </Value>
            SHORT
          </DataRow>
        </Column>
      </HedgerColumn>
      <HedgerColumn>
        <Name>Next Funding</Name>
        <Value size={'12px'}>
          {fundingRate && !nextFundingRateLongBN.isNaN()
            ? `${
                diff > 0 &&
                ` ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
                  .toString()
                  .padStart(2, '0')}`
              }`
            : '-'}
        </Value>
      </HedgerColumn>
    </React.Fragment>
  )
}

function useColor(value: string) {
  const theme = useTheme()
  const valueBN = toBN(value)

  if (valueBN.isEqualTo(0)) return theme.text0
  else if (valueBN.isGreaterThan(0)) return theme.green1
  else return theme.red1
}
