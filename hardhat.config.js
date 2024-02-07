/* eslint-env node */
import { ChainId } from '@uniswap/sdk-core'
import dotenv from 'dotenv'
dotenv.config()

const forkingConfig = {
  httpHeaders: {
    Origin: 'localhost:3000', // infura allowlists requests by origin
  },
}

const forks = {
  [ChainId.MAINNET]: {
    url: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
    blockNumber: 1,
    ...forkingConfig,
  },
  [ChainId.POLYGON]: {
    url: `https://polygon-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
    blockNumber: 2,
    ...forkingConfig,
  },
  [ChainId.BNB]: {
    url: `https://bsc.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
    blockNumber: 3,
    ...forkingConfig,
  },
  [ChainId.BASE]: {
    url: `https://lingering-quick-meadow.base-mainnet.quiknode.pro/861b5b015f10e20fa3ed03b95118b43fabac9ffe/`,
    blockNumber: 3,
    ...forkingConfig,
  },
}

module.exports = {
  forks,
  networks: {
    hardhat: {
      chainId: ChainId.BASE,
      forking: forks[ChainId.BASE],
      accounts: {
        count: 2,
      },
      mining: {
        auto: true, // automine to make tests easier to write.
        interval: 0, // do not interval mine so that tests remain deterministic
      },
    },
  },
}
