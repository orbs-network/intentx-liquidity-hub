import { createReducer } from '@reduxjs/toolkit'
import { ApiState } from 'types/api'
import { ConnectionStatus, UserState } from './types'

import { TradeView } from 'types/trade'
import {
  addRejectedQuote,
  cleanRejectedQuotes,
  removeRejectedQuotes,
  resetUser,
  setFillOrKillMode,
  setHideAccountBalance,
  setHideFavouriteBar,
  setTradeContainerIsReverse,
  updateAccount,
  updateAccountPartyAStat,
  updateAccountUpnl,
  updateAccountsArchive,
  updateMatchesDarkMode,
  updateTradeView,
  updateUpnlWebSocketStatus,
  updateUserDarkMode,
  updateUserExpertMode,
  updateUserFavorites,
  updateUserLeverage,
  updateUserSlippageTolerance,
} from './actions'
import {
  getBalanceHistory,
  getHistoricalResultEntities,
  getIsWhiteList,
  getTotalDepositsAndWithdrawals,
} from './thunks'

const currentTimestamp = () => new Date().getTime()

const activeAccountUpnlInitialState = {
  upnl: 0,
  timestamp: 0,
  available_balance: 0,
}

export const initialState: UserState = {
  matchesDarkMode: false,
  userDarkMode: true,
  userExpertMode: false,
  userSlippageTolerance: 2.5,
  timestamp: currentTimestamp(),
  accountsArchive: [],
  favorites: [],
  leverage: 2,
  activeAccount: null,
  lastActiveAccountMap: {},
  upnlWebSocketStatus: ConnectionStatus.CLOSED,
  activeAccountUpnl: activeAccountUpnlInitialState,
  accountsPartyAStat: {},
  tradeContainerIsReverse: false,
  hideAccountBalance: false,
  hideFavouriteBar: false,

  whiteListAccount: null,
  whiteListAccountState: ApiState.LOADING,

  balanceHistory: {},
  balanceHistoryState: ApiState.LOADING,
  hasMoreHistory: true,

  depositWithdrawalsData: null,
  depositWithdrawalsState: ApiState.LOADING,

  historicalResultEntities: [],
  historicalResultEntitiesState: ApiState.LOADING,

  view: TradeView.TRADE,

  fillOrKillMode: false,

  rejectedQuotesIds: [],
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(resetUser, (state) => {
      state = initialState
    })
    .addCase(updateUserDarkMode, (state, action) => {
      state.userDarkMode = action.payload.userDarkMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateMatchesDarkMode, (state, action) => {
      state.matchesDarkMode = action.payload.matchesDarkMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserExpertMode, (state, action) => {
      state.userExpertMode = action.payload.userExpertMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateAccountsArchive, (state, action) => {
      state.accountsArchive = action.payload
    })
    .addCase(updateUserFavorites, (state, action) => {
      state.favorites = action.payload
    })
    .addCase(updateUserLeverage, (state, action) => {
      state.leverage = action.payload
    })
    .addCase(updateUserSlippageTolerance, (state, action) => {
      state.userSlippageTolerance = action.payload.userSlippageTolerance
      state.timestamp = currentTimestamp()
    })
    .addCase(updateAccount, (state, action) => {
      state.activeAccount = action.payload

      if (action.payload?.userWallet) {
        const lastActiveAccountMap = { ...state.lastActiveAccountMap }
        lastActiveAccountMap[action.payload.userWallet] = action.payload
        state.lastActiveAccountMap = lastActiveAccountMap
      }
    })
    .addCase(updateAccountUpnl, (state, action) => {
      state.activeAccountUpnl = action.payload
    })
    .addCase(updateUpnlWebSocketStatus, (state, { payload }) => {
      state.upnlWebSocketStatus = payload.status
    })

    .addCase(setTradeContainerIsReverse, (state, action) => {
      state.tradeContainerIsReverse = action.payload
    })

    .addCase(setHideAccountBalance, (state, action) => {
      state.hideAccountBalance = action.payload
    })

    .addCase(setHideFavouriteBar, (state, action) => {
      state.hideFavouriteBar = action.payload
    })

    .addCase(updateAccountPartyAStat, (state, action) => {
      const result = state.accountsPartyAStat ?? {}
      const index = action.payload.address
      result[index] = action.payload.value
      state.accountsPartyAStat = result
    })
    .addCase(getIsWhiteList.fulfilled, (state, { payload }) => {
      state.whiteListAccount = payload.isWhiteList
      state.whiteListAccountState = ApiState.OK
    })

    .addCase(getIsWhiteList.pending, (state) => {
      state.whiteListAccountState = ApiState.LOADING
    })

    .addCase(getIsWhiteList.rejected, (state) => {
      state.whiteListAccount = false
      state.whiteListAccountState = ApiState.ERROR
    })

    .addCase(getBalanceHistory.fulfilled, (state, { payload: { hasMore, result } }) => {
      const history = { ...state.balanceHistory }
      if (!result) return

      result.forEach((d) => {
        history[d.transaction] = d
      })
      state.balanceHistory = history
      state.hasMoreHistory = hasMore
      state.balanceHistoryState = ApiState.OK
    })

    .addCase(getBalanceHistory.pending, (state) => {
      state.balanceHistoryState = ApiState.LOADING
    })

    .addCase(getBalanceHistory.rejected, (state) => {
      state.hasMoreHistory = false
      state.balanceHistoryState = ApiState.ERROR
    })

    .addCase(getTotalDepositsAndWithdrawals.fulfilled, (state, { payload: { result } }) => {
      state.depositWithdrawalsData = result
      state.depositWithdrawalsState = ApiState.OK
    })

    .addCase(getTotalDepositsAndWithdrawals.pending, (state) => {
      state.depositWithdrawalsState = ApiState.LOADING
    })

    .addCase(getTotalDepositsAndWithdrawals.rejected, (state) => {
      state.depositWithdrawalsData = null
      state.depositWithdrawalsState = ApiState.ERROR
    })

    .addCase(getHistoricalResultEntities.fulfilled, (state, { payload: { result } }) => {
      if (!result) {
        state.historicalResultEntitiesState = ApiState.ERROR
        return
      }

      state.historicalResultEntities = result
      state.historicalResultEntitiesState = ApiState.OK
    })

    .addCase(getHistoricalResultEntities.pending, (state) => {
      state.historicalResultEntitiesState = ApiState.LOADING
    })

    .addCase(getHistoricalResultEntities.rejected, (state) => {
      state.historicalResultEntitiesState = ApiState.ERROR
    })

    .addCase(updateTradeView, (state, { payload }) => {
      state.view = payload
    })

    .addCase(setFillOrKillMode, (state, { payload }) => {
      state.fillOrKillMode = payload
    })

    .addCase(addRejectedQuote, (state, { payload: { id } }) => {
      // Checking if the quote is already in the list
      if (state.rejectedQuotesIds) {
        const rejectedQuotes = [...state.rejectedQuotesIds, id]
        state.rejectedQuotesIds = rejectedQuotes
      } else {
        state.rejectedQuotesIds = [id]
      }
    })
    .addCase(removeRejectedQuotes, (state, { payload: { ids } }) => {
      if (state.rejectedQuotesIds) {
        console.log('Previous ', state.rejectedQuotesIds)
        state.rejectedQuotesIds = state.rejectedQuotesIds.filter((id) => !ids.includes(id))
        console.log('New ', state.rejectedQuotesIds)
      }
    })
    .addCase(cleanRejectedQuotes, (state) => {
      state.rejectedQuotesIds = []
    })
)
