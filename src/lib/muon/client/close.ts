import { toWei } from 'utils/numbers'
import { APP_NAME, MUON_BASE_URLS } from '../config'
import { MuonClient } from './base'
import { Address } from 'viem'
import toast from 'react-hot-toast'

export class ForceCloseQuotesClient extends MuonClient {
  constructor(app?: string) {
    super({ APP: app ?? APP_NAME, APP_METHOD: 'uPnlWithSymbolPrice' })
  }

  static createInstance(isEnabled: boolean, app?: string): ForceCloseQuotesClient | null {
    if (isEnabled) {
      return new ForceCloseQuotesClient(app ?? APP_NAME)
    }
    return null
  }

  private _getRequestParams(
    account: string | null,
    partyB: Address | null,
    symbolId: number | null,
    contractAddress?: string,
    chainId?: number
  ): string[][] | Error {
    if (!account) return new Error('Param `account` is missing.')
    if (!partyB) return new Error('Param `partyB` is missing.')
    if (!chainId) return new Error('Param `chainId` is missing.')
    if (!symbolId) return new Error('Param `symbolId` is missing.')
    if (!contractAddress) return new Error('Param `contractAddress` is missing.')

    return [
      ['chainId', chainId.toString()],
      ['symmio', contractAddress],
      ['partyA', account],
      ['partyB', partyB],
      ['symbolId', `${symbolId}`],
    ]
  }

  public async getMuonSig(
    account: string | null,
    partyB: Address | null,
    symbolId: number | null,
    contractAddress?: string,
    chainId?: number
  ) {
    try {
      const requestParams = this._getRequestParams(account, partyB, symbolId, contractAddress, chainId)
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
        console.log('in the succc')
        throw new Error('')
      }

      const reqId = result['reqId'] as Address
      const timestamp = BigInt(result['data']['timestamp'])
      const upnlPartyA = BigInt(result['data']['result']['uPnlA'])
      const upnlPartyB = BigInt(result['data']['result']['uPnlB'])
      const price = BigInt(result['data']['result']['price'])
      const gatewaySignature = result['nodeSignature'] as Address

      const signature = BigInt(result['signatures'][0]['signature'])
      const owner = result['signatures'][0]['owner'] as Address
      const nonce = result['data']['init']['nonceAddress'] as Address

      const generatedSignature = {
        reqId,
        timestamp,
        upnlPartyA,
        upnlPartyB,
        price: price ? price : toWei(0),
        gatewaySignature,
        sigs: { signature, owner, nonce },
      }

      return { success: true, signature: generatedSignature }
    } catch (error) {
      console.error(error)
      toast.remove()
      toast.error(error.message)
      return { success: false, error }
    }
  }
}
