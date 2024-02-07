import { PrimaryButton } from 'components/Button'
import EyeDisabled from 'components/Icons/EyeDisabled'
import { useIsMobile } from 'lib/hooks/useWindowSize'
import { Eye } from 'react-feather'
import { useActiveTradeView, useSetActiveTradeView } from 'state/user/hooks'
import styled from 'styled-components'
import { TradeView } from 'types/trade'

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

export default function HideDepthButton() {
  const activeTradeView = useActiveTradeView()
  const setActiveTradeView = useSetActiveTradeView()
  const isMobile = useIsMobile()

  return !isMobile ? (
    <MainButton
      active={activeTradeView === TradeView.TRADE_FULL}
      onClick={() =>
        setActiveTradeView(activeTradeView === TradeView.TRADE_FULL ? TradeView.TRADE : TradeView.TRADE_FULL)
      }
    >
      {activeTradeView === TradeView.TRADE_FULL && <EyeDisabled width={13} height={13} color="white" />}
      {(activeTradeView === TradeView.TRADE || activeTradeView === TradeView.DEPTH) && (
        <Eye width={13} height={13} color="white" />
      )}
      <span>Depth</span>
    </MainButton>
  ) : (
    <></>
  )
}
