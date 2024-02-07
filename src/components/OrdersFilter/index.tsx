import Reload from 'components/Icons/Reload'
import SettingsCog from 'components/Icons/SettingsCog'
import React, { useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import HeaderMask from '/public/images/spot-header-mask.png'
import { Row } from 'components/Row'
import SwapOrder from 'components/Icons/SwapOrder'
import DepositOrder from 'components/Icons/DepositOrder'
import WithdrawOrder from 'components/Icons/WithdrawOrder'
import { useIsLaptop, useIsMobile } from 'lib/hooks/useWindowSize'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 10px;
  background: #1c1f26;
  border-radius: 10px;
  min-width: 480px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 12px 8px;
  min-width: 360px;
`};
`

const ActionButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

export default function SpotTradingHeader({
  onFilterChange,
  selectedFilter,
}: {
  onFilterChange(value: string): void
  selectedFilter: string
}) {
  const isMobile = useIsMobile()
  const isLaptop = useIsLaptop()
  const [hoveredElement, setHoveredElement] = useState<string | undefined>(undefined)

  const handleFilter = (filter: string) => (): void => {
    onFilterChange?.(filter)
  }

  return (
    <Wrapper>
      <Row gap="10px">
        <ActionButton
          onClick={handleFilter('SWAP')}
          onMouseEnter={() => setHoveredElement('SWAP')}
          onMouseLeave={() => setHoveredElement(undefined)}
        >
          <SwapOrder
            selected={selectedFilter === 'SWAP' || hoveredElement === 'SWAP'}
            size={isLaptop || isMobile ? '16' : '24'}
          />
        </ActionButton>
        <ActionButton
          onClick={handleFilter('DEPOSIT')}
          onMouseEnter={() => setHoveredElement('DEPOSIT')}
          onMouseLeave={() => setHoveredElement(undefined)}
        >
          <DepositOrder
            selected={selectedFilter === 'DEPOSIT' || hoveredElement === 'DEPOSIT'}
            size={isLaptop || isMobile ? '16' : '24'}
          />
        </ActionButton>
        <ActionButton
          onClick={handleFilter('WITHDRAW')}
          onMouseEnter={() => setHoveredElement('WITHDRAW')}
          onMouseLeave={() => setHoveredElement(undefined)}
        >
          <WithdrawOrder
            selected={selectedFilter === 'WITHDRAW' || hoveredElement === 'WITHDRAW'}
            size={isLaptop || isMobile ? '16' : '24'}
          />
        </ActionButton>
      </Row>
    </Wrapper>
  )
}
