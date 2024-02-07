import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useCallback } from 'react'
import { ApplicationConnectionStatus } from 'state/application/reducer'
import { signMessage } from '@wagmi/core'
import { ethers } from 'ethers'
import { useAA } from 'state/accountAbstraction/provider/AAProvider'

export default function useCombinedSignOwnerMessage() {
  const { account, applicationConnectionStatus } = useActiveConnectionDetails()
  const { web3Provider, safeAccountAbstraction, safeSdk, gelatoRelayPack, ownerAddress, safeSelected } = useAA()

  return useCallback(
    async (message: string) => {
      if (applicationConnectionStatus === ApplicationConnectionStatus.ACCOUNT_ABSTRACTION) {
        if (!safeAccountAbstraction) {
          throw new Error('SafeAccountAbstraction is not initialized.')
        }
        if (!safeSelected) {
          throw new Error('Safe is not selected.')
        }

        // Creating a fake transaction with gnosis safe
        const tx = {
          to: safeSelected,
          value: '0',
          data: `0x${ethers.utils.toUtf8Bytes(message)}`,
        }
        
      } else {
        const signature = await signMessage({
          message,
        })

        return signature
      }
    },
    [applicationConnectionStatus, safeAccountAbstraction]
  )
}
