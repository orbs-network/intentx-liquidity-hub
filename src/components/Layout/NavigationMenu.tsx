import Link from 'next/link'

import { Row, RowBetween } from 'components/Row'
import styled from 'styled-components'

const Container = styled(Row)`
  width: unset;
  margin-right: 0px;
  gap: 10px;
  margin-left: 50px;
`

const LinkContainer = styled(RowBetween)<{ active?: boolean }>`
  width: unset;
  gap: 20px;
`

export default function NavigationMenu() {
  return (
    <Container>
      <Link href={'/my-account'}>
        <LinkContainer>
          <div>My Account</div>
        </LinkContainer>
      </Link>
      <Link href="/trade/BTCUSDT" passHref>
        <LinkContainer>
          <div>Trade</div>
        </LinkContainer>
      </Link>
    </Container>
  )
}
