import { ApiState } from 'types/api'

export type ReferralState = {
  // User API related info
  userFetchState: ApiState
  userInformation: ReferralUserInformation | null
  userAnalyticsFetchState: ApiState
  userAnalytics: ReferralUserAnalytics | null
}

export type ReferralUserInformation = {
  isRegistered: boolean
  referralCode: string
  canUseReferralCode: boolean
  whitelisted: boolean
}

export type ReferralUserAnalytics = {
  referralsCount: number
  dailyEpochReferralsVolume: string
  totalReferalsVolume: string
  platformVirtualVolume: string
}
