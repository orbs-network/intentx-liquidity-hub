import { EPOCH_START_TIMESTAMP } from 'config/index'

export function getCurrentEpochStartTimestamp(): number {
  const now = new Date()
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  return Math.floor(startOfDay.getTime() / 1000)
}

export function getEpochEndTimestamp(epochStart: number): number {
  const SECONDS_IN_A_DAY = 86400 // 24 horas * 60 minutos * 60 segundos
  return epochStart + SECONDS_IN_A_DAY - 1
}

export function getSecondsRemainingInEpoch(): number {
  const now = Math.floor(Date.now() / 1000) // Timestamp actual en segundos
  const secondsSinceEpochStart = now - EPOCH_START_TIMESTAMP
  const SECONDS_IN_A_DAY = 86400 // 24 horas * 60 minutos * 60 segundos
  const secondsRemainingInEpoch = SECONDS_IN_A_DAY - (secondsSinceEpochStart % SECONDS_IN_A_DAY)
  return secondsRemainingInEpoch
}

export function getCurrentEpochNumber(): number {
  const now = new Date()
  const currentTimestamp = Math.floor(now.getTime() / 1000) // Timestamp actual en segundos
  const daysSinceEpochStart = Math.floor((currentTimestamp - EPOCH_START_TIMESTAMP) / (24 * 60 * 60))
  return daysSinceEpochStart
}

export function getEpochNumberFromTimestamp(timestamp: number): number {
  const daysSinceEpochStart = Math.floor((timestamp - EPOCH_START_TIMESTAMP) / (24 * 60 * 60))

  if (daysSinceEpochStart === -1) {
    return 0
  }

  return daysSinceEpochStart
}
