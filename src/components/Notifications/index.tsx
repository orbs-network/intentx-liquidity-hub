import React, { useMemo, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { isMobile } from 'react-device-detect'

import useOnOutsideClick from 'lib/hooks/useOnOutsideClick'
import { useMarkAsReadAllNotificationsCallback, useUnreadNotifications } from 'state/notifications/hooks'

import { Bell } from 'components/Icons'
import { NavButton, NavigationButton } from 'components/Button'
import NotificationsModal from 'components/Notifications/NotificationsModal'

const Container = styled.div`
  display: unset;
  align-items: center;
`

const NotificationsCount = styled.div`
  width: 14px;
  height: 14px;
  position: absolute;
  right: 0px;
  top: 4px;
  border-radius: 100px;
  font-weight: 500;
  font-size: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.gradCustom1};
  color: ${({ theme }) => theme.white};
`

export default function Notifications() {
  const theme = useTheme()
  const ref = useRef(null)
  useOnOutsideClick(ref, () => {
    if (!isMobile) setModalOpen(false)
    if (modalOpen) readAllNotifications()
  })
  const [modalOpen, setModalOpen] = useState(false)
  const readAllNotifications = useMarkAsReadAllNotificationsCallback()
  const unreadNotifications = [...useUnreadNotifications()]
  const newNotifications = useMemo(() => unreadNotifications.length !== 0, [unreadNotifications.length])

  const closeOnClick = () => {
    if (modalOpen) readAllNotifications()
    setModalOpen(!modalOpen)
  }

  return (
    <div ref={ref}>
      <NavigationButton onClick={closeOnClick}>
        <Bell color={newNotifications ? theme.primaryBlue : undefined} width={30} height={30} />
        {newNotifications && <NotificationsCount>{unreadNotifications.length}</NotificationsCount>}
      </NavigationButton>
      <>
        {isMobile ? (
          <>
            <NotificationsModal isModal isOpen={modalOpen} onDismiss={() => setModalOpen(false)} />
          </>
        ) : (
          <Container>
            {modalOpen && (
              <div>
                <NotificationsModal isOpen onDismiss={() => setModalOpen(!modalOpen)} />
              </div>
            )}
          </Container>
        )}
      </>
    </div>
  )
}
