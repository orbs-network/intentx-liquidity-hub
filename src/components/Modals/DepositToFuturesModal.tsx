import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { toast } from 'react-hot-toast'

import { COLLATERAL_SYMBOL, MULTI_ACCOUNT_ADDRESS } from 'constants/addresses'
import { FALLBACK_CHAIN_ID } from 'constants/chains'
import { toBN, formatAmount, BN_ZERO, formatPrice } from 'utils/numbers'
import { getTokenWithFallbackChainId } from 'utils/token'
import { COLLATERAL_TOKEN } from 'constants/tokens'

import { TransferTab } from 'types/transfer'
import { useDepositModalToggle, useModalOpen } from 'state/application/hooks'
import { ApplicationConnectionStatus, ApplicationModal } from 'state/application/reducer'
import { useHasPendingApproval, useIsHavePendingTransaction } from 'state/transactions/hooks'
import {
  useAccountPartyAStat,
  useActiveAccount,
  useActiveAccountAddress,
  useHideAccountBalance,
} from 'state/user/hooks'

import { ApprovalState, useApproveCallback } from 'lib/hooks/useApproveCallback'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'

import { Modal, ModalHeader2 } from 'components/Modal'
import InfoItem from 'components/InfoItem'
import { Option } from 'components/Tab'
import { DotFlashing } from 'components/Icons'
import { MainButton, PrimaryButton } from 'components/Button'
import { CustomInputBox, CustomInputBox2, CustomInputBox3 } from 'components/InputBox'
import { Close as CloseIcon } from 'components/Icons'
import { useTransferCollateral } from 'callbacks/useTransferCollateral'
import { Row, RowBetween, RowStart } from 'components/Row'

import { Address } from 'viem'
import useCombinedApprove from 'callbacks/combined/useCombinedApprove'
import { useApproval } from 'lib/hooks/useApproval'
import useCombinedTransferCollateral from 'callbacks/combined/useCombinedTransferCollateral'

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

// const BuyDei = styled(PrimaryButton)`
//   &:focus,
//   &:hover,
//   &:active {
//     background: ${({ theme }) => theme.primaryBlue};
//     cursor: ${({ disabled }) => !disabled && 'pointer'};
//   }
// `

const LabelsRow = styled(Row)`
  flex-direction: column;
  gap: 16px;
  padding-bottom: 10px;

  & > * {
    &:first-child {
      width: 100%;
    }
  }
`

// const BuyDeiText = styled.div`
//   margin-left: 10px;
//   color: ${({ theme }) => theme.black};
// `

const Close = styled.div`
  width: 24px;
  height: 24px;
  padding: 3px 3px;
  cursor: pointer;
  border-radius: 4px;
  margin: 2px 2px 1px 0px;
  background: ${({ theme }) => theme.bg6};
`

const Warning12Hours = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.yellow1};
`

export default function DepositToFuturesModal() {
  const theme = useTheme()
  const { chainId, account, applicationConnectionStatus } = useActiveConnectionDetails()
  const activeAccountAddress = useActiveAccountAddress()
  const activeAccount = useActiveAccount()
  const [typedAmount, setTypedAmount] = useState('')
  const isPendingTxs = useIsHavePendingTransaction()
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const showDepositModal = useModalOpen(ApplicationModal.DEPOSIT)
  const toggleDepositModal = useDepositModalToggle()

  const { accountBalanceLimit, allocatedBalance: subAccountAllocatedBalance } =
    useAccountPartyAStat(activeAccountAddress)

  const { collateralBalance } = useAccountPartyAStat(account)

  const allowedDepositAmount = useMemo(() => {
    const amount = toBN(accountBalanceLimit).minus(subAccountAllocatedBalance)
    return amount.gt(0) ? amount : BN_ZERO
  }, [accountBalanceLimit, subAccountAllocatedBalance])

  const insufficientBalance = useMemo(() => {
    return toBN(collateralBalance).isLessThan(typedAmount)
  }, [collateralBalance, typedAmount])

  const { callback: transferBalanceCallback } = useCombinedTransferCollateral(typedAmount, TransferTab.DEPOSIT)

  // const { callback: mintCallback, error: mintCallbackError } = useMintCollateral()

  const spender = useMemo(() => MULTI_ACCOUNT_ADDRESS[chainId ?? FALLBACK_CHAIN_ID], [chainId])
  const collateralCurrency = getTokenWithFallbackChainId(COLLATERAL_TOKEN, chainId)

  const [approvalState, _getApproval] = useApproval(
    collateralCurrency,
    typedAmount ?? '0',
    account,
    spender,
    useHasPendingApproval
  )
  const { callback: approveCallback } = useCombinedApprove(collateralCurrency, typedAmount ?? '0', spender as Address)

  const [showApprove, showApproveLoader] = useMemo(() => {
    const show = collateralCurrency && approvalState !== ApprovalState.APPROVED && !!typedAmount
    return [show, show && approvalState === ApprovalState.PENDING]
  }, [collateralCurrency, approvalState, typedAmount])

  const handleAction = useCallback(async () => {
    if (!transferBalanceCallback) {
      toast.error('Something went wrong')
      return
    }

    if (!transferBalanceCallback) return
    try {
      setAwaitingConfirmation(true)
      await transferBalanceCallback()
      setTypedAmount('')
      setAwaitingConfirmation(false)
      toggleDepositModal()
    } catch (e) {
      setAwaitingConfirmation(false)
      if (e instanceof Error) {
        console.error(e)
      } else {
        console.error(e)
      }
    }
  }, [transferBalanceCallback, toggleDepositModal])

  // const onDeiMint = useCallback(async () => {
  //   if (!mintCallback) {
  //     toast.error(mintCallbackError)
  //     return
  //   }

  //   let error = ''
  //   try {
  //     setAwaitingMintConfirmation(true)
  //     const txHash = await mintCallback()
  //     setTxHash(txHash)
  //     setAwaitingMintConfirmation(false)
  //   } catch (e) {
  //     setAwaitingMintConfirmation(false)
  //     if (e instanceof Error) {
  //       error = e.message
  //     } else {
  //       console.debug(e)
  //       error = 'An unknown error occurred.'
  //     }
  //   }
  //   if (error) console.log(error)
  //   setAwaitingMintConfirmation(false)
  // }, [mintCallback, mintCallbackError])

  const handleApprove = async () => {
    if (!approveCallback) return
    try {
      setAwaitingConfirmation(true)
      await approveCallback()
      setAwaitingConfirmation(false)
      // toggleDepositModal()
    } catch (err) {
      console.error(err)
      setAwaitingConfirmation(false)
      // toggleDepositModal()
    }
  }

  const onChange = (value: string) => {
    setTypedAmount(value)
  }
  const hideAccountBalance = useHideAccountBalance()

  function getLabel() {
    // removeTrailingZeros
    return (
      <LabelsRow>
        <CustomInputBox2
          symbol={COLLATERAL_SYMBOL[chainId ?? FALLBACK_CHAIN_ID]}
          title={`Deposit Amount`}
          value={typedAmount}
          onChange={onChange}
          max={true}
          // symbol={collateralCurrency?.symbol}
          precision={Math.min(collateralCurrency.decimals, 3)}
          balanceTitle={`${collateralCurrency?.symbol} Balance:`}
          balanceExact={collateralBalance ? formatAmount(collateralBalance.toString()) : '0.00'}
          balanceDisplay={collateralBalance ? formatAmount(collateralBalance.toString(), 4, true) : '0.00'}
        />

        <InfoItem
          label={'Balance in the account'}
          amount={hideAccountBalance ? '****' : formatAmount(subAccountAllocatedBalance.toString(), 4, true)}
          ticker={`${collateralCurrency?.symbol}`}
        />
        <InfoItem
          label={'Allowed to Deposit'}
          balanceExact={formatPrice(allowedDepositAmount, collateralCurrency?.decimals)}
          amount={formatAmount(allowedDepositAmount.toString(), 4, true)}
          ticker={`${collateralCurrency?.symbol}`}
          valueColor={theme.primaryBlue}
          onClick={onChange}
        />
        <Warning12Hours>Funds are subject to a 12 hour fraud proof time lock upon withdraw.</Warning12Hours>
      </LabelsRow>
    )
  }

  function getActionButton() {
    if (awaitingConfirmation) {
      return (
        <PrimaryButton>
          Awaiting Confirmation <DotFlashing />
        </PrimaryButton>
      )
    }

    if (isPendingTxs) {
      return (
        <PrimaryButton>
          Transacting <DotFlashing />
        </PrimaryButton>
      )
    }

    if (allowedDepositAmount.isLessThan(typedAmount))
      return <PrimaryButton disabled>Amount exceeds deposit limit</PrimaryButton>

    if (insufficientBalance) return <PrimaryButton disabled>Insufficient Balance</PrimaryButton>

    if (showApproveLoader) {
      return (
        <PrimaryButton>
          Approving <DotFlashing />
        </PrimaryButton>
      )
    }

    if (showApprove) {
      return <PrimaryButton onClick={handleApprove}>Approve Collateral</PrimaryButton>
    }

    return <MainButton onClick={handleAction}>Deposit and allocate</MainButton>
  }

  return (
    <Modal isOpen={showDepositModal} onBackgroundClick={toggleDepositModal} onEscapeKeydown={toggleDepositModal}>
      <Wrapper>
        <ModalHeader2
          withdraw={true}
          title="Transfer"
          subtitle={`To ${activeAccount?.name} account`}
          onBack={() => {
            toggleDepositModal()
          }}
        />

        {getLabel()}
        {/* {toBN(collateralBalance).lt(100) && activeTab === TransferTab.DEPOSIT && (
          <BuyDei onClick={onDeiMint}>
            <Image unoptimized={true} src={'/static/images/tokens/dei.svg'} width={20} height={20} alt="Dei Logo" />
            <BuyDeiText>mint TEST DEI</BuyDeiText>
            {awaitingMintConfirmation ? <DotFlashing /> : <></>}
          </BuyDei>
        )} */}
        {getActionButton()}
      </Wrapper>
    </Modal>
  )
}
