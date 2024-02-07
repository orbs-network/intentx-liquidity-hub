import isEqual from 'lodash/isEqual'
import Image from 'next/image'
import { lighten } from 'polished'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Activity } from 'react-feather'
import styled, { useTheme } from 'styled-components'
import { useConnect } from 'wagmi'

import { ChainInfo } from 'constants/chainInfo'
import { FALLBACK_CHAIN_ID, V3_CHAIN_IDS } from 'constants/chains'
import { useAppDispatch } from 'state'
import { truncateAddress } from 'utils/address'

import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import usePrevious from 'lib/hooks/usePrevious'
import useRpcChangerCallback from 'lib/hooks/useRpcChangerCallback'
import { updateAccount } from 'state/user/actions'
import {
  useAccountPartyAStat,
  useAccountUpnl,
  useActiveAccount,
  useActiveAccountAddress,
  useHideAccountBalance,
  useLastActiveAccountMap,
} from 'state/user/hooks'

import { useAccountsLength, useUserAccounts } from 'hooks/useAccounts'

import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit'
import AccountUpnl from 'components/App/AccountData/AccountUpnl'
import { NavButton, PrimaryButton, RedButton } from 'components/Button'
import { GradientButtonWrapper, GradientColorButton } from 'components/Button/GradientButton'
import { AddUser as AddUserIcon, ChevronDown, Status as StatusIcon, Switch, SwitchWallet } from 'components/Icons'
import ImageWithFallback from 'components/ImageWithFallback'
import CreateAccountModal from 'components/Modals/CreateAccountModal'
import { Row, RowCenter, RowStart } from 'components/Row'
import { LoaderIcon } from 'react-hot-toast'
import { useAA } from 'state/accountAbstraction/provider/AAProvider'
import { useApplicationConnectionStatus, useConnectionModalToggle, useToggleModal } from 'state/application/hooks'
import { ApplicationConnectionStatus, ApplicationModal } from 'state/application/reducer'
import AccountsModal from '../AccountsModal'
import GenericPfPIcon from '/public/static/images/etc/base-pfp.svg'

import ExpandArrow from 'components/Icons/ExpandArrow'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { useIsMobile } from 'lib/hooks/useWindowSize'

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`

  `}
`
const NavMenuContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 10px;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 7.5px;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
  `}
`
const ConnectWrap = styled.div`
  margin-right: 10px;
  height: 20px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin-right: 7.5px;
  height: 15px;
`};
`

const InnerContentWrapper = styled(Row)`
  height: 48px;
  width: 100%;
  font-size: 12px;
  color: ${({ theme }) => theme.white};
  background: #242831;
  border-radius: 5px;
  overflow: hidden;
  min-width: unset;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 34px;
    padding: 1.4rem;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  height: 36px;
  font-size: 9px;
  border-radius: 3.75px;
`};
`

const InnerMobileContentWrapper = styled(Row)`
  height: 60px;
  width: fit-content;
  font-size: 12px;
  position: absolute;
  bottom: -60%;
  right: 150px;
  color: ${({ theme }) => theme.white};
  border-radius: 8px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    right: 0;
  `}
`

const UserStatus = styled(RowStart)`
  overflow: hidden;
  gap: 4px;
`

const NameWrapper = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: left;
`

const ErrorWrapper = styled(GradientButtonWrapper)`
  height: 38px;
  width: unset;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  height: 28.5px;
`};
`

const ErrorButton = styled(GradientColorButton)`
  padding: 0 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  &:hover,
  &:focus {
    cursor: pointer;
    color: ${({ theme }) => lighten(0.1, theme.primaryBlue)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 0 7.5px;
`};
`

const MainButton = styled(PrimaryButton)`
  font-size: 12px;
  width: 220px;
  padding: 1.4rem;
  height: 55px;
  display: flex;
  overflow: unset;
  z-index: 0;

  border: double 1px transparent;
  border-radius: 8px;
  background-image: ${({ theme }) => theme.gradCustomBg}, ${({ theme }) => theme.gradCustom1};
  background-origin: border-box;
  background-clip: padding-box, border-box;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 9px;
  width: 165px;
  padding: 1rem;
  height: 40px;
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 34px;
    padding: 0.8rem;
  `}
`

const SignButton = styled(RedButton)`
  font-size: 12px;
  width: 220px;
  padding: 1.4rem;
  height: 55px;
  display: flex;
  overflow: unset;
  z-index: 0;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 34px;
  `}
`

export const ButtonGray = styled.div`
  display: flex;
  flex-direction: column;
  width: 190px;
  height: 190px;
  background: rgba(35, 41, 51, 1);
  border-radius: 5px;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.gradCustom2};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 142px;
  height: 142px;
`};
`

const Button = styled.div`
  width: 204px;
  height: 36px;
  margin: 2px 0px;
  margin-right: 2px;

  font-weight: 500;
  font-size: 12px;
  text-align: center;
  color: ${({ theme }) => theme.bg};
  background: ${({ theme }) => theme.gradLight};
  border-radius: 3px;
  padding: 10px 0px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 153px;
  height: 27px;
  margin: 1.5px 0px;
  margin-right: 1.5px;
  font-size: 9px;
  padding: 7.5px 0px;
`};
`

const ChooseAccountButton = styled(Button)`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text0};
`

const UpnlText = styled(RowCenter)`
  font-size: 12px;
  color: ${({ theme }) => theme.text2};
  margin-right: 12px;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0em;
  text-align: right;
`

const CreateAccountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
gap: 15px;
`};
`

const AccountAddress = styled.div<{ width?: string; color?: string }>`
  width: ${({ width }) => width ?? '20vw'};
  color: ${({ theme, color }) => color ?? theme.text0};
  padding: 13px 0px;
  display: flex;
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 9.75px 0;
`};
`

const NetworkButton = styled(NavButton)<{ lighter?: boolean }>`
  position: relative;
  cursor: pointer;
  overflow: visible;
  padding: 0px 5px;
  color: ${({ theme }) => theme.text1};

  /* ${({ lighter }) =>
    !lighter &&
    `
    opacity:0.5;
  `} */

  background: ${({ theme }) => theme.red6};
  border: 1px solid ${({ theme }) => theme.red2};
  border-radius: 8px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 0 3px;
`};
`

export const Chevron = styled(ChevronDown)<{ open: boolean }>`
  transform: rotateX(${({ open }) => (open ? '180deg' : '0deg')});
  transition: 0.5s;
`

const SwitchIcon = styled.div`
  position: absolute;
  top: 20px;
  left: 30px;
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  top: 15px;
  left: 22.5px;
`};
`

const User = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme, active }) => (active ? theme.gradCustom5 : theme.bgCustom2)};
  height: 100%;
  padding: 0 15px;
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 7.5px;
  padding: 0 11.25px;
`};
`

const AccountHandler = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: end;
  height: 100%;
`

export const UserName = styled.h4`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 11px;
`};
`

const UserInfo = styled.div``

export const UserAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  span {
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.green};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 4px;
  span {
    width: 7.5px;
    height: 7.5px;
    border-radius: 7.5px;
    background-color: ${({ theme }) => theme.green};
  }
`};
`

const UseruPNLWrapper = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 15px;
  gap: 10px;
  background: ${({ theme, active }) => (active ? theme.gradCustom6 : theme.bgCustom3)};
  background-origin: border-box;
  background-clip: padding-box, border-box;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 0 11px;
  gap: 7.5px;
`};
`

const UserCNA = styled.p`
  text-transform: uppercase;
  color: #ffffff;
  font-size: 14px;
`
export const CreateAccountButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  background: ${({ theme }) => theme.gradCustom7};
  height: 100%;
  gap: 5px;
  min-width: 237px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 3.75px;
  min-width: 178px;
  font-size: 11px;
`};
`

export const UseruPNL = styled.div`
  dislay: flex;
  align-items: center;
  color: #ffffff;
  font-size: 14px;
  display: flex;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 11px;
`};
`

const MobileInnerContent = styled.div``

const UserDropDown = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  height: 34px;
  margin-left: 10px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  height: 25px;
  border-radius: 6px;
`};
`

const ProfileContainer = styled.div`
  height: 100%;
  width: 35px;
  background: rgba(35, 41, 51, 0.3);
  border-radius: 8px 0px 0px 8px;
  border: 1.41665px solid #232933;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 26px;
  border-radius: 6px 0 0 6px;
`};
`

const DrodownContainer = styled.div`
  height: 100%;
  width: 35px;
  background: rgba(35, 41, 51, 0.75);
  border: 1.41665px solid #232933;
  border-radius: 8px 0px 0px 8px;
  transform: matrix(-1, 0, 0, 1, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 26px;
  border-radius: 6px 0 0 6px;
`};
`

export const AccountBalance = styled.div<{ color?: string; size?: string }>`
  margin-left: 8px;
  font-weight: 500;
  text-wrap: nowrap;
  overflow-y: scroll;
  font-size: ${({ size }) => size ?? '14px'};
  color: ${({ theme, color }) => color ?? theme.text0};
  ${({ theme, size }) => theme.mediaWidth.upToMedium`
    font-size: ${size ?? '12px'};
  `};

  ${({ theme, size }) => theme.mediaWidth.upToExtraLarge`
  font-size: ${size ?? '11px'};
`};
`

const EmailDisplay = styled.div``

const AAOwnerAddressDisplay = styled.div``

const AADisplayContainer = styled.div``

export default function AccountAbstractionMultiAccount() {
  const isMobile = useIsMobile()
  const { userInfo, isConnected, isSafeDeployed, isRefreshing, isReady } = useAA()

  const theme = useTheme()

  const { accounts } = useUserAccounts()
  const previousAccounts = usePrevious(accounts)
  const lastActiveAccountMap = useLastActiveAccountMap()

  const applicationConnectionStatus = useApplicationConnectionStatus()

  const { account, chainId } = useActiveConnectionDetails()

  const ENSName = undefined //use ens from wagmi
  const activeAccount = useActiveAccount()
  const rpcChangerCallback = useRpcChangerCallback()
  const dispatch = useAppDispatch()

  const { accountAddress, name } = activeAccount || {}
  const { loading: accountsLoading } = useAccountsLength()

  const { loading: statsLoading } = useAccountPartyAStat(accountAddress)
  const ref = useRef(null)
  // useOnOutsideClick(ref, () => setClickAccounts(false))

  const accountsModalRef = useRef(null)

  const [clickAccounts, setClickAccounts] = useState(false)
  const [createAccountModal, setCreateAccountModal] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const [iconIndex, setIconIndex] = useState(0)
  const handleShowIcon = () => setIconIndex((iconIndex + 1) % 4)

  const Chain = ChainInfo[FALLBACK_CHAIN_ID]

  const { error } = useConnect()

  const standardAccountName = (() => {
    if (name && name.length > 10) return `${name.slice(0, 10)}...`
    return name
  })()
  const [accountName, setAccountName] = useState(standardAccountName)

  const toggleAccountsModal = (): void => {
    setClickAccounts((prev) => !prev)
  }

  useEffect(() => {
    if (previousAccounts === undefined || accounts === null || !account) return
    if (!isEqual(accounts, previousAccounts)) {
      // Using the last account map
      const lastActiveAccount = lastActiveAccountMap[account]
      if (lastActiveAccount) {
        dispatch(updateAccount(lastActiveAccount))
      } else {
        const lastSubAccount = accounts[accounts.length - 1]
        dispatch(updateAccount(lastSubAccount))
      }
    }
  }, [account, accounts, dispatch, previousAccounts, lastActiveAccountMap])

  useEffect(() => {
    standardAccountName && setAccountName(standardAccountName)
  }, [standardAccountName])

  const showCallbackError: boolean = useMemo(() => {
    if (!chainId || !account) return false
    return !V3_CHAIN_IDS.includes(chainId)
  }, [chainId, account])

  const openAcountModal = () => {
    setClickAccounts(!clickAccounts)
    setIsExpanded((prev) => !prev)
  }

  const { openAccountModal } = useAccountModal()
  const toggleConnectionModal = useConnectionModalToggle()
  const toggleConnectedAccountManagementModal = useToggleModal(ApplicationModal.CONNECTED_ACCOUNT_MANAGEMENT)

  const { openConnectModal } = useConnectModal()
  const toggleConnectionModal_temp = useToggleModal(ApplicationModal.ACCOUNT_ABSTRACTION_CONNECTING)

  const activeAccountAddress = useActiveAccountAddress()
  const { allocatedBalance } = useAccountPartyAStat(activeAccountAddress)
  const { upnl } = useAccountUpnl()
  const hideAccountBalance = useHideAccountBalance()

  useOnClickOutside(accountsModalRef, clickAccounts ? openAcountModal : undefined)

  function accountDisplayBlock() {
    if (applicationConnectionStatus === ApplicationConnectionStatus.ACCOUNT_ABSTRACTION && account) {
      return (
        <AccountAddress onClick={toggleConnectedAccountManagementModal}>
          <StatusIcon connected size={12} style={{ marginRight: '12px', marginTop: '1px' }} />
          <AADisplayContainer>
            <EmailDisplay>{userInfo.email}</EmailDisplay>
            <AAOwnerAddressDisplay>{ENSName || truncateAddress(account)}</AAOwnerAddressDisplay>
          </AADisplayContainer>
        </AccountAddress>
      )
    } else if (applicationConnectionStatus === ApplicationConnectionStatus.DEFI && account) {
      return (
        <AccountAddress onClick={openAccountModal}>
          <StatusIcon connected size={12} style={{ marginRight: '12px', marginTop: '1px' }} />
          {ENSName || truncateAddress(account)}
        </AccountAddress>
      )
    } else {
      return <LoaderIcon />
    }
  }

  function getInnerContent() {
    return (
      <InnerContentWrapper>
        {activeAccount ? (
          <AccountHandler data-toggle-account-handle-modal="true">
            <User
              active={clickAccounts}
              onClick={() => {
                if (applicationConnectionStatus === ApplicationConnectionStatus.ACCOUNT_ABSTRACTION) {
                  toggleConnectedAccountManagementModal()
                } else {
                  openAccountModal && openAccountModal()
                }
              }}
            >
              {/* <UserAvatar src="/static/images/header/user.png" /> */}
              <UserInfo>
                <UserName>{accountName}</UserName>
                <UserAddress>
                  <span></span>
                  {hideAccountBalance && '0x****************'}
                  {!hideAccountBalance && account && truncateAddress(account)}
                </UserAddress>
              </UserInfo>
            </User>
            <UseruPNLWrapper active={clickAccounts} onClick={() => setClickAccounts(!clickAccounts)}>
              {/* <Badges iconIndex={iconIndex} handleShowIcon={handleShowIcon} /> */}
              <UseruPNL>
                uPNL: <AccountUpnl />
              </UseruPNL>

              <Chevron
                width={15}
                height={15}
                color={clickAccounts ? theme.red1 : theme.border4}
                open={clickAccounts}
                onClick={() => setClickAccounts(!clickAccounts)}
              />
            </UseruPNLWrapper>
          </AccountHandler>
        ) : (
          <AccountHandler>
            <User
              active={clickAccounts}
              onClick={() => {
                if (applicationConnectionStatus === ApplicationConnectionStatus.ACCOUNT_ABSTRACTION) {
                  toggleConnectedAccountManagementModal()
                } else {
                  openAccountModal && openAccountModal()
                }
              }}
            >
              {/* <UserAvatar src="/static/images/header/user-default.png" /> */}
              <UserInfo>
                <UserName>Not Signed</UserName>
                <UserAddress>{account && truncateAddress(account)}</UserAddress>
              </UserInfo>
            </User>
            <CreateAccountButton onClick={() => setCreateAccountModal(true)}>
              <AddUserIcon width={18} height={18} />
              Create Account
            </CreateAccountButton>
          </AccountHandler>
        )}
      </InnerContentWrapper>
    )
  }

  function getMobileInnerContent() {
    return (
      <MobileInnerContent>
        <UserDropDown onClick={openAcountModal}>
          <ProfileContainer>
            <Image src={GenericPfPIcon} alt="user" />
          </ProfileContainer>
          <DrodownContainer>
            <ExpandArrow isExpanded={!isExpanded} />
          </DrodownContainer>
        </UserDropDown>
      </MobileInnerContent>
    )
  }

  function getContent() {
    if (showCallbackError) {
      // ERROR IN CONNECTION
      return (
        <NetworkButton onClick={() => rpcChangerCallback(FALLBACK_CHAIN_ID)}>
          <ImageWithFallback src={Chain.logoUrl} alt={Chain.label} width={28} height={28} />
          <SwitchIcon onClick={() => rpcChangerCallback(FALLBACK_CHAIN_ID)}>
            <Switch />
          </SwitchIcon>
        </NetworkButton>
      )
    }

    if (
      applicationConnectionStatus === ApplicationConnectionStatus.DEFI ||
      applicationConnectionStatus === ApplicationConnectionStatus.ACCOUNT_ABSTRACTION
    ) {
      // if (accountsLoading || statsLoading || isRefreshing) {
      if (accountsLoading || isRefreshing) {
        return (
          <MainButton gap="15px">
            Loading... <LoaderIcon />
          </MainButton>
        )
      }

      return (
        <CreateAccountWrapper ref={accountsModalRef}>
          <Container>
            <div onClick={(e) => e.stopPropagation()}>
              <AccountsModal
                open={clickAccounts}
                setCreateAccountModal={setCreateAccountModal}
                onDismiss={() => {}}
                data={accounts}
              />
            </div>
            {isMobile ? getMobileInnerContent() : getInnerContent()}
          </Container>
        </CreateAccountWrapper>
      )
    } else if (error) {
      return (
        <ErrorWrapper>
          <ErrorButton
            onClick={() => {
              // toggleConnectionModal()
              toggleConnectionModal_temp()
              openConnectModal && openConnectModal()
            }}
          >
            <Activity />
            {error.message || 'Error'}
          </ErrorButton>
        </ErrorWrapper>
      )
    } else if (isRefreshing || !isReady) {
      return <LoaderIcon />
    } else {
      return (
        <>
          <NavMenuContainer>
            <MainButton
              onClick={() => {
                // toggleConnectionModal()
                toggleConnectionModal_temp()
                openConnectModal && openConnectModal()
              }}
            >
              <ConnectWrap>
                <SwitchWallet />
              </ConnectWrap>
              Connect / Login
            </MainButton>
          </NavMenuContainer>
        </>
      )
    }
  }

  return (
    <>
      <CreateAccountModal isOpen={createAccountModal} onDismiss={() => setCreateAccountModal(false)} /> {getContent()}
    </>
  )
}
