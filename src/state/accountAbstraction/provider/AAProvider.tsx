import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'

import {
  Web3AuthMPCCoreKit,
  SubVerifierDetailsParams,
  COREKIT_STATUS,
  TssSecurityQuestion,
} from '@web3auth/mpc-core-kit'
import { ChainNamespaceType, CustomChainConfig, SafeEventEmitterProvider, UserInfo } from '@web3auth/base'
import Web3 from 'web3'
import { ethers } from 'ethers'
import { Web3AuthMPCPack } from 'lib/safe/auth-kit'
import AccountAbstraction from 'lib/safe/AccountAbstraction'
import { GelatoRelayPack } from 'lib/safe/relay-kit'
import { getChain, initialChain } from 'constants/safeChainInfo'
import Safe from '@safe-global/protocol-kit'
import { Abi, Address, encodeFunctionData, parseAbi } from 'viem'
import { MetaTransactionData, MetaTransactionOptions, OperationType } from '@safe-global/safe-core-sdk-types'
import { SubVerifierDetails, LOGIN } from '@toruslabs/customauth'
import { ERC20_ABI } from 'constants/abi'
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN, WEB3AUTH_CLIENT_ID, WEB3AUTH_NETWORK } from 'constants/accountAbstraction'

export enum AALoginProvider {
  GOOGLE,
}

export type IAAContextType = {
  // Account abstraction connection
  userInfo: Partial<UserInfo>
  isSafeDeployed: boolean
  isConnected: boolean
  isReady: boolean
  isRefreshing: boolean
  ownerAddress: Address | undefined
  safeSelected: Address | undefined
  loginWeb3Auth: (accountType?: AccountType) => Promise<void>
  logoutWeb3Auth: () => void
  accountType?: AccountType
  isConnecting: boolean

  // Providers
  web3Provider: ethers.providers.Web3Provider | undefined
  safeAccountAbstraction: AccountAbstraction | undefined
  safeSdk: Safe | undefined
  gelatoRelayPack?: GelatoRelayPack
  web3AuthMPCPack?: Web3AuthMPCPack
}

const AAContext = createContext<IAAContextType>({} as IAAContextType)

export const useAA = () => {
  const context = useContext(AAContext)

  if (!context) {
    throw new Error('Missing AAContext')
  }

  return context
}

export enum AccountType {
  GOOGLE = 'google-auth0-jwt',
  GOOGLE_TEST = 'google-intentx',
  APPLE = 'apple-auth0-jwt',
  DISCORD = 'discord-intent',
}

export const AAProvider = ({ children }: { children: React.ReactNode }) => {
  const [accountType, setAccountType] = useState<AccountType>()
  const [web3Provider, setWeb3Provider] = useState<ethers.providers.Web3Provider>()
  const [isReady, setIsReady] = useState<boolean>(false)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  // const [coreKitInstance, setCoreKitInstance] = useState<Web3AuthMPCCoreKit | null>(null)

  // Safe wallet parameters
  const [isSafeDeployed, setIsSafeDeployed] = useState<boolean>(false)
  const [safeSdk, setSafeSdk] = useState<Safe>()
  const [ownerAddress, setOwnerAddress] = useState<Address>()
  const [safes, setSafes] = useState<string[]>([])

  // chain selected
  const [chainId, setChainId] = useState<string>(() => {
    return initialChain.id
  })
  const isConnected = !!ownerAddress && !!chainId
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const chain = getChain(chainId) || initialChain
  const [web3AuthMPCPack, setWeb3AuthMPCPack] = useState<Web3AuthMPCPack>()
  const [safeSelected, setSafeSelected] = useState<Address>()
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({})

  // Gelato configuration
  const gelatoRelayPack = useMemo<GelatoRelayPack>(() => {
    const gelatoRelayPack = new GelatoRelayPack(chain.gelatoApiKey)
    return gelatoRelayPack
  }, [chain])

  const [safeAccountAbstraction, setSafeAccountAbstraction] = useState<AccountAbstraction>()

  useEffect(() => {
    const initWeb3Provider = async () => {
      if (web3Provider) {
        const signer = web3Provider.getSigner()
        const safeAccountAbstraction = new AccountAbstraction(signer)
        await safeAccountAbstraction.init({ relayPack: gelatoRelayPack })
        setSafeAccountAbstraction(safeAccountAbstraction)
      }
    }

    initWeb3Provider()
  }, [web3Provider, gelatoRelayPack])

  useEffect(() => {
    setOwnerAddress(undefined)
    setSafes([])
    setChainId(chain.id)
    setWeb3Provider(undefined)
    // setSafeSelected('')
  }, [chain])

  // Initialize web3auth MPC Pack AuthKit
  useEffect(() => {
    if (web3AuthMPCPack) return
    ;(async () => {
      const chainConfig: CustomChainConfig = {
        chainNamespace: 'eip155',
        chainId: chain.id,
        rpcTarget: chain.rpcUrl,
        displayName: chain.label,
        blockExplorer: chain.blockExplorerUrl,
        ticker: chain.token,
        tickerName: chain.token,
      }

      const verifiers: SubVerifierDetails[] = [
        {
          typeOfLogin: LOGIN.JWT,
          verifier: AccountType.GOOGLE,
          // clientId: '77661664595-b9l7cblv83muermfn9ldu3q79g9idaht.apps.googleusercontent.com',
          clientId: AUTH0_CLIENT_ID,
          jwtParams: {
            redirect_uri: `${window.location.origin}/auth`,
            domain: AUTH0_DOMAIN,
            connection: 'google-oauth2',
            verifierIdField: 'email',
            scope: 'read:current_user openid profile email',
          },
        },
        {
          typeOfLogin: LOGIN.JWT,
          verifier: AccountType.GOOGLE_TEST,
          // clientId: '77661664595-b9l7cblv83muermfn9ldu3q79g9idaht.apps.googleusercontent.com',
          clientId: AUTH0_CLIENT_ID,
          jwtParams: {
            redirect_uri: `${window.location.origin}/auth`,
            domain: AUTH0_DOMAIN,
            connection: 'google-oauth2',
            verifierIdField: 'email',
            scope: 'read:current_user openid profile email',
          },
        },
        // {
        //   typeOfLogin: 'google',
        //   verifier: AccountType.GOOGLE_TEST,
        //   clientId: '77661664595-b9l7cblv83muermfn9ldu3q79g9idaht.apps.googleusercontent.com',
        // },
        {
          typeOfLogin: LOGIN.APPLE,
          verifier: AccountType.APPLE,
          clientId: AUTH0_CLIENT_ID,
          jwtParams: {
            redirect_uri: `${window.location.origin}/auth`,
            domain: AUTH0_DOMAIN,
            connection: 'apple',
            verifierIdField: 'email',
            scope: 'read:current_user openid profile email',
          },
        },
      ]

      const web3AuthMPCPack = new Web3AuthMPCPack(
        {
          txServiceUrl: chain.transactionServiceUrl,
        },
        verifiers
      )
      await web3AuthMPCPack.init({
        options: {
          web3AuthClientId: WEB3AUTH_CLIENT_ID,
          web3AuthNetwork: WEB3AUTH_NETWORK,
          uxMode: 'redirect',
          redirectPathName: 'auth',
          baseUrl: `${window.location.origin}`,
          chainConfig,
          // storageKey: 'local',
        },
      })
      setWeb3AuthMPCPack(web3AuthMPCPack)
      // setUserInfo(userInfo)
      // setChainId(chain.id)
      // setOwnerAddress(eoa as Address)
      // setSafes(safes || [])

      try {
        setIsRefreshing(true)
        const { safes, eoa } = await web3AuthMPCPack.refreshSession()
        if (!eoa) {
          return
        }
        // const { safes, eoa } = await web3AuthMPCPack.recoverAccount(
        //   'cupboard bundle soft next stuff slim invest fatal moment attend victory climb stock hunt oil swim admit utility scissors tragic swap kingdom cash fashion'
        // )

        const userInfo = await web3AuthMPCPack.getUserInfo()
        const provider = web3AuthMPCPack.getProvider() as ethers.providers.ExternalProvider

        // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
        setChainId(chain.id)
        setOwnerAddress(eoa as Address)
        setAccountType(userInfo?.verifier as AccountType)
        setSafes(safes || [])
        setWeb3Provider(new ethers.providers.Web3Provider(provider))
        setUserInfo(userInfo)
      } catch (error) {
        setAccountType(undefined)
        console.log('error: ', error)
      } finally {
        setIsReady(true)
        setIsRefreshing(false)
      }
    })()
  }, [chain])

  // Initialize Account Abstraction Kit
  useEffect(() => {
    const getSafeAddress = async () => {
      if (web3Provider && safeAccountAbstraction) {
        const signer = web3Provider.getSigner()
        const relayPack = new GelatoRelayPack()
        const hasSafes = safes.length > 0
        const safeSelected = hasSafes ? safes[0] : await safeAccountAbstraction.getSafeAddress()
        // console.log('safeSelected: ', safeSelected, await safeAccountAbstraction.getSafeAddress())
        const _safeSdk = await safeAccountAbstraction.getSafeSdk()
        const isSafeDeployed = await safeAccountAbstraction?.isSafeDeployed()
        setIsSafeDeployed(isSafeDeployed)
        setSafeSdk(_safeSdk)
        // console.log('safeSdk: ', await _safeSdk?.getAddress())
        setSafeSelected(safeSelected as Address)
      }
    }

    getSafeAddress()
  }, [safes, web3Provider, safeAccountAbstraction])

  const loginWeb3Auth = useCallback(
    async (accountType?: AccountType) => {
      if (!web3AuthMPCPack) return
      if (isConnected) {
        throw new Error("You're already connected, logout first")
      }

      if (!accountType) {
        throw new Error('Invalid Account Type')
        // return
      }

      try {
        setIsConnecting(true)
        setAccountType(accountType)

        const { safes, eoa } = await web3AuthMPCPack.signIn(accountType)
        // const { safes, eoa } = await web3AuthMPCPack.recoverAccount(
        //   'cupboard bundle soft next stuff slim invest fatal moment attend victory climb stock hunt oil swim admit utility scissors tragic swap kingdom cash fashion'
        // )
        const userInfo = await web3AuthMPCPack.getUserInfo()
        const provider = web3AuthMPCPack.getProvider() as ethers.providers.ExternalProvider

        // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
        setChainId(chain.id)
        setOwnerAddress(eoa as Address)
        setSafes(safes || [])
        setWeb3Provider(new ethers.providers.Web3Provider(provider))
        setUserInfo(userInfo)
      } catch (error) {
        setAccountType(undefined)
        console.error('error: ', error)
      } finally {
        setIsConnecting(false)
      }
    },
    [chain, web3AuthMPCPack, isConnected]
  )

  // auto login
  // useEffect(() => {
  //   if (web3AuthMPCPack && web3AuthMPCPack.getProvider()) {
  //     ;(async () => {
  //       await loginWeb3Auth()
  //     })()
  //   }
  // }, [web3AuthMPCPack, loginWeb3Auth])

  const logoutWeb3Auth = useCallback(() => {
    web3AuthMPCPack?.signOut()
    setOwnerAddress(undefined)
    setSafes([])
    setChainId(chain.id)
    setWeb3Provider(undefined)
    setSafeSelected(undefined)
    // setGelatoTaskId(undefined)
  }, [chain, web3AuthMPCPack])

  const memoedValue = useMemo(
    () => ({
      // Account abstraction connection
      userInfo,
      accountType,
      isConnected,
      isReady,
      isRefreshing,
      isSafeDeployed,
      ownerAddress,
      safeSelected,
      loginWeb3Auth,
      logoutWeb3Auth,
      isConnecting,

      // Providers
      web3Provider,
      safeAccountAbstraction,
      safeSdk,
      gelatoRelayPack,
      web3AuthMPCPack,
      // Smart contract functions
    }),
    [
      // Account abstraction connection
      userInfo,
      accountType,
      isConnected,
      isReady,
      isRefreshing,
      isSafeDeployed,
      ownerAddress,
      safeSelected,
      loginWeb3Auth,
      logoutWeb3Auth,
      isConnecting,

      // Providers
      web3Provider,
      safeAccountAbstraction,
      safeSdk,
      gelatoRelayPack,
      web3AuthMPCPack,
    ]
  )

  return <AAContext.Provider value={memoedValue}>{children}</AAContext.Provider>
}
