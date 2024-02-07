import { useState } from 'react'
import styled from 'styled-components'
import Add from 'components/Icons/Add'

import { BaseButton } from 'components/Button'

export type CreateOtherAccountsProps = {
  onClick: () => void
}

const AcountButton = styled(BaseButton)`
  font-size: 14px;
  font-weight: 400;
  background-color: ${({ theme }) => theme.bg3};
  margin-bottom: 10px;

  align-items: center;
  gap: 10px;

  &:hover {
    background-image: ${({ theme }) => theme.gradCustom1};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    background: linear-gradient(0deg, rgba(35, 41, 51, 0.5), rgba(35, 41, 51, 0.5));
    border: 0.94px solid rgba(35, 41, 51, 1);
    height: 45px;
  `}
`

export default function CreateOtherAccounts({ onClick }: CreateOtherAccountsProps) {
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseOver = () => setIsHovering(false)
  const handleMouseOut = () => setIsHovering(true)

  return (
    <AcountButton onClick={onClick} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <Add isHover={isHovering} />
      Create other account
    </AcountButton>
  )
}
