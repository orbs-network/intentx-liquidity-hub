import gql from 'graphql-tag'

export interface IResultEntity {
  orderTypeOpen: number
  partyAmm: string
  partyBmm: string
  lf: string
  cva: string
  partyA: string
  partyB: string
  quoteId: string
  quoteStatus: number
  symbol: string
  positionType: number
  quantity: string
  orderTypeClose: number
  openedPrice: string
  price: string
  closedPrice: string
  quantityToClose: string
  timeStamp: string
  closePrice: string
  deadline: string
  partyBsWhiteList: string
  symbolId: string
  fillAmount: string
  marketPrice: string
  averageClosedPrice: string
  liquidateAmount: string
  liquidatePrice: string
  closedAmount: string
  initialData: {
    cva: string
    lf: string
    mm: string
    timeStamp: string
  }
}

export const HISTORICAL_RESULT_ENTITY = gql`
  query HistoricalResultEntity(
    $address: String!
    $first: Int!
    $skip: Int!
    $startTimestamp: Int!
    $endTimestamp: Int!
  ) {
    resultEntities(
      first: $first
      skip: $skip
      orderBy: timeStamp
      orderDirection: desc
      where: {
        partyA: $address
        quoteStatus_in: [4, 7, 8, 9]
        timeStamp_gte: $startTimestamp
        timeStamp_lte: $endTimestamp
      }
    ) {
      orderTypeOpen
      partyAmm
      partyBmm
      lf
      cva
      partyA
      partyB
      quoteId
      quoteStatus
      symbol
      positionType
      quantity
      orderTypeClose
      openedPrice
      requestedOpenPrice
      closedPrice
      quantityToClose
      timeStamp
      closePrice
      deadline
      partyBsWhiteList
      symbolId
      fillAmount
      marketPrice
      averageClosedPrice
      liquidateAmount
      liquidatePrice
      closedAmount
      initialData {
        cva
        lf
        partyAmm
        partyBmm
        timeStamp
      }
    }
  }
`
