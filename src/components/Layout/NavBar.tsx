import React, { useState } from 'react'
import styled from 'styled-components'
import { Z_INDEX } from 'theme'

import { useIsLaptop, useIsMobile } from 'lib/hooks/useWindowSize'
import { useNewNotification } from 'state/notifications/hooks'
import { useInjectedAddress } from 'lib/hooks/useInjectedAddress'

import { Row, RowBetween, RowFixed } from 'components/Row'
// import { sendEvent } from 'components/Analytics'
import Web3Network from 'components/Web3Network'

import Web3Status from 'components/Web3Status'
import { InfoHeader } from 'components/InfoHeader'
import NavLogo from './NavLogo'
import WithdrawCooldownButton from 'components/App/AccountData/Withdraw/WithdrawCooldownButton'
import Notifications from 'components/Notifications'
import Warning from './Warning'
// import Menu from './Menu'
import Column from 'components/Column'
import NavMenu from 'components/NavMenu'

import { NavButton, NavigationButton } from 'components/Button'
import User from 'components/Icons/User'
import Router from 'next/router'
import UserMenu from 'components/User'
import WithdrawCooldownLabel from 'components/App/AccountData/Withdraw/WithdrawCooldownLabel'
import GradientButton from 'components/Button/GradientButton'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useApplicationConnectionStatus, useToggleModal } from 'state/application/hooks'
import { ApplicationConnectionStatus, ApplicationModal } from 'state/application/reducer'
import OutlineBtn from 'components/Button/OutlineButton'
import { useAccountModal } from '@rainbow-me/rainbowkit'

const Wrapper = styled(Row)`
  gap: 5px;
  font-size: 16px;
  flex-wrap: nowrap;
  height: 64px;
  padding: 0 2rem;
  position: relative;
  z-index: ${Z_INDEX.fixed};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    background-color: ${({ theme }) => theme.bg};
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0px 1.5rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 3.75px;
  font-size: 12px;
  height: 48px;
`};
`

const BackgroundWrapper = styled(Wrapper)<{ newNotification?: boolean }>`
  @keyframes fade {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  padding: 0px;
  height: 100%;
  overflow: hidden;
  position: absolute;
  background: ${({ theme, newNotification }) => (newNotification ? theme.bg9 : theme.bg9)};
  animation: ${({ newNotification }) => (newNotification ? 'fade 1s linear 1' : 'none')};
`

const MobileWrapper = styled(Wrapper)`
  display: flex;
  background: transparent;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  `};
`

export const NavbarContentWrap = styled.div`
  list-style: none;
  margin: auto;
  margin-left: 15px;
  margin-right: 15px;
  cursor: pointer;
  padding: 10px 0;
  position: relative;

  &:hover {
    display: block;

    & > ul {
      display: block;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin-left: 11px;
  margin-right: 11px;
  padding: 7.5px 0;
`};
`

export const SubNavbarContentWrap = styled.ul`
  display: none;
  padding: 12px 0 12px 0px;
  background: ${({ theme }) => theme.bg2};
  border-radius: 10px;
  list-style: none;
  position: absolute;
  top: 50px;
  margin-top: -14px;
  left: 50%;
  transform: translateX(-50%);

  & > li > div {
    border-radius: 0;
    padding: 0.45rem 1rem;
    min-width: 150px;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 9px 0 9px 0px;
  margin-top: -11px;

  & > li > div {
    border-radius: 0;
    padding: 0.3375rem 0.9rem;
    min-width: 112px;
  }
`};
`

const Items = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  flex: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
      gap: 5px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 15px;
`};
`

const StatusWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 5px;
`
const CooldownWrapper = styled(Column)`
  & > * {
    width: 100%;
  }

  z-index: -1;
`

export default function NavBar() {
  const hasInjected = useInjectedAddress()
  const isNewNotification = useNewNotification()
  const isLaptop = useIsLaptop()
  const showBanner = localStorage.getItem('risk_warning') === 'true' ? false : true
  const [showTopBanner, setShowTopBanner] = useState(showBanner)
  const bannerText = 'Users interacting with this software do so entirely at their own risk'
  const applicationConnectionStatus = useApplicationConnectionStatus()
  const { openAccountModal } = useAccountModal()
  const toggleConnectedAccountManagementModal = useToggleModal(ApplicationModal.CONNECTED_ACCOUNT_MANAGEMENT)

  function setShowBanner(inp: boolean) {
    if (!inp) {
      localStorage.setItem('risk_warning', 'true')
      setShowTopBanner(false)
      // sendEvent('click', { click_type: 'close_notification', click_action: 'risk_warning' })
    }
  }

  function getMobileContent() {
    return (
      <>
        <BackgroundWrapper newNotification={isNewNotification} />
        <MobileWrapper>
          <RowBetween>
            <NavLogo />
            <RowFixed>
              <StatusWrapper>
                <Web3Status />
                <CooldownWrapper>
                  <WithdrawCooldownButton formatedAmount={false} />
                </CooldownWrapper>
              </StatusWrapper>
              <Notifications />
              <Web3Network />
              <NavMenu />
            </RowFixed>
          </RowBetween>
        </MobileWrapper>
        {/* showTopBanner && <InfoHeader onClose={setShowBanner} hasInfoIcon={true} text={bannerText} /> */}
      </>
    )
  }

  function getDefaultContent() {
    return (
      <>
        <BackgroundWrapper newNotification={isNewNotification}></BackgroundWrapper>
        <BackgroundWrapper newNotification={isNewNotification} />
        <Wrapper>
          <NavLogo />
          <Items>
            <WithdrawCooldownButton formatedAmount={false} />
            <Web3Status />

            <NavigationButton
              onClick={() => {
                if (applicationConnectionStatus === ApplicationConnectionStatus.ACCOUNT_ABSTRACTION) {
                  toggleConnectedAccountManagementModal()
                } else {
                  openAccountModal && openAccountModal()
                }
              }}
            >
              <User size={30} color="white" />
            </NavigationButton>
            <Notifications />
            <Web3Network />
            <NavMenu />
          </Items>
        </Wrapper>
        <div>
          {hasInjected && (
            <Warning message={`❌ You are in "READ-ONLY" mode. Please do not confirm any transactions! ❌ `} />
          )}
        </div>
      </>
    )
  }

  const isMobile = useIsMobile()
  return isMobile ? getMobileContent() : getDefaultContent()
}
