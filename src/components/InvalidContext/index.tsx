import { useMemo } from 'react'
import styled from 'styled-components'

import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'

import { ChainInfo } from 'constants/chainInfo'
import { FALLBACK_CHAIN_ID } from 'constants/chains'

import useRpcChangerCallback from 'lib/hooks/useRpcChangerCallback'
import { useSupportedChainId } from 'lib/hooks/useSupportedChainId'

import { useConnectModal } from '@rainbow-me/rainbowkit'
import { MainButton } from 'components/Button'
import { SwitchWallet } from 'components/Icons'
import { useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'

const ConnectWrap = styled.div`
  margin-right: 5px;
  display: flex;
  align-items: center;
`

export enum ContextError {
  ACCOUNT,
  CHAIN_ID,
  VALID,
}

export function useInvalidContext() {
  const { chainId, account } = useActiveConnectionDetails()
  const isSupportedChainId = useSupportedChainId()
  return useMemo(
    () =>
      !account || !chainId ? ContextError.ACCOUNT : !isSupportedChainId ? ContextError.CHAIN_ID : ContextError.VALID,
    [account, chainId, isSupportedChainId]
  )
}

export function InvalidContext() {
  const invalidContext = useInvalidContext()
  const rpcChangerCallback = useRpcChangerCallback()
  const fallbackChainInfo = ChainInfo[FALLBACK_CHAIN_ID]

  const toggleConnectionModal = useToggleModal(ApplicationModal.CONNECT_ACCOUNT)

  const { openConnectModal } = useConnectModal()
  const toggleConnectionModal_temp = useToggleModal(ApplicationModal.ACCOUNT_ABSTRACTION_CONNECTING)

  return useMemo(() => {
    if (invalidContext === ContextError.ACCOUNT) {
      return (
        <>
          <MainButton
            onClick={() => {
              // toggleConnectionModal()
              toggleConnectionModal_temp()
              openConnectModal && openConnectModal()
            }}
          >
            <ConnectWrap>
              <SwitchWallet size={16} />
            </ConnectWrap>
            Connect your Wallet
          </MainButton>
        </>
      )
    }
    if (invalidContext === ContextError.CHAIN_ID) {
      return (
        <>
          <MainButton
            label={`Switch Network to ${fallbackChainInfo.chainName}`}
            onClick={() => rpcChangerCallback(FALLBACK_CHAIN_ID)}
          >
            Switch Network to {fallbackChainInfo.chainName}
          </MainButton>
        </>
      )
    }
    return null
  }, [invalidContext, toggleConnectionModal_temp, openConnectModal, fallbackChainInfo.chainName, rpcChangerCallback])
}
