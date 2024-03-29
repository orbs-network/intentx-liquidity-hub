import React from 'react'
import styled, { useTheme } from 'styled-components'

import useCopyClipboard from 'lib/hooks/useCopyClipboard'
import { Copy as CopyIcon, CheckMark } from 'components/Icons'
import { RowStart } from 'components/Row'

const Wrapper = styled(RowStart)`
  flex-flow: row nowrap;
  gap: 5px;

  &:hover,
  &:focus {
    cursor: pointer;
  }
`

export default function Copy({
  toCopy,
  text,
  placement = 'left',
  noFeedback,
}: {
  toCopy: string
  text?: any
  placement?: 'left' | 'right'
  noFeedback?: boolean
}): JSX.Element {
  const [isCopied, setCopied] = useCopyClipboard()
  const theme = useTheme()

  return isCopied ? (
    <Wrapper>
      {placement == 'right' && !noFeedback && 'Copied'}
      <CheckMark size={12} />
      {placement == 'left' && !noFeedback && 'Copied'}
    </Wrapper>
  ) : (
    <Wrapper onClick={() => setCopied(toCopy)}>
      {placement == 'right' && text}
      <CopyIcon size={12} color={theme.text1} style={{ transform: 'translateY(-1px)' }} />
      {placement == 'left' && text}
    </Wrapper>
  )
}
