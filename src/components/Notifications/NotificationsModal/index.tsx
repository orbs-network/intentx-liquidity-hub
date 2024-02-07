import { useMemo } from 'react'
import styled, { useTheme } from 'styled-components'
import { Z_INDEX } from 'theme'

import { useReadNotifications, useUnreadNotifications } from 'state/notifications/hooks'
import { NotificationDetails } from 'state/notifications/types'

import { Card } from 'components/Card'
import Column, { ColumnCenter } from 'components/Column'
import { Bell } from 'components/Icons'
import { Modal } from 'components/Modal'
import NotificationCardsItems from 'components/Notifications/Cards/index'
import { RowCenter } from 'components/Row'
import { useAppDispatch } from 'state'
import { setReadNotifications, setUnreadNotifications } from 'state/notifications/actions'
import OldNotificationsDropdown from './OldNotificationsDropdown'

const ModalWrapper = styled(Card)`
  padding: 0.6rem;
  border: none;
  background: ${({ theme }) => theme.bg3};

  & > * {
    &:last-child {
      overflow-y: scroll;
      overflow-x: hidden;
      width: 100%;
      min-height: 100%;
      max-height: 400px;
    }
  }
`

const InlineModal = styled(Card)<{
  isOpen: boolean
  height?: string
}>`
  padding: 10px 15px;
  width: 404px;
  max-height: ${({ height }) => height ?? '554px'};
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: absolute;
  z-index: ${Z_INDEX.modal};
  transform: translate(-364px, 20px);
  background: ${({ theme }) => theme.bg3};

  & > * {
    &:last-child {
      overflow-y: scroll;
      overflow-x: hidden;
      width: 100%;
    }
  }
`

const EmptyRow = styled(ColumnCenter)`
  font-size: 14px;
  margin-bottom: 70px;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};
  background: ${({ theme }) => theme.bg3};
`

const InfoBox = styled(RowCenter)`
  font-weight: 500;
  font-size: 12px;
  height: 30px;
  border-radius: 4px;
  color: ${({ theme }) => theme.text0};
  background: ${({ theme }) => theme.bg4};
`

const Top = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  justify-content: space-between;
`

const Title = styled.div`
  display: flex;
  font-size: 18px;
  align-items: center;
  p {
    font-size: 12px;
    color: ${({ theme }) => theme.text0};
    font-weight: 400;
    margin-left: 10px;
  }
`
const Counter = styled.span`
  margin-left: 5px;
  background: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text0};
  height: 20px;
  width: 20px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
`

const MarkAll = styled.p`
  color: ${({ theme }) => theme.text0};
  text-decoration: underline;
  font-size: 12px;
  cursor: pointer;
  font-weight: 400;
`

const Label = styled.p`
  color: ${({ theme }) => theme.text3};
  font-size: 12px;
  cursor: pointer;
  display: block;
`

export function newNotificationsFirst(a: NotificationDetails, b: NotificationDetails) {
  return Number(b.modifyTime) - Number(a.modifyTime)
}

export default function NotificationsModal({
  isModal,
  isOpen,
  onDismiss,
}: {
  isModal?: boolean
  isOpen: boolean
  onDismiss: () => void
}) {
  const theme = useTheme()

  const unreadNotifications = [...useUnreadNotifications()]
  const readNotifications = [...useReadNotifications()]
  const emptyNotification = useMemo(
    () => unreadNotifications.length === 0 && readNotifications.length === 0,
    [readNotifications.length, unreadNotifications.length]
  )

  const dispatch = useAppDispatch()

  function getInnerContent() {
    return (
      <>
        <Top>
          <Title>
            <Bell color={theme.red} style={{ marginBottom: 2 }} />
            <p>Your notifications</p>
            <Counter>{unreadNotifications.length}</Counter>
          </Title>
          {unreadNotifications.length > 0 && (
            <MarkAll
              onClick={() => {
                dispatch(
                  setUnreadNotifications({
                    notifications: [],
                  })
                )
                dispatch(
                  setReadNotifications({
                    notifications: unreadNotifications,
                  })
                )
              }}
            >
              Mark all as read
            </MarkAll>
          )}
        </Top>
        {emptyNotification ? (
          <EmptyRow>
            <Bell width={48} height={50} color={theme.bg5} style={{ margin: '10px auto 20px auto' }} />
            There are no pending notifications
          </EmptyRow>
        ) : (
          <Column style={{ gap: '10px' }}>
            <Column style={{ gap: '10px' }}>
              <Label>New</Label>
              {unreadNotifications.length > 0 && (
                <Column>
                  {unreadNotifications.map((notification, index) => {
                    return <NotificationCardsItems notification={notification} key={index} />
                  })}
                </Column>
              )}
            </Column>
            <Column>
              {readNotifications.length > 0 && (
                <>
                  <Label>All</Label>
                  <OldNotificationsDropdown newNotifications={!unreadNotifications.length} />
                </>
              )}
            </Column>
          </Column>
        )}
      </>
    )
  }

  return isModal ? (
    <Modal isOpen={isOpen} onBackgroundClick={onDismiss} onEscapeKeydown={onDismiss}>
      <ModalWrapper>{getInnerContent()}</ModalWrapper>
    </Modal>
  ) : (
    <InlineModal isOpen={isOpen} height={emptyNotification ? '288px' : undefined}>
      {getInnerContent()}
    </InlineModal>
  )
}
