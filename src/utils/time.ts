import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import updateLocale from 'dayjs/plugin/updateLocale'

import { RoundMode } from './numbers'

dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '%d seconds',
    m: '1 min',
    mm: '%d mins',
    h: '1 hr',
    hh: '%d hrs',
    d: '1 day',
    dd: '%d days',
    M: '1 month',
    MM: '%d months',
    y: '1 yr',
    yy: '%d yrs',
  },
})

export function getDurationSeconds(targetDate: Date, ROUND_MODE: RoundMode): number {
  const now = dayjs.utc().unix()
  const then = dayjs.utc(targetDate).unix()
  const result = then - now
  return ROUND_MODE === RoundMode.ROUND_DOWN ? Math.floor(result) : Math.ceil(result)
}

export function getRemainingTime(timeStamp: number): {
  diff: number
  day: number
  hours: number
  minutes: number
  seconds: number
} {
  const now = dayjs().utc()
  const endTime = dayjs.utc(timeStamp)
  const diff = endTime.diff(now)

  const day = endTime.diff(now, 'day')
  const hours = dayjs.utc(diff).hour()
  const minutes = dayjs.utc(diff).minute()
  const seconds = dayjs.utc(diff).second()

  return { diff, day, hours, minutes, seconds }
}

export function getTimeLength(timeLength: number): {
  hours: string
  minutes: string
  seconds: string
  fullLength: string
} {
  const hours = dayjs.utc(timeLength).hour() + ' hr'
  const minutes = dayjs.utc(timeLength).minute() + ' min'
  const seconds = dayjs.utc(timeLength).second() + ' sec'

  let fullLength = ''
  if (hours[0] !== '0') fullLength += hours
  if (minutes[0] !== '0') fullLength += minutes
  if (seconds[0] !== '0') fullLength += seconds

  return { hours, minutes, seconds, fullLength }
}

export function formatTimestampUTC(timeLength: number, format?: string): string {
  return dayjs.utc(timeLength).format(format ?? 'LLL')
}

export function formatTimestamp(timeLength: number, format?: string): string {
  return dayjs(timeLength).format(format ?? 'YYYY /MM /DD - HH:mm')
}

export function getFromNow(timeLength: number): string {
  return dayjs(timeLength).fromNow()
}
