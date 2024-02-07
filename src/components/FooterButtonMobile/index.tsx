import AnalyticsMobile from 'components/Icons/AnalyticsMobile'
import MedalOutline from 'components/Icons/MedalOutline'
import ReferralsMobile from 'components/Icons/ReferralsMobile'
import TradeBarMobile from 'components/Icons/TradeBarMobile'
import UserMobile from 'components/Icons/UserMobile'
import Router, { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

const MainButton = styled.div<{ active: boolean }>`
  color: ${({ theme, active }) => (active ? theme.white : '#394353')};
  font-size: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TradeBar = styled(TradeBarMobile)`
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
`

interface Option {
  name: string
  path: string
  icon: string
}

export default function FooterButtonMobile({ isMobile, option }: { isMobile?: boolean; option: Option }) {
  const [isHover, setIsHover] = useState(false)
  const isActive = location.pathname.includes(option.path) ? true : false
  return (
    <MenuButton onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} path={option.path}>
      {isMobile &&
        option.icon &&
        (option.icon === 'user' ? (
          <UserMobile width={22} height={22} color={isActive ? undefined : '#394353'} />
        ) : option.icon === 'graph' ? (
          <AnalyticsMobile width={22} height={22} color={isActive ? undefined : '#394353'} />
        ) : option.icon === 'medaloutline' ? (
          <MedalOutline width={22} height={22} color={isActive ? undefined : '#394353'} />
        ) : option.icon === 'users' ? (
          <ReferralsMobile width={22} height={22} color={isActive ? undefined : '#394353'} />
        ) : option.icon === 'tradebar' ? (
          <TradeBar width={55} height={55} />
        ) : null)}
      {option.name}
    </MenuButton>
  )
}

function MenuButton({
  children,
  path,
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode | string
  path: string
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const router = useRouter()

  const isActive = location.pathname.includes(path) ? true : false

  const onClick = useCallback(() => {
    Router.push({
      pathname: path,
    })
  }, [router])
  return (
    <MainButton active={isActive} onClick={onClick} onMouseOver={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </MainButton>
  )
}
