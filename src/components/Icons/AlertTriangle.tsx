import styled from 'styled-components'
import { AlertTriangle as AlertTriangleIcon } from 'react-feather'

const Icon = styled(AlertTriangleIcon)<{
  size?: string
  [x: string]: any
}>`
  stroke-width: 2;
  color: ${({ theme }) => theme.white};
  &:hover {
    cursor: pointer;
  }
`

export default function AlertTriangle({ size, ...rest }: { size?: number; [x: string]: any }) {
  return <Icon size={size ?? 10} {...rest} />
}
