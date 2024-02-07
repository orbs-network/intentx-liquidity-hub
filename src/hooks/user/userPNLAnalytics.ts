import getOperationPNL from 'lib/operations/getOperationPNL'
import { useMemo } from 'react'
import { useHistoricalResultEntities } from 'state/user/hooks'
import { ApiState } from 'types/api'
import { toBN } from 'utils/numbers'

export function useUserCummulativePNL(): number {
  const { historicalResultEntities, historicalResultEntitiesState } = useHistoricalResultEntities()
  const cummulativePNL = useMemo(() => {
    if (historicalResultEntitiesState !== ApiState.OK) return 0

    return historicalResultEntities.reduce((acc, entity) => {
      const operationPNL = getOperationPNL(entity)

      if (isNaN(operationPNL)) return acc

      return acc + operationPNL
    }, 0)
  }, [historicalResultEntities, historicalResultEntitiesState])

  return cummulativePNL
}

export function useUserLast30DaysCummulativePNL(): number {
  const { historicalResultEntities, historicalResultEntitiesState } = useHistoricalResultEntities()

  const last30DaysCummulativePNL = useMemo(() => {
    if (historicalResultEntitiesState !== ApiState.OK) return 0

    const timestamp30DaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000000

    return historicalResultEntities
      .filter((entity) => {
        return parseInt(entity.timeStamp) > timestamp30DaysAgo
      })
      .reduce((acc, entity) => {
        const operationPNL = getOperationPNL(entity)

        if (isNaN(operationPNL)) return acc

        return acc + operationPNL
      }, 0)
  }, [historicalResultEntities, historicalResultEntitiesState])

  return last30DaysCummulativePNL
}

export function useUserCummulativeTradedVolume(): number {
  const { historicalResultEntities, historicalResultEntitiesState } = useHistoricalResultEntities()

  const cummulativeTradedVolume = useMemo(() => {
    if (historicalResultEntitiesState !== ApiState.OK) return 0
    return historicalResultEntities.reduce((acc, entity) => {
      const amountOpened = parseFloat(
        toBN(entity.quantity).multipliedBy(entity.openedPrice).div(1e18).div(1e18).toFixed(2)
      )
      const amountClosed = parseFloat(
        toBN(entity.quantity).multipliedBy(entity.closedPrice).div(1e18).div(1e18).toFixed(2)
      )

      const amountLiq = parseFloat(
        toBN(entity.liquidateAmount).multipliedBy(entity.liquidatePrice).div(1e18).div(1e18).toFixed(2)
      )

      let sum: number = 0

      if (!isNaN(amountOpened)) {
        sum += amountOpened
      }

      if (!isNaN(amountClosed)) {
        sum += amountClosed
      }

      if (!isNaN(amountLiq)) {
        sum += amountLiq
      }

      return acc + sum
    }, 0)
  }, [historicalResultEntities, historicalResultEntitiesState])

  return cummulativeTradedVolume
}

export function useUserLast30DaysCummulativeTradedVolume(): number {
  const { historicalResultEntities, historicalResultEntitiesState } = useHistoricalResultEntities()

  const last30CummulativeDaysTradedVolume = useMemo(() => {
    if (historicalResultEntitiesState !== ApiState.OK) return 0
    const timestamp30DaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000000

    return historicalResultEntities
      .filter((entity) => {
        return parseInt(entity.timeStamp) > timestamp30DaysAgo
      })
      .reduce((acc, entity) => {
        const amountOpened = parseFloat(
          toBN(entity.quantity).multipliedBy(entity.openedPrice).div(1e18).div(1e18).toFixed(2)
        )
        const amountClosed = parseFloat(
          toBN(entity.quantity).multipliedBy(entity.closedPrice).div(1e18).div(1e18).toFixed(2)
        )

        const amountLiq = parseFloat(
          toBN(entity.liquidateAmount).multipliedBy(entity.liquidatePrice).div(1e18).div(1e18).toFixed(2)
        )

        let sum: number = 0

        if (!isNaN(amountOpened)) {
          sum += amountOpened
        }

        if (!isNaN(amountClosed)) {
          sum += amountClosed
        }

        if (!isNaN(amountLiq)) {
          sum += amountLiq
        }

        return acc + sum
      }, 0)
  }, [historicalResultEntities, historicalResultEntitiesState])

  return last30CummulativeDaysTradedVolume
}

export function useUserPNLByDays(): {
  [date: string]: number
} {
  const { historicalResultEntities, historicalResultEntitiesState } = useHistoricalResultEntities()

  const pnlByDays = useMemo(() => {
    if (historicalResultEntitiesState !== ApiState.OK) return {}
    const pnlByDays: {
      [date: string]: number
    } = {}

    historicalResultEntities.forEach((entity) => {
      const date = new Date(parseInt(entity.timeStamp) * 1000)
      const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
        .getDate()
        .toString()
        .padStart(2, '0')}`

      const operationPNL = getOperationPNL(entity)

      if (isNaN(operationPNL)) return

      if (pnlByDays[dateKey]) {
        pnlByDays[dateKey] += operationPNL
      } else {
        pnlByDays[dateKey] = operationPNL
      }
    })

    return pnlByDays
  }, [historicalResultEntities, historicalResultEntitiesState])

  return pnlByDays
}

export function useUserWinningDays(): number {
  const pnlByDays = useUserPNLByDays()

  const winningDays = useMemo(() => {
    return Object.values(pnlByDays).filter((pnl) => pnl > 0).length
  }, [pnlByDays])

  return winningDays
}

export function useWinningLosingTradesRate(): {
  totalWinningTrades: number
  totalLosingTrades: number
  rate: number
} {
  const { historicalResultEntities, historicalResultEntitiesState } = useHistoricalResultEntities()

  const winLoseRate = useMemo(() => {
    if (historicalResultEntitiesState !== ApiState.OK)
      return {
        totalWinningTrades: 0,
        totalLosingTrades: 0,
        rate: 0,
      }

    let totalWinningTrades = 0
    let totalLosingTrades = 0

    historicalResultEntities.forEach((entity) => {
      const operationPNL = getOperationPNL(entity)

      if (isNaN(operationPNL)) return

      if (operationPNL > 0) {
        totalWinningTrades++
      } else {
        totalLosingTrades++
      }
    })

    return {
      totalWinningTrades,
      totalLosingTrades,
      rate: (totalWinningTrades / (totalWinningTrades + totalLosingTrades)) * 100,
    }
  }, [historicalResultEntities, historicalResultEntitiesState])

  return winLoseRate
}

export function useUserLosingDays(): number {
  const pnlByDays = useUserPNLByDays()

  const losingDays = useMemo(() => {
    return Object.values(pnlByDays).filter((pnl) => pnl < 0).length
  }, [pnlByDays])

  return losingDays
}

export function useUserWinRate(): number {
  const winningDays = useUserWinningDays()
  const losingDays = useUserLosingDays()

  const winRate = useMemo(() => {
    return (winningDays / (winningDays + losingDays)) * 100
  }, [winningDays, losingDays])

  return winRate
}

export function useUserProfitAndLossAnalytics(): {
  totalProfit: number
  totalLoss: number
  netProfitLoss: number
  averageProfit: number
  averageLoss: number
  profitLossRatio: number
} {
  const { historicalResultEntities, historicalResultEntitiesState } = useHistoricalResultEntities()

  const analytics = useMemo(() => {
    let totalProfit = 0
    let totalLoss = 0
    let netProfitLoss = 0
    let averageProfit = 0
    let averageLoss = 0
    let profitLossRatio = 0

    const profits: number[] = []
    const losses: number[] = []

    if (historicalResultEntitiesState !== ApiState.OK)
      return { totalProfit, totalLoss, netProfitLoss, averageProfit, averageLoss, profitLossRatio }

    historicalResultEntities.forEach((entity) => {
      const operationPNL = getOperationPNL(entity)

      if (isNaN(operationPNL)) return

      if (operationPNL >= 0) {
        profits.push(operationPNL)
      } else {
        losses.push(operationPNL)
      }
    })

    if (profits.length > 0) {
      totalProfit = profits.reduce((acc, profit) => acc + profit, 0)
      averageProfit = totalProfit / profits.length
    }

    if (losses.length > 0) {
      totalLoss = losses.reduce((acc, loss) => acc + Math.abs(loss), 0)
      averageLoss = totalLoss / losses.length
    }

    netProfitLoss = totalProfit - totalLoss

    if (averageLoss !== 0) {
      profitLossRatio = Math.abs(averageProfit / averageLoss) * 100
    }

    return { totalProfit, totalLoss, netProfitLoss, averageProfit, averageLoss, profitLossRatio }
  }, [historicalResultEntities, historicalResultEntitiesState])

  return analytics
}
