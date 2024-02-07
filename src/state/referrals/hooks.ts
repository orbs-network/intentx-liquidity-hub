import { ApiState } from 'types/api'
import { ReferralUserAnalytics, ReferralUserInformation } from './types'
import { useAppSelector } from 'state'
import { EPOCH_VIRTUAL_POINTS } from 'constants/tradingIncentives'

export function useUserReferralAccountInfo() {
  const accountInfo: ReferralUserInformation | null = useAppSelector((state) => {
    return state.referrals.userInformation
  })
  const fetchStatus: ApiState = useAppSelector((state) => {
    return state.referrals.userFetchState
  })
  return {
    accountInfo,
    fetchStatus,
  }
}

export function useUserReferralAnalyticsInfo() {
  const analyticsInfo: ReferralUserAnalytics | null = useAppSelector((state) => {
    return state.referrals.userAnalytics
  })
  const fetchStatus: ApiState = useAppSelector((state) => {
    return state.referrals.userAnalyticsFetchState
  })
  return {
    analyticsInfo,
    fetchStatus,
  }
}

export function useBonusPointsObtainedWithTheReferrals() {
  const analyticsInfo: ReferralUserAnalytics | null = useAppSelector((state) => {
    return state.referrals.userAnalytics
  })
  const fetchStatus: ApiState = useAppSelector((state) => {
    return state.referrals.userAnalyticsFetchState
  })

  if (fetchStatus === ApiState.OK && analyticsInfo) {
    const { dailyEpochReferralsVolume, platformVirtualVolume } = analyticsInfo

    const dailyEpochReferralsVolumeNumber = parseFloat(dailyEpochReferralsVolume)
    const platformVirtualVolumeNumber = parseFloat(platformVirtualVolume)

    return (dailyEpochReferralsVolumeNumber / platformVirtualVolumeNumber) * EPOCH_VIRTUAL_POINTS
  } else {
    return null
  }
}
