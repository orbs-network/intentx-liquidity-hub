import { Address } from 'viem'
import { APP_NAME, MUON_BASE_URLS } from '../config'
import { MuonClient } from './base'
import toast from 'react-hot-toast'

export class DeallocateClient extends MuonClient {
  constructor(app?: string) {
    super({ APP: app ?? APP_NAME, APP_METHOD: 'uPnl_A' })
  }

  static createInstance(isEnabled: boolean, app?: string): DeallocateClient | null {
    if (isEnabled) {
      return new DeallocateClient(app ?? APP_NAME)
    }
    return null
  }

  private _getRequestParams(account: string | null, chainId?: number, contractAddress?: string): string[][] | Error {
    if (!account) return new Error('Param `account` is missing.')
    if (!chainId) return new Error('Param `chainId` is missing.')
    if (!contractAddress) return new Error('Param `contractAddress` is missing.')

    return [
      ['partyA', account],
      ['chainId', chainId.toString()],
      ['symmio', contractAddress],
    ]
  }

  public async getMuonSig(account: string | null, chainId?: number, contractAddress?: string) {
    try {
      const requestParams = this._getRequestParams(account, chainId, contractAddress)
      if (requestParams instanceof Error) throw new Error(requestParams.message)
      console.info('Requesting data from Muon: ', requestParams)

      const toastId = toast.loading('requesting data from Muon...')
      let result, success

      for (const url of MUON_BASE_URLS) {
        try {
          const res = await this._sendRequest(url, requestParams)
          result = res.result
          success = res.success

          break // Exit the loop if successful
        } catch (error) {
          console.log('Retrying with the next URL...')
        }
      }

      toast.success('Muon responded', {
        id: toastId,
      })

      console.info('Response from Muon: ', result)

      if (!success) {
        throw new Error('')
      }

      const reqId = result['reqId'] as Address
      const timestamp = BigInt(result['data']['timestamp'])
      const upnl = BigInt(result['data']['result']['uPnl'])
      const gatewaySignature = result['nodeSignature'] as Address
      const signature = BigInt(result['signatures'][0]['signature'])
      const owner = result['signatures'][0]['owner'] as Address
      const nonce = result['data']['init']['nonceAddress'] as Address

      const generatedSignature = {
        reqId,
        timestamp,
        upnl,
        gatewaySignature,
        sigs: { signature, owner, nonce },
      }

      return { success: true, signature: generatedSignature }
    } catch (error) {
      console.error(error)
      toast.remove()
      toast.error('Unable to get response from Muon')
      return { success: false, error }
    }
  }
}
