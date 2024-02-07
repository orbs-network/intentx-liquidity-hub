import { SupportedChainId } from './chains'

const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY
if (typeof INFURA_KEY === 'undefined') {
  throw new Error(`NEXT_PUBLIC_INFURA_KEY must be a defined environment variable`)
}

/**
 * Fallback JSON-RPC endpoints.
 * These are used if the integrator does not provide an endpoint, or if the endpoint does not work.
 *
 * MetaMask allows switching to any URL, but displays a warning if it is not on the "Safe" list:
 * https://github.com/MetaMask/metamask-mobile/blob/bdb7f37c90e4fc923881a07fca38d4e77c73a579/app/core/RPCMethods/wallet_addEthereumChain.js#L228-L235
 * https://chainid.network/chains.json
 *
 * These "Safe" URLs are listed first, followed by other fallback URLs, which are taken from chainlist.org.
 */
export const FALLBACK_URLS: { [key in SupportedChainId]: string[] } = {
  [SupportedChainId.MAINNET]: [
    // "Safe" URLs
    'https://api.mycryptoapi.com/eth',
    'https://cloudflare-eth.com',
    // "Fallback" URLs
    'https://rpc.ankr.com/eth',
    'https://eth-mainnet.public.blastapi.io',
  ],
  [SupportedChainId.ROPSTEN]: [
    // "Fallback" URLs
    'https://rpc.ankr.com/eth_ropsten',
  ],
  [SupportedChainId.RINKEBY]: [
    // "Fallback" URLs
    'https://rinkeby-light.eth.linkpool.io/',
  ],
  [SupportedChainId.POLYGON]: [
    // "Safe" URLs
    'https://polygon-rpc.com/',
    'https://rpc-mainnet.maticvigil.com',
    'https://rpc-mainnet.matic.quiknode.pro',
    'https://matic-mainnet-full-rpc.bwarelabs.com',
  ],
  [SupportedChainId.ARBITRUM]: [
    // "Safe" URLs
    'https://arb1.arbitrum.io/rpc',
    // "Fallback" URLs
    'https://arbitrum.public-rpc.com',
  ],
  [SupportedChainId.BASE]: [
    // "Safe" URLs
    'https://mainnet.base.org',
    // "Fallback" URLs
    'https://1rpc.io/base',
  ],
  [SupportedChainId.FANTOM]: [
    // "Safe" URLs
    'https://rpc.ankr.com/fantom',
    // "Fallback" URLs
    'https://rpc.fantom.network',
    'https://rpc2.fantom.network',
    'https://rpc3.fantom.network',
    'https://rpcapi.fantom.network',
  ],
  [SupportedChainId.BSC]: [
    // "Safe" URLs
    'https://rpc.ankr.com/bsc',
    // "Fallback" URLs
    'https://bsc-dataseed1.ninicoin.io',
    'https://rpc-bsc.bnb48.club',
    'https://bsc-dataseed4.binance.org',
  ],
  [SupportedChainId.BSC_TESTNET]: [
    // "Safe" URLs
    'https://bsc-testnet.public.blastapi.io',
    'https://data-seed-prebsc-1-s1.binance.org:8545',
    // "Fallback" URLs
    'https://data-seed-prebsc-2-s1.binance.org:8545',
    'https://data-seed-prebsc-1-s2.binance.org:8545',
    'https://data-seed-prebsc-2-s2.binance.org:8545',
    'https://data-seed-prebsc-2-s3.binance.org:8545',
  ],
}

/**
 * Known JSON-RPC endpoints.
 * These are the URLs used by the interface when there is not another available source of chain data.
 */
export const RPC_URLS: { [key in SupportedChainId]: string[] } = {
  [SupportedChainId.MAINNET]: [
    `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.MAINNET],
  ],
  [SupportedChainId.RINKEBY]: [
    `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.RINKEBY],
  ],
  [SupportedChainId.ROPSTEN]: [
    `https://ropsten.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.ROPSTEN],
  ],
  [SupportedChainId.BSC]: [`https://bsc-dataseed.binance.org`, ...FALLBACK_URLS[SupportedChainId.BSC]],
  [SupportedChainId.BSC_TESTNET]: [
    `https://data-seed-prebsc-1-s3.binance.org:8545`,
    ...FALLBACK_URLS[SupportedChainId.BSC_TESTNET],
  ],
  [SupportedChainId.ARBITRUM]: [`https://mainnet.base.org`, ...FALLBACK_URLS[SupportedChainId.ARBITRUM]],
  [SupportedChainId.BASE]: [`https://arb1.arbitrum.io/rpc`, ...FALLBACK_URLS[SupportedChainId.BASE]],

  [SupportedChainId.POLYGON]: [
    `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.POLYGON],
  ],
  [SupportedChainId.FANTOM]: [`https://rpc.ftm.tools`, ...FALLBACK_URLS[SupportedChainId.FANTOM]],
}
