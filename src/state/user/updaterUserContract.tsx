import { usePartyAStats } from 'hooks/usePartyAStats'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import useDebounce from 'lib/hooks/useDebounce'
import isEqual from 'lodash/isEqual'
import { useEffect, useState } from 'react'
import { useAppDispatch } from 'state'
import { updateAccountPartyAStat } from './actions'
import { useAccountPartyAStat, useActiveAccountAddress } from './hooks'

export function UpdaterUserContract(): null {
  const dispatch = useAppDispatch()
  const [time, setTime] = useState(0)
  const { account } = useActiveConnectionDetails()
  const activeAccountAddress = useActiveAccountAddress()

  const previousAccountPartyAStat = useAccountPartyAStat(account)
  const previousActiveAccountPartyAStat = useAccountPartyAStat(activeAccountAddress)

  const accountPartyAStat = usePartyAStats(account)
  const debouncedPartyAStat = useDebounce(accountPartyAStat, 1000)
  const activePartyAStat = usePartyAStats(activeAccountAddress)
  const debouncedActivePartyAStat = useDebounce(activePartyAStat, 1000)

  useEffect(() => {
    if (account !== undefined && !isEqual(previousAccountPartyAStat, debouncedPartyAStat)) {
      // if (debouncedPartyAStat === accountPartyAStat)
      if (debouncedPartyAStat.account === account)
        dispatch(updateAccountPartyAStat({ address: account, value: debouncedPartyAStat }))
    }
  }, [debouncedPartyAStat, account, dispatch, previousAccountPartyAStat, accountPartyAStat])

  useEffect(() => {
    if (activeAccountAddress !== null && !isEqual(previousActiveAccountPartyAStat, debouncedActivePartyAStat)) {
      // if (debouncedActivePartyAStat === activePartyAStat)
      if (debouncedActivePartyAStat.account === activeAccountAddress)
        dispatch(updateAccountPartyAStat({ address: activeAccountAddress, value: debouncedActivePartyAStat }))
    }
  }, [debouncedActivePartyAStat, activeAccountAddress, dispatch, previousActiveAccountPartyAStat, activePartyAStat])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1)
    }, 2000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return null
}
