import styled from 'styled-components'

import { EmptyPosition, EmptyPositionDetails } from 'components/Icons'
import { EmptyRow } from 'components/App/UserPanel/Common'

const EmptyPositionContainer = styled.div`
  margin-top: 90px;
  line-height: 0;
`

const SelectContainer = styled.div`
  font-size: 14px;
  margin-top: 20px;
  color: ${({ theme }) => theme.text3};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px;
  margin-top: 15px;
  `};
`

export default function EmptyDetails() {
  return (
    <EmptyRow>
      <EmptyPositionContainer>
        <EmptyPosition style={{ margin: '40px auto 16px auto' }} />
      </EmptyPositionContainer>
      <SelectContainer>Select a position from the list to view the details</SelectContainer>
    </EmptyRow>
  )
}
