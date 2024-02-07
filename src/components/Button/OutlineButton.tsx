import React, { FC } from 'react'
import styled from 'styled-components'

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  padding?: string
  btnFunc?: () => void
  url?: string
  secondary?: boolean
  disabled?: boolean
  full?: boolean
}

const OutlinedButton = styled.button<{ secondary?: boolean; padding?: string; full?: boolean }>`
  color: #798599;
  padding: ${({ padding }) => (padding ? padding : '18px 30px')};
  text-align: center;
  flex-shrink: 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
  gap: 8px;
  width: ${({ full }) => (full ? '100%' : 'fit-content')};
  background: ${(props) =>
    props.secondary
      ? 'rgba(35, 41, 51, 0.4)'
      : 'linear-gradient(90deg, rgba(188, 39, 56, 0.3) 0%, rgba(110, 22, 32, 0.3) 128.07%)'};
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 8px;
    padding: 1px;
    background: ${({ secondary }) => (secondary ? '#232933' : 'linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%)')};
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
  white-space: nowrap;
  overflow: hidden;
  transition: filter 0.3s;
  opacity: ${(props) => (props.disabled ? '0.5' : '1')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  filter: ${(props) => (props.disabled ? 'none' : 'brightness(150%)')};
  font-size: 14px;
  font-weight: 400;

  &:hover {
    filter: brightness(100%);
    background: linear-gradient(90deg, rgba(188, 39, 56, 0.3) 0%, rgba(110, 22, 32, 0.3) 128.07%);
    color: white;

    &::before {
      background: ${({ secondary }) =>
        secondary
          ? 'linear-gradient(90deg, #BC2738 0%, #6E1620 128.07%)'
          : 'linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%)'};
    }
  }

  ${({ theme, padding }) => theme.mediaWidth.upToExtraLarge`
  padding: ${padding ?? '12px 21px'};
  font-size: 11px;
  `}
`

const OutlineBtn: FC<BtnProps> = ({ children, className, secondary, padding, full, ...rest }) => {
  return (
    <OutlinedButton className={className} {...rest} secondary={secondary} padding={padding} full={full}>
      {children}
    </OutlinedButton>
  )
}

export default OutlineBtn
