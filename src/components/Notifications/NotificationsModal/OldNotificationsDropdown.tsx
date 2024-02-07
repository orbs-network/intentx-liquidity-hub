import { useState } from 'react'
import styled from 'styled-components'

import { useReadNotifications } from 'state/notifications/hooks'

import { newNotificationsFirst } from '.'
import Column from 'components/Column'
import NotificationCardsItems from 'components/Notifications/Cards/index'
import { RowCenter } from 'components/Row'
import { ChevronDown } from 'components/Icons'
import { Card } from 'components/Card'

const ContentContainer = styled(Column)`
  gap: 12px;
  overflow: scroll;
  border-radius: 0px 0px 4px 4px;
  background: ${({ theme }) => theme.bg3};
`

const DropdownContent = styled(Card)<{ isOpen: boolean }>`
  gap: 12px;
  width: 379px;
  padding: 0px;
  max-height: 500px;
  overflow: scroll;
  background: ${({ theme }) => theme.bg3};
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
`

const OldButton = styled(RowCenter)`
  font-weight: 500;
  font-size: 12px;
  min-height: 30px;
  cursor: pointer;
  position: relative;
  border-radius: 4px;
  color: ${({ theme }) => theme.text3};
  background: ${({ theme }) => theme.bg4};
`

const IconWrap = styled.div`
  position: absolute;
  right: 15px;
  top: 7px;
`

const Chevron = styled(ChevronDown)<{ open: boolean }>`
  transform: rotateX(${({ open }) => (open ? '180deg' : '0deg')});
  margin-right: 4px;
  transition: 0.5s;
`

export default function OldNotificationsDropdown({ newNotifications }: { newNotifications: boolean }) {
  const [showDropdown, toggleDropdown] = useState(newNotifications)
  const readNotifications = [...useReadNotifications()]

  function getTriggers(): React.ReactElement<any> | string {
    return (
      <OldButton>
        {`${showDropdown ? 'Hide' : 'Show'} Old Notifications`}
        <IconWrap>
          <Chevron open={showDropdown} />
        </IconWrap>
      </OldButton>
    )
  }

  function GetContent(): JSX.Element {
    return (
      <>
        {readNotifications.length > 0 && (
          <Column style={{ gap: '10px' }}>
            {readNotifications.sort(newNotificationsFirst).map((notification, index) => {
              return <NotificationCardsItems notification={notification} key={index} />
            })}
          </Column>
        )}
      </>
    )
  }

  return (
    <>
      <ContentContainer onClick={() => toggleDropdown(!showDropdown)}>
        {getTriggers()}
        <DropdownContent isOpen={showDropdown}>
          <GetContent />
        </DropdownContent>
      </ContentContainer>
    </>
  )
}
