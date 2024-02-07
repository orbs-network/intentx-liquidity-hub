import { CurrencyAmount, Token } from '@uniswap/sdk-core'

type TokenAddress = string

export type TokenBalancesMap = Record<TokenAddress, CurrencyAmount<Token>>

export interface Wallet {
  walletType: string
  account: string
}
