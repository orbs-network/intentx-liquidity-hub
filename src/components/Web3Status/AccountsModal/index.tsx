import { useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'

import { Account as AccountType } from 'types/user'

import AccountUpnl from 'components/App/AccountData/AccountUpnl'
import GradientButton from 'components/Button/GradientButton'
import { ArrowUpLeft, ArrowUpRight } from 'components/Icons'
import { useIsLaptop, useIsMobile } from 'lib/hooks/useWindowSize'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'state'
import {
  useApplicationConnectionStatus,
  useConnectionModalToggle,
  useDepositModalToggle,
  useToggleModal,
  useWithdrawModalToggle,
} from 'state/application/hooks'
import { setHideAccountBalance, updateAccount } from 'state/user/actions'
import {
  useAccountsArchive,
  useActiveAccount,
  useActiveAccountAddress,
  useHideAccountBalance,
  useLastActiveAccountMap,
} from 'state/user/hooks'
import Account from './Account'
import AccountArchive from './AccountArchive'
import CreateOtherAccounts from './CreateOtherAccounts'

import { useAccountModal } from '@rainbow-me/rainbowkit'
import { AddUser as AddUserIcon } from 'components/Icons'
import { Title } from 'components/Modal'
import { Row } from 'components/Row'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { ApplicationConnectionStatus, ApplicationModal } from 'state/application/reducer'
import { truncateAddress } from 'utils/address'
import { CreateAccountButton, UserAddress, UserName, UseruPNL } from '../AccountManager/AccountAbstractionMultiAccount'
import Badges from '../Badges'

const InnerMobileContentWrapper = styled(Row)`
  height: 80px;
  width: 100%;
  font-size: 12px;
  background: rgba(36, 40, 49, 0.94);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: ${({ theme }) => theme.white};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  height: 56px;
  font-size: 9px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    right: 0;
  `}
`

const InnerContent = styled.div`
  background: rgba(18, 20, 26, 0.55);
  padding: 15px 12px;
  -webkit-backdrop-filter: blur(40px);
  backdrop-filter: blur(40px);
  border-radius: 5px;
  margin-top: -5px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 10px 8px;
  margin-top: -3.5px;
  `}
`

const ProfileContainer = styled.div`
  height: 100%;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 35px;
  `}
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const User = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 100%;
  padding: 0 15px;
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 7px;
  padding: 0 10px;
  `}
`

const UseruPNLWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 15px;
  gap: 10px;
  background-origin: border-box;
  background-clip: padding-box, border-box;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 0 10px;
  gap: 7px; 
  `}
`

const HoverWrapper = styled.div`
  padding: 0px 8px 12px 8px;
  position: absolute;
  transform: translate(0px, 40px);
  background: ${({ theme }) => theme.bgCustom3};
  border: 2px solid ${({ theme }) => theme.border3};
  z-index: 1;
  border-radius: 4px;
  width: 335px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 260px;
  transform: translate(0px, 30px);
  padding: 0px 6px 8px 6px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    left: 0;
    width: 100%;
    background: transparent;
    border: none;
    padding: 0;
  `}
`

const AccountHandler = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  height: 100%;
`

const InnerContentScroll = styled.div`
  max-height: 240px;
  overflow: scroll;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  max-height: 170px;
  `}
`

const InnerContentFooter = styled.div`
  padding-top: 15px;
`

const ButtonGruop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`

const AccountManageContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  span {
    height: 14px;
  }
`

const BackToAccountArchive = styled.div`
  display: flex;

  backdrop-filter: blur(5px);
  align-items: center;
  font-size: 14px;
  padding: 10px 0px 5px;
  color: ${({ theme }) => theme.text3};
  cursor: pointer;
  gap: 10px;
  &:hover {
    color: ${({ theme }) => theme.red};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 10px;
  padding: 8px 0px 4px;
  gap: 7px; 
  `}
`

const HideAccountBalance = styled.div`
  font-size: 11px;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  transition-duration: 0.25s;
  text-decoration: underline;
  margin-bottom: 3px;
  color: ${({ theme }) => theme.text3};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.red};
  }
`

export default function AccountsModal({
  data,
  onDismiss,
  setCreateAccountModal,
  open,
}: {
  setCreateAccountModal: (b: boolean) => void
  data: AccountType[]
  onDismiss: () => void
  open: boolean
}) {
  const activeAccountAddress = useActiveAccountAddress()
  const lastActiveAccountMap = useLastActiveAccountMap()

  const dispatch = useAppDispatch()
  const [accountArchive, setAccountArchive] = useState(false)
  const activeAccount = useActiveAccount()
  const toggleDepositModal = useDepositModalToggle()
  const toggleWithdrawModal = useWithdrawModalToggle()
  const applicationConnectionStatus = useApplicationConnectionStatus()
  const { accountAddress, name } = activeAccount || {}

  const [iconIndex, setIconIndex] = useState(0)
  const handleShowIcon = () => setIconIndex((iconIndex + 1) % 4)
  const { account, chainId } = useActiveConnectionDetails()
  const standardAccountName = (() => {
    if (name && name.length > 10) return `${name.slice(0, 10)}...`
    return name
  })()
  const [accountName, setAccountName] = useState(standardAccountName)
  const { openAccountModal } = useAccountModal()
  const toggleConnectionModal = useConnectionModalToggle()
  const toggleConnectedAccountManagementModal = useToggleModal(ApplicationModal.CONNECTED_ACCOUNT_MANAGEMENT)

  const theme = useTheme()
  const router = useRouter()

  const onClick = (acc: AccountType) => {
    dispatch(updateAccount(acc))
    onDismiss()
  }
  const [clickAccounts, setClickAccounts] = useState(false)
  const handleHiddenArchiveAccount = () => setAccountArchive(true)
  const handleShowArchiveAccount = () => setAccountArchive(false)
  const accountsArchive = useAccountsArchive()
  const { isConnected } = useActiveConnectionDetails()
  const isLaptop = useIsLaptop()
  const hideAccountBalance = useHideAccountBalance()
  function getInnerContent() {
    return (
      <div>
        {accountArchive && (
          <BackToAccountArchive onClick={handleShowArchiveAccount}>
            <ArrowUpLeft />
            <span>Go Back</span>
          </BackToAccountArchive>
        )}
        <InnerContentScroll>
          {data
            .filter((account) =>
              accountArchive
                ? accountsArchive.includes(account.accountAddress)
                : !accountsArchive.includes(account.accountAddress)
            )
            .map((account, index) => {
              return (
                <Account
                  account={account}
                  key={index}
                  active={activeAccountAddress ? activeAccountAddress === account.accountAddress : false}
                  onClick={() => onClick(account)}
                />
              )
            })}
        </InnerContentScroll>
        <InnerContentFooter>
          {isConnected && (
            <>
              <HideAccountBalance
                onClick={() => {
                  dispatch(setHideAccountBalance(!hideAccountBalance))
                }}
              >
                <span>{hideAccountBalance ? 'Show' : 'Hide'} Account Balance</span>
              </HideAccountBalance>
              <ButtonGruop>
                <GradientButton
                  buttonFilled={false}
                  label={'Deposit'}
                  onClick={toggleDepositModal}
                  height={isLaptop ? '36px' : '48px'}
                />
                <GradientButton
                  buttonFilled={false}
                  label={'Withdraw'}
                  onClick={toggleWithdrawModal}
                  height={isLaptop ? '36px' : '48px'}
                />
              </ButtonGruop>
              <GradientButton
                onClick={() => {
                  router.push('/conversion')
                }}
                buttonFilled={false}
                label="Cross-Chain Swap"
                height={isLaptop ? '20px' : '36px'}
                size="auto"
              />
            </>
          )}

          {!accountArchive && <AccountArchive onClick={handleHiddenArchiveAccount} />}
          <CreateOtherAccounts onClick={() => setCreateAccountModal(true)} />

          <GradientButton
            buttonFilled={true}
            onClick={() => {
              router.push('/my-account')
            }}
            size="100%"
            label=""
          >
            <AccountManageContent>
              Account Manage
              <span>
                <ArrowUpRight />
              </span>
            </AccountManageContent>
          </GradientButton>
        </InnerContentFooter>
      </div>
    )
  }
  function getMobileContent() {
    return (
      <div>
        {accountArchive && (
          <BackToAccountArchive onClick={handleShowArchiveAccount}>
            <ArrowUpLeft />
            <span>Go Back</span>
          </BackToAccountArchive>
        )}
        <InnerMobileContentWrapper>
          {activeAccount ? (
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
                {/* <UserAvatar src="/static/images/header/user.png" />  */}
                <UserInfo>
                  <div>
                    <UserName>{accountName}</UserName>
                    <UserAddress>
                      <span></span>
                      {account && truncateAddress(account, 5)}
                    </UserAddress>
                  </div>
                </UserInfo>
              </User>
              <UseruPNLWrapper>
                <Title>CNA MAIN</Title>
                <Badges iconIndex={iconIndex} handleShowIcon={handleShowIcon} />
                <UseruPNL>
                  uPNL: <AccountUpnl />
                </UseruPNL>
              </UseruPNLWrapper>
            </AccountHandler>
          ) : (
            <AccountHandler>
              <User active={clickAccounts} onClick={openAccountModal}>
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
        </InnerMobileContentWrapper>
        <InnerContent>
          <InnerContentScroll>
            {data
              .filter((account) =>
                accountArchive
                  ? accountsArchive.includes(account.accountAddress)
                  : !accountsArchive.includes(account.accountAddress)
              )
              .map((account, index) => {
                return (
                  <Account
                    account={account}
                    key={index}
                    active={activeAccountAddress ? activeAccountAddress === account.accountAddress : false}
                    onClick={() => onClick(account)}
                  />
                )
              })}
          </InnerContentScroll>
          <InnerContentFooter>
            {!accountArchive && <AccountArchive onClick={handleHiddenArchiveAccount} />}
            <CreateOtherAccounts onClick={() => setCreateAccountModal(true)} />
            {isConnected && (
              <HideAccountBalance
                onClick={() => {
                  dispatch(setHideAccountBalance(!hideAccountBalance))
                }}
              >
                <span>{hideAccountBalance ? 'Show' : 'Hide'} Account Balance</span>
              </HideAccountBalance>
            )}
            <ButtonGruop>
              <GradientButton buttonFilled={false} label={'Deposit'} onClick={toggleDepositModal} />
              <GradientButton buttonFilled={false} label={'Withdraw'} onClick={toggleWithdrawModal} />
            </ButtonGruop>
            <GradientButton
              buttonFilled={true}
              onClick={() => {
                router.push('/my-account')
              }}
              size="100%"
              height="40px"
              label=""
            >
              <AccountManageContent>
                Account Manage
                <span>
                  <ArrowUpRight />
                </span>
              </AccountManageContent>
            </GradientButton>
          </InnerContentFooter>
        </InnerContent>
      </div>
    )
  }
  const isMobile = useIsMobile()

  const modalRef = useRef<HTMLDivElement>(null)

  return open ? <HoverWrapper ref={modalRef}>{isMobile ? getMobileContent() : getInnerContent()}</HoverWrapper> : <></>
}
