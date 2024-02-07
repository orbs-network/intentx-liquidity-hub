import { IResultEntity } from 'apollo/queries/operations'
import { QuoteStatusInt } from 'types/quote'
import { BN_ZERO, toBN } from 'utils/numbers'

export default function getOperationPNL(entity: IResultEntity) {
  let pnl
  if (entity.quoteStatus === QuoteStatusInt.CLOSED) {
    pnl = toBN(entity.closedPrice ?? entity.averageClosedPrice)
      .minus(entity.openedPrice)
      .times(entity.closedAmount ?? entity.quantityToClose)
      .times(entity.positionType === 0 ? 1 : -1)
      .div(1e18)
      .div(1e18)
      .toFixed(2)
  }

  if (entity.quoteStatus === QuoteStatusInt.LIQUIDATED) {
    const averagePrice = toBN(entity.liquidatePrice)
      .times(entity.liquidateAmount)
      .plus(toBN(entity.averageClosedPrice).times(entity.closedAmount))
      .div(entity.quantity)

    const lockedMargin = toBN(entity.cva).plus(toBN(entity.lf)).plus(entity.partyAmm)

    pnl = toBN(averagePrice)
      .minus(entity.openedPrice)
      .times(entity.quantity)
      .times(entity.positionType === 0 ? 1 : -1)
      .div(1e18)
      .minus(lockedMargin)
      .div(1e18)
      .toFixed(2)
  }

  const operationPNL = pnl === BN_ZERO.toString() ? 0 : parseFloat(pnl)

  return operationPNL
}
