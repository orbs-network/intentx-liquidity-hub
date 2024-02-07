import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { updateApplicationConnectionStatus, updateChainId } from './actions'
import { useAccount } from 'wagmi'
import { ApplicationConnectionStatus } from './reducer'
import { useApplicationConnectionStatus } from './hooks'
import { useAA } from 'state/accountAbstraction/provider/AAProvider'

/**
 * FIXME: Possible issues with this updater
 * 1. Account abstraction not able to choose chainId if wagmi is not connected?
 * 2. Connection to account abstraction with wagmi connected or viceversa might cause issues?
 * 3. Desync between wagmi chainId and application chainId when using account abstraction (future issue, for now only working with base)
 *
 * QUICK FIXES FOR NOW:
 * 1. Account abstraction is always using base chainId
 */

export function ApplicationUpdater(): null {
  // Handling wagmi events
  const { chainId: wagmiChainId, account: wagmiAccount, isConnected: isWagmiConnected } = useActiveConnectionDetails()
  const { isConnected: isAAConnected, isConnecting: isAAConnecting } = useAA()
  const { chainId: applicationChainId } = useActiveConnectionDetails()
  const applicationConnectionStatus = useApplicationConnectionStatus()

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (wagmiChainId && wagmiChainId !== applicationChainId) {
      dispatch(
        updateChainId({
          chainId: wagmiChainId,
        })
      )
    }
  }, [wagmiChainId, applicationChainId, dispatch])

  // This useEffect will update the application connection status based on the wagmi & account abstraction adapter status
  useEffect(() => {
    // This way, account abstraction is prioritized over wagmi in case that both are connected at the same time
    // FIXME: Maybe closing the session in the other one would be better?

    if (
      applicationConnectionStatus === ApplicationConnectionStatus.DISCONNECTED ||
      applicationConnectionStatus === ApplicationConnectionStatus.ACCOUNT_ABSTRACTION
    ) {
      if (isAAConnected) {
        if (applicationConnectionStatus === ApplicationConnectionStatus.DISCONNECTED) {
          dispatch(
            updateApplicationConnectionStatus({
              applicationConnectionStatus: ApplicationConnectionStatus.ACCOUNT_ABSTRACTION,
            })
          )
        }
      } else {
        if (applicationConnectionStatus === ApplicationConnectionStatus.ACCOUNT_ABSTRACTION) {
          dispatch(
            updateApplicationConnectionStatus({
              applicationConnectionStatus: ApplicationConnectionStatus.DISCONNECTED,
            })
          )
        }
      }
    }

    if (
      applicationConnectionStatus === ApplicationConnectionStatus.DISCONNECTED ||
      applicationConnectionStatus === ApplicationConnectionStatus.DEFI
    ) {
      if (wagmiAccount && isWagmiConnected) {
        // If it's disconnected, allow wagmi connection
        if (applicationConnectionStatus === ApplicationConnectionStatus.DISCONNECTED) {
          dispatch(
            updateApplicationConnectionStatus({
              applicationConnectionStatus: ApplicationConnectionStatus.DEFI,
            })
          )
        }
      } else {
        // If it's connected to wagmi
        if (applicationConnectionStatus === ApplicationConnectionStatus.DEFI) {
          dispatch(
            updateApplicationConnectionStatus({
              applicationConnectionStatus: ApplicationConnectionStatus.DISCONNECTED,
            })
          )
        }
      }
    }
  }, [wagmiAccount, isWagmiConnected, dispatch, applicationConnectionStatus, isAAConnected, isAAConnecting])

  return null
}
