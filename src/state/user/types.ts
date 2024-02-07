import { IResultEntity } from 'apollo/queries/operations'
import { ApiState } from 'types/api'
import { TradeView } from 'types/trade'
import { Account, AccountUpnl, UserPartyAStatType } from 'types/user'

export enum ConnectionStatus {
  OPEN,
  CLOSED,
}

export interface UserState {
  matchesDarkMode: boolean // whether the dark mode media query matches
  userDarkMode: boolean | null // the user's choice for dark mode or light mode
  userExpertMode: boolean | null // the expert user's choice it for disable review modal and enable submit buggy tx
  userSlippageTolerance: 'auto' | number // user defined slippage tolerance in percentages
  timestamp: number
  accountsArchive: string[]
  favorites: string[]
  leverage: number
  activeAccount: Account | null
  lastActiveAccountMap: { [wallet: string]: Account }

  activeAccountUpnl: AccountUpnl
  upnlWebSocketStatus: ConnectionStatus
  whiteListAccount: boolean | null
  accountsPartyAStat: UserPartyAStatType
  whiteListAccountState: ApiState
  tradeContainerIsReverse: boolean
  hideAccountBalance: boolean
  hideFavouriteBar: boolean

  balanceHistory?: { [txHash: string]: BalanceHistoryData }
  balanceHistoryState: ApiState
  hasMoreHistory?: boolean

  depositWithdrawalsData: DepositWithdrawalsData | null
  depositWithdrawalsState: ApiState

  historicalResultEntities: IResultEntity[]
  historicalResultEntitiesState: ApiState

  view: TradeView
  fillOrKillMode: boolean

  rejectedQuotesIds: string[]
}

export enum BalanceHistoryType {
  DEPOSIT_PARTY_A = 'DEPOSIT',
  ALLOCATE_PARTY_A = 'ALLOCATE_PARTY_A',
  DEALLOCATE_PARTY_A = 'DEALLOCATE_PARTY_A',
  WITHDRAW_PARTY_A = 'WITHDRAW',
}

export const BalanceHistoryName: { [status: string]: string } = {
  [BalanceHistoryType.DEPOSIT_PARTY_A]: 'DEPOSIT',
  [BalanceHistoryType.DEALLOCATE_PARTY_A]: 'WITHDRAW REQUEST',
  [BalanceHistoryType.WITHDRAW_PARTY_A]: 'WITHDRAW',
}

export interface BalanceHistoryData {
  amount: string
  transaction: string
  timestamp: string
  account: string
  type: BalanceHistoryType
  __typename: string
}

export interface DepositWithdrawalsData {
  id: string
  timestamp: string
  withdraw: string
  deposit: string
  updateTimestamp: string
  __typename: string
}
