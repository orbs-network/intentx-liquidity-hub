import styled from 'styled-components'

import { Row, RowCenter } from 'components/Row'
import { useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { useSlippageTolerance } from 'state/user/hooks'

const AutoSlippageContainer = styled.div`
  padding: 1px;
  width: 125px;
  height: 28px;
  border-radius: 4px;
`

const AutoSlippageWrapper = styled(Row)`
  height: 100%;
  font-size: 10px;
  padding: 0px 6px;
  border-radius: 4px;
  color: ${({ theme }) => theme.text0};
  background: ${({ theme }) => theme.red};
  &:hover {
    cursor: pointer;
  }
`

export default function SlippageTolerance() {
  const slippage = useSlippageTolerance()
  const toggleSlippageModal = useToggleModal(ApplicationModal.CHANGE_MARKET_SLIPPAGE)
  return (
    <AutoSlippageContainer
      onClick={() => {
        toggleSlippageModal()
      }}
    >
      {slippage === 'auto' ? (
        <AutoSlippageWrapper>
          <RowCenter>Auto slippage</RowCenter>
        </AutoSlippageWrapper>
      ) : (
        <AutoSlippageWrapper>
          <RowCenter>{slippage}%</RowCenter>
        </AutoSlippageWrapper>
      )}
    </AutoSlippageContainer>
  )
}
