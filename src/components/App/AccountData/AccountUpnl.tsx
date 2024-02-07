import { useMemo } from 'react'
import styled, { useTheme } from 'styled-components'

import { useAccountUpnl, useHideAccountBalance } from 'state/user/hooks'
import { formatAmount, toBN } from 'utils/numbers'

export const UpnlValue = styled.div<{ color?: string; size?: string }>`
  margin-left: 8px;
  font-weight: 500;
  text-wrap: nowrap;
  overflow-y: scroll;
  font-size: ${({ size }) => size ?? '14px'};
  color: ${({ theme, color }) => color ?? theme.text0};
  ${({ theme, size }) => theme.mediaWidth.upToMedium`
    font-size: ${size ?? '12px'};
  `};

  ${({ theme, size }) => theme.mediaWidth.upToExtraLarge`
  font-size: ${size ?? '11px'};
`};
`

export default function AccountUpnl({ size }: { size?: string }) {
  const theme = useTheme()
  const { upnl } = useAccountUpnl()

  const [value, color] = useMemo(() => {
    const upnlBN = toBN(upnl)
    if (upnlBN.isGreaterThan(0)) return [`+ $${parseFloat(formatAmount(upnlBN)).toFixed(2)}`, theme.green1]
    else if (upnlBN.isLessThan(0))
      return [`- $${parseFloat(formatAmount(Math.abs(upnlBN.toNumber()))).toFixed(2)}`, theme.red1]
    return [`$${parseFloat(formatAmount(upnlBN)).toFixed(2)}`, undefined]
  }, [upnl, theme])
  const hideAccountBalance = useHideAccountBalance()
  return (
    <UpnlValue color={hideAccountBalance ? undefined : color} size={size}>
      {hideAccountBalance ? '$******' : value}
    </UpnlValue>
  )
}
