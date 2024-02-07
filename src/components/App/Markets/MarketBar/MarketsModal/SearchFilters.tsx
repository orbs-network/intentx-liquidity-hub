'use client'
import React, { useState } from 'react'
import styled from 'styled-components'


import { Row, RowBetween, RowStart } from 'components/Row'
import FilterButton from 'components/Button/FilterButton'
import { MarketsFilters } from '.'
import GradientButton from 'components/Button/GradientButton'

const Container = styled(RowStart)`
  
`

const DateLabel = styled.span`
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme }) => theme.white};
  margin-top: 4px;
  white-space: nowrap;
`

const Header = styled(RowStart)`
  flex-wrap: wrap;
`

export interface SearchFiltersProps {
  selectedFilter: MarketsFilters
  setSelectedFilter: (filter: MarketsFilters) => void
}

export default function SearchFilters({ selectedFilter, setSelectedFilter }: SearchFiltersProps) {
  return (
    <Container>
      <Header>
        <Row gap="20px" width="fit-content">
          <GradientButton
            onClick={() => setSelectedFilter(MarketsFilters.ALL)}
            buttonFilled={selectedFilter === MarketsFilters.ALL}
            label="All"
            size='fit-content'
            height='34px'
          />
          {/* <GradientButton
            onClick={() => setSelectedFilter(MarketsFilters.TRENDING)}
            buttonFilled={selectedFilter === MarketsFilters.TRENDING}
            label="Trending"
            size='fit-content'
            height='34px'
          />
          <GradientButton
            onClick={() => setSelectedFilter(MarketsFilters.DEX_ONLY)}
            buttonFilled={selectedFilter === MarketsFilters.DEX_ONLY}
            label="Dex Only"
            size='fit-content'
            height='34px'
  /> */}
        </Row>
      </Header>
    </Container>
  )
}
