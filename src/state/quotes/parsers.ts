import { IQuotesInfo } from 'types/quotesOverview'
import { PositionType } from 'types/trade'

export function getPositionNumbers(quotesInfo: IQuotesInfo) {
  const calcArraySum = (inQuotesInfo: IQuotesInfo) =>
    inQuotesInfo
      .map((quoteInfo) => quoteInfo.positionQuantity)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0)

  const shortPositions = quotesInfo.filter((quoteInfo) => quoteInfo.positionType === PositionType.SHORT)
  const longPositions = quotesInfo.filter((quoteInfo) => quoteInfo.positionType === PositionType.LONG)

  const totalPositionNumber = calcArraySum(quotesInfo)
  const shortPositionNumber = calcArraySum(shortPositions)
  const longPositionNumber = calcArraySum(longPositions)

  return {
    totalPositionNumber,
    shortPositionNumber,
    longPositionNumber,
  }
}
