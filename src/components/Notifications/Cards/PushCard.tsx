import { Account } from 'types/user'
import { NotificationDetails } from 'state/notifications/types'
import BaseItem from 'components/Notifications/Cards/BaseCard'
import { StaticImageData } from 'next/image'
import { RowStart } from 'components/Row'
import styled from 'styled-components'
import Logos from '../Logos'

const DefaultToken: StaticImageData = {
  src: '/static/images/stakingIcons/intentXIcon.svg',
  height: 128,
  width: 128,
}

export const PartiallyFillText = styled(RowStart)`
  width: unset;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};
`
export default function PushCard({
  notification,
  account,
  loading,
}: {
  notification: NotificationDetails
  account: Account
  loading?: boolean
}): JSX.Element {
  const { createTime } = notification

  return (
    <BaseItem
      text={<PartiallyFillText>{notification?.pushNotificationBody || ''}</PartiallyFillText>}
      timestamp={createTime}
      title={notification?.pushNotificationTitle || ''}
      accountName={''}
      token1={DefaultToken}
      loading={loading}
    />
  )
}
