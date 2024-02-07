import { CHAIN_IDS_TO_NAMES, SupportedChainId } from 'constants/chains'
import { useAA } from 'state/accountAbstraction/provider/AAProvider'
import { useApplicationConnectionStatus } from 'state/application/hooks'
import { ApplicationConnectionStatus } from 'state/application/reducer'
import { Address, useAccount, useNetwork } from 'wagmi'

interface IActiveConnectionDetails {
  chainId?: number
  chain?: any
  account?: Address
  isConnected: boolean
  isConnecting: boolean
  applicationConnectionStatus: ApplicationConnectionStatus
}

export default function useActiveConnectionDetails(): IActiveConnectionDetails {
  /**
   * This hook is used to get the current connection details for the application
   * Used to display the current connection details, unifying account abstraction with defi
   */

  const applicationConnectionStatus = useApplicationConnectionStatus()

  // FIXME: This still needs to be more robust, but it's a start
  const { chain } = useNetwork()

  const { address: wagmiAddress, isConnected: wagmiIsConnected, isConnecting: wagmiIsConnecting } = useAccount()
  const { safeSelected: aaAddress, isConnected: aaIsConnected, isConnecting: aaIsConnecting } = useAA()

  if (
    applicationConnectionStatus === ApplicationConnectionStatus.DISCONNECTED ||
    applicationConnectionStatus === ApplicationConnectionStatus.DEFI
  ) {
    return {
      chainId: chain?.id,
      account: wagmiAddress,
      isConnected: wagmiIsConnected,
      isConnecting: wagmiIsConnecting,
      applicationConnectionStatus,
    }
  } else {
    // FIXME: For now, returning forced BASE chain information
    return {
      chainId: SupportedChainId.BASE,
      isConnected: aaIsConnected,
      isConnecting: aaIsConnecting,
      account: aaAddress,
      applicationConnectionStatus,
    }
  }
}
