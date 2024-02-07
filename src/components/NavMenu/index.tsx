import { useRef, useState } from 'react'
import styled from 'styled-components'

import { NavigationButton } from 'components/Button'
import Menu from 'components/Icons/Menu'
import { MenuModal } from './MenuModal'

import useOnOutsideClick from 'lib/hooks/useOnOutsideClick'

import { useIsMobile } from 'lib/hooks/useWindowSize'
import { Z_INDEX } from 'theme'

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  height: 100%;
`

const ModalWrapper = styled.div<{ isOpen?: boolean }>`
  position: absolute;
  top: 0;
  right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
  z-index: ${Z_INDEX.modal};
  transition: right 0.3s ease;
  margin-top: 65px;
  height: 100vh;
  background-color: #16181c;
  width: 250px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin-top: 48px;
  `}

  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-top: 0;
  `}
`

export default function UserMenu() {
  const ref = useRef(null)
  const menuRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

  const isMobile = useIsMobile()

  useOnOutsideClick(ref, () => (isOpen ? setIsOpen(false) : undefined))

  if (isMobile) {
    return <></>
  }

  return (
    <Container ref={ref}>
      <ModalWrapper ref={menuRef} isOpen={isOpen}>
        <MenuModal onDismiss={() => setIsOpen((prev) => !prev)} />
      </ModalWrapper>

      <NavigationButton onClick={() => setIsOpen((prev) => !prev)}>
        <Menu />
      </NavigationButton>
    </Container>
  )
}
