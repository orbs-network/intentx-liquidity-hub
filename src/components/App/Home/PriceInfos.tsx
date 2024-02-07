import styled from 'styled-components'
import Column from 'components/Column'
import { useMarketData } from 'state/hedger/hooks'
import PriceInfo from './PriceInfo'

const Wrapper = styled(Column)`
  width: unset;
`

export default function PriceInfos(): JSX.Element | null {
  const markPrice = useMarketData('ETHUSDT')?.markPrice
  return <Wrapper>{<PriceInfo symbol="ETHUSDT" price={markPrice || '-'} />}</Wrapper>
}
