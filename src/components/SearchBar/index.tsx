import Reload from 'components/Icons/Reload'
import SettingsCog from 'components/Icons/SettingsCog'
import React, { useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import HeaderMask from '/public/images/spot-header-mask.png'
import { useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { IconWrapper, Search } from 'components/Icons'

const Wrapper = styled.div`
  display: flex;
  height: 55px;
  width: 100%;
  border-radius: 5px;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`

`};
`

const Label = styled.span<{ size?: string; weight?: string; reducedOpacity?: boolean }>`
  font-weight: ${({ weight }) => (weight ? weight : '400')};
  font-size: ${({ size }) => (size ? size : '20px')};
  color: ${({ theme }) => theme.white};
  opacity: ${({ reducedOpacity }) => (reducedOpacity ? '0.5' : '1')};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 20px;
`}
`

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

const ActionButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 9999;
`

const IconInput = styled(IconWrapper)`
  height: 100%;
  padding-left: 20px;
  padding-right: 15px;
  border-radius: 5px 0px 0px 5px;
  background: rgba(35, 41, 51, 0.5);
`

const Input = styled.input<{
  [x: string]: any
}>`
  height: 100%;
  flex: 1;
  border: none;
  background: rgba(35, 41, 51, 0.5);
  border-radius: 0px 4px 4px 0px;
  color: ${({ theme }) => theme.white};
  padding-left: 10px;
  &:focus,
  &:hover {
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      font-size: 0.6rem;
    `}

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    font-size: 0.75rem;
  `};
`

export default function SearchBar({
  searchValue,
  onChange,
  placeHolder = 'Search...',
}: {
  searchValue: string
  onChange(value: string): void
  placeHolder?: string
}) {
  const handleValueChange = (value: string): void => {
    onChange?.(value)
  }

  return (
    <Wrapper>
      <IconInput>
        <Search size={24} />
      </IconInput>
      <Input
        value={searchValue}
        onChange={(e) => {
          handleValueChange(e.target.value)
        }}
        autoFocus
        type="text"
        placeholder={placeHolder}
        spellCheck="false"
        onBlur={() => null}
      />
    </Wrapper>
  )
}
