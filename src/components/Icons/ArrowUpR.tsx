import styled from 'styled-components'
import { ArrowUpRight as ArrowUpRightIcon } from 'react-feather'

const Icon = styled(ArrowUpRightIcon)<{
  size?: string
  hover?: boolean
  strokeW?:string
  [x: string]: any
}>`
  stroke-width: ${({strokeW }) => (strokeW ? strokeW : '1')};
  color: ${({ theme, hover }) => (hover ? theme.red2 : theme.text2)};
  &:hover {
    cursor: pointer;
  }
`

export default function ArrowUpRight({ size, hover, strokeW, ...rest }: { size?: number; strokeW?: string; hover?: boolean; [x: string]: any }) {
  return <Icon size={size ?? 10} strokeW={strokeW ?? '1'} hover={hover ?? false} {...rest} />
}
