import { FC } from 'react'
import styled from 'styled-components'
import { BtnProps, Icon } from 'types/traderIncentives'
import { LinkIcon } from 'components/Icons/LinkIcon'

const StyledCTABtn = styled.button`
  background: transparent;
  cursor: pointer;
  text-clip: text;
  display: flex;
  gap: 1rem;
  align-items: center;
  outline: none;
  focus: outlined-none;
  padding: 0.5rem;
  filter: grayscale(100%);
  transition: filter 0.5s;

  &:hover {
    filter: grayscale(0%);
  }
`

const IconContainer = styled.div`
  fill: currentColor;
  width: 1.5rem; /* Adjust as needed */
  height: 1.5rem; /* Adjust as needed */
`

const TextContainer = styled.span`
  background-clip: text;
  font-size: 1rem;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px;
`}
`

export const CTABtn: FC<BtnProps & { icon?: Icon }> = ({ children, className, icon: Icon = LinkIcon, ...props }) => {
  return (
    <StyledCTABtn className={className} {...props}>
      <IconContainer>
        <Icon />
      </IconContainer>
      <TextContainer>{children}</TextContainer>
    </StyledCTABtn>
  )
}
