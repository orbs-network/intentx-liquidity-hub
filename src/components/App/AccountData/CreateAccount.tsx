import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { COLLATERAL_TOKEN } from 'constants/tokens'
import { truncateAddress } from 'utils/address'
import { getTokenWithFallbackChainId } from 'utils/token'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useAddAccountToContract } from 'callbacks/useMultiAccount'
import { IntentXBaseLogo } from 'components/Icons'
import Column from 'components/Column'
import { BaseButton } from 'components/Button'
import { Row, RowCenter, RowEnd, RowStart } from 'components/Row'
import { Close as CloseIcon, DotFlashing } from 'components/Icons'
import Checkbox from 'components/CheckBox'
import AccountCircle from '/public/static/images/account-circle.svg'
import WalletIcon from '/public/images/wallet.svg'
import { useCombinedAddAccountToContract } from 'callbacks/combined/useCombinedMultiAccount'
import { useUserReferralAccountInfo } from 'state/referrals/hooks'
import { ApiState } from 'types/api'
import { VERIFICATION_MESSAGE } from 'lib/referrals/verificationMessage'
import { getUserReferralAccountInfo } from 'state/referrals/thunks'
import useRegisterReferralCodeCallback from 'callbacks/referrals/useRegisterReferralCode'
import useCombinedSignOwnerMessage from 'callbacks/combined/useCombinedSignOwnerMessage'
import { AppThunkDispatch } from 'state'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { useUserWhitelist } from 'state/user/hooks'

const Wrapper = styled.div<{ modal?: boolean }>`
  border: none;
  width: 100%;
  min-height: 379px;
  border-radius: ${({ modal }) => (modal ? '5px' : '4px')};
  background: ${({ theme }) => theme.black2};
  ${({ theme }) => theme.mediaWidth.upToLarge`
    width: 100%;
  `};
`

const Title = styled(RowStart)`
  padding: 12px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  justify-content: center;
  color: ${({ theme }) => theme.text0};
`

const ContentWrapper = styled(Column)`
  padding: 12px;
  position: relative;
`

const ImageWrapper = styled(RowCenter)`
  margin-top: 15px;
  margin-bottom: 20px;
`

const DepositButtonWrapper = styled(BaseButton)<{ disabled?: boolean }>`
  padding: 1px;
  height: 40px;
  border-radius: 8px;
  background: ${({ theme }) => theme.gradLight};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`

const DepositButton = styled(BaseButton)`
  height: 100%;
  border-radius: 8px;
  background: ${({ theme }) => theme.gradCustom2};

  &:hover {
    background: ${({ theme }) => theme.gradCustom3};
  }
`

const ButtonLabel = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  background: ${({ theme }) => theme.white};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const AccountWrapper = styled(Row)`
  height: 40px;
  background: ${({ theme }) => theme.bg};
  margin-bottom: 16px;
  padding: 0px 7px;
  font-weight: 500;
  font-size: 12px;
  gap: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.red};
  color: ${({ theme }) => theme.text1};
`

const AccountNameWrapper = styled(Row)`
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text3};
  height: 40px;
  border-bottom: 1px solid ${({ theme }) => theme.red};
  margin-bottom: 16px;
  padding: 10px 12px;
  font-weight: 500;
  font-size: 12px;
`

const Input = styled.input<{
  [x: string]: any
}>`
  height: fit-content;
  width: 90%;
  border: none;
  background: transparent;
  font-size: 12px;
  color: ${({ theme }) => theme.text3};
  padding-left: 2px;

  &::placeholder {
    color: ${({ theme }) => theme.text3};
  }

  &:focus,
  &:hover {
    color: ${({ theme }) => theme.text0};
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      font-size: 0.6rem;
    `}
`

const Close = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 3px 6px;
  cursor: pointer;
  border-radius: 4px;
  margin: 6px 12px 1px 0px;
  background: ${({ theme }) => theme.bg6};
`

const DescriptionText = styled.div`
  font-size: 12px;
  text-align: center;
  margin-top: 16px;

  color: ${({ theme }) => theme.text4};
`

const AcceptRiskWrapper = styled.div`
  padding: 4px 0px 16px 22px;
`

export default function CreateAccount({ id, onClose }: { id: string; onClose?: () => void }) {
  const { isConnected, account, chainId, applicationConnectionStatus } = useActiveConnectionDetails()
  const [name, setName] = useState('')
  const [, setTxHash] = useState('')
  const [referralCode, setReferralCode] = useState(localStorage.getItem('referralCode') || '')
  const [referralLocked, setReferralLocked] = useState(!!localStorage.getItem('referralCode'))
  const userWhitelisted = useUserWhitelist()
  const [acceptRiskValue, setAcceptRiskValue] = useState(false)
  const collateralCurrency = getTokenWithFallbackChainId(COLLATERAL_TOKEN, chainId)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  // const message = 'Users interacting with this software do so entirely at their own risk'

  const referralAccountInfo = useUserReferralAccountInfo()
  const registerReferralCodeCallback = useRegisterReferralCodeCallback()
  const signMessageCallback = useCombinedSignOwnerMessage()

  const { callback: addAccountToContractCallback } = useCombinedAddAccountToContract(name)

  const isRegisterPending =
    isConnected && referralAccountInfo.fetchStatus === ApiState.OK && !referralAccountInfo.accountInfo?.isRegistered

  const canUseReferralCode = referralAccountInfo.accountInfo?.canUseReferralCode

  const thunkDispatch: AppThunkDispatch = useDispatch()

  const onAddAccount = useCallback(async () => {
    if (!addAccountToContractCallback || !account) return
    try {
      if (isRegisterPending) {
        // Registering the user first
        const registerSignature = await signMessageCallback(VERIFICATION_MESSAGE(referralCode ?? ''))

        const fixedReferralCode = canUseReferralCode ? referralCode : ''

        try {
          const registerResult = await registerReferralCodeCallback(fixedReferralCode, account, registerSignature ?? '')
          thunkDispatch(
            getUserReferralAccountInfo({
              userAddress: account,
            })
          )
        } catch (err) {
          toast.error(err.toString())
        } finally {
        }
      }

      setAwaitingConfirmation(true)
      const txHash = await addAccountToContractCallback()

      if (txHash) {
        setTxHash(txHash)
        setAwaitingConfirmation(false)
      }

      onClose && onClose()
    } catch (e) {
      if (e instanceof Error) {
        console.error(e)
      } else {
        console.debug(e)
      }
      setAwaitingConfirmation(false)
    }
  }, [
    account,
    addAccountToContractCallback,
    isRegisterPending,
    onClose,
    referralCode,
    registerReferralCodeCallback,
    signMessageCallback,
    thunkDispatch,
  ])

  function getActionButton() {
    if (awaitingConfirmation) {
      return (
        <DepositButtonWrapper>
          <DepositButton>
            <ButtonLabel>Awaiting Confirmation</ButtonLabel>
            <DotFlashing />
          </DepositButton>
        </DepositButtonWrapper>
      )
    }

    if (userWhitelisted === false) {
      return (
        <DepositButtonWrapper disabled={true}>
          <DepositButton disabled={true}>
            <ButtonLabel>You are not whitelisted</ButtonLabel>
          </DepositButton>
        </DepositButtonWrapper>
      )
    }

    return (
      // <DepositButtonWrapper>
      <DepositButton
        disabled={!name || !acceptRiskValue}
        onClick={() => {
          if (name && acceptRiskValue) onAddAccount()
        }}
      >
        <ButtonLabel>
          {acceptRiskValue ? (name === '' ? 'Set an account name first' : 'Create Account') : 'Accept T&C'}
        </ButtonLabel>
      </DepositButton>
      // </DepositButtonWrapper>
    )
  }

  return (
    <Wrapper modal={onClose ? true : false}>
      <Row>
        <RowEnd>
          {onClose && (
            <Close onClick={onClose}>
              <CloseIcon size={12} />
            </Close>
          )}
        </RowEnd>
      </Row>
      <ContentWrapper>
        <ImageWrapper>
          <IntentXBaseLogo></IntentXBaseLogo>
        </ImageWrapper>
        <Title>Create an Account</Title>
        <AccountWrapper>
          {/* <RowStart> */}
          {/* <Wallet /> */}
          <Image unoptimized={true} src={WalletIcon} alt="WalletIcon" width={40} height={40} />
          {/* </RowStart> */}
          {account && truncateAddress(account)}
        </AccountWrapper>
        <AccountNameWrapper>
          <RowStart width={'10%'}>
            {/* <Client /> */}
            <Image unoptimized={true} src={AccountCircle} alt="AccountCircle" width={25} height={25} />
          </RowStart>
          <Input
            autoFocus
            type="text"
            placeholder={'Account Name (it will be saved on chain)'}
            spellCheck="false"
            onBlur={() => null}
            value={name}
            minLength={1}
            maxLength={20}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
          />
        </AccountNameWrapper>
        {referralAccountInfo.accountInfo?.canUseReferralCode && (
          <AccountNameWrapper>
            <RowStart width={'10%'}>
              {/* <Client /> */}
              <Image unoptimized={true} src={AccountCircle} alt="AccountCircle" width={25} height={25} />
            </RowStart>
            <Input
              type="text"
              placeholder={'Referral Code'}
              spellCheck="false"
              onBlur={() => null}
              value={referralCode}
              readOnly={referralLocked}
              minLength={1}
              maxLength={20}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setReferralCode(event.target.value)}
            />
          </AccountNameWrapper>
        )}
        <AcceptRiskWrapper>
          <Checkbox
            id={id}
            name={'user-accept-risk'}
            label={'Users interacting with this software agree to the T&C'}
            checked={acceptRiskValue}
            onChange={() => {
              setAcceptRiskValue(!acceptRiskValue)
            }}
          />
        </AcceptRiskWrapper>
        {getActionButton()}
        {onClose && (
          <DescriptionText>{`Create Account > Deposit ${collateralCurrency?.symbol} > Enjoy Trading`}</DescriptionText>
        )}
      </ContentWrapper>
    </Wrapper>
  )
}
