import { Quote, QuoteStatus } from 'types/quote'
import { OrderType, PositionType } from 'types/trade'

export function generateMockQuotesForForceClose() {
  const quotes: Quote[] = [
    {
      id: 123,
      partyBsWhiteList: [],
      marketId: 1,
      positionType: PositionType.LONG,
      orderType: OrderType.LIMIT,
      leverage: 10,

      openedPrice: '10000000',
      initialOpenedPrice: '1000000000000000000',
      requestedOpenPrice: '1000000000000000000',
      marketPrice: '1000000000000000000',
      openSlippage: '0',
      closeSlippage: '0',
      quantity: '10',
      closedAmount: '0',
      initialCVA: '0',
      initialLF: '0',
      initialPartyAMM: '0',
      initialPartyBMM: '0',
      CVA: '0',
      LF: '0',
      partyAMM: '0',
      partyBMM: '0',
      maxFundingRate: '0',
      partyA: '0x0',
      partyB: '0x0',

      quoteStatus: QuoteStatus.CLOSE_PENDING,
      avgClosedPrice: '0',
      requestedCloseLimitPrice: '0',
      quantityToClose: '10000000',
      liquidateAmount: '0',
      liquidatePrice: '0',
      parentId: '0',
      createTimestamp: 1705002222,
      statusModifyTimestamp: 1705002222,
      lastFundingPaymentTimestamp: 0,
      deadline: 1000,
      tradingFee: 0,
    },
  ]

  return quotes
}
