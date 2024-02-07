import styled from 'styled-components'
import { Badge as BadgeIcon, Bullet, Medal, Bow } from 'components/Icons'

const UserIconAction = styled.span`
  cursor: pointer;
  height: 24px;
`

export default function MultiAccount({ handleShowIcon, iconIndex }: { handleShowIcon: () => void; iconIndex: number }) {
  const icons = [
    <BadgeIcon key="badge" width={22} height={22} />,
    <Bullet key="bullet" width={24} height={20} />,
    <Medal key="medal" width={22} height={22} />,
    <Bow key="bow" width={22} height={22} />,
  ]

  return <UserIconAction onClick={handleShowIcon}>{icons[iconIndex]}</UserIconAction>
}
