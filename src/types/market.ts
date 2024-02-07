export interface Market {
  id: number
  name: string
  symbol: string
  asset: string
  pricePrecision: number
  quantityPrecision: number
  isValid: boolean
  minAcceptableQuoteValue: number
  minAcceptablePortionLF: number
  tradingFee: number
  maxLeverage: number
  rfqAllowed?: boolean
  maxFundingRate: string
  maxNotionalValue: number
  hedgerFeeOpen: number
  hedgerFeeClose: number
  autoSlippage: number
}
