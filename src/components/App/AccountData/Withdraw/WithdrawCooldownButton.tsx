import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'

import { COLLATERAL_TOKEN } from 'constants/tokens'
import { TransferTab } from 'types/transfer'
import { formatCurrency, formatPrice, toBN } from 'utils/numbers'
import { getRemainingTime } from 'utils/time'
import { getTokenWithFallbackChainId } from 'utils/token'

import useCombinedTransferCollateral from 'callbacks/combined/useCombinedTransferCollateral'
import { DotFlashing } from 'components/Icons'
import { CancelWithdraw } from 'components/Modals/WithdrawModal/CancelWithdraw'
import { RowCenter } from 'components/Row'
import { useAccountPartyAStat, useActiveAccountAddress } from 'state/user/hooks'

const RemainingWrap = styled(RowCenter)<{ cursor?: string }>`
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.border4};
  background: ${({ theme }) => theme.gradCustomBg};
  color: ${({ theme }) => theme.white};
  font-size: 12px;
  width: 288px;
  height: 47px;
  cursor: ${({ cursor }) => cursor ?? 'progress'};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  height: 35px;
  width: 200px;
`};

  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: 160px !important;
`};

  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 120px !important;
`};
`

const RemainingBlock = styled.div<{ width?: string }>`
  background: ${({ theme }) => theme.gradCustom1};
  height: 100%;
  left: 0;
  bottom: 0;
  position: absolute;
  border-radius: 5px 0px 0px 5px;
  width: ${({ width }) => width ?? 'unset'};
  z-index: 1;
`

const Text = styled(RowCenter)`
  font-weight: 400;
  z-index: 2;
  font-size: 12px;
  color: ${({ theme }) => theme.white};

  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: 10px;
`};
`

const WithdrawContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export default function WithdrawCooldownButton({ formatedAmount, text }: { formatedAmount: boolean; text?: string }) {
  const { chainId, applicationConnectionStatus } = useActiveConnectionDetails()
  const activeAccountAddress = useActiveAccountAddress()
  const { accountBalance, withdrawCooldown, cooldownMA } = useAccountPartyAStat(activeAccountAddress)

  const collateralCurrency = getTokenWithFallbackChainId(COLLATERAL_TOKEN, chainId)

  const { callback: transferCollateralCallback } = useCombinedTransferCollateral(
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
        console.error(e.message)
      } else {
        console.error(e)
      }
    }
  }, [transferCollateralCallback])

  const fixedAccountBalance = formatPrice(accountBalance, collateralCurrency?.decimals)

  if (diff > 0 && parseFloat(fixedAccountBalance) > 0) {
    return (
      <WithdrawContainer>
        <RemainingWrap>
          <Text>{`Withdraw in ${hours}:${minutes}:${seconds}`}</Text>
          {/* <RemainingBlock width={`${remainingPercent}%`}></RemainingBlock> */}
          <RemainingBlock width={`60%`}></RemainingBlock>
        </RemainingWrap>
        <div>
          <CancelWithdraw />
        </div>
      </WithdrawContainer>
    )
  } else if (toBN(fixedAccountBalance).isGreaterThan(0)) {
    const balance = formatedAmount ? formatPrice(fixedAccountBalance, 2, true) : formatCurrency(fixedAccountBalance, 4)

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
