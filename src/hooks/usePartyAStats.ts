import { COLLATERAL_ADDRESS } from 'constants/addresses'
import { useSingleContractMultipleMethods } from 'lib/hooks/multicall'
import { useToken } from 'lib/hooks/useTokens'

import { useSupportedChainId } from 'lib/hooks/useSupportedChainId'
import { useTokenBalance } from 'state/wallet/hooks'

import { getMultipleBN, getSingleWagmiResult } from 'utils/multicall'
import { fromWei } from 'utils/numbers'

import { useDiamondContract } from 'hooks/useContract'
import { useMemo } from 'react'
import { UserPartyAStatDetail } from 'types/user'

//TODO why its not covered by useMemo
//we converted all BigNumbers to string to avoid spurious rerenders
export function usePartyAStats(account: string | null | undefined): UserPartyAStatDetail {
  const isSupportedChainId = useSupportedChainId()
  const DiamondContract = useDiamondContract()

  const cToken = useToken(COLLATERAL_ADDRESS)

  const partyAStatsCallsFirstCall = isSupportedChainId
    ? !account
      ? []
      : [
          {
            functionName: 'balanceOf',
            callInputs: [account],
          },
          {
            functionName: 'partyAStats',
            callInputs: [account],
          },
        ]
    : []

  const partyAStatsCallsSecondCall = isSupportedChainId
    ? !account
      ? []
      : [
          {
            functionName: 'getBalanceLimitPerUser',
            callInputs: [],
          },
          {
            functionName: 'withdrawCooldownOf',
            callInputs: [account],
          },
          {
            functionName: 'coolDownsOfMA',
            callInputs: [],
          },
        ]
    : []

  const cBalance = useTokenBalance(account ?? undefined, cToken ?? undefined)?.toExact() || '0'

  const {
    data: firstData,
    isLoading: isFirstCallLoading,
    isError: isFirstCallError,
  } = useSingleContractMultipleMethods(DiamondContract, partyAStatsCallsFirstCall, {
    watch: true,
    enabled: partyAStatsCallsFirstCall.length > 0,
  })

  const {
    data: secondData,
    isLoading: isSecondCallLoading,
    isError: isSecondCallError,
  } = useSingleContractMultipleMethods(DiamondContract, partyAStatsCallsSecondCall, {
    watch: true,
    enabled: partyAStatsCallsSecondCall.length > 0,
  })

  const loading = isFirstCallLoading || isSecondCallLoading || !firstData || !secondData

  const isError = isFirstCallError || isSecondCallError

  const multipleBNResult = getMultipleBN(firstData?.[1]?.result)

  return useMemo(
    () => ({
      account: account ?? '',
      collateralBalance: cBalance,

      accountBalance: fromWei(getSingleWagmiResult(firstData, 0)),
      liquidationStatus: getSingleWagmiResult<boolean[]>(firstData, 1)?.[0] ?? false,

      accountBalanceLimit: fromWei(getSingleWagmiResult(secondData, 0)),
      withdrawCooldown: getSingleWagmiResult(secondData, 1)?.toString() ?? '0',
      cooldownMA: getMultipleBN(secondData?.[2]?.result)[0]?.toString() ?? '0',
      allocatedBalance: fromWei(multipleBNResult[1]),
      lockedCVA: fromWei(multipleBNResult[2]),
      lockedLF: fromWei(multipleBNResult[3]),
      lockedPartyAMM: fromWei(multipleBNResult[4]),
      lockedPartyBMM: fromWei(multipleBNResult[5]),

      pendingLockedCVA: fromWei(multipleBNResult[6]),
      pendingLockedLF: fromWei(multipleBNResult[7]),
      pendingLockedPartyAMM: fromWei(multipleBNResult[8]),
      pendingLockedPartyBMM: fromWei(multipleBNResult[9]),

      positionsCount: multipleBNResult[10]?.toNumber() ?? 0,
      pendingCount: multipleBNResult[11]?.toNumber() ?? 0,
      nonces: multipleBNResult[12]?.toNumber() ?? 0,
      quotesCount: (multipleBNResult[13]?.toNumber() ?? 75) + 5,
      loading,
      isError,
    }),
    [cBalance, firstData, secondData, multipleBNResult, loading, isError, account]
  )
}
