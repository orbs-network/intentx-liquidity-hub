import { IAdapter, UserInfo } from '@web3auth/base'
import {
  Web3AuthMPCCoreKit,
  WEB3AUTH_NETWORK,
  SubVerifierDetailsParams,
  COREKIT_STATUS,
  TssSecurityQuestion,
  Web3AuthOptions,
  keyToMnemonic,
  mnemonicToKey,
} from '@web3auth/mpc-core-kit'
import { ExternalProvider } from '@ethersproject/providers'
import type { LOGIN_TYPE, SubVerifierDetails } from '@toruslabs/customauth'

import { getErrorMessage } from '../../lib/errors'
import { Web3AuthConfig, Web3AuthEvent, Web3AuthEventListener } from './types'
import { AuthKitBasePack } from '../../AuthKitBasePack'
import type { AuthKitSignInData } from '../../types'
import BN from 'bn.js'

/**
 * Web3AuthMPCPack implements the SafeAuthClient interface for adapting the Web3Auth service provider
 * @class
 */
export class Web3AuthMPCPack extends AuthKitBasePack {
  #provider: ExternalProvider | null
  #config: Web3AuthConfig
  web3Auth?: Web3AuthMPCCoreKit
  #verifiers: SubVerifierDetails[]
  /**
   * Instantiate the Web3AuthMPCPack
   * @param config Web3Auth specific config
   */
  constructor(config: Web3AuthConfig, verifiers: SubVerifierDetails[]) {
    super()
    this.#config = config
    this.#provider = null
    this.#verifiers = verifiers
  }

  /**
   * Initialize the Web3Auth service provider
   * @param options Web3Auth options {@link https://web3auth.io/docs/sdk/web/modal/initialize#arguments}
   * @param adapters Web3Auth adapters {@link https://web3auth.io/docs/sdk/web/modal/initialize#configuring-adapters}
   * @param modalConfig The modal configuration {@link https://web3auth.io/docs/sdk/web/modal/whitelabel#whitelabeling-while-modal-initialization}
   * @throws Error if there was an error initializing Web3Auth
   */
  async init({ options }: { options: Web3AuthOptions }) {
    try {
      this.web3Auth = new Web3AuthMPCCoreKit(options)

      await this.web3Auth?.init()

      // await this.web3Auth.initModal({ modalConfig: modalConfig })

      this.#provider = this.web3Auth.provider
    } catch (e) {
      throw new Error(getErrorMessage(e))
    }
  }

  /**
   * Connect to the Web3Auth service provider
   * @returns The sign in data from the provider
   */
  async signIn(verifier: string): Promise<AuthKitSignInData> {
    if (!this.web3Auth) {
      throw new Error('Web3AuthMPCPack is not initialized')
    }

    const subVerifierDetails = this.#verifiers.find((v) => v.verifier === verifier)
    if (!subVerifierDetails) {
      throw new Error(`Verifier ${verifier} not found`)
    }

    const verifierConfig = {
      subVerifierDetails,
    } as SubVerifierDetailsParams

    await this.web3Auth.loginWithOauth(verifierConfig)

    const userInfo = await this.web3Auth.getUserInfo()
    const keyDetails = await this.web3Auth.getKeyDetails()

    // await this.web3Auth.inputFactorKey(
    //   new BN('c5c1c80efbc2388e7775cfad074e61da242616b40ba0eb5fa13035629982d0a4', 'hex')
    // )
    // const backupFactor = 'cupboard bundle soft next stuff slim invest fatal moment attend victory climb stock hunt oil swim admit utility scissors tragic swap kingdom cash fashion'
    // const factor = mnemonicToKey(backupFactor)
    // await this.web3Auth.inputFactorKey(new BN(factor, 'hex'))
    // console.log(this.web3Auth.state)
    // console.log(this.web3Auth.status)

    // const factorKey = await this.web3Auth.enableMFA({})
    // const factorKeyMnemonic = keyToMnemonic(factorKey)
    // console.log(`factorKeyMnemonic: ${factorKeyMnemonic}`)
    // enable mfa if not enabled
    // if (!userInfo?.mfaEnabled) {
    //   const securityQuestion = {
    //     question: 'What is your favorite color?',
    //     answer: 'blue',
    //   } as TssSecurityQuestion

    //   await this.web3Auth.enableMfa(securityQuestion)
    // }

    this.#provider = await this.web3Auth.provider

    const eoa = await this.getAddress()
    const safes = await this.getSafes(this.#config?.txServiceUrl || '')

    const signInData = {
      eoa,
      safes,
    }

    // // sign example data
    // const data = '0xdeadbeef'
    // this.web3Auth.provider?.send(
    //   {
    //     method: 'eth_sign',
    //     params: [eoa, data],
    //   },
    //   (err, res) => {
    //     debugger
    //     console.log(res, res)
    //   }
    // )

    return signInData
  }

  /**
   * Connect to the Web3Auth service provider
   * @returns The sign in data from the provider
   */
  async refreshSession(): Promise<AuthKitSignInData> {
    if (!this.web3Auth) {
      throw new Error('Web3AuthMPCPack is not initialized')
    }
    if (!this.web3Auth.state?.factorKey) {
      return {
        eoa: undefined,
        safes: [],
        session: false,
      }
    }
    const userInfo = await this.web3Auth.getUserInfo()
    const keyDetails = await this.web3Auth.getKeyDetails()

    this.#provider = await this.web3Auth.provider

    const eoa = await this.getAddress()
    const safes = await this.getSafes(this.#config?.txServiceUrl || '')

    const signInData = {
      eoa,
      safes,
      session: true,
    }

    return signInData
  }

  getProvider(): ExternalProvider | null {
    return this.#provider
  }

  /**
   * Disconnect from the Web3Auth service provider
   */
  async signOut() {
    if (!this.web3Auth) {
      throw new Error('Web3AuthMPCPack is not initialized')
    }

    this.#provider = null
    await this.web3Auth.logout()
  }

  /**
   * Get authenticated user information
   * @returns The user info
   */
  async getUserInfo(): Promise<Partial<UserInfo>> {
    if (!this.web3Auth) {
      throw new Error('Web3AuthMPCPack is not initialized')
    }

    const userInfo = await this.web3Auth.getUserInfo()

    return userInfo
  }

  /**
   * Allow to subscribe to the Web3Auth events
   * @param event The event you want to subscribe to (https://web3auth.io/docs/sdk/web/modal/initialize#subscribing-the-lifecycle-events)
   * @param handler The event handler
   */
  subscribe(event: Web3AuthEvent, handler: Web3AuthEventListener): void {
    // this.web3Auth(event, handler)
  }

  /**
   * Allow to unsubscribe to the Web3Auth events
   * @param event The event you want to unsubscribe to (https://web3auth.io/docs/sdk/web/modal/initialize#subscribing-the-lifecycle-events)
   * @param handler The event handler
   */
  unsubscribe(event: Web3AuthEvent, handler: Web3AuthEventListener): void {
    // this.web3Auth?.off(event, handler)
  }
}
