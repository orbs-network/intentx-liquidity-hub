import { useEffect, useMemo } from 'react'
import { Address, useContractRead } from 'wagmi'

import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { Account } from 'types/user'
import { useMultiAccountContract } from './useContract'

import { useSupportedChainId } from 'lib/hooks/useSupportedChainId'

export function useUserAccounts() {
  const { account } = useActiveConnectionDetails()
  const MultiAccountContract = useMultiAccountContract()
  const isSupportedChainId = useSupportedChainId()
  const { accountLength } = useAccountsLength()

  const {
    data: accounts,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useContractRead({
    address: MultiAccountContract?.address,
    abi: MultiAccountContract?.abi,
    functionName: 'getAccounts',
    args: [account as Address, BigInt(0), BigInt(accountLength)],
    watch: true,
    enabled: Boolean(account) && Boolean(accountLength) && isSupportedChainId,
  })

  useEffect(() => {
    console.log('Fetched accounts ', accounts)
  }, [accounts])

  const accountsUnsorted = useMemo(() => {
    if (!accounts || !isSuccess || isError) return []
    return accounts.map(
      (acc: any) => ({ accountAddress: acc.accountAddress.toString(), name: acc.name, userWallet: account } as Account)
    )
  }, [accounts, isError, isSuccess, account])

  return useMemo(
    () => ({
      accounts: accountsUnsorted,
      isLoading,
      isError,
      error,
    }),
    [accountsUnsorted, error, isError, isLoading]
  )
}

export function useAccountsLength(): { accountLength: number; loading: boolean } {
  const isSupportedChainId = useSupportedChainId()

  const { account } = useActiveConnectionDetails()
  const MultiAccountContract = useMultiAccountContract()

  const { data, isLoading, isSuccess, isError } = useContractRead({
    address: MultiAccountContract?.address,
    abi: MultiAccountContract?.abi,
    functionName: 'getAccountsLength',
    args: [account as Address],
    watch: true,
    enabled: Boolean(account) && isSupportedChainId,
  })

  return useMemo(
    () => ({
      accountLength: isSuccess ? Number(data) : 0,
      loading: isLoading,
      isError,
    }),
    [data, isError, isLoading, isSuccess]
  )
}
