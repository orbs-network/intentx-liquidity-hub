export const WEB_SETTING = {
  version: '0.1.10',
  versionCode: 11,
  calculationalInput: true,
  showBadge: true,
  muonEnabled: true,
  showAccountHealthEmoji: true,
  showColorfulAccountHealth: true,
}

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL

export const APP_NAME = 'IntentX'

export const UNDER_MAINTENANCE = false

export const GLOBAL_MULTI_ACCOUNTABLE_PAUSED = false
export const CHECK_IS_WHITE_LIST = false

export const DEFAULT_PRECISION = 2

export const MARKET_PRICE_COEFFICIENT = 1.01

export const MARKET_ORDER_DEADLINE = 500 // 5 minutes
export const LIMIT_ORDER_DEADLINE = 311040120 // 10 years

export const MAX_LEVERAGE_VALUE = 40
export const MIN_LEVERAGE_VALUE = 1

export const MAX_PENDINGS_POSITIONS_NUMBER = 10
export const BALANCE_HISTORY_ITEMS_NUMBER = 10

export const EPOCH_START_TIMESTAMP = new Date('2023-11-15T00:00:00Z').getTime() / 1000 // Timestamp en segundos
