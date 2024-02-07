import Link from 'next/link'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Row } from 'components/Row'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { ApplicationConnectionStatus } from 'state/application/reducer'
import MenuButton from './MenuButton'

import Graph from 'components/Icons/Graph'
import MedalOutline from 'components/Icons/MedalOutline'
import TablerCoin from 'components/Icons/TablerCoin'
import TradeBar from 'components/Icons/TradeBar'
import Users from 'components/Icons/Users'
import BookOpen from 'components/Icons/BookOpen'

import { useIsMobile } from 'lib/hooks/useWindowSize'

// import UserExample from '/public/static/images/etc/user-example.svg'
import { useApplicationConnectionStatus } from 'state/application/hooks'
import { useActiveAccount } from 'state/user/hooks'
import { truncateAddress } from 'utils/address'

import ArrowUpRight from 'components/Icons/ArrowUpRight'
import { ArrowRight } from 'react-feather'

interface Option {
  name: string
  path: string
  icon: string
  newTab?: boolean
}

const options: Option[] = [
  { name: 'Trade', path: '/trade', icon: 'tradebar' },
  // { name: 'Markets', path: '/markets', icon: '' },
  { name: 'Analytics', path: '/analytics', icon: 'graph' },
  { name: 'Referrals', path: '/referrals', icon: 'users' },
  { name: 'Leaderboard', path: '/leaderboard', icon: 'medaloutline' },
  { name: 'Incentives', path: '/trader-incentives', icon: 'tablercoin' },
  { name: 'Documentation', path: 'https://docs.intentx.io/', icon: 'documentation', newTab: true },
]

const Wrapper = styled(Row)`
  height: 36px;
  border-radius: 4px;
  display: flex;
  gap: 7px;
  flex-direction: column;
`

const MobileWrapper = styled(Wrapper)`
  height: initial;
  padding: 0;
  gap: 10px;
`

const CurrentUser = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding: 10px 15px;
  background: ${({ theme }) => theme.bg10};
  border-radius: 10px;

  img {
    width: 32px;
    height: 32px;
    border-radius: 100%;
  }
`

const UserName = styled.h4`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
`
const UserInfo = styled.div``

const UserAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 400;

  span {
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.green};
  }
`

const MenuTitle = styled.div`
  font-size: 12px;
  line-height: normal;
  color: ${({ theme }) => theme.text1};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

const AccountManageButton = styled.div`
  a {
    color: ${({ theme }) => theme.white};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: ${({ theme }) => theme.gradCustom1};
    cursor: pointer;
    padding: 12px;
    border-radius: 5px;
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: 400;
    text-decoration: none;

    &:hover {
      background: ${({ theme }) => theme.gradCustom4};
    }
  }
`

// const CloseButton = styled.div`
//   line-height: 0;
//   cursor: pointer;
// `

const DesktopModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
`

const LogoContainer = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

function Button({ onDismiss, isMobile, option }: { onDismiss: () => void; isMobile?: boolean; option: Option }) {
  const [isHover, setIsHover] = useState(false)

  return (
    <MenuButton
      isMobile={isMobile}
      onDismiss={() => {
        if (option.newTab) {
          window.open(option.path, '_blank')
        } else {
          Router.push({
            pathname: option.path,
          })
        }

        onDismiss()
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {isMobile &&
        option.icon &&
        (option.icon === 'tradebar' ? (
          <TradeBar width={20} height={20} color={isHover ? '#fff' : ''} />
        ) : option.icon === 'graph' ? (
          <Graph width={20} height={20} color={isHover ? '#fff' : ''} />
        ) : option.icon === 'medaloutline' ? (
          <MedalOutline width={20} height={20} color={isHover ? '#fff' : ''} />
        ) : option.icon === 'users' ? (
          <Users width={20} height={20} color={isHover ? '#fff' : ''} />
        ) : option.icon === 'tablercoin' ? (
          <TablerCoin width={20} height={20} color={isHover ? '#fff' : ''} />
        ) : option.icon === 'documentation' ? (
          <BookOpen width={20} height={20} color={isHover ? '#fff' : ''} />
        ) : null)}
      {option.name}

      {option.icon === 'documentation' && (
        <span style={{ lineHeight: 0 }}>
          <ArrowRight width={15} height={15} color={'#fff'} />
        </span>
      )}
    </MenuButton>
  )
}

function MenuButtons({ onDismiss, isMobile }: { onDismiss: () => void; isMobile?: boolean }) {
  return (
    <>
      {options.map((option, index) => (
        <Button key={index} onDismiss={onDismiss} isMobile={isMobile} option={option} />
      ))}
    </>
  )
}

export function MenuModal({ onDismiss }: { onDismiss: () => void }) {
  const { account } = useActiveConnectionDetails()
  const isMobile = useIsMobile()
  const activeAccount = useActiveAccount()
  const { name } = activeAccount || {}
  const applicationConnectionStatus = useApplicationConnectionStatus()

  const standardAccountName = (() => {
    if (name && name.length > 10) return `${name.slice(0, 10)}...`
    return name
  })()

  const [accountName, setAccountName] = useState(standardAccountName)

  useEffect(() => {
    standardAccountName && setAccountName(standardAccountName)
  }, [standardAccountName])

  const dissmissMenu = (): void => {
    onDismiss?.()
  }

  return (
    <DesktopModalWrapper>
      <MenuTitle>
        {/* <LogoContainer>
          {!isMobile ? <Image width={20} unoptimized={true} src={logointentx} alt="logo" /> : null}

          <span>Where Intent Meets Execution</span>
        </LogoContainer> */}

        {/* <CloseButton onClick={dissmissMenu}>
          <Close size={15} color="#fff" />
        </CloseButton> */}
      </MenuTitle>

      {(applicationConnectionStatus === ApplicationConnectionStatus.DEFI ||
        applicationConnectionStatus === ApplicationConnectionStatus.ACCOUNT_ABSTRACTION) && (
        <>
          <CurrentUser>
            {/* <Image unoptimized={true} src={UserExample} alt="icon" width={32} /> */}
            <UserInfo>
              <UserName>{activeAccount ? accountName : 'Not Signed'}</UserName>
              <UserAddress>
                <span></span>
                {account && truncateAddress(account)}
              </UserAddress>
            </UserInfo>
          </CurrentUser>

          <AccountManageButton>
            <Link href="/my-account" passHref onClick={dissmissMenu}>
              <span>Manage Account</span>
              <ArrowUpRight width={15} height={15} />
            </Link>
          </AccountManageButton>
        </>
      )}

      <MobileWrapper>
        <MenuButtons onDismiss={dissmissMenu} isMobile={true} />
      </MobileWrapper>
    </DesktopModalWrapper>
  )
}
