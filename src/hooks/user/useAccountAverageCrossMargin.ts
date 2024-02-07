import BigNumber from 'bignumber.js'
import useAccountData from 'hooks/useAccountData'
import { useMemo } from 'react'
import { useMarketsInfo } from 'state/hedger/hooks'
import { usePositionsQuotes } from 'state/quotes/hooks'
import { toBN } from 'utils/numbers'

export default function useAccountAverageCrossMargin() {
  const { quotes: positions } = usePositionsQuotes()
  const { equity } = useAccountData()

  const marketsInfo = useMarketsInfo()

  const totalNotional = useMemo(
    () =>
      Object.values(positions).reduce((acc, position) => {
        const quantity = toBN(position.quantity).minus(position.closedAmount)
        const notional = quantity.times(position.marketPrice)
        return acc.plus(notional)
      }, BigNumber(0)),
    [positions]
  )

  const average = useMemo(() => {
    if (totalNotional.isZero()) return '0'
    return totalNotional.div(equity).toFixed(2)
  }, [totalNotional, equity])

  return average
}
