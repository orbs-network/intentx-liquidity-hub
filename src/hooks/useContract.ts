import { Abi } from 'viem'
import { erc20ABI, erc721ABI } from 'wagmi'
import { useContract } from 'lib/hooks/contract'
import { ERC20_BYTES32_ABI, DIAMOND_ABI, MULTICALL3_ABI, MULTI_ACCOUNT_ABI, COLLATERAL_ABI } from 'constants/abi'
import { COLLATERAL_ADDRESS, DIAMOND_ADDRESS, MULTI_ACCOUNT_ADDRESS, MULTICALL3_ADDRESS } from 'constants/addresses'

/* ###################################
                        CloverField
################################### */

export function useCollateralContract() {
  return useContract(COLLATERAL_ADDRESS, COLLATERAL_ABI)
}

export function useDiamondContract() {
  return useContract(DIAMOND_ADDRESS, DIAMOND_ABI)
}

export function useMultiAccountContract() {
  return useContract(MULTI_ACCOUNT_ADDRESS, MULTI_ACCOUNT_ABI)
}

/* ###################################
                      THIRD PARTY
################################### */

export function useERC20Contract(tokenAddress: string | null | undefined) {
  return useContract(tokenAddress, erc20ABI)
}
export function useERC721Contract(tokenAddress: string | null | undefined, ABI?: Abi) {
  return useContract(tokenAddress, ABI ?? erc721ABI)
}

export function useBytes32TokenContract(tokenAddress?: string) {
  return useContract(tokenAddress, ERC20_BYTES32_ABI)
}

export function useMultiCall3Contract() {
  return useContract(MULTICALL3_ADDRESS, MULTICALL3_ABI)
}
