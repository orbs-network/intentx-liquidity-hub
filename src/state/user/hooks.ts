import { useCallback } from 'react'
import { shallowEqual } from 'react-redux'

import { BALANCE_HISTORY_ITEMS_NUMBER, CHECK_IS_WHITE_LIST } from 'config'
import { AppThunkDispatch, useAppDispatch, useAppSelector } from 'state'
import { ApiState } from 'types/api'
import { Account, UserPartyAStatDetail, initialUserPartyAStatDetail } from 'types/user'
import { makeHttpRequest } from 'utils/http'
import { getBalanceHistory } from './thunks'
import { BalanceHistoryData, ConnectionStatus } from './types'

import { IResultEntity } from 'apollo/queries/operations'
import useDebounce from 'lib/hooks/useDebounce'
import { useHedgerInfo } from 'state/hedger/hooks'
import { TradeView } from 'types/trade'
import {
    addRejectedQuote,
    resetUser,
    setFillOrKillMode,
    updateAccountsArchive,
    updateTradeView,
    updateUpnlWebSocketStatus,
    updateUserDarkMode,
    updateUserExpertMode,
    updateUserFavorites,
    updateUserLeverage,
    updateUserSlippageTolerance,
} from './actions'

// Reset resetUser() action
export const useResetUser = () => {
  const dispatch = useAppDispatch()
  return useCallback(() => {
    dispatch(resetUser())
  }, [dispatch])
}

export function useIsDarkMode(): boolean {
  const { userDarkMode, matchesDarkMode } = useAppSelector(
    ({ user: { matchesDarkMode, userDarkMode } }) => ({
      userDarkMode,
      matchesDarkMode,
    }),
    shallowEqual
  )
  return userDarkMode === null ? matchesDarkMode : userDarkMode
}

export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch()
  const darkMode = useIsDarkMode()

  const toggleSetDarkMode = useCallback(() => {
    dispatch(updateUserDarkMode({ userDarkMode: !darkMode }))
  }, [darkMode, dispatch])

  return [darkMode, toggleSetDarkMode]
}

export function useSetSlippageToleranceCallback(): (slippageTolerance: 'auto' | number) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (userSlippageTolerance: 'auto' | number) => {
      dispatch(
        updateUserSlippageTolerance({
          userSlippageTolerance,
        })
      )
    },
    [dispatch]
  )
}

export function useSlippageTolerance(): number | 'auto' {
  const userSlippageTolerance = useAppSelector((state) => state.user.userSlippageTolerance)
  return userSlippageTolerance
}

export function useSetExpertModeCallback() {
  const dispatch = useAppDispatch()
  return useCallback(
    (userExpertMode: boolean) => {
      dispatch(updateUserExpertMode({ userExpertMode }))
    },
    [dispatch]
  )
}

export function useExpertMode(): boolean {
  const userExpertMode = useAppSelector((state) => state.user.userExpertMode)
  return userExpertMode ? true : false
}

export function useUserWhitelist(): null | boolean {
  const whiteListAccount = useAppSelector((state) => state.user.whiteListAccount)
  return whiteListAccount
}

export function useLeverage(): number {
  const leverage = useAppSelector((state) => state.user.leverage)
  return leverage
}

export function useSetLeverageCallback() {
  const dispatch = useAppDispatch()
  return useCallback(
    (leverage: number) => {
      dispatch(updateUserLeverage(leverage))
    },
    [dispatch]
  )
}
export function useAccountsArchive(): string[] {
  const accountsArchive = useAppSelector((state) => state.user.accountsArchive)
  return accountsArchive ?? []
}

export function useToggleAccountsArchiveCallback(accountAddress: string): () => void {
  const dispatch = useAppDispatch()
  const accountsArchive = useAccountsArchive()

  return useCallback(() => {
    const isArchived = accountsArchive?.includes(accountAddress)
    if (isArchived) {
      const filteredAccountsArchive = accountsArchive.filter((archivedAccount) => archivedAccount !== accountAddress)
      dispatch(updateAccountsArchive(filteredAccountsArchive))
    } else {
      dispatch(updateAccountsArchive([...accountsArchive, accountAddress]))
    }
  }, [accountsArchive, accountAddress, dispatch])
}

export function useFavorites(): string[] {
  const favorites = useAppSelector((state) => state.user.favorites)
  return favorites
}

export function useToggleUserFavoriteCallback(symbol: string): () => void {
  const dispatch = useAppDispatch()
  const favorites = useFavorites()

  return useCallback(() => {
    const isFavorite = favorites?.includes(symbol)
    if (isFavorite) {
      const filteredFavorites = favorites.filter((favorite) => favorite !== symbol)
      dispatch(updateUserFavorites(filteredFavorites))
    } else {
      dispatch(updateUserFavorites([...favorites, symbol]))
    }
  }, [favorites, symbol, dispatch])
}

export function useActiveAccount(): Account | null {
  const activeAccount = useAppSelector((state) => state.user.activeAccount)
  return activeAccount
}
export function useTradeContainerIsReverse(): boolean {
  const isReverse = useAppSelector((state) => state.user.tradeContainerIsReverse)
  return isReverse ?? false
}

export function useHideAccountBalance(): boolean {
  const hideAccountBalance = useAppSelector((state) => state.user.hideAccountBalance)
  return hideAccountBalance ?? false
}

export function useHideFavouriteBar(): boolean {
  const hideFavouriteBar = useAppSelector((state) => state.user.hideFavouriteBar)
  return hideFavouriteBar ?? false
}

export function useActiveAccountAddress(): string | null {
  const activeAccount = useAppSelector((state) => state.user.activeAccount)
  return activeAccount && activeAccount.accountAddress
}

export function useAccountPartyAStat(address: string | null | undefined): UserPartyAStatDetail {
  const accountsPartyAStat = useAppSelector((state) => state.user.accountsPartyAStat)
  if (!address || !accountsPartyAStat) return initialUserPartyAStatDetail
  if (!accountsPartyAStat[address]) return initialUserPartyAStatDetail
  return accountsPartyAStat[address]
}

export function useAccountUpnl() {
  const activeAccountUpnl = useAppSelector((state) => state.user.activeAccountUpnl)
  return activeAccountUpnl
}

export function useSetUpnlWebSocketStatus() {
  const dispatch = useAppDispatch()
  return useCallback(
    (status: ConnectionStatus) => {
      dispatch(updateUpnlWebSocketStatus({ status }))
    },
    [dispatch]
  )
}

export function useGetBalanceHistoryCallback() {
  const thunkDispatch: AppThunkDispatch = useAppDispatch()
  return useCallback(
    (chainId: number | undefined, account: string | null, skip?: number, first?: number) => {
      if (!chainId || !account) return
      thunkDispatch(
        getBalanceHistory({
          account,
          chainId,
          first: first ?? BALANCE_HISTORY_ITEMS_NUMBER,
          skip: skip ? skip : 0,
        })
      )
    },
    [thunkDispatch]
  )
}

export function useUpnlWebSocketStatus() {
  const upnlWebSocketStatus = useAppSelector((state) => state.user.upnlWebSocketStatus)
  return upnlWebSocketStatus
}

export function useIsWhiteList(
  account: string | undefined,
  multiAccountAddress: string | undefined
): () => Promise<any> {
  const { baseUrl, fetchData } = useHedgerInfo() || {}
  return useCallback(async () => {
    if (!CHECK_IS_WHITE_LIST || !fetchData || !account || !baseUrl || !multiAccountAddress) return null
    const { href: url } = new URL(`/check_in-whitelist/${account}/${multiAccountAddress}`, baseUrl)
    return makeHttpRequest(url)
  }, [fetchData, account, baseUrl, multiAccountAddress])
}

export function useAddInWhitelist(
  subAccount: string | undefined,
  multiAccountAddress: string | undefined
): () => Promise<any> {
  const { baseUrl, fetchData } = useHedgerInfo() || {}
  return useCallback(async () => {
    if (!CHECK_IS_WHITE_LIST || !fetchData || !subAccount || !baseUrl || !multiAccountAddress) return null
    const { href: url } = new URL(`/add-sub-address-in-whitelist/${subAccount}/${multiAccountAddress}`, baseUrl)
    return makeHttpRequest(url)
  }, [baseUrl, fetchData, multiAccountAddress, subAccount])
}

export function useBalanceHistory(): {
  hasMoreHistory: boolean | undefined
  balanceHistory: { [txHash: string]: BalanceHistoryData } | undefined
  balanceHistoryState: ApiState
} {
  const hasMoreHistory = useAppSelector((state) => state.user.hasMoreHistory)
  const balanceHistory = useAppSelector((state) => state.user.balanceHistory)
  const balanceHistoryState = useAppSelector((state) => state.user.balanceHistoryState)

  return { hasMoreHistory, balanceHistory, balanceHistoryState }
}

export function useTotalDepositsAndWithdrawals() {
  const depositWithdrawalsData = useAppSelector((state) => state.user.depositWithdrawalsData)
  const depositWithdrawalsState = useAppSelector((state) => state.user.depositWithdrawalsState)
  const debounceState = useDebounce(depositWithdrawalsState, 200)

  return { depositWithdrawalsData, depositWithdrawalsState: debounceState }
}

export function useHistoricalResultEntities(): {
  historicalResultEntities: IResultEntity[]
  historicalResultEntitiesState: ApiState
} {
  const historicalResultEntities = useAppSelector((state) => state.user.historicalResultEntities)
  const historicalResultEntitiesState = useAppSelector((state) => state.user.historicalResultEntitiesState)
  const debouncedEntities = useDebounce(historicalResultEntities, 500)
  const debounceState = useDebounce(historicalResultEntitiesState, 500)

  return { historicalResultEntities: debouncedEntities, historicalResultEntitiesState: debounceState }
}

export function useLastActiveAccountMap() {
  const lastActiveAccountMap: {
    [wallet: string]: Account
  } = useAppSelector((state) => state.user.lastActiveAccountMap) ?? {}
  return lastActiveAccountMap
}
export function useActiveTradeView(): TradeView {
  const view = useAppSelector((state) => state.user.view)
  return view
}

export function useSetActiveTradeView(): (view: TradeView) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (view: TradeView) => {
      dispatch(updateTradeView(view))
    },
    [dispatch]
  )
}

export function useFillOrKillMode() {
  const fillOrKillMode: boolean = useAppSelector((state) => state.user.fillOrKillMode)
  return fillOrKillMode
}

export function useSetFillOrKillMode(): (fillOrKillMode: boolean) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (fillOrKillMode: boolean) => {
      dispatch(setFillOrKillMode(fillOrKillMode))
    },
    [dispatch]
  )
}

export function useRejectedQuotesIds() {
  const rejectedQuotesIds: string[] = useAppSelector((state) => state.user.rejectedQuotesIds)

  if (!rejectedQuotesIds) return []

  return rejectedQuotesIds
}

export function useAddRejectedQuoteCallback() {
  const dispatch = useAppDispatch()
  return useCallback(
    (id: string) => {
      dispatch(addRejectedQuote({ id }))
    },
    [dispatch]
  )
}
