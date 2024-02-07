import BigNumber from 'bignumber.js'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { COLLATERAL_TOKEN } from 'constants/tokens'
import { TransferTab } from 'types/transfer'
import { formatAmount, formatPrice, toBN } from 'utils/numbers'
import { getTokenWithFallbackChainId } from 'utils/token'

import { useModalOpen, useWithdrawModalToggle } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { useIsHavePendingTransaction } from 'state/transactions/hooks'
import { useAccountPartyAStat, useActiveAccountAddress } from 'state/user/hooks'

import useAccountData from 'hooks/useAccountData'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'

import useCombinedTransferCollateral from 'callbacks/combined/useCombinedTransferCollateral'
import WithdrawCooldown from 'components/App/AccountData/Withdraw/WithdrawCooldownButton'
import { MainButtonWithdraw, PrimaryButton } from 'components/Button'
import { Close as CloseIcon, DotFlashing } from 'components/Icons'
import { CustomInputBox2 } from 'components/InputBox'
import { Modal } from 'components/Modal'
import { Row, RowBetween, RowStart } from 'components/Row'
import { Option } from 'components/Tab'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  width: 100%;
  padding: 1rem;
  gap: 0.8rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0.5rem;
  `};
`

const WithdrawInfo = styled(RowStart)`
  font-size: 12px;
  color: ${({ theme }) => theme.yellow1};
`

const LabelsRow = styled(Row)`
  flex-direction: column;
  gap: 16px;
  padding-bottom: 36px;

  & > * {
    &:first-child {
      width: 100%;
    }
  }
`

const Close = styled.div`
  width: 24px;
  height: 24px;
  padding: 6px;
  cursor: pointer;
  margin: -15px 4px 1px 0px;
`

export default function WithdrawModal() {
  const { chainId, applicationConnectionStatus } = useActiveConnectionDetails()
  const activeAccountAddress = useActiveAccountAddress()
  const [typedAmount, setTypedAmount] = useState('')
  const isPendingTxs = useIsHavePendingTransaction()
  const { availableForOrder } = useAccountData()
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const showWithdrawModal = useModalOpen(ApplicationModal.WITHDRAW)
  const toggleWithdrawModal = useWithdrawModalToggle()

  const { cooldownMA, allocatedBalance: subAccountAllocatedBalance } = useAccountPartyAStat(activeAccountAddress)

  const [amountForDeallocate, insufficientBalance] = useMemo(() => {
    const deallocateAmount = BigNumber.min(availableForOrder, subAccountAllocatedBalance)
    const insufficientBalance = deallocateAmount.isLessThan(typedAmount)
    if (deallocateAmount.isLessThan(0)) return ['0', insufficientBalance]
    return [deallocateAmount.toString(), insufficientBalance]
  }, [availableForOrder, subAccountAllocatedBalance, typedAmount])

  const { callback: transferCollateralCallback } = useCombinedTransferCollateral(typedAmount, TransferTab.DEALLOCATE)

  const collateralCurrency = getTokenWithFallbackChainId(COLLATERAL_TOKEN, chainId)

  const handleAction = useCallback(async () => {
    if (!transferCollateralCallback) return

    try {
      setAwaitingConfirmation(true)
      await transferCollateralCallback()
      setTypedAmount('')
      setAwaitingConfirmation(false)
      toggleWithdrawModal()
    } catch (e) {
      setAwaitingConfirmation(false)
      if (e instanceof Error) {
        console.error(e)
      } else {
        console.error(e)
      }
    }
  }, [transferCollateralCallback, toggleWithdrawModal])

  function getTabs() {
    return (
      <RowStart>
        <Option active={true}>{TransferTab.WITHDRAW}</Option>
      </RowStart>
    )
  }

  const onChange = (value: string) => {
    setTypedAmount(value)
  }

  function getLabel() {
    return (
      <LabelsRow>
        <WithdrawCooldown formatedAmount={false} />
        <CustomInputBox2
          balanceDisplay={!toBN(amountForDeallocate).isNaN() ? formatAmount(amountForDeallocate, 4, true) : '0.00'}
          value={typedAmount}
          title={'Amount '}
          balanceTitle="USDC Balance:"
          balanceExact={
            !toBN(amountForDeallocate).isNaN() ? formatPrice(amountForDeallocate, collateralCurrency.decimals) : '0.00'
          }
          onChange={onChange}
          max={true}
          symbol={collateralCurrency?.symbol}
          precision={collateralCurrency.decimals}
        />
        <WithdrawInfo>
          You can withdraw your {collateralCurrency?.symbol} {`${toBN(cooldownMA).div(60).toString()}`} minutes after
          the deallocation. There is 12 hour fraud proof lock-up window on withdraw.
        </WithdrawInfo>
      </LabelsRow>
    )
  }

  function getActionButton() {
    if (awaitingConfirmation) {
      return (
        <MainButtonWithdraw>
          Awaiting Confirmation <DotFlashing />
        </MainButtonWithdraw>
      )
    }

    if (isPendingTxs) {
      return (
        <PrimaryButton>
          Transacting <DotFlashing />
        </PrimaryButton>
      )
    }

    if (insufficientBalance) return <PrimaryButton disabled>Insufficient Balance</PrimaryButton>

    const text = 'Withdraw'

    return <PrimaryButton onClick={handleAction}>{text}</PrimaryButton>
  }

  return (
    <Modal isOpen={showWithdrawModal} onBackgroundClick={toggleWithdrawModal} onEscapeKeydown={toggleWithdrawModal}>
      <Wrapper>
        <RowBetween>
          {getTabs()}
          <Close>
            <CloseIcon size={12} onClick={toggleWithdrawModal} style={{ cursor: 'pointer' }} />
          </Close>
        </RowBetween>
        {getLabel()}
        {getActionButton()}
      </Wrapper>
    </Modal>
  )
}


