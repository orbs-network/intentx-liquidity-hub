import React from 'react'

import DEPOSIT_USDC_ICON from '/public/static/images/etc/DepositUSDC.svg'
import WITHDRAW_USDC_ICON from '/public/static/images/etc/WithdrawUSDC.svg'

import { COLLATERAL_TOKEN } from 'constants/tokens'
import { SupportedChainId } from 'constants/chains'
import { Account } from 'types/user'
import { TransferTab } from 'types/transfer'
import { getTokenWithFallbackChainId } from 'utils/token'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'

import { NotificationDetails } from 'state/notifications/types'

import BaseItem from 'components/Notifications/Cards/BaseCard'

export default function TransferCollateralCard({
  notification,
  account,
}: {
  notification: NotificationDetails
  account: Account
  loading?: boolean
}): JSX.Element {
  const { chainId } = useActiveConnectionDetails()
  const { modifyTime, transferAmount, transferType } = notification
  const collateralCurrency = getTokenWithFallbackChainId(COLLATERAL_TOKEN, chainId)
  const icon = (() => {
    if (transferType === TransferTab.DEPOSIT) {
      return chainId === SupportedChainId.BASE && DEPOSIT_USDC_ICON
    }
    return chainId === SupportedChainId.BASE && WITHDRAW_USDC_ICON
  })()
  const text = transferType === TransferTab.DEALLOCATE ? `${transferType} submitted.` : `${transferType} successful.`

  return (
    <BaseItem
      title={`${transferAmount} ${collateralCurrency?.symbol} ${transferType}`}
      text={text}
      icon={icon}
      timestamp={modifyTime}
      accountName={account.name}
    />
  )
}
