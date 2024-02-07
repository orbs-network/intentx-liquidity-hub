import { Provider as ReduxProvider } from 'react-redux'
import { ModalProvider } from 'styled-react-modal'
import dynamic from 'next/dynamic'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { PersistGate } from 'redux-persist/integration/react'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import store, { persistor } from 'state'
import { BlockNumberProvider } from 'lib/hooks/useBlockNumber'

import 'swiper/css'
import 'swiper/css/pagination'
import { getWagmiConfig } from 'utils/wagmi'
import ThemeProvider, { ThemedGlobalStyle } from 'theme'
import Popups from 'components/Popups'
import Layout from 'components/Layout'
import { ModalBackground } from 'components/Modal'
import pjson from '../../package.json'
import ConnectionModal from 'components/Web3Status/ConnectionModal'
import { AAProvider } from 'state/accountAbstraction/provider/AAProvider'
import AAConnectingModal from 'components/Web3Status/ConnectionModal/AAConnectingModal'
import GoogleAnalytics from 'components/Analytics/GoogleAnalytics/GoogleAnalytics'
import PushNotifications from 'components/Notifications/PushNotifications'
const Updaters = dynamic(() => import('state/updaters'), { ssr: false })

if (typeof window !== 'undefined' && !!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

const { wagmiConfig, chains, initialChain } = getWagmiConfig()

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} initialChain={initialChain} showRecentTransactions={true}>
            <ThemeProvider>
              <ThemedGlobalStyle />
              <ModalProvider backgroundComponent={ModalBackground}>
                <AAProvider>
                  <Toaster position="bottom-center" />
                  {/* <PushNotifications /> Disabled until is fixed on browsers with no notification support */}
                  <BlockNumberProvider>
                    <Popups />
                    <Updaters />
                    <Layout>
                      <GoogleAnalytics trackingId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
                      <Component {...pageProps} />
                    </Layout>
                  </BlockNumberProvider>
                </AAProvider>
              </ModalProvider>
            </ThemeProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </PersistGate>
    </ReduxProvider>
  )
}
