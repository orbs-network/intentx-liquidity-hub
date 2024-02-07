import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { ChevronDown } from 'components/Icons'
import User from 'components/Icons/User'
import { RowBetween } from 'components/Row'
import find from 'lodash/find'

const Wrapper = styled.div<{
  width: string
}>`
  /* overflow: hidden; */
  max-width: ${({ width }) => width};
  width: 100%;
  position: relative;
`

const Header = styled(RowBetween)<{
  noHover?: boolean
  width: string
}>`
  text-align: left;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 13px;
  color: ${({ theme }) => theme.text0};
  width: ${({ width }) => width};
  align-items: center;

  &:hover {
    cursor: ${({ noHover }) => (noHover ? 'default' : 'pointer')};
  }
`

const StyledChevron = styled(ChevronDown)<{
  isOpen?: boolean
}>`
  transition: transform 0.3s ease-out;
  ${({ isOpen }) =>
    isOpen &&
    `
    transform: scaleY(-1)
  `};
`

const List = styled.ul<{
  width: string
  isOpen?: boolean
}>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: 9px;
  background: ${({ theme }) => theme.bg0};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
  position: absolute;
  z-index: 999;
  left: -50px;
  width: 300px;
  padding: 10px 8px;
  max-height: 125px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: block;
    width: 5px;
  }
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(15px);

  & > li {
    display: flex;
  }
  
  ${({ theme }) => theme.mediaWidth.upToSmall`
    left: -50px;
    width: 200px;
  `};
`

const ListItem = styled.button<{
  selected: boolean
}>`
  width: 100%;
  list-style: none;
  border-top: none;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.text0};
  padding: 5px;
  border-radius: 5px;
  transition: all 0.3s ease-out;
  background: ${({ selected }) => (selected ? 'rgba(35, 41, 51, 1)' : 'none')};
  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.white};
    background: rgba(35, 41, 51, 1);
  }
`

const IconWrapper = styled.div`
  flex-shrink: 0;
  line-height: 0;
`

export interface Option {
  value: string
  label: JSX.Element | string
}

export default function Dropdown({
  options = [],
  placeholder = 'Contracts',
  emptyList = 'No options available',
  onSelect,
  width,
  value,
  defaultValue,
  disabled = false,
}: {
  options: Option[]
  placeholder?: string
  emptyList?: string
  onSelect: (val: string) => void
  width: string
  value?: string
  defaultValue?: string
  disabled?: boolean
}) {
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<string>(value || defaultValue || '')

  useEffect(() => {
    if (value) {
      setSelectedOption(value)
      onSelect(value)
    } else if (defaultValue && !selectedOption) {
      setSelectedOption(defaultValue)
      onSelect(defaultValue)
    }
  }, [options, value, defaultValue, onSelect, selectedOption])

  const header: JSX.Element | string = useMemo(() => {
    const option: Option | undefined = find(options, (obj) => obj.value == selectedOption)
    return option?.label ?? placeholder
  }, [selectedOption, options, placeholder])

  const toggle = () => {
    !disabled && setIsOpen(!isOpen)
  }

  if (!options.length) {
    return (
      <Wrapper ref={ref} width={width}>
        <Header width={width} noHover>
          {emptyList}
        </Header>
      </Wrapper>
    )
  }

  return (
    <>
      <Wrapper ref={ref} width={width}>
        <Header onClick={toggle} width={width}>
          <IconWrapper>
            <User size={25} color="red" />
          </IconWrapper>
          {header}
          {!disabled && (
            <IconWrapper>
              <StyledChevron isOpen={isOpen} color={isOpen ? 'red' : '#5F6064'} width="1.5rem" />
            </IconWrapper>
          )}
        </Header>
      </Wrapper>

      <List isOpen={isOpen} width={width}>
        {options.map((option, i) => (
          <li key={i}>
            <ListItem
              onClick={() => {
                const selected = option.value
                onSelect(selected)
                setSelectedOption(selected)
                toggle()
              }}
              selected={option.value === selectedOption}
            >
              <IconWrapper>
                <User size={20} color="red" />
              </IconWrapper>
              {option.label}
            </ListItem>
          </li>
        ))}
      </List>
    </>
  )
}
