import { RetryOptions } from 'utils/retry'
import { SupportedChainId } from 'constants/chains'

export const DEFAULT_RETRY_OPTIONS: RetryOptions = { n: 1, minWait: 0, maxWait: 0 }

export const AVERAGE_L1_BLOCK_TIME = 12000

// Only applies to L2
export const RETRY_OPTIONS_BY_CHAIN_ID: { [chainId: number]: RetryOptions } = {
  [SupportedChainId.ARBITRUM]: { n: 10, minWait: 250, maxWait: 1000 },
  [SupportedChainId.FANTOM]: { n: 10, minWait: 250, maxWait: 1000 },
  [SupportedChainId.BSC]: { n: 10, minWait: 250, maxWait: 1000 },
  [SupportedChainId.BSC_TESTNET]: { n: 10, minWait: 250, maxWait: 1000 },
  [SupportedChainId.BASE]: { n: 10, minWait: 250, maxWait: 1000 },
}

export const AddressZero = '0x0000000000000000000000000000000000000000'
export const MAX_UINT256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

// transaction popup dismissal amounts
export const DEFAULT_TXN_DISMISS_MS = 25000
export const L2_TXN_DISMISS_MS = 5000

export const TRANSACTION_SOFT_FAIL_SECONDS = 500
export const TRANSACTION_FORCE_CLOSE_COOLDOWN_SECONDS = 60 * 5 // 5 minutes
export const TRANSACTION_FORCE_CANCEL_COOLDOWN_SECONDS = 60 * 5 // 5 minutes
export const TRANSACTION_FORCE_CANCEL_CLOSE_COOLDOWN_SECONDS = 60 * 5 // 5 minutes