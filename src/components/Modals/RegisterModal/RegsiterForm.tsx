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
import useCombinedSignOwnerMessage from 'callbacks/combined/useCombinedSignOwnerMessage'
import { VERIFICATION_MESSAGE } from 'lib/referrals/verificationMessage'
import { useUserReferralAccountInfo } from 'state/referrals/hooks'
import useRegisterReferralCodeCallback from 'callbacks/referrals/useRegisterReferralCode'
import toast from 'react-hot-toast'
import { AppThunkDispatch } from 'state'
import { useDispatch } from 'react-redux'
import { getUserReferralAccountInfo } from 'state/referrals/thunks'
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

const ReferralCodeWrapper = styled(Row)`
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

export default function RegisterForm({ onClose }: { onClose?: () => void }) {
  const { account, chainId, applicationConnectionStatus } = useActiveConnectionDetails()

  const referralAccountInfo = useUserReferralAccountInfo()
  const registerReferralCodeCallback = useRegisterReferralCodeCallback()
  const signMessageCallback = useCombinedSignOwnerMessage()

  const [referralCode, setReferralCode] = useState('')
  const userWhitelisted = useUserWhitelist()
  const [acceptRiskValue, setAcceptRiskValue] = useState(false)
  const collateralCurrency = getTokenWithFallbackChainId(COLLATERAL_TOKEN, chainId)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)

  const thunkDispatch: AppThunkDispatch = useDispatch()

  const onRegisterAccount = async () => {
    if (!account) {
      throw new Error('Account is not connected')
    }

    if (!acceptRiskValue) {
      throw new Error('You must accept the terms & conditions')
    }

    setAwaitingConfirmation(true)

    signMessageCallback(VERIFICATION_MESSAGE(referralCode)).then((signature) => {
      signature &&
        registerReferralCodeCallback(referralCode, account, signature)
          .then((registerResult) => {
            // Now refreshing the register details and closing the modal
            thunkDispatch(
              getUserReferralAccountInfo({
                userAddress: account,
              })
            )
            onClose && onClose()

            toast.success("You've successfully enrolled into the referrals program")
          })
          .catch((err) => {
            toast.error(err)
          })
          .finally(() => {
            setAwaitingConfirmation(false)
          })
    })
  }

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
        disabled={referralAccountInfo.accountInfo?.isRegistered || !acceptRiskValue}
        onClick={() => {
          if (!referralAccountInfo.accountInfo?.isRegistered && acceptRiskValue) {
            onRegisterAccount()
          }
        }}
      >
        <ButtonLabel>
          {acceptRiskValue
            ? referralAccountInfo.accountInfo?.isRegistered
              ? 'Already registered'
              : 'Register'
            : 'Accept T&C'}
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
        <Title>Register in IntentX</Title>
        <AccountWrapper>
          {/* <RowStart> */}
          {/* <Wallet /> */}
          <Image unoptimized={true} src={WalletIcon} alt="WalletIcon" width={40} height={40} />
          {/* </RowStart> */}
          {account && truncateAddress(account)}
        </AccountWrapper>

        {referralAccountInfo.accountInfo?.canUseReferralCode && (
          <ReferralCodeWrapper>
            <RowStart width={'10%'}>
              {/* <Client /> */}
              <Image unoptimized={true} src={AccountCircle} alt="AccountCircle" width={25} height={25} />
            </RowStart>
            <Input
              autoFocus
              type="text"
              placeholder={'Referral Code'}
              spellCheck="false"
              onBlur={() => null}
              value={referralCode}
              minLength={1}
              maxLength={20}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setReferralCode(event.target.value)}
            />
          </ReferralCodeWrapper>
        )}
        <AcceptRiskWrapper>
          <Checkbox
            name={'user-accept-risk'}
            id={'user-accept-risk'}
            label={'Users interacting with this software agree to the T&C'}
            checked={acceptRiskValue}
            onChange={() => {
              setAcceptRiskValue(!acceptRiskValue)
            }}
          />
        </AcceptRiskWrapper>
        {getActionButton()}
        {onClose && (
          <DescriptionText>{`Accept terms & conditions to enroll into IntentX referrals program`}</DescriptionText>
        )}
      </ContentWrapper>
    </Wrapper>
  )
}
