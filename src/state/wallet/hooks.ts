import { useMemo, useCallback } from 'react'
import JSBI from 'jsbi'
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'

import { useMultiCall3Contract } from 'hooks/useContract'
import { useMultipleContractSingleData, useSingleContractMultipleData } from 'lib/hooks/multicall'

import { isAddress } from 'utils/validate'
import { Wallet } from './types'
import { useAppDispatch, useAppSelector } from 'state'
import { addConnectedWallet } from './reducer'
import { erc20ABI } from 'wagmi'

import { getSingleWagmiResult } from 'utils/multicall'
import { nativeOnChain } from 'utils/token'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'

//TODO: check gas
// const tokenBalancesGasRequirement = { gasRequired: 185_000 }

export function useConnectedWallets(): [Wallet[], (wallet: Wallet) => void] {
  const dispatch = useAppDispatch()
  const connectedWallets = useAppSelector((state) => state.wallets.connectedWallets)
  const addWallet = useCallback(
    (wallet: Wallet) => {
      dispatch(addConnectedWallet(wallet))
    },
    [dispatch]
  )
  return [connectedWallets, addWallet]
}

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useNativeCurrencyBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: CurrencyAmount<Currency> | undefined
} {
  const { chainId } = useActiveConnectionDetails()
  const multicallContract = useMultiCall3Contract()

  const validAddressInputs: [string][] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
            .map((addr) => [addr])
        : [],
    [uncheckedAddresses]
  )

  const { data: results } = useSingleContractMultipleData(multicallContract, 'getEthBalance', validAddressInputs)

  return useMemo(
    () =>
      validAddressInputs.reduce<{ [address: string]: CurrencyAmount<Currency> }>((memo, [address], i) => {
        const value = getSingleWagmiResult(results, i)
        if (value && chainId)
          memo[address] = CurrencyAmount.fromRawAmount(nativeOnChain(chainId), JSBI.BigInt(value.toString()))
        return memo
      }, {}),
    [validAddressInputs, chainId, results]
  )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const { chainId } = useActiveConnectionDetails() // we cannot fetch balances cross-chain
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false && t?.chainId === chainId) ?? [],
    [chainId, tokens]
  )
  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens])

  const { data: balances, isLoading: anyLoading } = useMultipleContractSingleData(
    validatedTokenAddresses,
    erc20ABI,
    'balanceOf',
    useMemo(() => (address ? [address] : []), [address]),
    { watch: true, cacheTime: 4_000 }
  )

  return useMemo(
    () => [
      address && validatedTokens.length > 0
        ? validatedTokens.reduce<{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }>((memo, token, i) => {
            const value = getSingleWagmiResult(balances, i)
            const amount = value ? JSBI.BigInt(value.toString()) : undefined

            if (amount) {
              memo[token.address] = CurrencyAmount.fromRawAmount(token, amount)
            }
            return memo
          }, {})
        : {},
      anyLoading,
    ],
    [address, validatedTokens, anyLoading, balances]
  )
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): CurrencyAmount<Token> | undefined {
  const tokenBalances = useTokenBalances(account, [token])
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency?.isToken ?? false) ?? [],
    [currencies]
  )

  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some((currency) => currency?.isNative) ?? false, [currencies])
  const ethBalance = useNativeCurrencyBalances(useMemo(() => (containsETH ? [account] : []), [containsETH, account]))

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined
        if (currency.isToken) return tokenBalances[currency.address]
        if (currency.isNative) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount<Currency> | undefined {
  return useCurrencyBalances(account, [currency])[0]
}
