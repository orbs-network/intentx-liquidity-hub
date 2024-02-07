import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { toast } from 'react-hot-toast'

import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'

import { TransferTab } from 'types/transfer'
import { getRemainingTime } from 'utils/time'
import { COLLATERAL_TOKEN } from 'constants/tokens'
import { getTokenWithFallbackChainId } from 'utils/token'
import { formatCurrency, formatPrice, toBN } from 'utils/numbers'

import { useAccountPartyAStat, useActiveAccountAddress } from 'state/user/hooks'

import { useTransferCollateral } from 'callbacks/useTransferCollateral'

import { RowCenter } from 'components/Row'
import { DotFlashing } from 'components/Icons'
import { ApplicationConnectionStatus } from 'state/application/reducer'

const RemainingWrap = styled(RowCenter)<{ cursor?: string }>`
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.primaryBlue};
  background: ${({ theme }) => theme.bg7};
  color: ${({ theme }) => theme.white};
  height: 40px;
  font-size: 12px;
  width: 162px;
  height: 40px;
  cursor: ${({ cursor }) => cursor ?? 'progress'};
`

const RemainingBlock = styled.div<{ width?: string }>`
  background: ${({ theme }) => theme.hoverGrad};
  opacity: 0.2;
  height: 100%;
  left: 0;
  bottom: 0;
  position: absolute;
  border-radius: 4px 0px 0px 4px;
  width: ${({ width }) => width ?? 'unset'};
`

const Text = styled(RowCenter)`
  font-weight: 500;
  font-size: 12px;
  color: ${({ theme }) => theme.primaryBlue};
`

export default function WithdrawCooldownLabel({ formatedAmount, text }: { formatedAmount: boolean; text?: string }) {
  const { chainId, applicationConnectionStatus } = useActiveConnectionDetails()
  const activeAccountAddress = useActiveAccountAddress()
  const { accountBalance, withdrawCooldown, cooldownMA } = useAccountPartyAStat(activeAccountAddress)

  const collateralCurrency = getTokenWithFallbackChainId(COLLATERAL_TOKEN, chainId)
  const { callback: transferCollateralCallback } = useTransferCollateral(
    formatPrice(accountBalance, collateralCurrency?.decimals),
    TransferTab.WITHDRAW
  )
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)

  const currentTimestamp = Math.floor(Date.now() / 1000)
  const remainingPercent = useMemo(() => {
    const cooldownRemainPercent = toBN(currentTimestamp).minus(withdrawCooldown).div(cooldownMA).times(100)
    return cooldownRemainPercent.gte(0) && cooldownRemainPercent.lte(100) ? cooldownRemainPercent.toFixed(0) : null
  }, [cooldownMA, currentTimestamp, withdrawCooldown])
  const { diff, hours, seconds, minutes } = getRemainingTime(
    toBN(withdrawCooldown).plus(cooldownMA).times(1000).toNumber()
  )

  const handleAction = useCallback(async () => {
    if (!transferCollateralCallback) return

    try {
      setAwaitingConfirmation(true)
      await transferCollateralCallback()
      setAwaitingConfirmation(false)
    } catch (e) {
      setAwaitingConfirmation(false)
      if (e instanceof Error) {
        console.log(e.message)
      } else {
        console.error(e)
      }
    }
  }, [transferCollateralCallback])

  const fixedAccountBalance = formatPrice(accountBalance, collateralCurrency?.decimals)

  if (diff > 0) {
    return <Text>{`Available in ${hours}:${minutes}:${seconds}`}</Text>
  } else if (toBN(fixedAccountBalance).isGreaterThan(0)) {
    const balance = formatedAmount
      ? formatPrice(fixedAccountBalance, 2, true)
      : formatCurrency(fixedAccountBalance, 4, true)

    if (awaitingConfirmation) {
      return (
        <RemainingWrap cursor={'default'}>
          <Text>
            {text ?? `Withdraw ${balance} ${collateralCurrency?.symbol}`}
            <DotFlashing />
          </Text>
          <RemainingBlock width={`100%`}></RemainingBlock>
        </RemainingWrap>
      )
    }
    return (
      <RemainingWrap onClick={handleAction} cursor={'pointer'}>
        <Text>{text ?? `Withdraw ${balance} ${collateralCurrency?.symbol}`}</Text>
        <RemainingBlock width={`100%`}></RemainingBlock>
      </RemainingWrap>
    )
  } else {
    return <></>
  }
}
