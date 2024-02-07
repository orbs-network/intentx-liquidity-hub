export type Account = {
  userWallet?: string
  accountAddress: string
  name: string
}

export type AccountUpnl = {
  upnl: number
  timestamp: number
  available_balance: number
}

export type UserPartyAStatDetail = {
  account: string
  collateralBalance: string
  accountBalance: string
  liquidationStatus: boolean
  accountBalanceLimit: string
  withdrawCooldown: string
  cooldownMA: string
  allocatedBalance: string
  lockedCVA: string
  lockedLF: string
  lockedPartyAMM: string
  lockedPartyBMM: string

  pendingLockedCVA: string
  pendingLockedLF: string
  pendingLockedPartyAMM: string
  pendingLockedPartyBMM: string

  positionsCount: number
  pendingCount: number
  nonces: number
  quotesCount: number
  loading: boolean
  isError: boolean
}

export const initialUserPartyAStatDetail: UserPartyAStatDetail = {
  collateralBalance: '-',
  accountBalance: '-',
  liquidationStatus: false,
  accountBalanceLimit: '0',
  withdrawCooldown: '0',
  cooldownMA: '0',
  allocatedBalance: '0',
  lockedCVA: '0',
  lockedLF: '0',
  lockedPartyAMM: '0',
  lockedPartyBMM: '0',

  pendingLockedCVA: '0',
  pendingLockedLF: '0',
  pendingLockedPartyAMM: '0',
  pendingLockedPartyBMM: '0',

  positionsCount: 0,
  pendingCount: 0,
  nonces: 0,
  quotesCount: 80,
  loading: true,
  isError: false,
  account: '',
}

export type UserPartyAStatType = {
  [key: string]: UserPartyAStatDetail
}
