export enum ErrorState {
  VALID,
  AMOUNT_IS_ZERO,
  INSUFFICIENT_BALANCE,
  INVALID_PRICE,
  INVALID_QUANTITY,
  OUT_OF_RANGE_PRICE,
  CAP_REACHED,
  REMAINING_AMOUNT_UNDER_10,
  PARTIAL_CLOSE_WITH_SLIPPAGE,
  MAX_PENDING_POSITIONS_REACHED,
  LESS_THAN_MIN_ACCEPTABLE_QUOTE_VALUE,
  HIGHER_THAN_MAX_NOTIONAL_VALUE,
}

export enum CloseQuote {
  CANCEL_CLOSE_REQUEST,
  CANCEL_QUOTE,
  CLOSE_POSITION,
  FORCE_CLOSE,
}

export const CloseQuoteMessages: { [closeQuoteType: number]: string } = {
  [CloseQuote.CANCEL_CLOSE_REQUEST]: 'Cancel Close Position',
  [CloseQuote.CANCEL_QUOTE]: 'Cancel Order',
  [CloseQuote.CLOSE_POSITION]: 'Close Position',
  [CloseQuote.FORCE_CLOSE]: 'Force Cancel Order',
}

export enum CloseGuides {
  ZERO,
  ONE,
  TWO,
  THREE,
}

export enum InputField {
  PRICE,
  QUANTITY,
}

export enum PositionType {
  LONG = 'Long',
  SHORT = 'Short',
}

export enum OrderType {
  MARKET = 'Market',
  LIMIT = 'Limit',
}

export enum TradeState {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}

export enum TradeView {
  TRADE = 'trade',
  DEPTH = 'depth',
  TRADE_FULL = 'trade_full',
}