import { StateTabs } from 'components/App/UserPanel/OrdersTab'
import { OrderType, PositionType, InputField, TradeView } from 'types/trade'

export interface TradeState {
  marketId: number | undefined
  inputField: InputField
  orderType: OrderType
  positionType: PositionType
  selectedTab: StateTabs
  limitPrice: string
  typedValue: string
  cva: string | undefined
  partyAmm: string | undefined
  partyBmm: string | undefined
  lf: string | undefined
  estimatedSlippage: number
}
