import { RowBetween } from 'components/Row'
import ShimmerAnimation from 'components/ShimmerAnimation'
import { useHideAccountBalance } from 'state/user/hooks'
import styled from 'styled-components'

const Row = styled(RowBetween)<{ margin?: string }>`
  flex-flow: row nowrap;
  margin: ${({ margin }) => margin ?? '8px 0px'};

  ${({ theme, margin }) => theme.mediaWidth.upToExtraLarge`
  margin: ${margin ?? '6px 0px'};
`};
`

const Label = styled.div<{ color?: string }>`
  font-size: 13px;
  font-weight: 400;
  justify-self: start;
  color: ${({ theme, color }) => color ?? theme.text1};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 12px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 11px;
`};
`

const Value = styled.div<{ color?: string }>`
  font-weight: 500;
  font-size: 13px;
  justify-self: end;
  color: ${({ theme, color }) => color ?? theme.text0};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 12px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 11px;
`};
`

export default function DataRow({
  label,
  value,
  ticker,
  labelColor,
  valueColor,
  margin,
  loading,
}: {
  label: string
  value: string
  ticker?: string
  labelColor?: string
  valueColor?: string
  margin?: string
  loading?: boolean
}) {
  const hideAccountBalance = useHideAccountBalance()

  return (
    <Row margin={margin}>
      <Label color={labelColor}>{label}</Label>
      {loading ? (
        <ShimmerAnimation width="68px" height="17px" />
      ) : (
        <Value color={valueColor}>{hideAccountBalance ? '*******' : `${value} ${ticker}`}</Value>
      )}
    </Row>
  )
}
