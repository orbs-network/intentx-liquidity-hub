import styled from 'styled-components'
import { ArrowUpLeft as ArrowUpLeftIcon } from 'react-feather'

const Icon = styled(ArrowUpLeftIcon)<{
  size?: string
  hover?: boolean
  [x: string]: any
}>`
  stroke-width: 1;
  color: ${({ theme, hover }) => (hover ? theme.red2 : theme.text2)};
  &:hover {
    cursor: pointer;
  }
`

export default function ArrowUpLeft({ size, hover, ...rest }: { size?: number; hover?: boolean; [x: string]: any }) {
  return <Icon size={size ?? 10} hover={hover ?? false} {...rest} />
}
