import { createAction } from '@reduxjs/toolkit'
import { ConnectionStatus } from 'state/hedger/types'
import { TradeView } from 'types/trade'

import { Account, AccountUpnl, UserPartyAStatDetail } from 'types/user'

export const resetUser = createAction('user/resetUser')
export const updateMatchesDarkMode = createAction<{ matchesDarkMode: boolean }>('user/updateMatchesDarkMode')
export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>('user/updateUserDarkMode')
export const updateUserExpertMode = createAction<{ userExpertMode: boolean }>('user/updateUserExpertMode')
export const updateAccountsArchive = createAction<string[]>('user/updateAccountsArchive')
export const updateUserFavorites = createAction<string[]>('user/updateUserFavorites')
export const updateUserLeverage = createAction<number>('user/updateUserLeverage')
export const updateUserSlippageTolerance = createAction<{ userSlippageTolerance: 'auto' | number }>(
  'user/updateUserSlippageTolerance'
)
export const updateAccount = createAction<Account | null>('user/updateAccount')
export const updateAccountUpnl = createAction<AccountUpnl>('user/updateAccountUpnl')

export const updateUpnlWebSocketStatus = createAction<{ status: ConnectionStatus }>('user/updateUpnlWebSocketStatus')
export const updateAccountPartyAStat = createAction<{ address: string; value: UserPartyAStatDetail }>(
  'user/updateAccountPartyAStat'
)
export const setTradeContainerIsReverse = createAction<boolean>('user/setTradeContainerIsReverse')
export const setHideAccountBalance = createAction<boolean>('user/setHideAccountBalance')
export const updateTradeView = createAction<TradeView>('user/updateTradeView')
export const setHideFavouriteBar = createAction<boolean>('user/setHideFavouriteBar')
export const setFillOrKillMode = createAction<boolean>('user/setFillOrKillMode')

export const addRejectedQuote = createAction<{ id: string }>('quotes/addRejectedQuote')
export const removeRejectedQuotes = createAction<{ ids: string[] }>('quotes/removeRejectedQuote')
export const cleanRejectedQuotes = createAction('quotes/cleanRejectedQuotes')
