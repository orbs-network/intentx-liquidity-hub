import { X } from 'react-feather'

import { useTheme } from 'styled-components'
import { IconWrapper } from './index'

export default function SearchClose({ size }: { size?: number | string }) {
  const theme = useTheme()
  return (
    <IconWrapper size={size?.toString()} stroke={theme.red}>
      <X opacity={1} size={size ?? 18} />
    </IconWrapper>
  )
}
