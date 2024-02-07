import * as d3 from 'd3'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { formatAmount, formatCurrency, toBN } from 'utils/numbers'

import { PrimaryButton } from 'components/Button'
import Contract from 'components/Icons/Contract'
import DepthChart from 'components/Icons/DepthChart'
import Expand from 'components/Icons/Expand'
import useBidAskPrice from 'hooks/useBidAskPrice'
import useTradePage from 'hooks/useTradePage'
import useWindowSize from 'lib/hooks/useWindowSize'
import { ChevronDown } from 'react-feather'
import { useDepthGraph, useMarketData } from 'state/hedger/hooks'
import { useActiveMarket, useOrderType, useSetEstimatedSlippageValue } from 'state/trade/hooks'
import { useActiveTradeView, useSetActiveTradeView } from 'state/user/hooks'
import { MEDIA_WIDTHS } from 'theme'
import { OrderType, TradeView } from 'types/trade'
import { Loader } from 'components/Icons'

const maxDataToShow = 80
const labelPaddingX = 8,
  labelHeight = 24,
  labelHeightHalf = labelHeight / 2

const LoaderWrapper = styled.div`
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SvgWrapper = styled.div`
  background: #131518;
  line-height: 0;
`

const SVGContainer = styled.div`
  position: relative;
`

const TitleWrapper = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  padding: 8px;
  height: 43px;
  display: flex;
  gap: 10px;
  align-items: center;
  border-bottom: 4px solid #2a2e39;
  border-top: 1px solid #363a45;
`

const MainButton = styled(PrimaryButton)<{ active: boolean }>`
  height: 21px;
  width: 21px;
  font-size: 12px !important;
  overflow: unset;
  z-index: 0;
  padding: 0;

  border-radius: 5px;
  background: ${({ theme, active }) =>
    active ? theme.gradCustom1 : `linear-gradient(45deg, #232933 15.48%, #3c4656 103.57%)`};
  /* background-origin: border-box;
  background-clip: padding-box, border-box; */
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 8px;
`}
`

const DepthChartToggleButton = styled(PrimaryButton)<{
  active: boolean
}>`
  gap: 16px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border-radius: 0px;

  ${({ theme, active }) => {
    if (!active) {
      return css`
        background: ${theme.bg0} !important;
        border: 1px solid ${theme.bg0};

        span,
        svg {
          opacity: 0.5;
        }
      `
    }

    return css`
      border: 1px solid ${theme.red};
    `
  }}

  svg:last-child {
    transform: rotateX(${({ active }) => (active ? '180deg' : '0deg')});
    width: 18px;
    height: 18px;
  }
`

const Chevron = styled(ChevronDown)``

function getTextDimensions(textElem: d3.Selection<SVGTextElement, unknown, null, undefined>) {
  return {
    width: textElem?.node()?.getBBox()?.width || 0,
    height: textElem?.node()?.getBBox()?.height || 0,
  }
}

function createWhiteRect(
  svg: d3.Selection<any, unknown, null, undefined>,
  {
    height = 0,
    width = 0,
    x = 0,
    y = 0,
    clipPath,
  }: {
    height?: number
    width?: number
    x?: number
    y?: number
    clipPath?: string
  }
) {
  const rect = svg
    .append('rect')
    .attr('fill', 'rgba(217, 217, 217, 0.05)')
    .attr('height', height)
    .attr('width', width)
    .attr('x', x)
    .attr('y', y)
    .attr('class', 'show-on-hover')

  if (clipPath) {
    rect.attr('clip-path', clipPath)
  }

  return rect
}

function createLine(
  svg: d3.Selection<any, unknown, null, undefined>,
  { ...attrs }: { [key: string]: string | number }
) {
  const line = svg.append('line').attr('stroke-width', 1)

  for (const attr in attrs) {
    line.attr(attr, attrs[attr])
  }

  return line
}

function createCrossLines(
  svg: d3.Selection<any, unknown, null, undefined>,
  {
    x1,
    x2,
    y1,
    y2,
    stroke,
    clipPath,
  }: { x1: number; x2: number; y1: number; y2: number; stroke: string; clipPath: string; showOnHover?: boolean }
) {
  const hoverLineX1 = createLine(svg, { stroke, x1, x2, y1, y2, 'clip-path': clipPath, 'stroke-dasharray': '3 ,3' })

  const hoverLineY1 = createLine(svg, { stroke, x1, x2, y1, y2, 'clip-path': clipPath, 'stroke-dasharray': '3 ,3' })

  return [hoverLineX1, hoverLineY1]
}

const createRectLabel = (
  svg: d3.Selection<any, unknown, null, undefined>
): d3.Selection<SVGRectElement, unknown, null, undefined> => {
  return svg
    .append('rect')
    .attr('fill', '#171A1F')
    .attr('rx', 2)
    .attr('ry', 2)
    .attr('height', 24)
    .attr('class', 'show-on-hover')
}

const createTextLabel = (
  svg: d3.Selection<any, unknown, null, undefined>,
  color: string
): d3.Selection<SVGTextElement, unknown, null, undefined> => {
  return svg
    .append('text')
    .attr('text-anchor', 'start')
    .attr('alignment-baseline', 'bottom')
    .style('fill', color)
    .style('font-family', 'Poppins')
    .style('font-size', '12px')
    .style('font-style', 'normal')
    .style('font-weight', '500')
    .style('line-height', 'normal')
    .attr('class', 'show-on-hover')
}

interface Label {
  x: {
    rect: d3.Selection<SVGRectElement, unknown, null, undefined>
    text: d3.Selection<SVGTextElement, unknown, null, undefined>
  }
  y: {
    rect: d3.Selection<SVGRectElement, unknown, null, undefined>
    text: d3.Selection<SVGTextElement, unknown, null, undefined>
  }
  diff: {
    rect: d3.Selection<SVGRectElement, unknown, null, undefined>
    text: d3.Selection<SVGTextElement, unknown, null, undefined>
  }
}

const createLabels = (
  svg: d3.Selection<any, unknown, null, undefined>,
  {
    color,
  }: {
    color: string
  }
): Label => {
  const xLabelRect = createRectLabel(svg)
  const xLabelText = createTextLabel(svg, color)

  const yLabelRect = createRectLabel(svg)
  const yLabelText = createTextLabel(svg, color)

  const diffLabelRect = createRectLabel(svg)
  const diffLabelText = createTextLabel(svg, color)

  return {
    x: {
      rect: xLabelRect,
      text: xLabelText,
    },
    y: {
      rect: yLabelRect,
      text: yLabelText,
    },
    diff: {
      rect: diffLabelRect,
      text: diffLabelText,
    },
  }
}

const createClipPath = (
  svg: d3.Selection<any, unknown, null, undefined>,
  {
    id,
    x = 0,
    y = 0,
    width = 0,
    height = 0,
  }: {
    id: string
    x?: number
    y?: number
    width?: number
    height?: number
  }
) => {
  return svg
    .append('defs')
    .append('clipPath')
    .attr('id', id)
    .append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height)
}

const createActiveDot = (svg: d3.Selection<any, unknown, null, undefined>, { color }: { color: string }) => {
  const wrapper = svg.append('g')

  wrapper
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 4)
    .attr('fill', color)
    .attr('stroke', color)
    .attr('stroke-width', 1)
    .attr('class', 'show-on-hover')

  wrapper
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 2)
    .attr('fill', color)
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .attr('class', 'show-on-hover')

  return wrapper
}

// const setLabel = ({
//   label,
//   textX,
//   textY,
//   positionX,
//   positionY,
// }: {
//   label: Label
//   textX: string
//   textY: string
//   positionX: number
//   positionY: number
// }) => {
//   label.x.text.text(textX).attr('y', 0)

//   const { width: xTextWidth, height: xTextHeight } = getTextDimensions(label.x.text)

//   label.x.text.attr('y', xTextHeight).attr('x', newX(d.btc) + 8 - (xTextWidth + 16) / 2)

//   xLabelRectBids
//     .attr('width', xTextWidth + 16)
//     .attr('x', newX(d.btc) - (xTextWidth + 16) / 2)
//     .attr('y', 0)

//   yLabelTextBids
//     .text(formatDollarAmount(mouseYData))
//     .attr('x', width - marginRight + 8)
//     .attr('y', my - 12)

//   const yTextWidth = yLabelTextBids?.node()?.getBBox()?.width
//   const yTextHeight = yLabelTextBids?.node()?.getBBox()?.height || 0

//   yLabelTextBids.attr('y', my + yTextHeight - 12).attr('x', width - marginRight + 8)

//   yLabelRectBids
//     .attr('width', yTextWidth + 16)
//     .attr('x', width - marginRight)
//     .attr('y', my - 12)
// }

interface DepthChartData {
  price: number
  btc: number
  type: string
}

function getLevels(e) {
  const a = ['100', '50', '10', '1']
  let t, r, n, o, i, s, l

  for (
    n = e.ts,
      o = e.c,
      i = e.mp,
      s = a.map(function (e) {
        return ''.concat(e)
      }),
      l = 1;
    l <= ((r = +n), -1 * Math.log10(r));
    l++
  ) {
    s.push(0 === (t = l) ? '1' : '0.'.concat('0'.repeat(t - 1), '1'))
  }

  const c = s.findIndex(function (e) {
    return (Number(o) || i || 0) >= 10 * Number(e)
  })

  return c < 0 ? s : s.slice(c)
}

function createNumberWithDecimals(number) {
  const decimalPlaces = Math.pow(10, number)
  return (1 / decimalPlaces).toFixed(number)
}

function customToFixed(number: number, tickSize: string, roundUp: boolean): string {
  const decimals = (tickSize.toString().split('.')[1] || '').length
  const factor = 10 ** decimals
  const roundedNumber = roundUp ? Math.ceil(number * factor) : Math.floor(number * factor)
  const fixedNumber = (roundedNumber / factor).toFixed(decimals)
  return fixedNumber
}

function fixNumber(number, tickSize) {
  const decimals = (tickSize.toString().split('.')[1] || '').length
  return Number(number.toFixed(decimals))
}

const mapData = (data) => {
  return {
    price: parseFloat(data[0]),
    amount: parseFloat(data[1]),
  }
}

const parseData = (data: { [key: string]: string }) => {
  return Object.keys(data || {})
    .map((key) => [key, data[key]])
    .map((d) => {
      return {
        price: parseFloat(d[0] || '0'),
        amount: parseFloat(d[1] || '0'),
      }
    })
}

const reduceData = (acum, current, level, roundUp: boolean) => {
  const price = customToFixed(current.price, level, roundUp)
  const amount = current.amount

  if (acum[price]) {
    acum[price] += amount
  } else {
    acum[price] = amount
  }

  return acum
}

const processDataFromWebsocket = ({ depthGrapht, level, lastData }) => {
  const bids = parseData(depthGrapht?.bids || {})
  const asks = parseData(depthGrapht?.asks || {})

  if (!bids.length || !asks.length) {
    return { bids: [], asks: [] }
  }

  const minPrice =
    bids
      .map((bid) => bid.price)
      .sort((a, b) => {
        const aStr = a.toString().split('.')[0] || ''
        const bStr = b.toString().split('.')[0] || ''

        return aStr.length - bStr.length
      })[0] || Math.min(...bids.map((bid) => bid.price))

  const maxBids = Math.max(...bids.map((bid) => bid.price))
  const minAsks = Math.min(...asks.map((ask) => ask.price))
  const average = minAsks - maxBids + maxBids

  const ts = createNumberWithDecimals((minPrice.toString().split('.')[1] || '').length)
  const c = fixNumber(average, ts)
  const mp = average
  const levels = getLevels({ ts, c, mp })
  const newLevel = levels.slice(-2)[0]

  if (!level.current || (newLevel.split('.')[1] || '').length > (level.current.split('.')[1] || '').length) {
    level.current = newLevel
  }

  const incomingBids = Object.entries(
    bids.reduce((acum, current) => reduceData(acum, current, level.current, false), {})
  ).map(mapData)
  const incomingAsks = Object.entries(
    asks.reduce((acum, current) => reduceData(acum, current, level.current, true), {})
  ).map(mapData)

  const maxPriceIncomingBids = Math.max(...incomingBids.map((bid) => bid.price))

  lastData.current.bids = [
    ...incomingBids,
    ...lastData.current.bids.filter((bid) => bid.price <= maxPriceIncomingBids),
  ].filter((bid, index, self) => index === self.findIndex((t) => t.price === bid.price))

  const minPriceIncomingAsks = Math.min(...incomingAsks.map((ask) => ask.price))

  lastData.current.asks = [
    ...incomingAsks,
    ...lastData.current.asks.filter((ask) => minPriceIncomingAsks <= ask.price),
  ].filter((ask, index, self) => index === self.findIndex((t) => t.price === ask.price))

  // const maxPriceIncomingAsks = Math.max(...incomingAsks.map((ask) => ask.price))
  // lastData.current.asks = [...incomingAsks, ...lastData.current.asks.filter((ask) => ask.price > maxPriceIncomingAsks)]
  // const minorPriceIncomingBids = Math.min(...incomingBids.map((bid) => bid.price))
  // lastData.current.bids = [
  //   ...incomingBids,
  //   ...lastData.current.bids.filter((bid) => minorPriceIncomingBids > bid.price),
  // ]

  return {
    bids: lastData.current.bids,
    asks: lastData.current.asks,
  }
}

const processBids = ({ bids, maxBid, spread }) => {
  if (!bids.length) return []

  let sumBtc = bids?.reduce((acum, current) => current.amount + acum, 0)
  const sortedData = bids?.sort((a, b) => a.price - b.price)
  const processedData = sortedData?.map((d) => {
    const price = d.price - ((spread / 2) * d.price) / 100

    const data = {
      price,
      btc: sumBtc,
      type: 'bids',
    }

    sumBtc -= d.amount

    return data
  })
  const filteredData = processedData

  ?.filter((bid) => !maxBid || bid.price <= maxBid)

  if (maxBid != filteredData[filteredData.length - 1].price) {
    filteredData[filteredData.length - 1].price = maxBid
  }

  return filteredData
}

const processtAsks = ({ asks, minAsk, spread }) => {
  if (!asks.length) return []

  let sumBtc = 0
  const sortedData = asks?.sort((a, b) => a.price - b.price)
  const processedData = sortedData?.map((d) => {
    const price = d.price + ((spread / 2) * d.price) / 100

    sumBtc += d.amount

    const data = {
      price,
      btc: sumBtc,
      type: 'asks',
    }

    return data
  })
  const filteredData = processedData

  ?.filter((ask) => !minAsk || ask.price >= minAsk)

  if (minAsk != filteredData[0].price) {
    filteredData[0].price = minAsk
  }

  return filteredData || []
}

const diffPercentValues = (value1: number, value2: number): number => {
  const diff = value1 - value2
  const percentage = (diff / value1) * 100

  return percentage
}

const getPriceDiffPercentage = (price1: number, price2: number): string => {
  const percentage = parseFloat(diffPercentValues(price1, price2).toFixed(1))

  return `${percentage > 0 ? '+' : ''}${percentage}%`
}

const showOnHover = (element: d3.Selection<any, unknown, null, undefined>) => {
  element.attr('class', 'show-on-hover').attr('visibility', 'visible')
}

const createLabelGroup = (
  svg: d3.Selection<any, unknown, null, undefined>,
  attrs: {
    rectAttrs?: { [key: string]: string | number }
    textAttrs?: { [key: string]: string | number }
  } = {
    rectAttrs: {},
    textAttrs: {},
  }
) => {
  const { rectAttrs, textAttrs } = attrs

  const group = svg.append('g')

  const rect = group.append('rect').attr('rx', 2).attr('ry', 2).attr('height', labelHeight)

  const text = group
    .append('text')
    .attr('text-anchor', 'start')
    .attr('alignment-baseline', 'bottom')
    .style('font-family', 'Poppins')
    .style('font-size', '12px')
    .style('font-style', 'normal')
    .style('font-weight', '500')
    .style('line-height', 'normal')

  for (const attr in rectAttrs) {
    rect.attr(attr, rectAttrs[attr])
  }

  for (const attr in textAttrs) {
    text.attr(attr, textAttrs[attr])
  }

  return group
}

const setTextLabelGroup = (label: d3.Selection<any, unknown, null, undefined>, text: string) => {
  const textElem: d3.Selection<SVGTextElement, unknown, null, undefined> = label.select('text')
  const rectElem: d3.Selection<SVGRectElement, unknown, null, undefined> = label.select('rect')

  textElem.text(text)

  const { width: textWidth, height: textHeight } = getTextDimensions(textElem)

  const newRectWidth = textWidth + labelPaddingX * 2

  rectElem.attr('width', newRectWidth)
  textElem.attr('x', labelPaddingX).attr('y', textHeight)
}

const moveElement = (
  elem: d3.Selection<any, unknown, null, undefined>,
  {
    x,
    y,
  }: {
    x: number
    y: number
  }
) => {
  return elem.attr('transform', `translate(${x},${y})`)
}

const moveLabelGroupFixedRight = (
  label: d3.Selection<SVGGElement, unknown, null, undefined>,
  {
    y,
    width,
    marginRight,
  }: {
    y: number
    width: number
    marginRight: number
  }
) => {
  return moveElement(label, { x: width - marginRight + 1, y: y - labelHeightHalf })
}

const moveLabelGroupFixedBottom = (
  label: d3.Selection<SVGGElement, unknown, null, undefined>,
  {
    x,
    height,
    marginBottom,
  }: {
    x: number
    height: number
    marginBottom: number
  }
) => {
  const rectWidth = Number(label.select('rect').attr('width'))

  return moveElement(label, { x: x - rectWidth / 2 + 1, y: height - marginBottom + 1 })
}

const moveLabelGroupFixedTop = (
  label: d3.Selection<SVGGElement, unknown, null, undefined>,
  {
    x,
    marginTop,
  }: {
    x: number
    marginTop: number
  }
) => {
  const rectWidth = Number(label.select('rect').attr('width'))

  return moveElement(label, { x: x - rectWidth / 2 + 1, y: marginTop })
}

const moveLabelGroupFixedLeft = (
  label: d3.Selection<SVGGElement, unknown, null, undefined>,
  {
    y,
    marginLeft,
  }: {
    y: number
    marginLeft: number
  }
) => {
  return moveElement(label, { x: marginLeft, y: y - labelHeightHalf })
}

const moveLabelGroup = (
  label: d3.Selection<SVGGElement, unknown, null, undefined>,
  {
    x,
    y,
  }: {
    x: number
    y: number
  }
) => {
  const rectWidth = Number(label.select('rect').attr('width'))

  return moveElement(label, { x: x - rectWidth / 2 + 1, y: y - labelHeightHalf })
}

const hideElement = (elem: d3.Selection<any, unknown, null, undefined>) => {
  return elem.attr('visibility', 'hidden')
}

const showElement = (elem: d3.Selection<any, unknown, null, undefined>) => {
  return elem.attr('visibility', 'visible')
}

const moveLine = (
  line: d3.Selection<any, unknown, null, undefined>,
  {
    x1 = undefined,
    x2 = undefined,
    y1 = undefined,
    y2 = undefined,
  }: {
    x1?: number
    x2?: number
    y1?: number
    y2?: number
  }
) => {
  if (x1 != undefined) line.attr('x1', x1)

  if (x2 != undefined) line.attr('x2', x2)

  if (y1 != undefined) line.attr('y1', y1)

  if (y2 != undefined) line.attr('y2', y2)

  return line
}

const centerTextHorizontal = (parent, text: d3.Selection<any, unknown, null, undefined>) => {
  const { width: textWidth } = getTextDimensions(text)

  return text.attr('x', Number(parent.attr('x')) + (Number(parent.attr('width')) - textWidth) / 2)
}

const moveElementInBoundaries = (
  elem: d3.Selection<any, unknown, null, undefined>,
  {
    x,
    y,
    width,
    height,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
  }: {
    x: number
    y: number
    width: number
    height: number
    marginLeft: number
    marginRight: number
    marginTop: number
    marginBottom: number
  }
) => {
  const { width: elemWidth, height: elemHeight } = getTextDimensions(elem)

  const newX = Math.max(marginLeft, Math.min(x, width - marginRight - elemWidth))
  const newY = Math.max(marginTop, Math.min(y, height - marginBottom - elemHeight))

  return moveElement(elem, { x: newX, y: newY })
}

const hideSlippageLabel = (tooltip: HTMLElement) => {
  if (!tooltip) return

  tooltip.style.display = 'none'
}

const showSlippageLabel = (tooltip: HTMLElement) => {
  if (!tooltip) return

  tooltip.style.display = 'block'
}

const moveSlippageLabel = (
  tooltip: HTMLElement,
  {
    x,
    y,
    width,
    height,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
  }: {
    x: number
    y: number
    width: number
    height: number
    marginLeft: number
    marginRight: number
    marginTop: number
    marginBottom: number
  }
) => {
  if (!tooltip) return

  const elemWidth = tooltip.offsetWidth
  const elemHeight = tooltip.offsetHeight

  const newX = Math.max(marginLeft, Math.min(x, width - marginRight - elemWidth))
  const newY = Math.max(marginTop, Math.min(y, height - marginBottom - elemHeight))

  return (tooltip.style.transform = `translate(${newX}px, ${newY}px)`)
}

const setSlippageTooltipText = (
  tooltip: HTMLElement,
  {
    estimidatedFillPrice,
    estimatedSlippage,
  }: {
    estimidatedFillPrice: number
    estimatedSlippage: number
  }
) => {
  const formatedEstimidatedFillPrice = '$' + formatAmount(estimidatedFillPrice, 7, true)

  const estimidatedFillPriceValue = tooltip?.querySelector('.estimidated-fill-price-value') as HTMLElement
  const estimidatedSlippageValue = tooltip?.querySelector('.estimidated-slippage-value') as HTMLElement

  if (estimidatedFillPriceValue) {
    estimidatedFillPriceValue.innerText = formatedEstimidatedFillPrice
  }

  if (estimidatedSlippageValue) {
    estimidatedSlippageValue.innerText = estimatedSlippage
      ? `${estimatedSlippage}%`
      : '0%'
  }
}

const removed3Events = (svg: d3.Selection<any, unknown, null, undefined>) => {
  svg.on('mousemove', null).on('mouseleave', null).on('mouseenter', null)
}

export const ChartDesktopHeader = () => {
  const activeTradeView = useActiveTradeView()
  const setActiveTradeView = useSetActiveTradeView()

  return (
    <TitleWrapper>
      <span style={{ opacity: 0.5 }}>Depth</span>
      <MainButton
        style={{ marginLeft: 'auto' }}
        active={activeTradeView === TradeView.DEPTH}
        onClick={() => setActiveTradeView(activeTradeView === TradeView.DEPTH ? TradeView.TRADE : TradeView.DEPTH)}
      >
        {activeTradeView === TradeView.TRADE && <Expand width={15} height={15} />}
        {activeTradeView === TradeView.DEPTH && <Contract width={13} height={13} />}
      </MainButton>
    </TitleWrapper>
  )
}

const TooltipWrapper = styled.div`
  position: absolute;
  padding: 20px;
  color: white;
  font-size: 8px;
  border-radius: 10px;
  background: linear-gradient(
    241deg,
    rgba(42, 49, 61, 0.1) 2.88%,
    rgba(43, 52, 65, 0.09) 39.82%,
    rgba(53, 35, 255, 0) 98.9%
  );
  backdrop-filter: blur(2.5px);
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: normal;
  font-weight: 300;

  .value {
    font-size: 10px;
  }

  div {
    flex-shrink: 0;
  }
`

const Tooltip = (props, ref) => {
  const activeMarket = useActiveMarket()
  const { name, pricePrecision } = activeMarket || {}
  const marketData = useMarketData(name)
  const mark = useMemo(
    () => (marketData ? parseFloat(marketData.markPrice).toFixed(pricePrecision) : 0),
    [marketData, pricePrecision]
  )

  return (
    <TooltipWrapper ref={ref}>
      <div>
        <div className="title">Current Price</div>
        <div className="value">${formatAmount(toBN(mark).toString(), 5, true)}</div>
      </div>
      <div>
        <div className="title">Est. Fill Price</div>
        <div className="value estimidated-fill-price-value"></div>
      </div>
      <div>
        <div className="title">Est. Slippage</div>
        <div className="value estimidated-slippage-value"></div>
      </div>
    </TooltipWrapper>
  )
}

const ForwardedTooltip = forwardRef(Tooltip)

const ChartLoader = styled.div<{ width: number | string; height: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ height }) => height}px;
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
`

const ChartDesktopLoading = ({ width, height }: { width?: number; height: number }) => {
  return (
    <SvgWrapper>
      <ChartDesktopHeader />
      <SVGContainer>
        <ChartLoader width={width || '100%'} height={height}>
          <Loader />
        </ChartLoader>
      </SVGContainer>
    </SvgWrapper>
  )
}

const ChartMobileLoading = ({ width, height }: { width?: number; height: number }) => {
  return (
    <SVGContainer>
      <ChartLoader width={width || '100%'} height={height}>
        <Loader />
      </ChartLoader>
    </SVGContainer>
  )
}

const DepthChartVerticalInner = ({ width, height, ...rest }: { width: number; height: number; [x: string]: any }) => {
  const orderType = useOrderType()
  const activeMarket = useActiveMarket()
  const setEstimatedSlippageValue = useSetEstimatedSlippageValue();
  const depthGrapht = useDepthGraph(activeMarket?.name)
  const { ask, bid, spread } = useBidAskPrice(activeMarket?.name, activeMarket?.pricePrecision)

  const { formattedAmounts } = useTradePage()

  const [labelsAreActive, setLabelsAreActive] = useState(false)

  const lastMousePosition = useRef({ x: 0, y: 0 })
  const SVGRef = useRef(null)
  const d3SVG = useRef<any>(null)
  const bidsLabels = useRef<{ labelX: any; labelY: any; lineX: any; lineY: any; labelPercent: any; activeDot: any }>({
    labelX: null,
    labelY: null,
    lineX: null,
    lineY: null,
    labelPercent: null,
    activeDot: null,
  })
  const asksLabels = useRef<{ labelX: any; labelY: any; lineX: any; lineY: any; labelPercent: any; activeDot: any }>({
    labelX: null,
    labelY: null,
    lineX: null,
    lineY: null,
    labelPercent: null,
    activeDot: null,
  })
  const asksClipPath = useRef<any>(null)
  const bidsClipPath = useRef<any>(null)
  const bidsWhiteRect = useRef<any>(null)
  const AsksWhiteRect = useRef<any>(null)
  const gx = useRef<any>(null)
  const gy = useRef<any>(null)
  const areaBids = useRef<any>(null)
  const areaAsks = useRef<any>(null)
  const middleLineY = useRef<any>(null)
  const transform = useRef<any>(null)
  const middleLineValue = useRef<number>(0)
  const middleLinePosition = useRef<number>(0)
  const fixedDomain = useRef<any>(null)
  const lastDomainYPoints = useRef<any>([0, 0])
  const level = useRef<any>(null)
  const lastData = useRef<{ bids: Array<any>; asks: Array<any> }>({ bids: [], asks: [] })
  const zoomScaleExtent = useRef<any>([1, 1])
  const lastMergedLength = useRef<number>(0)
  const lastBaseValue = useRef<number>(0)
  const x = useRef<any>(null)
  const y = useRef<any>(null)
  const scaleX = useRef<any>(null)
  const scaleY = useRef<any>(null)
  const zoom = useRef<any>(null)
  const slippageLabel = useRef<{ lineX: any; lineY: any; labelX: any; labelY: any }>({
    lineX: null,
    lineY: null,
    labelX: null,
    labelY: null,
  })
  const slippageLabelTooltip = useRef<any>(null)
  const bidsNotAllowedMoreThan = useRef<{ value: number; position: number; lineY: any }>({
    value: 0,
    lineY: null,
    position: 0,
  })
  const asksNotAllowedMoreThan = useRef<{ value: number; position: number; lineY: any; labelY: any }>({
    value: 0,
    lineY: null,
    position: 0,
    labelY: null,
  })
  const lastTypedAmount = useRef<number>(0)
  const typedAmountScale = useRef<any>(1)

  const marginLeft = 10,
    marginRight = 70,
    marginTop = 0,
    marginBottom = 25,
    innerWidth = width - marginLeft - marginRight

  useEffect(() => {
    fixedDomain.current = null
  }, [activeMarket?.name])

  useEffect(() => {
    bidsNotAllowedMoreThan.current.value = Number(bid)
    asksNotAllowedMoreThan.current.value = Number(ask)
  }, [bid, ask])

  const data = useMemo(
    () =>
      processDataFromWebsocket({
        depthGrapht,
        level,
        lastData,
      }),
    [depthGrapht]
  )

  const bids = useMemo(
    () =>
      bid && level.current
        ? processBids({
            bids: data.bids,
            maxBid: Number(customToFixed(Number(bid), level.current, false)),
            spread: Number(spread) / 100,
          })
        : [],
    [data, bid, spread]
  ) as Array<DepthChartData>

  const asks = useMemo(
    () =>
      ask && level.current
        ? processtAsks({
            asks: data.asks,
            minAsk: Number(customToFixed(Number(ask), level.current, false)),
            spread: Number(spread) / 100,
          })
        : [],
    [data, ask, spread]
  ) as Array<DepthChartData>

  const merged = useMemo(() => [...bids, ...asks], [bids, asks]) as Array<DepthChartData>

  const [minBidAmount, maxBidAmount] = useMemo(() => {
    const amounts = bids.map((bid) => bid.btc)

    return [Math.min(...amounts), Math.max(...amounts)]
  }, [bids])

  const [minAskAmount, maxAskAmount] = useMemo(() => {
    const amounts = asks.map((ask) => ask.btc)

    return [Math.min(...amounts), Math.max(...amounts)]
  }, [asks])

  const typedAmount = useMemo(() => {
    const formated = parseFloat(formattedAmounts[1] || '0')

    return orderType === OrderType.MARKET && formated < maxAskAmount ? formated : 0
  }, [formattedAmounts, orderType, maxAskAmount])

  const xAxis = (g, x) =>
    g.call(
      d3
        .axisBottom(x)
        .ticks(4)
        .tickFormat((value: any) => formatCurrency(value))
    )

  const yAxis = (g, y) => {
    const maxValue = y.domain()[1]
    const minValue = y.domain()[0]
    const tickCount = 12
    const tickStep = (maxValue - minValue) / (tickCount - 1)
    let tickValues = Array.from({ length: tickCount }, (_, i) => minValue + tickStep * i)

    tickValues = tickValues.slice(1, tickValues.length - 1)

    return g.call(
      d3
        .axisRight(y)
        .tickValues(tickValues)
        .tickFormat((value: any) => formatAmount(value, 7, true))
    )
  }

  const area = (data, x, y, type: 'bids' | 'asks') =>
    d3
      .area()
      .y((d: any) => y(d.price))
      .x0(x(0))
      .x1((d: any) => x(d.btc))
      .curve(type === 'bids' ? d3.curveStepAfter : d3.curveStepBefore)(data)

  const bisect = d3.bisector((d: any) => d.price).left

  const hiddenLabels = () => {
    d3SVG.current.selectAll('.show-on-hover').attr('visibility', 'hidden')
    setLabelsAreActive(false)
    lastMousePosition.current.y = 0
  }

  const showLabels = () => {
    d3SVG.current.selectAll('.show-on-hover').attr('visibility', 'visible')
    setLabelsAreActive(true)
  }

  const initClipPath = () => {
    bidsClipPath.current = createClipPath(d3SVG.current, {
      id: 'clip-bids',
      x: marginLeft,
      width: innerWidth,
    })

    asksClipPath.current = createClipPath(d3SVG.current, {
      id: 'clip-asks',
      x: marginLeft,
      y: marginTop,
      width: innerWidth,
    })
  }

  const initWhiteRect = () => {
    bidsWhiteRect.current = createWhiteRect(d3SVG.current, {
      width: innerWidth,
      x: marginLeft,
      y: marginTop,
      clipPath: 'url(#clip-bids)',
    })

    AsksWhiteRect.current = createWhiteRect(d3SVG.current, {
      height: 0,
      width: innerWidth,
      x: marginLeft,
      y: 0,
      clipPath: 'url(#clip-asks)',
    })
  }

  const initAxis = () => {
    gx.current = d3SVG.current
      .append('g')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .style('color', 'rgba(255, 255, 255, 0.70)')

    gy.current = d3SVG.current
      .append('g')
      .attr('transform', `translate(${width - marginRight},0)`)
      .style('color', 'rgba(255, 255, 255, 0.70)')
  }

  const initAreaCharts = () => {
    areaBids.current = d3SVG.current
      .append('path')
      .attr('clip-path', 'url(#clip-bids)')
      .attr('fill', 'rgba(27, 188, 122, 0.10)')
      .attr('stroke', '#27F290')

    areaAsks.current = d3SVG.current
      .append('path')
      .attr('clip-path', 'url(#clip-asks)')
      .attr('stroke', '#BD2738')
      .attr('fill', 'rgba(234, 60, 85, 0.10)')
  }

  const initMiddleLine = () => {
    middleLineY.current = d3SVG.current
      .append('line')
      .attr('x1', marginLeft)
      .attr('y1', 0)
      .attr('x2', width - marginRight)
      .attr('y2', 0)
      .attr('stroke', 'rgba(255, 255, 255, 0.10)')
      .attr('stroke-width', 1)
  }

  const initNotAllowedValues = () => {
    // bidsNotAllowedMoreThan.current.elem = svg.current
    //   .append('line')
    //   .attr('x1', marginLeft)
    //   .attr('y1', 0)
    //   .attr('x2', width - marginRight)
    //   .attr('y2', 0)
    //   // .attr('stroke', '#1147C2')
    //   .attr('stroke', 'transparent')
    //   .attr('stroke-width', 1)

    asksNotAllowedMoreThan.current.lineY = d3SVG.current
      .append('line')
      .attr('x1', marginLeft)
      .attr('y1', 0)
      .attr('x2', width - marginRight)
      .attr('y2', 0)
      .attr('stroke', '#2C2CBC')
      .attr('stroke-width', 2)
      .style('stroke-dasharray', '3, 3')

    asksNotAllowedMoreThan.current.labelY = createLabelGroup(d3SVG.current, {
      rectAttrs: { fill: '#2C2CBC', ry: 10, rx: 10 },
      textAttrs: { fill: '#FFF' },
    })
  }

  const initCrossLine = () => {
    ;[bidsLabels.current.lineX, bidsLabels.current.lineY] = createCrossLines(d3SVG.current, {
      x1: 0,
      x2: width,
      y1: 0,
      y2: height,
      stroke: '#27F290',
      clipPath: 'url(#clip-bids)',
    })
    ;[asksLabels.current.lineX, asksLabels.current.lineY] = createCrossLines(d3SVG.current, {
      x1: 0,
      x2: width,
      y1: 0,
      y2: height,
      stroke: '#BD2738',
      clipPath: 'url(#clip-asks)',
    })

    showOnHover(bidsLabels.current.lineX)
    showOnHover(bidsLabels.current.lineY)
    showOnHover(asksLabels.current.lineX)
    showOnHover(asksLabels.current.lineY)
  }

  const initLabels = () => {
    bidsLabels.current.labelX = createLabelGroup(d3SVG.current, {
      rectAttrs: { fill: '#171A1F' },
      textAttrs: { fill: '#27F291' },
    })

    bidsLabels.current.labelY = createLabelGroup(d3SVG.current, {
      rectAttrs: { fill: '#171A1F' },
      textAttrs: { fill: '#27F291' },
    })

    bidsLabels.current.labelPercent = createLabelGroup(d3SVG.current, {
      rectAttrs: { fill: '#171A1F' },
      textAttrs: { fill: '#27F291' },
    })

    asksLabels.current.labelX = createLabelGroup(d3SVG.current, {
      rectAttrs: { fill: '#171A1F' },
      textAttrs: { fill: '#BD2738' },
    })

    asksLabels.current.labelY = createLabelGroup(d3SVG.current, {
      rectAttrs: { fill: '#171A1F' },
      textAttrs: { fill: '#BD2738' },
    })

    asksLabels.current.labelPercent = createLabelGroup(d3SVG.current, {
      rectAttrs: { fill: '#171A1F' },
      textAttrs: { fill: '#BD2738' },
    })

    showOnHover(bidsLabels.current.labelX)
    showOnHover(bidsLabels.current.labelY)
    showOnHover(bidsLabels.current.labelPercent)
    showOnHover(asksLabels.current.labelX)
    showOnHover(asksLabels.current.labelY)
    showOnHover(asksLabels.current.labelPercent)
  }

  const initActiveDots = () => {
    bidsLabels.current.activeDot = createActiveDot(d3SVG.current, {
      color: '#27F291',
    })

    asksLabels.current.activeDot = createActiveDot(d3SVG.current, {
      color: '#BD2738',
    })
  }

  const initSlippage = () => {
    ;[slippageLabel.current.lineX, slippageLabel.current.lineY] = createCrossLines(d3SVG.current, {
      x1: 0,
      x2: width,
      y1: 0,
      y2: height,
      stroke: '#252566',
      clipPath: '',
      showOnHover: false,
    })

    slippageLabel.current.labelX = createLabelGroup(d3SVG.current, {
      rectAttrs: {
        fill: '#252566',
        ry: 10,
        rx: 10,
      },
      textAttrs: {
        fill: '#fff',
      },
    })

    slippageLabel.current.labelY = createLabelGroup(d3SVG.current, {
      rectAttrs: {
        fill: '#252566',
        ry: 10,
        rx: 10,
      },
      textAttrs: {
        fill: '#fff',
      },
    })

    // slippageLabel.current.tooltip = d3SVG.current.append('g')

    // const tooltipWidth = 90 + labelPaddingX * 2
    // const tooltipHeight = 90

    // slippageLabel.current.tooltip
    //   .append('rect')
    //   .attr('fill', '#323847')
    //   .attr('rx', 15)
    //   .attr('ry', 15)
    //   .attr('height', tooltipHeight)
    //   .attr('width', tooltipWidth)

    // const text = slippageLabel.current.tooltip
    //   .append('text')
    //   .style('font-family', 'Poppins')
    //   .style('font-style', 'normal')
    //   .attr('fill', '#8B8E9F')
    //   .attr('x', labelPaddingX)
    //   .attr('y', labelPaddingX)

    // text
    //   .append('tspan')
    //   .style('font-weight', '600')
    //   .style('font-size', '12px')
    //   .attr('dy', '1.5em')
    //   .attr('x', labelPaddingX)
    //   .text('Est. Fill Price')

    // text
    //   .append('tspan')
    //   .attr('class', 'estimidated-fill-price-value')
    //   .style('font-weight', '400')
    //   .style('font-size', '11px')
    //   .attr('dy', '1.5em')
    //   .attr('x', labelPaddingX)

    // text
    //   .append('tspan')
    //   .style('font-weight', '600')
    //   .style('font-size', '11px')
    //   .attr('dy', '1.5em')
    //   .attr('x', labelPaddingX)
    //   .text('Est. Slippage')

    // text
    //   .append('tspan')
    //   .attr('class', 'estimidated-slippage-value')
    //   .style('font-weight', '400')
    //   .style('font-size', '11px')
    //   .attr('dy', '1.5em')
    //   .attr('x', labelPaddingX)
  }

  const applyZoom = (scale: number, duration = 0) => {
    d3SVG.current
      .transition()
      .duration(duration)
      .call(zoom.current.transform, d3.zoomIdentity.translate(0, 0).scale(scale))
  }

  useEffect(() => {
    d3SVG.current = d3.select(SVGRef.current as any)

    d3SVG.current.selectAll('*').remove()

    initClipPath()
    initAxis()
    initAreaCharts()
    initWhiteRect()
    initCrossLine()
    initMiddleLine()
    initActiveDots()
    initLabels()
    hiddenLabels()
    initNotAllowedValues()
    initSlippage()

    x.current = d3.scaleLinear().range([marginLeft, width - marginRight])
    y.current = d3.scaleLinear().range([height - marginBottom, marginTop])

    scaleX.current = d3.scaleLinear().range([marginLeft, width - marginRight])
    scaleY.current = d3.scaleLinear().range([height - marginBottom, marginTop])

    zoom.current = d3.zoom().scaleExtent(zoomScaleExtent.current)
  }, [])

  useEffect(() => {
    if (!bids?.length || !asks?.length) {
      return
    }

    const lastBidsPrice = bids[bids.length - 1].price
    const firstAsksPrice = asks[0].price

    middleLineValue.current = lastBidsPrice + (firstAsksPrice - lastBidsPrice) / 2
  }, [bids, asks])

  useEffect(() => {
    if (!bids?.length || !asks?.length) {
      return
    }

    // dominio X por defecto
    x.current.domain([Math.max(...merged.map((d) => d.btc)), 0])

    // dominio Y por defecto
    const point1 = Math.min(...bids.map((d) => d.price))
    const point2 = Math.max(...asks.map((d) => d.price))

    lastDomainYPoints.current[0] = point1
    lastDomainYPoints.current[1] = point2

    fixedDomain.current = null

    // if (
    //   bids.length < 20 &&
    //   asks.length < 20 &&
    //   point1 < lastDomainYPoints.current[0] &&
    //   point2 > lastDomainYPoints.current[1]
    // ) {
    //   lastDomainYPoints.current = [point1, point2]
    //   fixedDomain.current = null
    // }

    // if (
    //   !fixedDomain.current
    //   // ||
    //   // point1 > lastDomainYPoints.current[0] ||
    //   // point2 < lastDomainYPoints.current[1]
    //   // || (point1 < lastDomainYPoints.current[0] && point2 > lastDomainYPoints.current[1])
    // ) {
    // lastDomainYPoints.current = [point1, point2]

    const middleValue = middleLineValue.current

    const distanceToPoint1 = Math.abs(middleValue - lastDomainYPoints.current[0])
    const distanceToPoint2 = Math.abs(middleValue - lastDomainYPoints.current[1])

    const minorDistance = Math.min(distanceToPoint1, distanceToPoint2)

    // New points based on the middle value and the minor distance
    const newPoint1 = middleValue - minorDistance
    const newPoint2 = middleValue + minorDistance

    fixedDomain.current = [newPoint1, newPoint2]
    // }

    y.current.domain(fixedDomain.current)

    // Se aplican las escalas
    scaleX.current = transform.current ? transform.current.rescaleX(x.current) : x.current
    scaleY.current = transform.current ? transform.current.rescaleY(y.current) : y.current

    const diffBetweenMiddleLine =
      Math.abs(y.current(bids[bids.length - 1].price)) - Math.abs(y.current(middleLineValue.current))

    const baseValue = parseFloat(diffBetweenMiddleLine.toFixed(5))

    if (baseValue > 0 && lastBaseValue.current != baseValue) {
      let minScale = 1
      let maxScale = 1

      for (let i = 1; i < 200; i = i + 0.1) {
        const futureValue = baseValue * Math.pow(i, 2)

        if (futureValue > 30 && minScale === 1) {
          minScale = i
        }
        if (futureValue > 75 && maxScale === 1) {
          maxScale = i
        }

        if (maxScale !== 1 && minScale !== 1) {
          break
        }
      }

      zoomScaleExtent.current = [minScale, maxScale]

      zoom.current.scaleExtent(zoomScaleExtent.current)

      const currentScale = transform.current?.k || 1
      const currentScaleIsLessThanMin = currentScale < zoomScaleExtent.current[0]
      const currentScaleIsMoreThanMax = currentScale > zoomScaleExtent.current[1]

      if (!typedAmount && (!currentScale || currentScaleIsLessThanMin || currentScaleIsMoreThanMax)) {
        if (currentScaleIsMoreThanMax) {
          applyZoom(zoomScaleExtent.current[1])
        } else {
          applyZoom(zoomScaleExtent.current[0])
        }
      }
    }

    lastBaseValue.current = baseValue

    const rangeY = (scaleY.current.domain()[1] - scaleY.current.domain()[0]) / (transform?.current?.k || 1)

    const newDomainY = [middleLineValue.current - rangeY / 2, middleLineValue.current + rangeY / 2]

    scaleY.current.domain(newDomainY)

    const visibleData = merged.filter(
      (d) => scaleY.current(d.price) > marginTop && scaleY.current(d.price) < height - marginBottom
    )

    const maxVisibleX = d3.max(visibleData, (d) => d.btc) || 1

    if (visibleData.length < 10 && zoomScaleExtent.current[1] === 200) {
      zoomScaleExtent.current = [1, transform?.current?.k || 1]
    }

    scaleX.current.domain([maxVisibleX * 1.2, 0])

    areaBids.current.attr('d', area(bids, scaleX.current, scaleY.current, 'bids'))
    areaAsks.current.attr('d', area(asks, scaleX.current, scaleY.current, 'asks'))

    gx.current.call(xAxis, scaleX.current)
    gy.current.call(yAxis, scaleY.current)

    d3SVG.current.selectAll('.tick').each(function (this: SVGElement, d: number) {
      if (d == 0) {
        d3.select(this).attr('visibility', 'hidden')
      }
    })

    d3SVG.current.selectAll('.domain').style('color', 'transparent')

    if (
      (typedAmount && (!transform.current?.k || transform.current?.k > zoomScaleExtent.current[0])) ||
      (!typedAmount && lastTypedAmount.current && transform.current?.k < zoomScaleExtent.current[0])
    ) {
      applyZoom(zoomScaleExtent.current[0], 500)
    }

    if (typedAmount) {
      const closestDataPoint = asks.find((d) => typedAmount <= d.btc)
      const TypedAmountPos = Math.abs(y.current(middleLineValue.current)) - Math.abs(y.current(closestDataPoint?.price))
      const diffBetweenTypedAmountAndLimitTop = scaleY.current(closestDataPoint?.price) - marginTop

      // console.log(typedAmount, diffBetweenTypedAmountAndLimitTop, middleLinePosition.current, closestDataPoint?.price)

      if (diffBetweenTypedAmountAndLimitTop < 0) {
        const targetPos = Math.abs(y.current(middleLineValue.current)) - marginTop - labelHeight
        const baseValue = parseFloat(TypedAmountPos.toFixed(5))

        // console.log('baseValue', baseValue, targetPos)

        for (let i = 1; i < 200; i = i + 0.01) {
          const futureValue = baseValue * Math.pow(i, 2)

          if (futureValue >= targetPos) {
            // console.log('futureValue', futureValue, targetPos, i)
            if (i < zoomScaleExtent.current[0]) {
              // console.log(i)
              typedAmountScale.current = i

              d3SVG.current
                .transition(0)
                .duration(500)
                .call(zoom.current.transform, d3.zoomIdentity.translate(0, 0).scale(typedAmountScale.current))
            }

            break
          }
        }
      }

      lastTypedAmount.current = typedAmount
    }

    const currentScale = transform.current?.k || 1
    const maxScale = zoomScaleExtent.current[1]
    const minScale =
      typedAmount && typedAmountScale.current !== 1 ? typedAmountScale.current : zoomScaleExtent.current[0]

    const currentScaleIsLessThanMin = currentScale < minScale
    const currentScaleIsMoreThanMax = currentScale > maxScale

    if (currentScaleIsMoreThanMax) {
      applyZoom(maxScale)
    } else if (currentScaleIsLessThanMin) {
      applyZoom(minScale)
    }
  }, [middleLineValue.current, merged, typedAmount])

  useEffect(() => {
    middleLinePosition.current = scaleY.current(middleLineValue.current)

    asksClipPath.current.attr('height', middleLinePosition.current - marginTop)

    bidsClipPath.current
      .attr('y', middleLinePosition.current)
      .attr('height', height - middleLinePosition.current - marginBottom)

    // bidsWhiteRect.current.attr('height', middleLinePosition.current - marginTop)
    // AsksWhiteRect.current
    //   .attr('height', middleLinePosition.current)
    //   .attr('y', middleLinePosition.current)

    moveLine(middleLineY.current, { y1: middleLinePosition.current, y2: middleLinePosition.current })
  }, [bids, asks, height])

  const updateSlippage = useCallback(() => {
    if (typedAmount <= 0 || asks.length === 0) return

    const minAskPrice = asks[0].price
    const minAskPos = scaleY.current(minAskPrice)
    const closestDataPoint = asks.find((d) => typedAmount <= d.btc)
    const amountPosition = scaleX.current(typedAmount)
    const pricePosition = scaleY.current(closestDataPoint?.price || 0)

    /**
     * AKS LIMIT
     */
    moveLine(asksNotAllowedMoreThan.current.lineY, { y1: minAskPos, y2: minAskPos })
    setTextLabelGroup(asksNotAllowedMoreThan.current.labelY, formatAmount(minAskPrice, 6, true))
    moveLabelGroupFixedRight(asksNotAllowedMoreThan.current.labelY, { y: minAskPos, width, marginRight })

    /**
     * SLIPPAGE LABEL AND LINE X
     */
    moveLine(slippageLabel.current.lineX, {
      x1: amountPosition,
      x2: amountPosition,
      y1: marginTop,
      y2: pricePosition,
    })
    setTextLabelGroup(slippageLabel.current.labelX, formatCurrency(typedAmount))
    moveLabelGroupFixedTop(slippageLabel.current.labelX, { x: amountPosition, marginTop })

    /**
     * SLIPPAGE LABEL AND LINE Y
     */
    moveLine(slippageLabel.current.lineY, {
      x1: width - marginRight,
      x2: amountPosition,
      y1: pricePosition,
      y2: pricePosition,
    })
    setTextLabelGroup(slippageLabel.current.labelY, formatAmount(closestDataPoint?.price, 6, true))
    moveLabelGroupFixedRight(slippageLabel.current.labelY, { y: pricePosition, width, marginRight })

    /**
     * SLIPPAGE TOOLTIP
     */
    if (closestDataPoint?.price && diffPercentValues(closestDataPoint?.price, minAskPrice) > 0.01) {
      const estimatedSlippage = Number(diffPercentValues(closestDataPoint?.price, minAskPrice));

      setEstimatedSlippageValue(estimatedSlippage);

      setSlippageTooltipText(slippageLabelTooltip?.current, {
        estimidatedFillPrice: closestDataPoint?.price,
        estimatedSlippage: Number(estimatedSlippage.toFixed(3)),
      })
    } else {
      hideSlippageLabel(slippageLabelTooltip.current)
      setEstimatedSlippageValue(0);
    }

    moveSlippageLabel(slippageLabelTooltip?.current, {
      x: 10,
      y: minAskPos - Number(slippageLabelTooltip?.current?.offsetHeight) - 10,
      width,
      height,
      marginLeft,
      marginRight,
      marginTop,
      marginBottom,
    })

    /**
     * If current price is equal to min ask price then hide label and line y of ask limits
     */
    if (pricePosition === minAskPos) {
      hideElement(asksNotAllowedMoreThan.current.labelY)
      hideElement(asksNotAllowedMoreThan.current.lineY)
    } else {
      showElement(asksNotAllowedMoreThan.current.labelY)
      showElement(asksNotAllowedMoreThan.current.lineY)
    }
  }, [asks, height, typedAmount, width])

  useEffect(() => {
    if (!bids?.length || !asks?.length) {
      return
    }

    removed3Events(d3SVG.current)

    function updateLabels() {
      if (!lastMousePosition.current.y) return

      let bidsMousePositionY = 0
      let asksMousePositionY = 0

      if (middleLinePosition.current > lastMousePosition.current.y) {
        asksMousePositionY = lastMousePosition.current.y
        bidsMousePositionY = height - marginBottom - lastMousePosition.current.y
      } else {
        bidsMousePositionY = lastMousePosition.current.y
        asksMousePositionY = middleLinePosition.current - (lastMousePosition.current.y - middleLinePosition.current)
      }

      const mouseYDataBids = scaleY.current.invert(bidsMousePositionY)
      const mouseYDataAsks = scaleY.current.invert(asksMousePositionY)

      let bidsCurrentData: any = {}
      let asksCurrentData: any = {}

      let BidsBtcX = 0
      let BidsPriceY = 0

      // if (mouseYDataBids > bidsNotAllowedMoreThan.current.value) {
      //   mouseYDataBids = bidsNotAllowedMoreThan.current.value
      // }

      let indexBid = bisect(bids, mouseYDataBids, 1)

      if (indexBid === bids.length) {
        indexBid = indexBid - 1
      } else if (labelsAreActive) {
        showLabels()
      }

      while (indexBid < bids.length) {
        const i2 = indexBid - 1

        const selectedIndex = mouseYDataBids - bids[i2]?.price > bids[indexBid]?.price - mouseYDataBids ? indexBid : i2

        bidsCurrentData = bids[selectedIndex]

        if (!bidsCurrentData) return

        BidsPriceY = scaleY.current(bidsCurrentData.price)
        BidsBtcX = scaleX.current(bidsCurrentData.btc)

        if (BidsPriceY > height - (marginBottom + labelHeight)) {
          indexBid++
        } else {
          break
        }
      }

      // if (mouseYDataAsks < asksNotAllowedMoreThan.current.value) {
      //   mouseYDataAsks = asksNotAllowedMoreThan.current.value
      // }

      let indexAsk = bisect(asks, mouseYDataAsks, 1)

      if (indexAsk === asks.length) {
        indexAsk = indexAsk - 1
      } else if (labelsAreActive) {
        showLabels()
      }

      let AsksBtcX = 0
      let AsksPriceY = 0

      while (indexAsk > 0) {
        const i3 = indexAsk - 1
        const selectedIndexAsk =
          mouseYDataAsks - asks[i3]?.price > asks[indexAsk]?.price - mouseYDataAsks ? indexAsk : i3

        asksCurrentData = asks[selectedIndexAsk]

        if (!asksCurrentData) return

        AsksBtcX = scaleX.current(asksCurrentData.btc)
        AsksPriceY = scaleY.current(asksCurrentData.price)

        if (AsksPriceY < labelHeight + marginTop) {
          indexAsk--
        } else {
          break
        }
      }

      if (!asksCurrentData || !bidsCurrentData) return

      moveLine(bidsLabels.current.lineX, { x1: BidsBtcX, x2: BidsBtcX })
      moveLine(bidsLabels.current.lineY, { y1: BidsPriceY, y2: BidsPriceY })
      moveElement(bidsLabels.current.activeDot, { x: BidsBtcX, y: BidsPriceY })

      bidsWhiteRect.current.attr('height', BidsPriceY - marginTop)

      /**
       * SET LABELS X
       */

      setTextLabelGroup(bidsLabels.current.labelX, formatAmount(bidsCurrentData.btc, 6, true))
      setTextLabelGroup(bidsLabels.current.labelY, formatAmount(bidsCurrentData.price, 6, true))
      setTextLabelGroup(
        bidsLabels.current.labelPercent,
        getPriceDiffPercentage(bidsCurrentData.price, middleLineValue.current)
      )

      moveLabelGroupFixedRight(bidsLabels.current.labelY, { y: BidsPriceY, width, marginRight })
      moveLabelGroupFixedBottom(bidsLabels.current.labelX, { x: BidsBtcX, height, marginBottom })
      moveLabelGroup(bidsLabels.current.labelPercent, {
        x: BidsBtcX,
        y: middleLinePosition.current + (BidsPriceY - middleLinePosition.current) / 2,
      })

      /**
       * ASKS
       */

      moveLine(asksLabels.current.lineX, { x1: AsksBtcX, x2: AsksBtcX })
      moveLine(asksLabels.current.lineY, { y1: AsksPriceY, y2: AsksPriceY })
      moveElement(asksLabels.current.activeDot, { x: AsksBtcX, y: AsksPriceY })

      AsksWhiteRect.current.attr('y', AsksPriceY).attr('height', height - AsksPriceY - marginBottom)

      /**
       * SET LABELS X
       */

      setTextLabelGroup(asksLabels.current.labelX, formatAmount(asksCurrentData.btc, 6, true))
      setTextLabelGroup(asksLabels.current.labelY, formatAmount(asksCurrentData.price, 6, true))
      setTextLabelGroup(
        asksLabels.current.labelPercent,
        getPriceDiffPercentage(middleLineValue.current, asksCurrentData.price)
      )

      moveLabelGroupFixedRight(asksLabels.current.labelY, { y: AsksPriceY, width, marginRight })
      moveLabelGroupFixedTop(asksLabels.current.labelX, { x: AsksBtcX, marginTop })
      moveLabelGroup(asksLabels.current.labelPercent, {
        x: AsksBtcX,
        y: middleLinePosition.current + (AsksPriceY - middleLinePosition.current) / 2,
      })
    }

    d3SVG.current.on('mouseleave', hiddenLabels)
    d3SVG.current.on('mouseenter', () => {
      if (!lastMousePosition.current.y) return

      showLabels()
    })

    d3SVG.current.on('mousemove', function (event: MouseEvent) {
      const [, my] = d3.pointer(event, SVGRef.current as any)

      lastMousePosition.current = { x: 0, y: my }

      showLabels()
      updateLabels()
    })

    zoom.current.on('zoom', (event: any) => {
      transform.current = event.transform

      scaleX.current = transform.current.rescaleX(x.current)
      scaleY.current = transform.current.rescaleY(y.current)

      const rangeY = (scaleY.current.domain()[1] - scaleY.current.domain()[0]) / transform.current.k

      const newDomainY = [middleLineValue.current - rangeY / 2, middleLineValue.current + rangeY / 2]

      scaleY.current.domain(newDomainY)

      const visibleData = merged.filter(
        (d) => scaleY.current(d.price) >= marginTop && scaleY.current(d.price) <= height - marginBottom
      )

      const maxVisibleX = d3.max(visibleData, (d) => d.btc) as number

      scaleX.current.domain([maxVisibleX * 1.5, 0])

      areaBids.current.attr('d', area(bids, scaleX.current, scaleY.current, 'bids'))
      areaAsks.current.attr('d', area(asks, scaleX.current, scaleY.current, 'asks'))

      gx.current.call(xAxis, scaleX.current)
      gy.current.call(yAxis, scaleY.current)

      middleLineY.current
        .attr('y1', scaleY.current(middleLineValue.current))
        .attr('y2', scaleY.current(middleLineValue.current))
      asksClipPath.current.attr('height', scaleY.current(middleLineValue.current) - marginTop)
      bidsClipPath.current
        .attr('y', scaleY.current(middleLineValue.current))
        .attr('height', height - scaleY.current(middleLineValue.current) - marginBottom)

      // bidsNotAllowedMoreThan.current.elem
      //   .attr('y1', scaleY.current(bidsNotAllowedMoreThan.current.value))
      //   .attr('y2', scaleY.current(bidsNotAllowedMoreThan.current.value))

      asksNotAllowedMoreThan.current.lineY
        .attr('y1', scaleY.current(asksNotAllowedMoreThan.current.value))
        .attr('y2', scaleY.current(asksNotAllowedMoreThan.current.value))

      updateLabels()

      updateSlippage()
    })

    d3SVG.current.call(zoom.current)

    updateLabels()

    return () => {
      // zoom.current.on('zoom', null)
      removed3Events(d3SVG.current)
    }
  }, [asks, bids, bisect, height, labelsAreActive, merged, typedAmount, width, updateSlippage])

  useEffect(() => {
    if (typedAmount <= 0) {
      hideElement(slippageLabel.current.lineX)
      hideElement(slippageLabel.current.lineY)
      hideElement(slippageLabel.current.labelY)
      hideElement(slippageLabel.current.labelX)
      hideElement(asksNotAllowedMoreThan.current.labelY)
      hideElement(asksNotAllowedMoreThan.current.lineY)
      hideSlippageLabel(slippageLabelTooltip.current)
      return
    } else {
      showElement(slippageLabel.current.lineX)
      showElement(slippageLabel.current.lineY)
      showElement(slippageLabel.current.labelY)
      showElement(slippageLabel.current.labelX)
      showSlippageLabel(slippageLabelTooltip.current)
    }
  }, [typedAmount])

  useEffect(() => {
    updateSlippage()
  }, [updateSlippage])

  return (
    <SvgWrapper>
      <ChartDesktopHeader />
      <SVGContainer>
        <ForwardedTooltip ref={slippageLabelTooltip} />
        <svg ref={SVGRef} width={width} height={height} />
      </SVGContainer>
    </SvgWrapper>
  )
}

const DepthChartVertical = () => {
  const activeMarket = useActiveMarket()
  const { ask, bid } = useBidAskPrice(activeMarket?.name, activeMarket?.pricePrecision)

  const { width: windowsWidth } = useWindowSize()
  const shortVersion = useMemo(() => windowsWidth <= MEDIA_WIDTHS.upToExtraLarge, [windowsWidth])
  const [currentWidth, setCurrentWidth] = useState(useWindowSize())

  //    height: 593px;
  //   ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  //    height: 487px;
  // `};
  //   ${({ theme }) => theme.mediaWidth.upToLarge`
  //    height: 432.25px;
  // `};
  //   ${({ theme }) => theme.mediaWidth.upToLarge`
  //    height: 452px;
  // `};
  //   ${({ theme }) => theme.mediaWidth.upToMedium`
  //    height: 400px;
  // `};
  if (Number(ask) === 0 || Number(bid) === 0) {
    return <ChartDesktopLoading width={350} height={shortVersion ? 480 : 550} />
  }

  if (shortVersion) {
    return <DepthChartVerticalInner width={350} height={480} key={`${activeMarket?.name || 'vertical'}-short`} />
  }

  return <DepthChartVerticalInner width={350} height={550} key={activeMarket?.name || 'vertical'} />
}

const DepthChartHorizontalInner = ({ width, height = 500 }: { width?: number; height?: number }) => {
  const orderType = useOrderType()
  const activeMarket = useActiveMarket()
  const setEstimatedSlippageValue = useSetEstimatedSlippageValue();
  const depthGrapht = useDepthGraph(activeMarket?.name)
  const { ask, bid, spread } = useBidAskPrice(activeMarket?.name, activeMarket?.pricePrecision)
  const { formattedAmounts } = useTradePage()

  const [labelsAreActive, setLabelsAreActive] = useState(false)
  const [svgWidth, setSvgWidth] = useState(0)

  const lastMousePosition = useRef({ x: 0, y: 0 })
  const SVGRef = useRef(null)
  const d3SVG = useRef<any>(null)
  const bidsLabels = useRef<{ labelX: any; labelY: any; lineX: any; lineY: any; labelPercent: any; activeDot: any }>({
    labelX: null,
    labelY: null,
    lineX: null,
    lineY: null,
    labelPercent: null,
    activeDot: null,
  })
  const asksLabels = useRef<{ labelX: any; labelY: any; lineX: any; lineY: any; labelPercent: any; activeDot: any }>({
    labelX: null,
    labelY: null,
    lineX: null,
    lineY: null,
    labelPercent: null,
    activeDot: null,
  })
  const asksClipPath = useRef<any>(null)
  const bidsClipPath = useRef<any>(null)
  const bidsWhiteRect = useRef<any>(null)
  const AsksWhiteRect = useRef<any>(null)
  const gx = useRef<any>(null)
  const gy = useRef<any>(null)
  const areaBids = useRef<any>(null)
  const areaAsks = useRef<any>(null)
  const middleLineY = useRef<any>(null)
  const transform = useRef<any>(null)
  const middleLineValue = useRef<number>(0)
  const middleLinePosition = useRef<number>(0)
  const fixedDomain = useRef<any>(null)
  const lastDomainYPoints = useRef<any>([0, 0])
  const level = useRef<any>(null)
  const lastData = useRef<{ bids: Array<any>; asks: Array<any> }>({ bids: [], asks: [] })
  const zoomScaleExtent = useRef<any>([1, 1])
  const lastBaseValue = useRef<number>(0)
  const x = useRef<any>(null)
  const y = useRef<any>(null)
  const scaleX = useRef<any>(null)
  const scaleY = useRef<any>(null)
  const zoom = useRef<any>(null)
  const slippageLabel = useRef<{ lineX: any; lineY: any; labelX: any; labelY: any }>({
    lineX: null,
    lineY: null,
    labelX: null,
    labelY: null,
  })
  const slippageLabelTooltip = useRef<any>(null)
  const bidsNotAllowedMoreThan = useRef<{ value: number; position: number; lineY: any }>({
    value: 0,
    lineY: null,
    position: 0,
  })
  const asksNotAllowedMoreThan = useRef<{ value: number; position: number; lineX: any; labelX: any }>({
    value: 0,
    lineX: null,
    position: 0,
    labelX: null,
  })
  const lastTypedAmount = useRef<number>(0)
  const typedAmountScale = useRef<any>(1)

  const svgMaxWidth = useMemo(() => width || 0, [width])

  const marginLeft = 0,
    marginRight = 50,
    marginTop = 0,
    marginBottom = 25

  useEffect(() => {
    fixedDomain.current = null
  }, [activeMarket?.name])

  useEffect(() => {
    bidsNotAllowedMoreThan.current.value = Number(bid)
    asksNotAllowedMoreThan.current.value = Number(ask)
  }, [bid, ask])

  const data = useMemo(
    () =>
      processDataFromWebsocket({
        depthGrapht,
        level,
        lastData,
      }),
    [depthGrapht]
  )

  const bids = useMemo(
    () =>
      bid && level.current
        ? processBids({
            bids: data.bids,
            maxBid: Number(customToFixed(Number(bid), level.current, false)),
            spread: Number(spread) / 100,
          })
        : [],
    [data, bid, spread]
  ) as Array<DepthChartData>

  const asks = useMemo(
    () =>
      ask && level.current
        ? processtAsks({
            asks: data.asks,
            minAsk: Number(customToFixed(Number(ask), level.current, false)),
            spread: Number(spread) / 100,
          })
        : [],
    [data, ask, spread]
  ) as Array<DepthChartData>

  const merged = useMemo(() => [...bids, ...asks], [bids, asks]) as Array<DepthChartData>

  const [minBidAmount, maxBidAmount] = useMemo(() => {
    const amounts = bids.map((bid) => bid.btc)

    return [Math.min(...amounts), Math.max(...amounts)]
  }, [bids])

  const [minAskAmount, maxAskAmount] = useMemo(() => {
    const amounts = asks.map((ask) => ask.btc)

    return [Math.min(...amounts), Math.max(...amounts)]
  }, [asks])

  const typedAmount = useMemo(() => {
    const formated = parseFloat(formattedAmounts[1] || '0')

    return orderType === OrderType.MARKET && formated < maxAskAmount ? formated : 0
  }, [formattedAmounts, orderType, maxAskAmount])

  const xAxis = (g, x) => {
    const maxValue = x.domain()[1]
    const minValue = x.domain()[0]
    const tickCount = 6
    const tickStep = (maxValue - minValue) / (tickCount - 1)
    let tickValues = Array.from({ length: tickCount }, (_, i) => minValue + tickStep * i)

    tickValues = tickValues.slice(1, tickValues.length - 1)

    return g.call(
      d3
        .axisBottom(x)
        .tickValues(tickValues)
        .tickFormat((value: any) => formatAmount(value, 7, true))
    )
  }

  const yAxis = (g, y) => {
    return g.call(
      d3
        .axisRight(y)
        .ticks(7)
        .tickFormat((value: any) => formatCurrency(value))
    )
  }

  const area = (data, x, y, type: 'bids' | 'asks') =>
    d3
      .area()
      .x((d: any) => x(d.price))
      .y0(y(0))
      .y1((d: any) => y(d.btc))
      .curve(type === 'bids' ? d3.curveStepBefore : d3.curveStepAfter)(data)

  const bisect = d3.bisector((d: any) => d.price).left

  const hiddenLabels = () => {
    d3SVG.current.selectAll('.show-on-hover').attr('visibility', 'hidden')
    setLabelsAreActive(false)
    lastMousePosition.current.x = 0
  }

  const showLabels = () => {
    d3SVG.current.selectAll('.show-on-hover').attr('visibility', 'visible')
    setLabelsAreActive(true)
  }

  const applyZoom = (scale: number, duration = 0) => {
    d3SVG.current
      .transition()
      .duration(duration)
      .call(zoom.current.transform, d3.zoomIdentity.translate(0, 0).scale(scale))
  }

  useEffect(() => {
    d3SVG.current = d3.select(SVGRef.current as any)

    const handleResize = () => {
      setSvgWidth(d3SVG?.current?.node()?.parentNode?.clientWidth)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    d3SVG.current.selectAll('*').remove()

    const initClipPath = () => {
      asksClipPath.current = createClipPath(d3SVG.current, {
        id: 'clip-asks-horizontal',
        y: marginTop,
        width: marginLeft,
        height: height - marginTop - marginBottom,
      })

      bidsClipPath.current = createClipPath(d3SVG.current, {
        id: 'clip-bids-horizontal',
        x: marginLeft,
        y: marginTop,
        width: marginLeft,
        height: height - marginTop - marginBottom,
      })
    }

    const initWhiteRect = () => {
      bidsWhiteRect.current = createWhiteRect(d3SVG.current, {
        height: height - marginTop - marginBottom,
        width: Math.max(svgWidth - marginRight - marginLeft, 0),
        x: marginLeft,
        y: marginTop,
        clipPath: 'url(#clip-bids-horizontal)',
      })

      AsksWhiteRect.current = createWhiteRect(d3SVG.current, {
        height: height - marginTop - marginBottom,
        width: marginLeft,
        y: marginTop,
        clipPath: 'url(#clip-asks-horizontal)',
      })
    }

    const initAxis = () => {
      gx.current = d3SVG.current
        .append('g')
        .attr('transform', `translate(0,${height - marginBottom})`)
        .style('color', 'rgba(255, 255, 255, 0.70)')

      gy.current = d3SVG.current
        .append('g')
        .attr('transform', `translate(${Math.max(svgWidth - marginRight, 0)},0)`)
        .style('color', 'rgba(255, 255, 255, 0.70)')
    }

    const initAreaCharts = () => {
      areaBids.current = d3SVG.current
        .append('path')
        .attr('clip-path', 'url(#clip-bids-horizontal)')
        .attr('fill', 'rgba(27, 188, 122, 0.10)')
        .attr('stroke', '#27F290')

      areaAsks.current = d3SVG.current
        .append('path')
        .attr('clip-path', 'url(#clip-asks-horizontal)')
        .attr('stroke', '#BD2738')
        .attr('fill', 'rgba(234, 60, 85, 0.10)')
    }

    const initMiddleLine = () => {
      middleLineY.current = d3SVG.current
        .append('line')
        .attr('y1', marginTop)
        .attr('x1', 0)
        .attr('y2', height - marginBottom)
        .attr('x2', 0)
        .attr('stroke', 'rgba(255, 255, 255, 0.10)')
        .attr('stroke-width', 1)
    }

    const initNotAllowedValues = () => {
      asksNotAllowedMoreThan.current.lineX = d3SVG.current
        .append('line')
        .attr('y1', marginTop)
        .attr('x1', 0)
        .attr('y2', height - marginBottom)
        .attr('x2', 0)
        .attr('stroke', '#2C2CBC')
        .attr('stroke-width', 2)
        .style('stroke-dasharray', '3, 3')

      asksNotAllowedMoreThan.current.labelX = createLabelGroup(d3SVG.current, {
        rectAttrs: { fill: '#2C2CBC', ry: 10, rx: 10 },
        textAttrs: { fill: '#FFF' },
      })

      hideElement(asksNotAllowedMoreThan.current.labelX)
    }

    const initCrossLine = () => {
      ;[bidsLabels.current.lineX, bidsLabels.current.lineY] = createCrossLines(d3SVG.current, {
        x1: 0,
        x2: svgWidth,
        y1: 0,
        y2: height,
        stroke: '#27F290',
        clipPath: 'url(#clip-bids-horizontal)',
      })
      ;[asksLabels.current.lineX, asksLabels.current.lineY] = createCrossLines(d3SVG.current, {
        x1: 0,
        x2: svgWidth,
        y1: 0,
        y2: height,
        stroke: '#BD2738',
        clipPath: 'url(#clip-asks-horizontal)',
      })

      showOnHover(bidsLabels.current.lineX)
      showOnHover(bidsLabels.current.lineY)
      showOnHover(asksLabels.current.lineX)
      showOnHover(asksLabels.current.lineY)
    }

    const initLabels = () => {
      bidsLabels.current.labelX = createLabelGroup(d3SVG.current, {
        rectAttrs: { fill: '#171A1F' },
        textAttrs: { fill: '#27F291' },
      })

      bidsLabels.current.labelY = createLabelGroup(d3SVG.current, {
        rectAttrs: { fill: '#171A1F' },
        textAttrs: { fill: '#27F291' },
      })

      bidsLabels.current.labelPercent = createLabelGroup(d3SVG.current, {
        rectAttrs: { fill: '#171A1F' },
        textAttrs: { fill: '#27F291' },
      })

      asksLabels.current.labelX = createLabelGroup(d3SVG.current, {
        rectAttrs: { fill: '#171A1F' },
        textAttrs: { fill: '#BD2738' },
      })

      asksLabels.current.labelY = createLabelGroup(d3SVG.current, {
        rectAttrs: { fill: '#171A1F' },
        textAttrs: { fill: '#BD2738' },
      })

      asksLabels.current.labelPercent = createLabelGroup(d3SVG.current, {
        rectAttrs: { fill: '#171A1F' },
        textAttrs: { fill: '#BD2738' },
      })

      showOnHover(bidsLabels.current.labelX)
      showOnHover(bidsLabels.current.labelY)
      showOnHover(bidsLabels.current.labelPercent)
      showOnHover(asksLabels.current.labelX)
      showOnHover(asksLabels.current.labelY)
      showOnHover(asksLabels.current.labelPercent)
    }

    const initActiveDots = () => {
      bidsLabels.current.activeDot = createActiveDot(d3SVG.current, {
        color: '#27F291',
      })

      asksLabels.current.activeDot = createActiveDot(d3SVG.current, {
        color: '#BD2738',
      })
    }

    const initSlippage = () => {
      ;[slippageLabel.current.lineX, slippageLabel.current.lineY] = createCrossLines(d3SVG.current, {
        x1: 0,
        x2: svgWidth,
        y1: 0,
        y2: height,
        stroke: '#252566',
        clipPath: '',
        showOnHover: false,
      })

      slippageLabel.current.labelX = createLabelGroup(d3SVG.current, {
        rectAttrs: {
          fill: '#252566',
          ry: 10,
          rx: 10,
        },
        textAttrs: {
          fill: '#fff',
        },
      })

      slippageLabel.current.labelY = createLabelGroup(d3SVG.current, {
        rectAttrs: {
          fill: '#252566',
          ry: 10,
          rx: 10,
        },
        textAttrs: {
          fill: '#fff',
        },
      })

      //   slippageLabel.current.tooltip = d3SVG.current.append('g')

      //   const tooltipWidth = 130 + labelPaddingX * 2
      //   const tooltipHeight = 90

      //   slippageLabel.current.tooltip
      //     .append('rect')
      //     .attr('fill', '#323847')
      //     .attr('rx', 15)
      //     .attr('ry', 15)
      //     .attr('height', tooltipHeight)
      //     .attr('width', tooltipWidth)

      //   const text = slippageLabel.current.tooltip
      //     .append('text')
      //     .style('font-family', 'Poppins')
      //     .style('font-style', 'normal')
      //     .attr('fill', '#8B8E9F')
      //     .attr('x', labelPaddingX)
      //     .attr('y', labelPaddingX)

      //   text
      //     .append('tspan')
      //     .style('font-weight', '600')
      //     .style('font-size', '11px')
      //     .attr('dy', '1.5em')
      //     .attr('x', labelPaddingX)
      //     .text('Estimidated fill price')

      //   text
      //     .append('tspan')
      //     .attr('class', 'estimidated-fill-price-value')
      //     .style('font-weight', '500')
      //     .style('font-size', '11px')
      //     .attr('dy', '1.5em')
      //     .attr('x', labelPaddingX)

      //   text
      //     .append('tspan')
      //     .style('font-weight', '600')
      //     .style('font-size', '11px')
      //     .attr('dy', '1.5em')
      //     .attr('x', labelPaddingX)
      //     .text('Estimidated Slippage')

      //   text
      //     .append('tspan')
      //     .attr('class', 'estimidated-slippage-value')
      //     .style('font-weight', '500')
      //     .style('font-size', '11px')
      //     .attr('dy', '1.5em')
      //     .attr('x', labelPaddingX)
    }

    initClipPath()
    initAxis()
    initAreaCharts()
    initWhiteRect()
    initCrossLine()
    initMiddleLine()
    initActiveDots()
    initLabels()
    hiddenLabels()
    initNotAllowedValues()
    initSlippage()

    x.current = d3.scaleLinear().range([marginLeft, Math.max(svgWidth - marginRight, 0)])
    y.current = d3.scaleLinear().range([marginTop, height - marginBottom])

    scaleX.current = d3.scaleLinear().range([marginLeft, Math.max(svgWidth - marginRight, 0)])
    scaleY.current = d3.scaleLinear().range([marginTop, height - marginBottom])

    zoom.current = d3.zoom().scaleExtent(zoomScaleExtent.current)
  }, [height, svgWidth])

  useEffect(() => {
    if (!bids?.length || !asks?.length) {
      return
    }

    const lastBidsPrice = bids[bids.length - 1].price
    const firstAsksPrice = asks[0].price

    middleLineValue.current = lastBidsPrice + (firstAsksPrice - lastBidsPrice) / 2
  }, [bids, asks])

  useEffect(() => {
    if (!bids?.length || !asks?.length || !svgWidth) {
      return
    }

    // dominio X por defecto
    const point1 = Math.min(...bids.map((d) => d.price))
    const point2 = Math.max(...asks.map((d) => d.price))

    lastDomainYPoints.current[0] = point1
    lastDomainYPoints.current[1] = point2
    fixedDomain.current = null

    // if (
    //   bids.length < 20 &&
    //   asks.length < 20 &&
    //   point1 < lastDomainYPoints.current[0] &&
    //   point2 > lastDomainYPoints.current[1]
    // ) {
    //   lastDomainYPoints.current = [point1, point2]
    //   fixedDomain.current = null
    // }

    // if (
    //   !fixedDomain.current
    //   // ||
    //   // point1 > lastDomainYPoints.current[0] ||
    //   // point2 < lastDomainYPoints.current[1]
    //   // || (point1 < lastDomainYPoints.current[0] && point2 > lastDomainYPoints.current[1])
    // ) {
    //   // lastDomainYPoints.current = [point1, point2]

    const middleValue = middleLineValue.current

    const distanceToPoint1 = Math.abs(middleValue - lastDomainYPoints.current[0])
    const distanceToPoint2 = Math.abs(middleValue - lastDomainYPoints.current[1])

    const minorDistance = Math.min(distanceToPoint1, distanceToPoint2)

    // if (bids.length > 50 && asks.length > 50) {
    //   minorDistance = minorDistance - Math.ceil(minorDistance * 0.1)
    // } else {
    //   minorDistance = minorDistance - Math.ceil(minorDistance * 0.01)
    // }

    // New points based on the middle value and the minor distance
    const newPoint1 = middleValue - minorDistance
    const newPoint2 = middleValue + minorDistance

    // newPoint1 = newPoint1 + (newPoint1 * 0.001)
    // newPoint2 = newPoint2 - (newPoint2 * 0.001)

    fixedDomain.current = [newPoint1, newPoint2]
    // }

    x.current.domain(fixedDomain.current)

    // dominio Y por defecto
    y.current.domain([d3.max(merged, (d) => d.btc) as number, 0])

    // Se aplican las escalas
    scaleX.current = transform.current ? transform.current.rescaleX(x.current) : x.current
    scaleY.current = transform.current ? transform.current.rescaleY(y.current) : y.current

    const diffBetweenMiddleLine =
      Math.abs(x.current(middleLineValue.current)) - Math.abs(x.current(bids[bids.length - 1].price))

    const baseValue = parseFloat(diffBetweenMiddleLine.toFixed(5))

    if (baseValue > 0 && lastBaseValue.current != baseValue) {
      let minScale = 1
      let maxScale = 1

      for (let i = 1; i < 200; i = i + 0.1) {
        const futureValue = baseValue * Math.pow(i, 2)

        if (futureValue > 30 && minScale === 1) {
          minScale = i
        }
        if (futureValue > 75 && maxScale === 1) {
          maxScale = i
        }

        if (maxScale !== 1 && minScale !== 1) {
          break
        }
      }

      zoomScaleExtent.current = [minScale, maxScale]

      zoom.current.scaleExtent(zoomScaleExtent.current)

      const currentScale = transform.current?.k
      const currentScaleIsLessThanMin = currentScale < zoomScaleExtent.current[0]
      const currentScaleIsMoreThanMax = currentScale > zoomScaleExtent.current[1]

      if (!typedAmount && (!currentScale || currentScaleIsLessThanMin || currentScaleIsMoreThanMax)) {
        if (currentScaleIsMoreThanMax) {
          applyZoom(zoomScaleExtent.current[1])
        } else {
          applyZoom(zoomScaleExtent.current[0])
        }
      }
    }

    lastBaseValue.current = baseValue

    const rangeX = (scaleX.current.domain()[1] - scaleX.current.domain()[0]) / (transform?.current?.k || 1)

    const newDomainX = [middleLineValue.current - rangeX / 2, middleLineValue.current + rangeX / 2]

    scaleX.current.domain(newDomainX)

    const visibleData = merged.filter(
      (d) => marginLeft <= scaleX.current(d.price) && scaleX.current(d.price) <= Math.max(svgWidth - marginRight, 0)
    )

    const maxVisibleY = d3.max(visibleData, (d) => d.btc) as number

    scaleY.current.domain([maxVisibleY * 1.5, 0])

    areaBids.current.attr('d', area(bids, scaleX.current, scaleY.current, 'bids'))
    areaAsks.current.attr('d', area(asks, scaleX.current, scaleY.current, 'asks'))

    gx.current.call(xAxis, scaleX.current)
    gy.current.call(yAxis, scaleY.current)

    d3SVG.current.selectAll('.tick').each(function (this: SVGElement, d: number) {
      if (d == 0) {
        d3.select(this).attr('visibility', 'hidden')
      }
    })

    d3SVG.current.selectAll('.domain').style('color', 'transparent')

    if (
      (typedAmount && (!transform.current?.k || transform.current?.k > zoomScaleExtent.current[0])) ||
      (!typedAmount && lastTypedAmount.current && transform.current?.k < zoomScaleExtent.current[0])
    ) {
      applyZoom(zoomScaleExtent.current[0], 500)
    }

    if (typedAmount) {
      const closestDataPoint = asks.find((d) => typedAmount <= d.btc)
      const TypedAmountPos = Math.abs(x.current(closestDataPoint?.price)) - Math.abs(x.current(middleLineValue.current))
      const diffBetweenTypedAmountAndLimitBottom =
        height - marginBottom - Math.abs(scaleX.current(closestDataPoint?.price))

      // console.log('baseValue', baseValue, targetPos)
      if (diffBetweenTypedAmountAndLimitBottom < 0) {
        const targetPos = svgWidth - marginRight - labelHeight - Math.abs(x.current(middleLineValue.current))
        const baseValue = parseFloat(TypedAmountPos.toFixed(5))
        for (let i = 1; i < 200; i = i + 0.01) {
          const futureValue = baseValue * Math.pow(i, 2)

          if (futureValue >= targetPos) {
            if (i < zoomScaleExtent.current[0]) {
              typedAmountScale.current = i

              d3SVG.current
                .transition(0)
                .duration(500)
                .call(zoom.current.transform, d3.zoomIdentity.translate(0, 0).scale(typedAmountScale.current))
            }

            break
          }
        }
      }

      lastTypedAmount.current = typedAmount
    }

    const currentScale = transform.current?.k || 1
    const maxScale = zoomScaleExtent.current[1]
    const minScale =
      typedAmount && typedAmountScale.current !== 1 ? typedAmountScale.current : zoomScaleExtent.current[0]

    const currentScaleIsLessThanMin = currentScale < minScale
    const currentScaleIsMoreThanMax = currentScale > maxScale

    if (currentScaleIsMoreThanMax) {
      applyZoom(maxScale)
    } else if (currentScaleIsLessThanMin) {
      applyZoom(minScale)
    }
  }, [svgWidth, merged, typedAmount])

  useEffect(() => {
    if (!svgWidth) return

    middleLinePosition.current = scaleX.current(middleLineValue.current)

    bidsClipPath.current.attr('width', middleLinePosition.current - marginLeft)
    asksClipPath.current
      .attr('x', middleLinePosition.current)
      .attr('width', svgWidth - middleLinePosition.current - marginRight)

    // bidsWhiteRect.current.attr('width', scaleX.current(middleLineValue.current) - marginLeft)
    // AsksWhiteRect.current
    //   .attr('x', scaleX.current(middleLineValue.current))
    //   .attr('width', svgWidth - scaleX.current(middleLineValue.current) - marginLeft)

    moveLine(middleLineY.current, { x1: middleLinePosition.current, x2: middleLinePosition.current })
  }, [svgWidth])

  const updateSlippage = useCallback(() => {
    if (typedAmount <= 0 || asks.length === 0 || !svgWidth) return

    const minAskPrice = asks[0].price
    const minAskPos = scaleX.current(minAskPrice)
    const closestDataPoint = asks.find((d) => typedAmount <= d.btc)
    const amountPosition = scaleY.current(typedAmount)
    const pricePosition = scaleX.current(closestDataPoint?.price || 0)

    /**
     * AKS LIMIT
     */
    moveLine(asksNotAllowedMoreThan.current.lineX, { x1: minAskPos, x2: minAskPos })
    setTextLabelGroup(asksNotAllowedMoreThan.current.labelX, formatAmount(minAskPrice, 6, true))
    moveLabelGroupFixedBottom(asksNotAllowedMoreThan.current.labelX, { x: minAskPos, height, marginBottom })

    /**
     * SLIPPAGE LABEL AND LINE X
     */
    moveLine(slippageLabel.current.lineY, {
      x1: pricePosition,
      x2: pricePosition,
      y1: height - marginBottom,
      y2: amountPosition,
    })
    setTextLabelGroup(slippageLabel.current.labelY, formatCurrency(typedAmount))
    moveLabelGroupFixedBottom(slippageLabel.current.labelX, { x: pricePosition, height, marginBottom })

    /**
     * SLIPPAGE LABEL AND LINE Y
     */
    moveLine(slippageLabel.current.lineX, {
      x1: svgWidth - marginRight,
      x2: pricePosition,
      y1: amountPosition,
      y2: amountPosition,
    })
    setTextLabelGroup(slippageLabel.current.labelX, formatAmount(closestDataPoint?.price, 6, true))
    moveLabelGroupFixedRight(slippageLabel.current.labelY, { y: amountPosition, width: svgWidth, marginRight })

    /**
     * SLIPPAGE TOOLTIP
     */
    if (closestDataPoint?.price && diffPercentValues(closestDataPoint?.price, minAskPrice) > 0.01) {
      const estimatedSlippage = Number(diffPercentValues(closestDataPoint?.price, minAskPrice));

      setEstimatedSlippageValue(estimatedSlippage);

      setSlippageTooltipText(slippageLabelTooltip?.current, {
        estimidatedFillPrice: closestDataPoint?.price,
        estimatedSlippage: Number(estimatedSlippage.toFixed(3)),
      })
    } else {
      hideSlippageLabel(slippageLabelTooltip.current)
      setEstimatedSlippageValue(0);
    }

    moveSlippageLabel(slippageLabelTooltip?.current, {
      x: 10,
      y: 10,
      width: svgWidth,
      height,
      marginLeft,
      marginRight,
      marginTop,
      marginBottom,
    })

    /**
     * If current price is equal to min ask price then hide label and line y of ask limits
     */
    if (pricePosition === minAskPos) {
      hideElement(asksNotAllowedMoreThan.current.labelX)
      hideElement(asksNotAllowedMoreThan.current.lineX)
    } else {
      showElement(asksNotAllowedMoreThan.current.labelX)
      showElement(asksNotAllowedMoreThan.current.lineX)
    }
  }, [asks, height, typedAmount, svgWidth])

  useEffect(() => {
    if (!bids?.length || !asks?.length || !svgWidth) {
      return
    }

    removed3Events(d3SVG.current)

    function updateLabels() {
      if (!lastMousePosition.current.x) return

      const middleLineXPosition = scaleX.current(middleLineValue.current)

      let bidsMousePositionX = 0
      let asksMousePositionX = 0

      if (lastMousePosition.current.x < middleLineXPosition) {
        bidsMousePositionX = lastMousePosition.current.x
        asksMousePositionX = middleLineXPosition - (lastMousePosition.current.x - middleLineXPosition)
      } else {
        asksMousePositionX = lastMousePosition.current.x
        bidsMousePositionX = svgWidth - marginRight - lastMousePosition.current.x
      }

      const mouseXDataBids = scaleX.current.invert(bidsMousePositionX)
      const mouseXDataAsks = scaleX.current.invert(asksMousePositionX)

      let bidsCurrentData: any = {}
      let asksCurrentData: any = {}

      let BidsPriceX = 0
      let BidsBtcY = 0

      let indexBid = bisect(bids, mouseXDataBids, 1)

      if (indexBid === bids.length) {
        indexBid = indexBid - 1
      } else if (labelsAreActive) {
        showLabels()
      }

      while (indexBid < bids.length) {
        const i2 = indexBid - 1

        const selectedIndex = mouseXDataBids - bids[i2]?.price > bids[indexBid]?.price - mouseXDataBids ? indexBid : i2
        bidsCurrentData = bids[selectedIndex]

        if (!bidsCurrentData) return

        BidsPriceX = scaleX.current(bidsCurrentData.price)
        BidsBtcY = scaleY.current(bidsCurrentData.btc)

        if (BidsPriceX < marginLeft + 20) {
          indexBid++
        } else {
          break
        }
      }

      let indexAsk = bisect(asks, mouseXDataAsks, 1)

      if (indexAsk === asks.length) {
        indexAsk = indexAsk - 1
      } else if (labelsAreActive) {
        showLabels()
      }

      let AsksPriceX = 0
      let AsksBtcY = 0

      while (indexAsk > 0) {
        const i3 = indexAsk - 1

        const selectedIndexAsk =
          mouseXDataAsks - asks[i3]?.price > asks[indexAsk]?.price - mouseXDataAsks ? indexAsk : i3

        asksCurrentData = asks[selectedIndexAsk]

        if (!asksCurrentData) return

        AsksPriceX = scaleX.current(asksCurrentData.price)
        AsksBtcY = scaleY.current(asksCurrentData.btc)

        if (AsksPriceX > svgWidth - marginRight - 20) {
          indexAsk--
        } else {
          break
        }
      }

      if (!asksCurrentData || !bidsCurrentData) return

      /**
       * BIDS
       */
      moveLine(bidsLabels.current.lineX, { x1: BidsPriceX, x2: BidsPriceX })
      moveLine(bidsLabels.current.lineY, { y1: BidsBtcY, y2: BidsBtcY })
      moveElement(bidsLabels.current.activeDot, { x: BidsPriceX, y: BidsBtcY })

      bidsWhiteRect.current.attr('width', BidsPriceX - marginLeft)

      /**
       * SET LABELS X
       */

      setTextLabelGroup(bidsLabels.current.labelX, formatAmount(bidsCurrentData.price, 6, true))
      setTextLabelGroup(bidsLabels.current.labelY, formatAmount(bidsCurrentData.btc, 6, true))
      setTextLabelGroup(
        bidsLabels.current.labelPercent,
        getPriceDiffPercentage(bidsCurrentData.price, middleLineValue.current)
      )

      moveLabelGroupFixedLeft(bidsLabels.current.labelY, { y: BidsBtcY, marginLeft })
      moveLabelGroupFixedBottom(bidsLabels.current.labelX, { x: BidsPriceX, height, marginBottom })
      moveLabelGroup(bidsLabels.current.labelPercent, {
        x: BidsPriceX + (middleLineXPosition - BidsPriceX) / 2,
        y: BidsBtcY,
      })

      /**
       * ASKS
       */

      moveLine(asksLabels.current.lineX, { x1: AsksPriceX, x2: AsksPriceX })
      moveLine(asksLabels.current.lineY, { y1: AsksBtcY, y2: AsksBtcY })
      moveElement(asksLabels.current.activeDot, { x: AsksPriceX, y: AsksBtcY })

      AsksWhiteRect.current.attr('x', AsksPriceX).attr('width', svgWidth - BidsPriceX - marginLeft)
      /**
       * SET LABELS X
       */

      setTextLabelGroup(asksLabels.current.labelX, formatAmount(asksCurrentData.price, 6, true))
      setTextLabelGroup(asksLabels.current.labelY, formatAmount(asksCurrentData.btc, 6, true))
      setTextLabelGroup(
        asksLabels.current.labelPercent,
        getPriceDiffPercentage(middleLineValue.current, asksCurrentData.price)
      )

      const { width: textWidth } = getTextDimensions(asksLabels.current.labelY)

      moveLabelGroupFixedRight(asksLabels.current.labelY, { y: AsksBtcY, width: svgWidth, marginRight: marginRight + textWidth })
      moveLabelGroupFixedBottom(asksLabels.current.labelX, { x: AsksPriceX, height, marginBottom })
      moveLabelGroup(asksLabels.current.labelPercent, {
        x: AsksPriceX + (middleLineXPosition - AsksPriceX) / 2,
        y: AsksBtcY,
      })
    }

    d3SVG.current.on('mouseleave', hiddenLabels)
    d3SVG.current.on('mouseenter', () => {
      if (!lastMousePosition.current.y) return

      showLabels()
    })

    const handleMouseMove = (event) => {
      const [mx] = d3.pointer(event, SVGRef.current as any)
      lastMousePosition.current = { x: mx, y: 0 }
      showLabels()
      updateLabels()
    }

    d3SVG.current.on('mousemove', handleMouseMove)

    d3SVG.current.on('touchmove', (event) => {
      // event.preventDefault()

      const touch = event.touches[0]

      if (touch) {
        const [tx] = d3.pointer(touch, SVGRef.current as any)
        lastMousePosition.current = { x: tx, y: 0 }
        showLabels()
        updateLabels()
      }
    })

    zoom.current
    .filter(event => !event?.touches || event?.touches?.length == 2)
    .on('zoom', (event: any) => {
      // console.log(event.transform.k)
      transform.current = event.transform

      scaleX.current = transform.current.rescaleX(x.current)
      scaleY.current = transform.current.rescaleY(y.current)

      const rangeX = (scaleX.current.domain()[1] - scaleX.current.domain()[0]) / transform.current.k

      const newDomainX = [middleLineValue.current - rangeX / 2, middleLineValue.current + rangeX / 2]

      scaleX.current.domain(newDomainX)

      const visibleData = merged.filter(
        (d) => marginLeft <= scaleX.current(d.price) && scaleX.current(d.price) <= svgWidth - marginRight
      )

      const maxVisibleY = d3.max(visibleData, (d) => d.btc) as number

      scaleY.current.domain([maxVisibleY * 1.5, 0])

      areaBids.current.attr('d', area(bids, scaleX.current, scaleY.current, 'bids'))
      areaAsks.current.attr('d', area(asks, scaleX.current, scaleY.current, 'asks'))

      gx.current.call(xAxis, scaleX.current)
      gy.current.call(yAxis, scaleY.current)

      middleLineY.current
        .attr('x1', scaleX.current(middleLineValue.current))
        .attr('x2', scaleX.current(middleLineValue.current))

      bidsClipPath.current.attr('width', scaleX.current(middleLineValue.current) - marginLeft)
      asksClipPath.current
        .attr('x', scaleX.current(middleLineValue.current))
        .attr('width', svgWidth - scaleX.current(middleLineValue.current) - marginRight)

      updateLabels()
      updateSlippage()
    })

    d3SVG.current.call(zoom.current)

    updateLabels()

    return () => {
      removed3Events(d3SVG.current)
    }
  }, [asks, bids, bisect, height, labelsAreActive, merged, typedAmount, width, updateSlippage, svgWidth])

  useEffect(() => {
    if (typedAmount <= 0) {
      hideElement(slippageLabel.current.lineX)
      hideElement(slippageLabel.current.lineY)
      hideElement(slippageLabel.current.labelY)
      hideElement(slippageLabel.current.labelX)
      hideElement(asksNotAllowedMoreThan.current.labelX)
      hideElement(asksNotAllowedMoreThan.current.lineX)
      hideSlippageLabel(slippageLabelTooltip.current)
      return
    } else {
      showElement(slippageLabel.current.lineX)
      showElement(slippageLabel.current.lineY)
      showElement(slippageLabel.current.labelY)
      showElement(slippageLabel.current.labelX)
      showSlippageLabel(slippageLabelTooltip.current)
    }
  }, [typedAmount, svgWidth])

  useEffect(() => {
    updateSlippage()
  }, [updateSlippage])

  return (
    <SVGContainer>
      <ForwardedTooltip ref={slippageLabelTooltip} />
      <svg
        ref={SVGRef}
        height={height}
        style={{ width: '100%', maxWidth: svgMaxWidth > 0 ? svgMaxWidth : undefined }}
        viewBox={`0 0 ${svgWidth} ${height}`}
      ></svg>
    </SVGContainer>
  )
}

const DepthChartDesktop = () => {
  const activeMarket = useActiveMarket()
  const { width: windowsWidth } = useWindowSize()
  const { ask, bid } = useBidAskPrice(activeMarket?.name, activeMarket?.pricePrecision)

  const shortVersion = useMemo(() => windowsWidth <= MEDIA_WIDTHS.upToExtraLarge, [windowsWidth])

  if (Number(ask) === 0 || Number(bid) === 0) {
    return <ChartDesktopLoading height={shortVersion ? 447 : 549} />
  }

  if (shortVersion) {
    return (
      <SvgWrapper>
        <ChartDesktopHeader />
        <DepthChartHorizontalInner height={447} key={`${activeMarket?.name}-horizontal-short`} />
      </SvgWrapper>
    )
  }

  return (
    <SvgWrapper>
      <ChartDesktopHeader />
      <DepthChartHorizontalInner height={549} key={`${activeMarket?.name}-horizontal`} />
    </SvgWrapper>
  )
}

const DepthChartMobile = () => {
  const activeMarket = useActiveMarket()
  const [showChart, setShowChart] = useState(false)
  const { ask, bid } = useBidAskPrice(activeMarket?.name, activeMarket?.pricePrecision)
  const activeTradeView = useActiveTradeView()

  if (activeTradeView === TradeView.TRADE_FULL) {
    return <></>
  }

  return (
    <SvgWrapper>
      <DepthChartToggleButton active={showChart} onClick={() => setShowChart(!showChart)}>
        <DepthChart width={28} height={18} />
        <span>Depth</span>
        <Chevron />
      </DepthChartToggleButton>

      {showChart ? (
        Number(ask) === 0 || Number(bid) === 0 ? (
          <ChartMobileLoading height={500} />
        ) : (
          <DepthChartHorizontalInner key={`${activeMarket?.name}-mobile`} />
        )
      ) : (
        <></>
      )}
    </SvgWrapper>
  )
}

export { DepthChartDesktop, DepthChartMobile, DepthChartVertical }
