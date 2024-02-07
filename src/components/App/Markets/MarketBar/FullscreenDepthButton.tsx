import { PrimaryButton } from 'components/Button'
import { Eye, EyeDisabled } from 'components/Icons'
import Contract from 'components/Icons/Contract'
import Expand from 'components/Icons/Expand'
import { useIsMobile } from 'lib/hooks/useWindowSize'
import { useActiveTradeView, useSetActiveTradeView } from 'state/user/hooks'
import styled from 'styled-components'
import { TradeView } from 'types/trade'

const Wrapper = styled.div`
  margin-left: auto;
`

const MainButton = styled(PrimaryButton)<{ active: boolean }>`
  height: 21px;
  font-size: 9px !important;
  overflow: unset;
  z-index: 0;
  padding: 0;
  display: inline-flex;
  width: initial;
  padding: 0 7px;
  gap: 3px;
  line-height: 1;
  border-radius: 5px;
  background: ${({ theme, active }) =>
    active ? theme.gradCustom1 : `linear-gradient(45deg, #232933 15.48%, #3c4656 103.57%)`};
  /* background-origin: border-box;
  background-clip: padding-box, border-box; */
  cursor: pointer;
  margin-right: 12px;
  margin-left: auto;
  svg {
    margin: 0;
    line-height: 0;
    margin-top: 2px;
  }
`

export default function FullscreenDepthButton() {
  const activeTradeView = useActiveTradeView()
  const setActiveTradeView = useSetActiveTradeView()
  const isMobile = useIsMobile()

  return (
    <Wrapper>
      {!isMobile && activeTradeView !== TradeView.TRADE_FULL ? (
        <MainButton
          active={activeTradeView === TradeView.DEPTH}
          onClick={() => setActiveTradeView(activeTradeView === TradeView.DEPTH ? TradeView.TRADE : TradeView.DEPTH)}
        >
          {activeTradeView === TradeView.TRADE && <Expand width={15} height={15} />}
          {activeTradeView === TradeView.DEPTH && <Contract width={13} height={13} />}
          <span>Depth</span>
        </MainButton>
      ) : (
        <></>
      )}
    </Wrapper>
  )
}
