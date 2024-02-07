import { ApplicationUpdater } from './application/updater'
import { HedgerUpdater } from './hedger/updater'
import { NotificationUpdater } from './notifications/updater'
import { TransactionUpdater } from './transactions/updater'
import { UserUpdater } from './user/updater'

import { useEffect } from 'react'
import { persistor, useAppDispatch } from 'state'
import { AnalyticsUpdater } from './analytics/updater'

import { useResetUser } from './user/hooks'
import { useUserAccounts } from 'hooks/useAccounts'
import { updateAccount } from './user/actions'
import { UpdaterUserContract } from './user/updaterUserContract'
import { useDisconnect } from 'wagmi'
export default function Updaters() {
  const resetUser = useResetUser()
  const { accounts } = useUserAccounts()
  const dispatch = useAppDispatch()

  return (
    <>
      <ApplicationUpdater />

      <UserUpdater />
      <UpdaterUserContract />

      <HedgerUpdater />
      <NotificationUpdater />
      <AnalyticsUpdater />
    </>
  )
}
