import { useEffect, useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Z_INDEX } from 'theme'

import { Account as AccountType } from 'types/user'

import ArchiveAccount from 'components/Icons/ArchiveAccount'
import UnarchiveAccount from 'components/Icons/UnarchiveAccount'
import { RowBetween, RowEnd, RowStart } from 'components/Row'
import { LoaderIcon } from 'react-hot-toast'
import {
  useAccountPartyAStat,
  useAccountsArchive,
  useHideAccountBalance,
  useToggleAccountsArchiveCallback,
} from 'state/user/hooks'
import { formatAmount } from 'utils/numbers'

const AccountWrapper = styled.div<{ active?: boolean }>`
  padding: 12px 8px 4px 8px;
  margin: 8px 0px;
  border-radius: 3px;
  background: transparent;
  border: 1px solid ${({ theme, active }) => (active ? theme.text1 : theme.bg7)};
  z-index: ${Z_INDEX.tooltip};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.bg4};
  }
`

const Row = styled(RowBetween)`
  flex-flow: row nowrap;
  align-items: center;
  margin-bottom: 8px;
  gap: 0.5rem;
`

const Label = styled(RowStart)<{ isHovering?: boolean }>`
  font-size: 12px;
  text-transform: capitalize;
  color: ${({ theme, isHovering }) => (isHovering ? theme.red : theme.text1)};
  transition: color 0.3s linear;
`

const Value = styled(RowEnd)`
  font-size: 12px;
  color: ${({ theme }) => theme.text0};
`

const UpnlText = styled(RowEnd)`
  font-size: 10px;
  color: ${({ theme }) => theme.text3};
`

const UpnlValue = styled.div<{ color?: string }>`
  font-size: 12px;
  justify-self: end;
  color: ${({ theme, color }) => color ?? theme.green};
`

const AccountStatusIcon = styled.div`
  font-size: 16px;
  height: 100%;
  cursor: pointer;
  display: flex;
`

const ArchiveRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`

export default function Account({
  account,
  active,
  onClick,
}: {
  account: AccountType
  active: boolean
  onClick: () => void
}): JSX.Element {
  const theme = useTheme()
  const accountsArchive = useAccountsArchive()
  const accountArchived = accountsArchive.includes(account.accountAddress)
  // const [value, color] = useMemo(() => {
  const [, color] = useMemo(() => {
    const upnl = { upnl: 0 }
    if (upnl.upnl > 0) return [`+ $${upnl.upnl}`, theme.green1]
    else if (upnl.upnl < 0) [`$${upnl.upnl}`, theme.red1]
    return [`$${upnl.upnl}`, undefined]
  }, [theme])

  const { allocatedBalance, lockedPartyAMM, loading, lockedCVA, lockedLF } = useAccountPartyAStat(
    account.accountAddress
  )

  useEffect(() => {
    console.log("Using analytics for account ", account.name, account.accountAddress)
    console.log(allocatedBalance)
  }, [account, allocatedBalance])

  //const accountData = useAccountData(account.accountAddress)
  // const { availableForOrder } = accountData

  const toggleAccountArchive = useToggleAccountsArchiveCallback(account.accountAddress)

  const [isHoveringArchive, setIsHoveringArchive] = useState(false)
  const hideAccountBalance = useHideAccountBalance()
  return (
    <AccountWrapper active={active} onClick={onClick}>
      <Row>
        <Label style={{ color: theme.text0 }}>{account.name}</Label>

        <AccountStatusIcon onClick={toggleAccountArchive}>
          {accountArchived ? (
            <ArchiveRow
              onMouseEnter={() => setIsHoveringArchive(true)}
              onMouseLeave={() => setIsHoveringArchive(false)}
            >
              <UnarchiveAccount isHovering={isHoveringArchive} />
              <Label isHovering={isHoveringArchive}>Unarchive</Label>
            </ArchiveRow>
          ) : (
            <ArchiveRow
              onMouseEnter={() => setIsHoveringArchive(true)}
              onMouseLeave={() => setIsHoveringArchive(false)}
            >
              <ArchiveAccount isHovering={isHoveringArchive} />
              <Label isHovering={isHoveringArchive}>Archive</Label>
            </ArchiveRow>
          )}
        </AccountStatusIcon>
      </Row>
      <Row>
        <Label>Account Balance:</Label>
        {hideAccountBalance && <Value>****</Value>}
        {!hideAccountBalance && <Value>{loading ? <LoaderIcon /> : `${formatAmount(allocatedBalance)}`}</Value>}
      </Row>
      <Row>
        <Label>Locked Margin: </Label>
        {hideAccountBalance && <Value>****</Value>}
        {!hideAccountBalance && <Value>{loading ? <LoaderIcon /> : `${formatAmount(lockedPartyAMM)}`}</Value>}
      </Row>
    </AccountWrapper>
  )
}
