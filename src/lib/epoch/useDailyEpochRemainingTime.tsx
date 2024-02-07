import React, { useEffect } from 'react'
import { getSecondsRemainingInEpoch } from './getEpochInformation'

export default function useDailyEpochRemainingTime() {
  const [hours, setHours] = React.useState(0)
  const [minutes, setMinutes] = React.useState(0)
  const [seconds, setSeconds] = React.useState(0)

  useEffect(() => {
    const timeRemaining = getSecondsRemainingInEpoch()
    const hours = Math.floor(timeRemaining / 3600)
    const minutes = Math.floor((timeRemaining % 3600) / 60)
    const seconds = Math.floor(timeRemaining % 60)

    setHours(hours)
    setMinutes(minutes)
    setSeconds(seconds)

    const interval = setInterval(() => {
      const timeRemaining = getSecondsRemainingInEpoch()
      const hours = Math.floor(timeRemaining / 3600)
      const minutes = Math.floor((timeRemaining % 3600) / 60)
      const seconds = Math.floor(timeRemaining % 60)

      setHours(hours)
      setMinutes(minutes)
      setSeconds(seconds)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    hours,
    minutes,
    seconds,
  }
}
