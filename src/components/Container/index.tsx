import { FC } from 'react'
import styled from 'styled-components'

interface Props {
  children: React.ReactNode
  className?: string
}

const StyledContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1800px;
`

export const Container: FC<Props> = ({ children, className = '' }) => {
  return <StyledContainer className={className}>{children}</StyledContainer>
}
