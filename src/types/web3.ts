import { TransactionStatusResponse } from '@gelatonetwork/relay-sdk'
import { TransactionCallbackState } from 'utils/web3'
import { Address, Hash } from 'viem'

export type ConstructCallReturnType = Promise<{
  args: ReadonlyArray<any>
  functionName: string
  config: {
    account: `0x${string}`
    to: `0x${string}`
    data: `0x${string}`
    value: bigint
  }
}>

export type ContractCallData = {
  to: `0x${string}`
  data: `0x${string}`
  value: bigint
}

export type TransactionCallback = {
  state: TransactionCallbackState
  callback: null | (() => Promise<any>)
  // error: string | null
}

export type AACallbackTransactionInfo = {
  callback: undefined | (() => Promise<string | undefined>) // RETURNS TX HASH
  txHash: Hash | undefined
  isLoading: boolean
}

export type CallbackTransactionInfo = {
  callback: null | (() => Promise<string>) // RETURNS TX HASH
  txHash: string | undefined
  callbackError?: any | undefined
  isLoading: boolean
}

export type CombinedTransactionData = {
  data: `0x${string}` | any
  value: string
  to: Address
}

export type CombinedTransactionCallbackInfo = {
  callback: null | (() => Promise<string | undefined>) // RETURNS TX HASH
  txHash: string | undefined
  callbackError?: any
  isLoading: boolean
}
