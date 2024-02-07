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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 24px;
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

function OrdersListElement({ data }: { data: any }) {
  const isMobile = useIsMobile()
  const isLaptop = useIsLaptop()
  const { token1, token2, orderType, date, value, secondaryValue, url, from, to } = data

  const iconToken1 = useCurrencyLogo(token1)
  const iconToken2 = useCurrencyLogo(token2)

  const getOrderTypeIcon = () => {
    if (orderType === 'SWAP') {
      return <OrderTypeSwap size={isLaptop || isMobile ? '20' : '24'} />
    } else if (orderType === 'DEPOSIT') {
      return <OrderTypeDeposit size={isLaptop || isMobile ? '20' : '24'} />
    } else if (orderType === 'WITHDRAW') {
      return <OrderTypeWithdraw size={isLaptop || isMobile ? '20' : '24'} />
    }

    return null
  }

  const getOrderDetails = () => {
    if (orderType === 'SWAP') {
      return (
        <ColumnContainer orientation="left">
          <Row gap="5px">
            <Label>{token1}</Label> <SwapSmall /> <Label>{token2}</Label>
          </Row>
          <Row gap="5px">
            <OrderCalendar />
            <Label reducedOpacity size={12}>
              {date}
            </Label>
          </Row>
        </ColumnContainer>
      )
    } else if (orderType === 'DEPOSIT') {
      return (
        <ColumnContainer orientation="left">
          <Row gap="5px">
            <Label>{token1}</Label> <TypeLabel>Deposit</TypeLabel>
          </Row>
          <Row gap="4px">
            <Label reducedOpacity size={12}>
              {from}
            </Label>
            <Row width="fit-content">
              <ArrowRight width={16} height={14} color={'#606978'} />
            </Row>
            <Label reducedOpacity size={12}>
              {to}
            </Label>
            <OrderCalendar />
            <Label reducedOpacity size={12}>
              {date}
            </Label>
          </Row>
        </ColumnContainer>
      )
    } else if (orderType === 'WITHDRAW') {
      return (
        <ColumnContainer orientation="left">
          <Row gap="5px">
            <Label>{token1}</Label> <TypeLabel>Withdraw</TypeLabel>
          </Row>
          <Row gap="4px">
            <Label reducedOpacity size={12}>
              {from}
            </Label>
            <Row width="fit-content">
              <ArrowRight width={16} height={14} color={'#606978'} />
            </Row>
            <Label reducedOpacity size={12}>
              {to}
            </Label>
            <OrderCalendar />
            <Label reducedOpacity size={12}>
              {date}
            </Label>
          </Row>
        </ColumnContainer>
      )
    }

    return null
  }

  return (
    <ElementContainer>
      <TokensContainer isSwap={orderType === 'SWAP'}>
        <Image src={iconToken1} alt="" width={isLaptop || isMobile ? 21 : 30} />
        <IconContainer isSwap={orderType === 'SWAP'}>{getOrderTypeIcon()}</IconContainer>
        {token2 && orderType === 'SWAP' ? (
          <Image
            src={iconToken2}
            alt=""
            width={isLaptop || isMobile ? 21 : 30}
            style={{ position: 'relative', left: isLaptop || isMobile ? '-18px' : '-24px' }}
          />
        ) : null}
      </TokensContainer>
      <RowBetween>
        {getOrderDetails()}
        <Row gap="10px" width="fit-content">
          <ColumnContainer>
            <Label>{value}</Label>
            <Label reducedOpacity>${secondaryValue}</Label>
          </ColumnContainer>
          <ActionButton onClick={() => {}}>
            <RedirectArrow />
          </ActionButton>
        </Row>
      </RowBetween>
    </ElementContainer>
  )
}

export default function OrdersList({ data }: { data: any }) {
  return (
    <Wrapper>
      {data.map((element, index) => (
        <OrdersListElement data={element} key={index} />
      ))}
    </Wrapper>
  )
}
