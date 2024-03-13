import Image from 'next/image'
import styled from 'styled-components'

import OrderCalendar from 'components/Icons/OrderCalendar'
import OrderTypeDeposit from 'components/Icons/OrderTypeDeposit'
import OrderTypeSwap from 'components/Icons/OrderTypeSwap'
import OrderTypeWithdraw from 'components/Icons/OrderTypeWithdraw'
import RedirectArrow from 'components/Icons/RedirectArrow'
import SwapSmall from 'components/Icons/SwapSmall'
import { Row, RowBetween } from 'components/Row'
import useCurrencyLogo from 'lib/hooks/useCurrencyLogo'
import { useIsLaptop, useIsMobile } from 'lib/hooks/useWindowSize'
import { ArrowRight } from 'react-feather'
import { useOrders, Order, useFormatNumber } from '@orbs-network/liquidity-hub-ui-sdk'
import { CSSProperties } from 'react'
import dayjs from 'dayjs'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  margin-top: 14px;
  max-height: 597px;
  overflow-y: auto;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 0 16px;
  gap: 8px;
  margin-top: 10px;
  max-height: 465px;
`};
`

const Label = styled.span<{ size?: number; weight?: string; reducedOpacity?: boolean }>`
  font-weight: ${({ weight }) => (weight ? weight : '400')};
  font-size: ${({ size }) => (size ? `${size}px` : '14px')};
  color: ${({ theme }) => theme.white};
  opacity: ${({ reducedOpacity }) => (reducedOpacity ? '0.5' : '1')};

  ${({ theme, size }) => theme.mediaWidth.upToExtraLarge`
  font-size: ${size ? `${size * 0.7}px` : '10px'};
`}
`

const ElementContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(56, 64, 79, 0.5);
  border-radius: 5px;
  transition: background 0.3s ease;

  &:hover {
    background: #38404f;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 8px 10px;
`};
`

const ActionButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
const TokensContainer = styled.div<{ isSwap?: boolean }>`
  display: flex;
  align-items: center;
  margin-right: ${({ isSwap }) => (isSwap ? '-12px' : '0')};
`

const IconContainer = styled.div<{ isSwap?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  left: -12px;
  top: ${({ isSwap }) => !isSwap && '3px'};
  z-index: 20;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  left: -9px;
`};
`

const ColumnContainer = styled.div<{ orientation?: string }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ orientation }) => (orientation === 'left' ? 'flex-start' : 'flex-end')};
`

const TypeLabel = styled.div`
  background: linear-gradient(90deg, rgba(188, 39, 56, 0.5) 0%, rgba(110, 22, 32, 0.5) 128.07%);
  border-radius: 100px;
  padding: 0 5px;
  font-size: 10px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 8px;
`};
`

const TokenLogo = ({ src = '', style = {} }: { src?: string; style?: CSSProperties }) => {
  const isMobile = useIsMobile()
  const isLaptop = useIsLaptop()
  return (
    <Image
      style={style}
      src={src}
      alt=""
      width={isLaptop || isMobile ? 21 : 30}
      height={isLaptop || isMobile ? 21 : 30}
    />
  )
}

function OrdersListElement({ order }: { order: Order }) {
  const isMobile = useIsMobile()
  const isLaptop = useIsLaptop()

  const fromAmount = useFormatNumber({ value: order.fromAmount })
  const fromUsd = useFormatNumber({ value: order.fromUsd })

  const onClick = () => window.open(order.explorerLink, '_blank')

  return (
    <ElementContainer>
      <TokensContainer isSwap={true}>
        <TokenLogo src={order.fromToken.logoUrl || ''} />
        <IconContainer isSwap={true}>
          <OrderTypeSwap size={isLaptop || isMobile ? '20' : '24'} />
        </IconContainer>
        <TokenLogo
          src={order.toToken.logoUrl || ''}
          style={{ position: 'relative', left: isLaptop || isMobile ? '-18px' : '-24px' }}
        />
      </TokensContainer>
      <RowBetween>
        <ColumnContainer orientation="left">
          <Row gap="5px">
            <Label>{order.fromToken.symbol}</Label> <SwapSmall /> <Label>{order.toToken.symbol}</Label>
          </Row>
          <Row gap="5px">
            <OrderCalendar />
            <Label reducedOpacity size={12}>
              {dayjs(order.date).format('DD/MM/YYYY hh:mm')}
            </Label>
          </Row>
        </ColumnContainer>
        <Row gap="10px" width="fit-content">
          <ColumnContainer>
            <Label>{fromAmount}</Label>
            <Label reducedOpacity>${fromUsd}</Label>
          </ColumnContainer>
          <ActionButton onClick={onClick}>
            <RedirectArrow />
          </ActionButton>
        </Row>
      </RowBetween>
    </ElementContainer>
  )
}

export default function OrdersList() {
  const { orders } = useOrders()

  return (
    <Wrapper>
      {!orders ? (
        <p>You dont have orders...</p>
      ) : (
        orders?.map((order, index) => <OrdersListElement order={order} key={index} />)
      )}
    </Wrapper>
  )
}
