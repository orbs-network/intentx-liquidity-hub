export type TokenData = {
  icon: any
  name: string
  symbol: string
  volume: string
  chg: string
  priceUSD: string
  id: number
}

export type CumulativeChartData = {
  value: number
  time: string
  cumulative: number
}

export type BaseChartData = {
  value: number
  time: string
}

export type RealTimeAnalytic = {
  totalValue: number
  todaysValue?: number
  last24HoursChange?: number
}
