import { SupportedChainId } from 'constants/chains'
import { createApolloClient } from './index'

const baseClient = createApolloClient(`https://api.thegraph.com/subgraphs/name/navid-fkh/symmio_base`)
const baseClient082 = createApolloClient(`https://api.studio.thegraph.com/query/62472/intentx-main_082/version/latest`)

export function getActivityApolloClient(chainId: SupportedChainId) {
  switch (chainId) {
    case SupportedChainId.BASE:
      return baseClient082
    default:
      console.error(`${chainId} is not a supported subgraph network`)
      return null
  }
}

export function getJoinedActivityApolloClient(chainId: SupportedChainId) {
  switch (chainId) {
    case SupportedChainId.BASE:
      return [baseClient, baseClient082]
    default:
      console.error(`${chainId} is not a supported subgraph network`)
      return null
  }
}
