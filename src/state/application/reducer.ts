import { createReducer, nanoid } from '@reduxjs/toolkit'
import { SupportedChainId } from 'constants/chains'
import { NotificationDetails } from 'state/notifications/types'
import { TransactionInfo } from 'state/transactions/types'

import {
  addPopup,
  removePopup,
  setOpenModal,
  setChainConnectivityWarning,
  updateBlockNumber,
  updateBlockTimestamp,
  updateChainId,
  updateApplicationConnectionStatus,
} from './actions'

export enum ApplicationModal {
  WALLET = 'WALLET',
  NETWORK = 'NETWORK',
  DASHBOARD = 'DASHBOARD',
  VOUCHER = 'VOUCHER',
  OPEN_POSITION = 'OPEN_POSITION',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  CONNECT_ACCOUNT = 'CONNECT_ACCOUNT',
  ACCOUNT_ABSTRACTION_CONNECTING = 'ACCOUNT_ABSTRACTION_CONNECTING',
  CONNECTED_ACCOUNT_MANAGEMENT = 'CONNECTED_ACCOUNT_MANAGEMENT',
  DEPOSIT_AA_SPOT = 'DEPOSIT_AA_SPOT',
  WITHDRAW_AA_SPOT = 'WITHDRAW_AA_SPOT',
  TRANSFER_SPOT_FUTURES = 'TRANSFER_SPOT_FUTURES',
  DEPOSIT_CRYPTO_AA_SPOT = 'DEPOSIT_CRYPTO_AA_SPOT',
  DEPOSIT_FIAT_AA_SPOT = 'DEPOSIT_FIAT_AA_SPOT',
  CHANGE_MARKET_SLIPPAGE = 'CHANGE_MARKET_SLIPPAGE',
  SETTING = 'SETTING',
  SPOT_SETTINGS = 'SPOT_SETTINGS',
  INSUFFICIENT_SLIPPAGE = 'INSUFFICIENT_SLIPPAGE',
  REFERRALS_REGISTER = 'REFERRALS_REGISTER',
  STAKE_INTX = 'STAKE_INTX',
  REDEEM_INTX = 'REDEEM_INTX',
  POSITIONS_SELECT = 'POSITIONS_SELECT',
  ADD_STAKING = 'ADD_STAKING',
  MERGE_STAKING = 'MERGE_STAKING',
  TRANFER_STAKING = 'TRANFER_STAKING',
  PWA_ALERT = 'PWA_ALERT',
  PROCESSING_TRADE = 'PROCESSING_TRADE',
  TOKEN_SELECTION = 'TOKEN_SELECTION',
  CHAIN_SELECTION = 'CHAIN_SELECTION',
}

export type PopupContent =
  | {
      txn: {
        hash: string
        success: boolean
        summary?: string
        info?: TransactionInfo
      }
    }
  | {
      failedSwitchNetwork: SupportedChainId
    }
  | NotificationDetails

export type Popup = {
  key: string
  show: boolean
  content: PopupContent
  removeAfterMs: number | null
}

export type PopupList = Array<Popup>

export enum ApplicationConnectionStatus {
  /**
   * This enum will represent the state of the whole connection of the application
   * It's very important to check that it's synchronized completely with the application
   */
  DISCONNECTED = 'DISCONNECTED',
  DEFI = 'DEFI',
  ACCOUNT_ABSTRACTION = 'ACCOUNT_ABSTRACTION',
}
export interface ApplicationState {
  readonly chainId: number | null
  // Connection mode representation
  readonly applicationConnectionStatus: ApplicationConnectionStatus
  readonly blockNumber: { readonly [chainId: number]: number }
  readonly blockTimestamp: { readonly [chainId: number]: number }
  readonly chainConnectivityWarning: boolean
  readonly popupList: PopupList
  readonly openModal: ApplicationModal | null
}

const initialState: ApplicationState = {
  chainId: null,
  applicationConnectionStatus: ApplicationConnectionStatus.DISCONNECTED,
  blockNumber: {},
  blockTimestamp: {},
  chainConnectivityWarning: false,
  openModal: null,
  popupList: [],
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateChainId, (state, { payload }) => {
      const { chainId } = payload
      state.chainId = chainId
    })
    .addCase(updateApplicationConnectionStatus, (state, { payload }) => {
      const { applicationConnectionStatus } = payload
      state.applicationConnectionStatus = applicationConnectionStatus
    })
    .addCase(updateBlockNumber, (state, { payload }) => {
      const { chainId, blockNumber } = payload
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber
      } else {
        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
      }
    })
    .addCase(updateBlockTimestamp, (state, action) => {
      const { chainId, blockTimestamp } = action.payload
      if (typeof state.blockTimestamp[chainId] !== 'number') {
        state.blockTimestamp[chainId] = blockTimestamp
      } else {
        state.blockTimestamp[chainId] = Math.max(blockTimestamp, state.blockTimestamp[chainId])
      }
    })
    .addCase(setChainConnectivityWarning, (state, action) => {
      const { chainConnectivityWarning } = action.payload
      state.chainConnectivityWarning = chainConnectivityWarning
    })
    .addCase(setOpenModal, (state, { payload }) => {
      state.openModal = payload
    })
    .addCase(addPopup, (state, { payload: { content, key, removeAfterMs = 25000 } }) => {
      state.popupList = (key ? state.popupList.filter((popup) => popup.key !== key) : state.popupList).concat([
        {
          key: key || nanoid(),
          show: true,
          content,
          removeAfterMs,
        },
      ])
    })
    .addCase(removePopup, (state, { payload }) => {
      const { key } = payload
      state.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false
        }
      })
    })
)
