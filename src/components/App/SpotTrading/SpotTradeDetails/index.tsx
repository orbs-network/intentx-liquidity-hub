import CollapseChevron from 'components/CollapseChevron'

import { Info as InfoIcon } from 'components/Icons'
import { Row, RowBetween } from 'components/Row'
import { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 22px;
  width: 100%;
  background: #1c1f26;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 16px;
  gap: 8px;
`}
`

const DetailsWrapper = styled.div<{ isCollapsed?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  max-height: ${({ isCollapsed }) => (isCollapsed ? '0' : '500')}px;
  transition: all 0.3s ease;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 8px;
`}
`

const Label = styled.span<{ size?: string; weight?: string; reducedOpacity?: boolean }>`
  font-weight: ${({ weight }) => (weight ? weight : '400')};
  font-size: ${({ size }) => (size ? size : '12px')};
  color: ${({ theme }) => theme.white};
  opacity: ${({ reducedOpacity }) => (reducedOpacity ? '0.5' : '1')};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 9px;
`}
`

const Separator = styled.div`
  width: 100%;
  border: 1px solid #2f3645;
`

const ColumnContainer = styled.div<{ orientation?: string }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ orientation }) => (orientation === 'left' ? 'flex-start' : 'flex-end')};
`

const CollapseButton = styled.div<{ isCollapsed?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${({ isCollapsed }) => (isCollapsed ? 'rotate(180deg)' : 'none')};
  transition: all 0.3s ease;
`

const StyledInfoIcon = styled(InfoIcon)`
  color: ${({ theme }) => theme.text2};
  width: 12px;
  height: 12px;
  cursor: default;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 9px;
  height: 9px;
`}
`

export default function SpotTradeDetails({}: {}) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  return (
    <Wrapper>
      <RowBetween>
        <Label reducedOpacity>
          <Label weight="600">0.00 BTC</Label> is all you pay, fees included
        </Label>
        <Row
          gap="5px"
          width="fit-content"
          onClick={() => setIsCollapsed((prev) => !prev)}
          style={{ cursor: 'pointer' }}
        >
          <Label>{isCollapsed ? 'Details' : 'Hide'}</Label>
          <CollapseButton isCollapsed={isCollapsed}>
            <CollapseChevron />
          </CollapseButton>
        </Row>
      </RowBetween>

      <DetailsWrapper isCollapsed={isCollapsed}>
        <Separator />

        <RowBetween>
          <ColumnContainer orientation="left">
            <Label>Platform Fees</Label>
            <Label reducedOpacity>Depends on the Settings</Label>
          </ColumnContainer>
          <ColumnContainer>
            <Label reducedOpacity>as low as</Label>
            <Label>$2.69</Label>
          </ColumnContainer>
        </RowBetween>

        <RowBetween>
          <Row width="fit-content" gap="5px">
            <Label>Network Fee</Label> <StyledInfoIcon />
          </Row>

          <Label>$1.47</Label>
        </RowBetween>

        <Separator />

        <RowBetween>
          <Label weight="600">Total Fees</Label>
          <Label>$4.15</Label>
        </RowBetween>
      </DetailsWrapper>
    </Wrapper>
  )
}
