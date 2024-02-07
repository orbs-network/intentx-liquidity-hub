import { ColumnCenter } from 'components/Column'
import { Loader } from 'components/Icons'
import { Row, RowBetween } from 'components/Row'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import PendingOrderIcon from '/public/static/images/etc/order-pending.svg'
import FilledOrderIcon from '/public/static/images/etc/order-filled.svg'
import CompletedOrderIcon from '/public/static/images/etc/order-completed.svg'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: #222832;

  position: fixed;
  top: 64px;
  right: 20px;
  z-index: 999;
`

const Label = styled.span<{ size?: string; weight?: string; color?: string }>`
  font-weight: ${({ weight }) => weight ?? '500'};
  font-size: ${({ size }) => size ?? '12px'};
  color: ${({ theme, color }) => color ?? theme.white};
  text-align: center;
`

const IDContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #808a9c;
  border-radius: 100px;
  padding: 2px 10px;
`

const StatusContainer = styled.div`
  border-radius: 5px;
  padding: 16px 0 12px 0;
  background: #20262e;
  width: 100%;
`

const ShineEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  animation: shine 2s infinite;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(128, 186, 232, 0) 99%,
    rgba(125, 185, 232, 0) 100%
  );

  @keyframes shine {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`

const IconContainer = styled.div`
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, rgba(188, 39, 56, 0.3) 0%, rgba(110, 22, 32, 0.3) 128.07%);
  width: 54px;
  height: 54px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid red;
  margin-bottom: 4px;
`

const ProgressBar = styled.div`
  position: relative;
  height: 5px;
  width: 200px;
  border-radius: 100px;
  background: #12161c;
  margin: 12px 0 4px 0;
`

const CurrentProgress = styled.div<{ width: string }>`
  position: absolute;
  top: 0;
  left: 0;
  transition: width 300ms ease;
  width: ${({ width }) => width};
  height: 100%;
  background: linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%);
  border-radius: 100px;
`

const AnimatedContainer = styled.div`
  overflow-y: hidden;
  position: relative;
  height: 80px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export default function OrderStatusCard() {
  const animatedContainerRef = useRef(null)

  const [orderStatus, setOrderStatus] = useState<number>(0)

  const getCurrentProgress = (): string => {
    switch (orderStatus) {
      case 0:
        return '33%'
      case 1:
        return '66%'
      case 2:
        return '100%'
      default:
        return '0%'
    }
  }

  //Call this function sir to update the current order status
  const updateToNextStatus = () => {
    const scrollContainer: any = animatedContainerRef.current
    if (!scrollContainer) {
      return
    }

    let currentScrollPosition = scrollContainer.scrollTop
    const scrollMax = scrollContainer.scrollHeight - scrollContainer.clientHeight
    currentScrollPosition += 94

    if (currentScrollPosition > scrollMax) {
      currentScrollPosition = 0
    }

    scrollContainer.scrollTo({
      top: currentScrollPosition,
      behavior: 'smooth',
    })

    setOrderStatus((prev) => (prev + 1) % 3)
  }

  const mockUpOrderId = 19827

  return (
    <Wrapper>
      <RowBetween gap="16px" padding="12px 14px">
        <Row width="fit-content" gap="4px">
          <Loader size="11px" />
          <Label>Processing Trade...</Label>
        </Row>
        <IDContainer>
          <Label color="#808A9C" size="10px">
            ID: {mockUpOrderId}
          </Label>
        </IDContainer>
      </RowBetween>
      <StatusContainer>
        <AnimatedContainer ref={animatedContainerRef}>
          <ColumnCenter>
            <IconContainer>
              <ShineEffect />
              <Image unoptimized={true} src={PendingOrderIcon} alt="icon" width={26} height={26} />
            </IconContainer>
            <Label>Order Pending</Label>
          </ColumnCenter>
          <ColumnCenter>
            <IconContainer>
              <ShineEffect />
              <Image unoptimized={true} src={FilledOrderIcon} alt="icon" width={26} height={26} />
            </IconContainer>
            <Label>Order Filled</Label>
          </ColumnCenter>
          <ColumnCenter>
            <IconContainer>
              <ShineEffect />
              <Image unoptimized={true} src={CompletedOrderIcon} alt="icon" width={26} height={26} />
            </IconContainer>
            <Label>Order Completed</Label>
          </ColumnCenter>
        </AnimatedContainer>
        <ColumnCenter>
          <ProgressBar>
            <CurrentProgress width={getCurrentProgress()} />
          </ProgressBar>
          <Label>{getCurrentProgress()}</Label>
        </ColumnCenter>
      </StatusContainer>
    </Wrapper>
  )
}
