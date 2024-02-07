'use client'

import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import Image from 'next/image'

import CalendarOutline from '/public/static/images/etc/calendar-filter.svg'
import OutlineBtn from 'components/Button/OutlineButton'
import FilterButton from 'components/Button/FilterButton'
import DateFilterButton from 'components/Button/DateFilterButton'

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: 100%;
 `}
`

const Wrapper = styled.div`
  position: absolute;
  top: 120%;
  width: 100%;
`

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(35, 41, 51, 1);
  border-radius: 5px;
  z-index: 9999;
  position: relative;
  padding: 16px;
  width: 100%;
  gap: 8px;
`

const DateFilter = ({ isMobile }: { isMobile: boolean }) => {
  const filterRef = useRef(null)

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedRange, setSelectedRange] = useState(undefined)

  const toggleDropdown = (): void => {
    setIsCalendarOpen((prev) => !prev)
  }

  const handleFilterChange = (value) => (): void => {
    setSelectedRange(value)
    toggleDropdown()
  }

  useOnClickOutside(filterRef, isCalendarOpen ? toggleDropdown : undefined)

  return (
    <Container ref={filterRef}>
      {isCalendarOpen ? (
        <Wrapper>
          <DropdownContainer>
            <DateFilterButton active={selectedRange === 'day'} onClick={handleFilterChange('day')}>
              1 Day Volume
            </DateFilterButton>
            <DateFilterButton active={selectedRange === 'week'} onClick={handleFilterChange('week')}>
              7 Day Volume
            </DateFilterButton>
            <DateFilterButton active={selectedRange === 'month'} onClick={handleFilterChange('month')}>
              30 Day Volume
            </DateFilterButton>
            <DateFilterButton active={selectedRange === 'all'} onClick={handleFilterChange('all')}>
              All Time Vol
            </DateFilterButton>
          </DropdownContainer>
        </Wrapper>
      ) : null}

      {/* <StyledFilterButton onClick={toggleCalendar} buttonFilled={false}>
        <Image unoptimized={true} src={CalendarOutline} alt="icon" /> Filter by Date
      </StyledFilterButton> */}
      <OutlineBtn secondary onClick={toggleDropdown} full={isMobile} padding={isMobile ? '18px 0' : '18px 30px'}>
        <Image unoptimized={true} src={CalendarOutline} alt="icon" /> Filter by Date
      </OutlineBtn>
    </Container>
  )
}

export default DateFilter
