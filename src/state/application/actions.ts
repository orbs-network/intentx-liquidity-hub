import { createAction } from '@reduxjs/toolkit'

import { ApplicationConnectionStatus, ApplicationModal, PopupContent } from './reducer'

export const updateChainId = createAction<{ chainId: number }>('application/updateChainId')
export const updateApplicationConnectionStatus = createAction<{
  applicationConnectionStatus: ApplicationConnectionStatus
}>('application/updateApplicationConnectionStatus')
export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')
export const updateBlockTimestamp = createAction<{
  chainId: number
  blockTimestamp: number
}>('application/updateBlockTimestamp')
export const setChainConnectivityWarning = createAction<{ chainConnectivityWarning: boolean }>(
  'application/setChainConnectivityWarning'
)
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
export const addPopup = createAction<{
  key?: string
  removeAfterMs?: number | null
  content: PopupContent
}>('application/addPopup')
export const removePopup = createAction<{ key: string }>('application/removePopup')
