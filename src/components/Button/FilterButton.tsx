import styled from 'styled-components'

import { BaseButton, PrimaryButton, RedButton } from 'components/Button'

export const GradientButtonWrapper = styled(BaseButton)`
  padding: 1px;
  height: 40px;
  border-radius: 5px;
  background: ${({ theme }) => theme.gradLight};
`

export const GradientColorButton = styled(BaseButton)`
  height: 100%;
  border-radius: 5px;
  background: ${({ theme }) => theme.bg1};

  &:focus,
  &:hover,
  &:active {
    background: ${({ theme }) => theme.black2};
    cursor: ${({ disabled }) => !disabled && 'pointer'};
  }
`

export const ButtonLabel = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: #798599;
`

const SignButton = styled(RedButton)`
  font-size: 12px;
  padding: 0;
  width: 107px;
  height: 44px;
  display: flex;
  overflow: unset;
  z-index: 0;
`

const MainButton = styled(PrimaryButton)`
  font-size: 12px;
  width: 107px;
  height: 44px;
  display: flex;
  overflow: unset;
  z-index: 0;
  padding: 0;
  display: flex;
  align-items: center;

  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  background: #22252e;
  background-origin: border-box;
  background-clip: padding-box, border-box;
`

export default function FilterButton({
  label,
  onClick,
  children,
  buttonFilled = true,
}: {
  label?: string
  onClick: () => void
  children?: React.ReactNode
  buttonFilled?: boolean
}): JSX.Element {
  return buttonFilled ? (
    <SignButton onClick={onClick}>
      <ButtonLabel>{label}</ButtonLabel>
      <div>{children}</div>
    </SignButton>
  ) : (
    <MainButton onClick={onClick}>
      <ButtonLabel>{label}</ButtonLabel>
      <div>{children}</div>
    </MainButton>
  )
}
