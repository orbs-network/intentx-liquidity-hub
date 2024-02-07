import { SupportedChainId } from 'constants/chains'
import { AddressMap, DecimalMap, SymbolMap } from 'utils/address'
import { Address } from 'viem'

/* ###################################
                      CloverField
################################### */

export const COLLATERAL_SYMBOL: SymbolMap = {
  [SupportedChainId.BASE]: 'USDC',
}

export const COLLATERAL_DECIMALS: DecimalMap = {
  [SupportedChainId.BASE]: 6,
}

export const COLLATERAL_ADDRESS: AddressMap = {
  [SupportedChainId.BASE]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
}

export const DIAMOND_ADDRESS: AddressMap = {
  [SupportedChainId.BASE]: '0x91Cf2D8Ed503EC52768999aA6D8DBeA6e52dbe43',
}

// OLD MULTIACCOUNT: 0x5de6949717f3aa8e0fbed5ce8b611ebcf1e44ae9
// NEW MULTIACCOUNT: 0x724796d2e9143920B1b58651B04e1Ed201b8cC98
export const MULTI_ACCOUNT_ADDRESS_0_8_0: AddressMap = {
  [SupportedChainId.BASE]: '0x724796d2e9143920B1b58651B04e1Ed201b8cC98',
}

export const MULTI_ACCOUNT_ADDRESS: AddressMap = {
  [SupportedChainId.BASE]: '0x8Ab178C07184ffD44F0ADfF4eA2ce6cFc33F3b86',
}

export const PARTY_B_WHITELIST: { [chainId: number]: readonly Address[] } = {
  [SupportedChainId.BASE]: ['0x9206D9d8F7F1B212A4183827D20De32AF3A23c59'],
}

/* ###################################
                THIRD PARTY ADDRESS
################################### */

export const MULTICALL3_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [SupportedChainId.ARBITRUM]: '0xadF885960B47eA2CD9B55E6DAc6B42b7Cb2806dB',
  [SupportedChainId.POLYGON]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [SupportedChainId.BSC]: '0x963Df249eD09c358A4819E39d9Cd5736c3087184',
  [SupportedChainId.FANTOM]: '0x8e7aceA52fE765D24FDC952400FC9Cf77ea0c8d9',
  [SupportedChainId.BSC_TESTNET]: '0x7C636D5611a6EA3B9eFA582ae0Db1DB93951446e',
  [SupportedChainId.BASE]: '0x66EC85c6d1971Ea15472754F733fA3F956a0Ec30',
}

/* ###################################
               TOKENS ADDRESS
################################### */

export const USDC_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [SupportedChainId.RINKEBY]: '0x49AC7cEDdb9464DA9274b164Cd6BA7129Da2C03E',
  [SupportedChainId.ARBITRUM]: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  [SupportedChainId.POLYGON]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  [SupportedChainId.FANTOM]: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  [SupportedChainId.BSC]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  [SupportedChainId.BASE]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
}

export const USDT_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
}

export const WRAPPED_NATIVE_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [SupportedChainId.RINKEBY]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  [SupportedChainId.ARBITRUM]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  [SupportedChainId.POLYGON]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  [SupportedChainId.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
  [SupportedChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  [SupportedChainId.BSC_TESTNET]: '0x5b3e2bc1da86ff6235d9ead4504d598cae77dbcb',
  [SupportedChainId.BASE]: '0x4200000000000000000000000000000000000006',
}
