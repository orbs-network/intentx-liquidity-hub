import { Address } from 'viem'

export type Chain = {
  id: string
  token: string
  rpcUrl: string
  shortName: string
  label: string
  color?: string
  icon?: string
  blockExplorerUrl: string
  transactionServiceUrl?: string
  isStripePaymentsEnabled: boolean // only available in Mumbai chain
  isMoneriumPaymentsEnabled: boolean // only available in Goerli chain
  faucetUrl?: string
  gelatoApiKey?: string
  nftAirdropAddress?: string
  allowedErc20FeeTokens?: {
    name: string
    address: Address
  }[]
}

export const baseChain: Chain = {
  id: '0x2105',
  token: 'ETH',
  shortName: 'eth',
  label: 'BASE',
  rpcUrl: 'https://mainnet.base.org',
  blockExplorerUrl: 'https://basescan.org',
  color: '#0052ff',
  transactionServiceUrl: 'https://safe-transaction-base.safe.global',
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: false,
  gelatoApiKey: 'HVOQmVlknmAC6vzfBgi8RuZ0V2WGnBWAysxKSpK7InY_',
  nftAirdropAddress: '0xc964d8fff001ce0783bc982e7c0d03f77e34e129',
  allowedErc20FeeTokens: [
    {
      name: 'WETH',
      address: '0x4200000000000000000000000000000000000006',
    },
    {
      name: 'USDbC',
      address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
    },
  ],
}

export const baseGoerliChain: Chain = {
  id: '0x14a33',
  token: 'ETH',
  shortName: 'eth',
  label: 'BASE Görli',
  rpcUrl: 'https://goerli.base.org',
  blockExplorerUrl: 'https://goerli.basescan.org',
  color: '#7aa5ff',
  transactionServiceUrl: 'https://safe-transaction-base-testnet.safe.global',
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: false,
  gelatoApiKey: 'M_d7pPwq78rMe3_3Nsp1iYQlryOaHu9Vxy6LT6aD_uQ_',
  nftAirdropAddress: '0x3EA9A2EcB6f3caD47a784f48D492a682DD8fE8A9',
  allowedErc20FeeTokens: [
    {
      name: 'WETH',
      address: '0x44D627f900da8AdaC7561bD73aA745F132450798',
    },
  ],
}

const chains: Chain[] = [baseChain, baseGoerliChain]

export const getChain = (chainId?: string) => {
  const chain = chains.find((chain) => chain.id === chainId)

  return chain
}

export const initialChain = baseChain

export default chains
