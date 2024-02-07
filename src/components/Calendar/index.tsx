'use client'
import Calendar from 'react-calendar'

import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { NavButton } from 'components/Button'
import weekDays from './utils'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import Image from 'next/image'

import CalendarIcon from '/public/static/images/etc/calendar.svg'
import CalendarOutline from '/public/static/images/etc/calendar-filter.svg'
import NavigationChevron from 'components/Icons/NavigationChevron'
import OutlineBtn from 'components/Button/OutlineButton'
import {
  useSetMainAnalyticsHistoryFilterDateRange,
  useMainAnalyticsHistoryFilterDateRange,
} from 'state/analytics/hooks'

const CalendarWrapper = styled.div`
  position: absolute;
  right: 100px;
  top: 50px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  right: 30px;
  top: 115px;
  `}
`

const CalendarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(35, 41, 51, 1);
  border-radius: 5px;
  z-index: 9999;
  position: relative;

  .react-calendar {
    border: none;
    width: 300px;
    padding: 16px 0;
  }

  .react-calendar__tile {
    max-width: 32px;
    height: 32px;
    background-color: transparent;
    border: 1px solid #d5d4df;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 9px;

    & > abbr {
      color: white;
    }
  }

  .react-calendar__tile--active {
    background: linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%);
    border: 1px solid red;

    & > abbr {
      color: white;
    }
  }

  .react-calendar__navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;

    & > * {
      &:nth-child(2) {
        order: 1;
        height: 30px;
      }
      &:nth-child(3) {
        order: 0;
      }
      &:nth-child(4) {
        order: 2;
        height: 30px;
      }
    }
  }

  .react-calendar__navigation__label {
    border: none;
    background: transparent;
  }

  .react-calendar__navigation__next2-button {
    display: none;
  }

  .react-calendar__navigation__prev2-button {
    display: none;
  }

  .react-calendar__navigation__arrow {
    border: none;
    background: transparent;
    cursor: pointer;
  }

  .react-calendar__month-view__weekdays {
    padding: 0 4px 10px 0;
  }

  .react-calendar__month-view__weekdays__weekday {
    text-align: center;

    & > * {
      text-transform: capitalize;
      text-decoration: none;
      font-size: 10px;
      color: white;
    }
  }

  .react-calendar__month-view__days {
    gap: 8px;
    justify-content: center;
    align-items: center;
  }

  .react-calendar__navigation button[disabled] {
    background: transparent;
  }

  .react-calendar__navigation__label__labelText {
    pointer-events: none;
    font-size: 12px;
    line-height: 18px;
    font-weight: 400;
    color: white;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.5;
  }
`

const StyledOutlineBtn = styled(OutlineBtn)`
  color: #798599;
`

const DatePickerPopPup = ({ isSecondary }: { isSecondary?: boolean }) => {
  const calendarRef = useRef(null)
  const setMainAnalyticsHistoryFilterDateRange = useSetMainAnalyticsHistoryFilterDateRange()
  const mainAnalyticsHistoryFilterDateRange = useMainAnalyticsHistoryFilterDateRange()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  // const [selectedRange, setSelectedRange] = useState(undefined)

  const formatWeekday = (_locale: any, date: Date): string => weekDays()[date.getDay()]

  const toggleCalendar = (): void => {
    setIsCalendarOpen((prev) => !prev)
  }

  const handleRangeChange = (value): void => {
    // setSelectedRange(value as any)

    toggleCalendar()

    setMainAnalyticsHistoryFilterDateRange(value)
  }

  useOnClickOutside(calendarRef, isCalendarOpen ? toggleCalendar : undefined)

  return (
    <div ref={calendarRef}>
      {isCalendarOpen ? (
        <CalendarWrapper>
          <CalendarContainer>
            <Calendar
              minDetail="month"
              formatShortWeekday={formatWeekday}
              formatMonthYear={(locale, date) => date.toLocaleString(locale, { month: 'short', year: 'numeric' })}
              returnValue="range"
              selectRange
              onChange={handleRangeChange}
              nextLabel={<NavigationChevron />}
              prevLabel={<NavigationChevron isPrev />}
              value={mainAnalyticsHistoryFilterDateRange}
            />
          </CalendarContainer>
        </CalendarWrapper>
      ) : null}

      {isSecondary ? (
        <StyledOutlineBtn secondary onClick={toggleCalendar}>
          <Image unoptimized={true} src={CalendarOutline} alt="icon" /> Filter by Date
        </StyledOutlineBtn>
      ) : (
        <NavButton onClick={toggleCalendar}>
          <Image unoptimized={true} src={CalendarIcon} alt="icon" />
        </NavButton>
      )}
    </div>
  )
}

export default DatePickerPopPup
