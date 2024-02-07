import React, { FC } from 'react'
import styled from 'styled-components'

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  btnFunc?: () => void
  url?: string
  active?: boolean
  disabled?: boolean
}

const FilterButton = styled.button<{ active?: boolean }>`
  color: white;
  width: 100%;
  padding: 13px 0;
  text-align: center;
  flex-shrink: 0;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
  gap: 8px;
  background: ${({ active }) =>
    active
      ? 'linear-gradient(90deg, #BC2738 0%, #6E1620 128.07%)'
      : 'linear-gradient(90deg, rgba(188, 39, 56, 0.3) 0%, rgba(110, 22, 32, 0.3) 128.07%)'};
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 5px;
    padding: 1px;
    background: linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
  white-space: nowrap;
  overflow: hidden;
  transition: filter 0.3s;
  opacity: ${(props) => (props.disabled ? '0.5' : '1')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  filter: ${(props) => (props.disabled ? 'none' : 'brightness(100%)')};
  font-size: 12px;
  font-weight: 300;

  &:hover {
    // filter: brightness(100%);
    background: linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%);
  }
`

const DateFilterButton: FC<BtnProps> = ({ children, size, active, ...rest }) => {
  return (
    <FilterButton {...rest} active={active}>
      {children}
    </FilterButton>
  )
}

export default DateFilterButton
