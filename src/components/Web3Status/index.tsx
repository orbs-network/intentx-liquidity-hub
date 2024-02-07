import React, { useRef } from 'react'

import MultiAccount from 'components/Web3Status/AccountManager/MultiAccount'
import AccountAbstractionMultiAccount from './AccountManager/AccountAbstractionMultiAccount'
import AAConnectingModal from './ConnectionModal/AAConnectingModal'
import ConnectionModal from './ConnectionModal'
import ConnectedAccountManagerModal from './ConnectedAccountManagerModal'

export default function Web3Status() {
  const ref = useRef<HTMLDivElement>(null)

  const applicationModals = () => {
    return (
      <>
        <AAConnectingModal />
        <ConnectionModal />
        <ConnectedAccountManagerModal />
      </>
    )
  }

  return (
    <span ref={ref}>
      <AccountAbstractionMultiAccount />
      {applicationModals()}
    </span>
  )
}
