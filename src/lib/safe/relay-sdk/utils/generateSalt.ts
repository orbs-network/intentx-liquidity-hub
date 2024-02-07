import { keccak256 } from '@ethersproject/keccak256'
import { defaultAbiCoder } from '@ethersproject/abi'

export const generateSalt = (): string => {
  const randomSeed = Math.floor(Math.random() * 1000000)
  const dataEncoded = defaultAbiCoder.encode(
    ['uint256', 'uint256'],
    [randomSeed, new Date().getMilliseconds()]
  )
  return keccak256(dataEncoded)
}
