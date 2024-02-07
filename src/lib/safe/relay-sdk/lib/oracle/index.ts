import { ethers } from 'ethers'
import { axiosInstance, getHttpErrorMessage } from '../../utils'
import { Config } from '../types'

export const isOracleActive = async (
  payload: {
    chainId: bigint
  },
  config: Config
): Promise<boolean> => {
  const oracles = await getGelatoOracles(config)
  return oracles.includes(payload.chainId.toString())
}

export const getGelatoOracles = async (config: Config): Promise<string[]> => {
  try {
    return (await axiosInstance.get(`${config.url}/oracles/`)).data.oracles
  } catch (error) {
    throw new Error(`GelatoRelaySDK/getGelatoOracles: Failed with error: ${getHttpErrorMessage(error)}`)
  }
}

export const getPaymentTokens = async (payload: { chainId: bigint }, config: Config): Promise<string[]> => {
  try {
    return (await axiosInstance.get(`${config.url}/oracles/${payload.chainId.toString()}/paymentTokens/`)).data
      .paymentTokens
  } catch (error) {
    throw new Error(`GelatoRelaySDK/getPaymentTokens: Failed with error: ${getHttpErrorMessage(error)}`)
  }
}

export const getEstimatedFee = async (
  payload: {
    chainId: bigint
    paymentToken: string
    gasLimit: bigint
    isHighPriority: boolean
    gasLimitL1: bigint
  },
  config: Config
): Promise<bigint> => {
  const { chainId, gasLimit, paymentToken } = payload
  const params = {
    to: paymentToken,
  }
  try {
    const res = await axiosInstance.get(`${config.url}/oracles/${chainId.toString()}/conversionRate`, {
      params,
    })
    const details = {
      numerator: BigInt(res.data.details.numerator),
      denominator: BigInt(res.data.details.denominator),
    }
    // (gasLimit * gasPrice) + (gasLimitL1 * gasPriceL1 * L1FeeScalar)

    const L2Provider = new ethers.providers.JsonRpcProvider('https://base.publicnode.com')
    const L2GasPrice = (await L2Provider.getGasPrice()).toBigInt()
    console.log(L2GasPrice.toString())

    const L1Provider = new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com')
    const L1GasPrice = (await L1Provider.getGasPrice()).toBigInt()
    console.log(L1GasPrice.toString())

    // Scalar: 0.684

    const gasLimitL1 = 15000n
    const gasCostEth = gasLimit * L2GasPrice + (gasLimitL1 * L1GasPrice * BigInt(684)) / BigInt(1000)
    console.log(gasCostEth.toString())

    // +10% for high priority
    const gasCostToken = (gasCostEth * details.numerator) / details.denominator
    const gasCostTokenGelatoPremium = gasCostToken + (gasCostToken * BigInt(10)) / BigInt(100)
    console.log(gasCostTokenGelatoPremium.toString())

    return gasCostTokenGelatoPremium
  } catch (error) {
    throw new Error(`GelatoRelaySDK/getEstimatedFee: Failed with error: ${getHttpErrorMessage(error)}`)
  }
}
