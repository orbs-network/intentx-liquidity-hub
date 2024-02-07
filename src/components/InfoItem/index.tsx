import { useCallback } from 'react'
import styled from 'styled-components'

import { Info as InfoIcon } from 'components/Icons'
import { RowBetween, RowStart } from 'components/Row'
import ShimmerAnimation from 'components/ShimmerAnimation'
import { ToolTipBottomEnd } from 'components/ToolTip'

const StyledInfoIcon = styled(InfoIcon)`
  color: ${({ theme }) => theme.text2};
  width: 12px;
  height: 12px;
  margin: 4px 4px 0px 4px;
  cursor: default;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 10px;
  height: 10px; 
  `};
`

export const DataRow = styled(RowBetween)`
  flex-flow: row nowrap;
  padding: 2px 3px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 2px 2px; 
  `};
`

export const Label = styled(RowStart)<{ size?: string }>`
  font-size: ${({ size }) => size ?? '13px'};
  justify-self: start;
  font-weight: 400;
  width: max-content;
  color: ${({ theme }) => theme.text1};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 12px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 11px;
  `};
`

export const Value = styled.div<{ color?: string; cursor?: string; size?: string }>`
  font-size: ${({ size }) => size ?? '13px'};
  justify-self: end;
  color: ${({ theme, color }) => color ?? theme.text0};
  cursor: ${({ cursor }) => cursor ?? 'default'};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 10px;
  `};

  ${({ theme, size }) => theme.mediaWidth.upToExtraLarge`
  font-size: ${size ?? '11px'};
  `};
`

export default function InfoItem({
  label,
  amount,
  ticker,
  tooltip,
  valueColor,
  onClick,
  balanceExact,
  fontSize,
  loading,
}: {
  label: string
  amount: string
  ticker?: string
  tooltip?: string
  valueColor?: string
  onClick?: (amount: string) => void
  balanceExact?: string
  fontSize?: string
  loading?: boolean
}): JSX.Element {
  const handleClick = useCallback(() => {
    if (!balanceExact || !onClick) return
    onClick(balanceExact.toString())
  }, [balanceExact, onClick])

  const cursor = onClick ? 'pointer' : undefined
  return (
    <>
      <DataRow data-for="tooltip" data-tip={tooltip}>
        <Label size={fontSize}>
          {label}
          <a data-tip data-for={label}>
            {tooltip && <StyledInfoIcon />}
          </a>
        </Label>
        {loading ? (
          <ShimmerAnimation width="68px" height="17px" />
        ) : (
          <Value onClick={handleClick} color={valueColor} cursor={cursor} size={fontSize}>
            {amount} {ticker && ` ${ticker}`}
          </Value>
        )}
      </DataRow>
      <ToolTipBottomEnd id="tooltip" />
    </>
  )
}
