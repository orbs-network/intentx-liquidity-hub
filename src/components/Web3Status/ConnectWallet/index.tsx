import { useConnectModal } from '@rainbow-me/rainbowkit'
import { PrimaryButton } from 'components/Button'
import { useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import styled from 'styled-components'

export default function ConnectWallet(): JSX.Element | null {
  const { openConnectModal } = useConnectModal()

  const toggleConnectionModal = useToggleModal(ApplicationModal.ACCOUNT_ABSTRACTION_CONNECTING)

  const ConnectWalletButton = styled(PrimaryButton)`
    height: 45px;
    width: 165px;
    border-radius: 10px;
    background: linear-gradient(90deg, rgba(189, 39, 56, 0.35) 0%, rgba(255, 6, 35, 0.1155) 100%);
    border: 1px solid #bd2738;
    margin-top: 10px;
  `

  return (
    <ConnectWalletButton
      onClick={() => {
        toggleConnectionModal()
        openConnectModal && openConnectModal()
      }}
    >
      Connect Wallet
    </ConnectWalletButton>
  )
}
