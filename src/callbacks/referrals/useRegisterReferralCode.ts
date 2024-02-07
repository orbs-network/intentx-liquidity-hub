import { REFERRALS_BACKEND_URL } from 'constants/apis'
import { useCallback } from 'react'
import { ReferralApiResponse } from 'types/api'

export default function useRegisterReferralCodeCallback() {
  return useCallback((referralCode: string, userAddress: string, registerSignature: string) => {
    return new Promise((resolve, reject) => {
      fetch(REFERRALS_BACKEND_URL + `/referrals/register`, {
        method: 'POST',
        body: JSON.stringify({
          referralCode,
          userAddress,
          registerSignature,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data: ReferralApiResponse<null>) => {
          if (data.success) {
            return resolve(data)
          }
          return reject(data.statusMessage)
        })
        .catch((err) => {
          console.error('Error fetching user referral info', err)
          return reject(err)
        })
    })
  }, [])
}
