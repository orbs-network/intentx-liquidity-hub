import styled from 'styled-components'
import { RowCenter } from 'components/Row'
import { memo } from 'react'

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
`
const Price = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.green1};
`
const Wrapper = styled(RowCenter)`
  gap: 10px;
  width: unset;
`

export default memo(function PriceInfo({ symbol, price }: { symbol: string; price: string }): JSX.Element | null {
  return (
    <Wrapper>
      <Title>{symbol} :</Title>
      <Price>{price}</Price>
    </Wrapper>
  )
})
