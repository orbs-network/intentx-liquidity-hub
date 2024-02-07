import { useMemo } from 'react'
import { Currency, Token } from '@uniswap/sdk-core'
import { useContractReads } from 'wagmi'
import { toBytes, hexToString } from 'viem'

import { TOKEN_SHORTHANDS, WRAPPED_NATIVE_CURRENCY } from 'constants/tokens'
import { isSupportedChain } from 'constants/chains'
import { DEFAULT_ERC20_DECIMALS } from 'utils/token'
import { isAddress } from 'utils/validate'
import { supportedChainId } from 'utils/supportedChainId'
import { getSingleWagmiResult } from 'utils/multicall'

import { useBytes32TokenContract, useERC20Contract } from 'hooks/useContract'
import useNativeCurrency from 'lib/hooks/useNativeCurrency'
import useActiveConnectionDetails from './useActiveConnectionDetails'

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/

function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && toBytes(bytes32)[31] === 0
    ? hexToString(bytes32 as `0x${string}`)
    : defaultValue
}

const UNKNOWN_TOKEN_SYMBOL = 'UNKNOWN'
const UNKNOWN_TOKEN_NAME = 'Unknown Token'

/**
 * Returns a Token from the tokenAddress.
 * Returns null if token is loading or null was passed.
 * Returns undefined if tokenAddress is invalid or token does not exist.
 */
export function useTokenFromActiveNetwork(tokenAddress: string | undefined): Token | null | undefined {
  const { chainId } = useActiveConnectionDetails()

  const formattedAddress = isAddress(tokenAddress)
  const tokenContract = useERC20Contract(formattedAddress ? formattedAddress : undefined)
  const tokenContractBytes32 = useBytes32TokenContract(formattedAddress ? formattedAddress : undefined)

  // Yo
  const { data, isLoading } = useContractReads({
    watch: false,
    cacheTime: 60 * 60 * 24 * 1000, // 24 hours,
    allowFailure: true,
    keepPreviousData: true,
    contracts: [
      { ...tokenContract, functionName: 'name' },
      { ...tokenContractBytes32, functionName: 'name' },
      { ...tokenContract, functionName: 'symbol' },
      { ...tokenContractBytes32, functionName: 'symbol' },
      { ...tokenContract, functionName: 'decimals' },
    ],
  })

  const parsedDecimals = useMemo(() => getSingleWagmiResult<number>(data, 4) ?? DEFAULT_ERC20_DECIMALS, [data])

  const parsedSymbol = useMemo(
    () =>
      parseStringOrBytes32(
        getSingleWagmiResult<string>(data, 2) || '',
        getSingleWagmiResult<string>(data, 3) || '',
        UNKNOWN_TOKEN_SYMBOL
      ),
    [data]
  )

  const parsedName = useMemo(
    () =>
      parseStringOrBytes32(
        getSingleWagmiResult<string>(data, 0) || '',
        getSingleWagmiResult<string>(data, 1) || '',
        UNKNOWN_TOKEN_NAME
      ),
    [data]
  )

  return useMemo(() => {
    // If the token is on another chain, we cannot fetch it on-chain, and it is invalid.
    if (typeof tokenAddress !== 'string' || !isSupportedChain(chainId) || !formattedAddress) return undefined
    if (isLoading || !chainId) return null

    return new Token(chainId, formattedAddress, parsedDecimals, parsedSymbol, parsedName)
  }, [chainId, tokenAddress, formattedAddress, isLoading, parsedDecimals, parsedSymbol, parsedName])
}

type TokenMap = { [address: string]: Token }

/**
 * Returns a Token from the tokenAddress.
 * Returns null if token is loading or null was passed.
 * Returns undefined if tokenAddress is invalid or token does not exist.
 */
export function useTokenFromMapOrNetwork(tokens: TokenMap, tokenAddress?: string | null): Token | null | undefined {
  const address = isAddress(tokenAddress)
  const token: Token | undefined = address ? tokens[address] : undefined

  const tokenFromNetwork = useTokenFromActiveNetwork(token ? undefined : address ? address : undefined)
  return tokenFromNetwork ?? token
}

/**
 * Returns a Currency from the currencyId.
 * Returns null if currency is loading or null was passed.
 * Returns undefined if currencyId is invalid or token does not exist.
 */
export function useCurrencyFromMap(tokens: TokenMap, currencyId?: string | null): Currency | null | undefined {
  const { chainId } = useActiveConnectionDetails()
  const nativeCurrency = useNativeCurrency()
  const isNative = Boolean(
    nativeCurrency && (currencyId?.toUpperCase() === 'ETH' || currencyId?.toUpperCase() === 'FTM')
  )

  const shorthandMatchAddress = useMemo(() => {
    const chain = supportedChainId(chainId)
    //TODO
    return chain && currencyId ? TOKEN_SHORTHANDS[currencyId.toUpperCase()]?.[chain] : undefined
  }, [chainId, currencyId])

  const token = useTokenFromMapOrNetwork(tokens, isNative ? undefined : shorthandMatchAddress ?? currencyId)

  if (currencyId === null || currencyId === undefined || !isSupportedChain(chainId)) return null
  // this case so we use our builtin wrapped token instead of wrapped tokens on token lists
  // const wrappedNative = nativeCurrency?.wrapped
  const wrappedNative = WRAPPED_NATIVE_CURRENCY[chainId]
  if (wrappedNative?.address?.toUpperCase() === currencyId?.toUpperCase()) return wrappedNative

  return isNative ? nativeCurrency : token
}
