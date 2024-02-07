import BigNumber from 'bignumber.js'
import { toBN } from 'utils/numbers'

export function getMultipleBN(result: any): BigNumber[] {
  if (!result || !result.length) return []
  return result.map((r: bigint) => toBN(r.toString()))
}

//TODO: fix types
export function getSingleWagmiResult<T>(
  result?:
    | (
        | {
            error: Error
            result?: undefined
            status: 'failure'
          }
        | {
            error?: undefined
            result: unknown
            status: 'success'
          }
      )[]
    | undefined,
  index?: number
): T | null {
  return result && result[index || 0]?.status === 'success' ? (result[index || 0].result as T) : null
}
