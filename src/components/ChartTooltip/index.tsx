import dayjs from 'dayjs'
import styled from 'styled-components'

import { formatDollarAmount, formatPrice } from 'utils/numbers'

export const IntextTooltip = styled.div`
  padding: 12px 14px;
  background-color: rgba(35, 41, 51, 0.9);
  border-radius: 12px;
  color: #fff;
  font-size: 10px;
`

interface ChartTooltipProps {
  active?: boolean
  payload?: { value: number }[]
  label?: string
  leftIndex?: number
  rightIndex?: number
  leftLabel?: string
  rightLabel?: string
  formatLeftValues?: string
  formatRightValues?: string
  customOperationForLeftLabel?: (any) => number
}

function formatValues(value: number, format: string | undefined = undefined) {
  if (format === 'USD') {
    return formatDollarAmount(value)
  }

  return formatPrice(value, 2, true)
}

const ChartTooltip = (props: ChartTooltipProps) => {
  const {
    active,
    payload,
    label,
    leftIndex = 1,
    rightIndex = 2,
    leftLabel,
    rightLabel,
    formatLeftValues,
    formatRightValues,
    customOperationForLeftLabel,
  } = props

  if (!active || !payload || !payload.length) return null

  let leftValue =
    payload[leftIndex]?.value !== undefined ? formatValues(payload[leftIndex]?.value, formatLeftValues) : null

  const rightValue =
    payload[rightIndex]?.value !== undefined ? formatValues(payload[rightIndex]?.value, formatRightValues) : null

  if (customOperationForLeftLabel) {
    leftValue = formatValues(customOperationForLeftLabel(payload), formatRightValues)
  }

  return (
    <IntextTooltip>
      <p className="label">{dayjs(label).format('DD/MM/YYYY')}</p>
      {rightLabel && rightValue && (
        <p>
          {rightLabel}: {rightValue}
        </p>
      )}

      {leftLabel && leftValue && (
        <p>
          {leftLabel}: {leftValue}
        </p>
      )}
    </IntextTooltip>
  )
}

export default ChartTooltip
