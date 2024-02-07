import Fuse from 'fuse.js'
import find from 'lodash/find'
import { useMemo } from 'react'
import { SelectSearchOption } from 'react-select-search'

import { useErrorMessages, useMarkets } from 'state/hedger/hooks'
import { useFavorites } from 'state/user/hooks'
import { Market } from 'types/market'

export function useMarket(id: number | undefined): Market | undefined {
  const markets = useMarkets()

  return useMemo(() => {
    if (!id) return undefined
    return find(markets, { id })
  }, [id, markets])
}

function fuzzySearch(options: SelectSearchOption[]) {
  const config = {
    keys: ['name', 'symbol'],
    threshold: 0.2,
  }

  const fuse = new Fuse(options, config)
  return (query: string) => {
    if (!query) {
      return options
    }

    return fuse.search(query)
  }
}

export function useFavoriteMarkets(): Market[] {
  const markets = useMarkets()
  const favorites = useFavorites()
  return useMemo(
    () => markets.filter((market: Market) => (favorites ? favorites.indexOf(market.symbol) !== -1 : -1)),
    [favorites, markets]
  )
}

export function useNeutralMarkets(): Market[] {
  const markets = useMarkets()
  const favorites = useFavorites()
  return useMemo(() => markets.filter((market: Market) => favorites?.indexOf(market.name) === -1), [favorites, markets])
}

export function useErrorMessage(code: number | null): string | undefined {
  const messages = useErrorMessages()
  return useMemo(() => {
    if (!code) return undefined

    let message = messages[code]

    
    if (message && message.includes('PartyB (Hedger) System experienced an unknown Request Processing Failure,')) {
      message = 'The solver was not able to fullfill your request. Please, increase your slippage and try again'
    }

    return message
  }, [code, messages])
}
