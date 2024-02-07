import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

import { APP_NAME } from 'config'
import { APP_CHAINS } from 'constants/chains'

export const getWagmiConfig = () => {
  if (!process.env.NEXT_PUBLIC_INFURA_KEY) {
    throw new Error('NEXT_PUBLIC_INFURA_KEY not provided')
  }

  if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
    throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID not provided')
  }

  //TODO  use our rpcUrls like bellow
  /**
   [
    jsonRpcProvider({
      rpc: (chain) => ({ http: getRpcUrl(chain.id as SupportedChainId) }),
    }),
    publicProvider(),
  ],
   */
  const { chains, publicClient } = configureChains(
    APP_CHAINS,
    // [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY }), publicProvider()],
    [publicProvider()],
    {
      batch: { multicall: true },
      retryCount: 5,
      pollingInterval: 5_000,
      stallTimeout: 5_000,
    }
  )

  const connectors = connectorsForWallets([
    {
      groupName: 'Recommended',
      wallets: [
        rabbyWallet({ chains }),
        metaMaskWallet({ chains, projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID }),
        injectedWallet({ chains }),
        coinbaseWallet({ chains, appName: APP_NAME }),
        walletConnectWallet({ chains, projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID }),
      ],
    },
    {
      groupName: 'More',
      wallets: [
        braveWallet({ chains }),
        rainbowWallet({ chains, projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID }),
        trustWallet({ chains, projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID }),
        ledgerWallet({ chains, projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID }),
      ],
    },
  ])

  return {
    wagmiConfig: createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    }),
    chains,
    initialChain: chains[0],
  }
}
