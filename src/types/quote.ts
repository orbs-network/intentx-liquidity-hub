import { OrderType, PositionType } from './trade'

export enum QuoteStatusInt {
  PENDING = 0,
  LOCKED = 1,
  CANCEL_PENDING = 2,
  CANCELED = 3,
  OPENED = 4,
  CLOSE_PENDING = 5,
  CANCEL_CLOSE_PENDING = 6,
  CLOSED = 7,
  LIQUIDATED = 8,
  EXPIRED = 9,
}

export enum QuoteStatus {
  PENDING = 'PENDING',
  LOCKED = 'RESERVED',
  CANCEL_PENDING = 'CANCEL_PENDING',
  CANCELED = 'CANCELED',
  OPENED = 'OPENED',
  CLOSE_PENDING = 'CLOSE_PENDING',
  CANCEL_CLOSE_PENDING = 'CANCEL_CLOSE_PENDING',
  CLOSED = 'CLOSED',
  LIQUIDATED = 'LIQUIDATED',
  EXPIRED = 'EXPIRED',
  // CREATED = "CREATED", // Extra state for better UI
}

export type Quote = {
  id: number
  partyBsWhiteList: string[]
  marketId: number

  positionType: PositionType
  orderType: OrderType
  leverage: number

  // Price of quote which PartyA requested in 18 decimals
  openedPrice: string
  initialOpenedPrice: string
  requestedOpenPrice: string
  marketPrice: string
  openSlippage: string
  closeSlippage: string
  quantity: string
  // Quantity of quote which PartyA requested in 18 decimals
  closedAmount: string
  initialCVA: string
  initialLF: string
  initialPartyAMM: string
  initialPartyBMM: string
  CVA: string
  LF: string
  partyAMM: string
  partyBMM: string
  maxFundingRate: string
  //PartyA & PartyB address
  partyA: string
  partyB: string
  quoteStatus: QuoteStatus
  avgClosedPrice: string
  requestedCloseLimitPrice: string
  quantityToClose: string
  // for liquid positions
  liquidateAmount: string
  liquidatePrice: string
  // handle partially open positionType
  parentId: string
  createTimestamp: number
  statusModifyTimestamp: number
  lastFundingPaymentTimestamp: number
  
  deadline: number
  tradingFee: number
}
