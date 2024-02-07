'use client'
import Calendar from 'react-calendar'

import { NavButton } from 'components/Button'
import React, { useMemo, useRef } from 'react'
import styled from 'styled-components'

import { useOnClickOutside } from 'hooks/useOnClickOutside'
import Image from 'next/image'

import OutlineBtn from 'components/Button/OutlineButton'
import NavigationChevron from 'components/Icons/NavigationChevron'
import { useIsMobile } from 'lib/hooks/useWindowSize'
import CalendarIcon from '/public/static/images/etc/calendar.svg'

// import CalendarIcon from '/public/static/images/etc/gradient-calendar.svg'
import { EPOCH_START_TIMESTAMP } from 'config/index'
import { useDispatch } from 'react-redux'
import { updateSelectedEpochDateForLeaderboard } from 'state/tradingIncentives/actions'
import { useSelectedEpochTimestampInSecondsForLeaderboard } from 'state/tradingIncentives/hooks'

export type WeekDay = 'Su' | 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa'

export const weekDays = (): WeekDay[] => {
  return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
}

const RelativeContainer = styled.div`
  position: relative;
`

const CalendarWrapper = styled.div`
  position: absolute;
  left: 0px;
  top: 50px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  left: -150px;
  bottom: 10px;
  `}
`

const CalendarContainer = styled.div<{
  disabled?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(35, 41, 51, 1);
  border-radius: 5px;
  min-width: 300px;
  z-index: 20000;
  position: relative;

  .react-calendar {
    border: none;
    width: 300px;
    min-width: 300px;
    padding: 16px 0;
    ${(props) => props.disabled && 'opacity: 0.5;'}
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

  .react-calendar__tile[disabled] {
    background: linear-gradient(90deg, #bc2738 0%, #6e1620 10.07%);
    border: 1px solid gray;

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

interface EpochDatePickerProps {
  isOpened: boolean
  setIsOpened: (value: React.SetStateAction<boolean>) => void
  disabled?: boolean
}

export default function EpochDatePicker({ isOpened, setIsOpened, disabled }: EpochDatePickerProps) {
  const calendarRef = useRef(null)

  const isMobile = useIsMobile()

  const dispatch = useDispatch()
  const selectedTimestamp = useSelectedEpochTimestampInSecondsForLeaderboard()

  const setSelectedDate = (value: number) => {
    const d = new Date(value)

    console.log('Selected date ', d)

    const day = d.getUTCDate()
    const month = d.getUTCMonth()
    const year = d.getUTCFullYear()

    const utcDate = new Date(Date.UTC(year, month, day + 1))

    dispatch(
      updateSelectedEpochDateForLeaderboard({
        date: Math.floor(utcDate.getTime() / 1000),
      })
    )
  }

  const formatWeekday = (_locale: any, date: Date): string => weekDays()[date.getDay()]

  const toggleCalendar = (): void => {
    setIsOpened((prev) => !prev)
  }

  const handleChange = (value): void => {
    setSelectedDate(value as any)
    toggleCalendar()
  }

  useOnClickOutside(calendarRef, isOpened ? toggleCalendar : undefined)

  const firstEpochDate = new Date(EPOCH_START_TIMESTAMP * 1000)
  const day = firstEpochDate.getUTCDate()
  const month = firstEpochDate.getUTCMonth()
  const year = firstEpochDate.getUTCFullYear()

  const minDate = new Date(Date.UTC(year, month, day - 1))
  const maxDate = useMemo(() => {
    const d = new Date()
    d.setUTCDate(d.getUTCDate())
    d.setUTCHours(0, 0, 0, 0)

    return d
  }, [])

  return (
    <RelativeContainer ref={calendarRef}>
      {isOpened ? (
        <CalendarWrapper>
          <CalendarContainer>
            <Calendar
              tileDisabled={({ date }) => {
                const d = new Date(date)

                return d.getTime() < minDate.getTime() || d.getTime() > maxDate.getTime()
              }}
              minDetail="month"
              formatShortWeekday={formatWeekday}
              formatMonthYear={(locale, date) => date.toLocaleString(locale, { month: 'short', year: 'numeric' })}
              onChange={handleChange}
              nextLabel={<NavigationChevron />}
              prevLabel={<NavigationChevron isPrev />}
              minDate={minDate}
              maxDate={maxDate}
              value={new Date((selectedTimestamp ?? 0) * 1000 ?? 0)}
            />
          </CalendarContainer>
        </CalendarWrapper>
      ) : null}
      <NavButton onClick={toggleCalendar}>
        <Image
          unoptimized={true}
          src={CalendarIcon}
          alt="icon"
          style={{ width: isMobile ? '32px' : 'auto', height: isMobile ? '32px' : 'auto' }}
        />
      </NavButton>
    </RelativeContainer>
  )
}
