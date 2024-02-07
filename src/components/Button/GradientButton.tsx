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

const Label = styled.span<{ size?: string; weight?: string; reducedOpacity?: boolean }>`
  font-weight: ${({ weight }) => (weight ? weight : '400')};
  font-size: ${({ size }) => (size ? size : '14px')};
  color: ${({ theme }) => theme.white};
  opacity: ${({ reducedOpacity }) => (reducedOpacity ? '0.5' : '1')};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px;
`}
`

export const GradientButtonLabel = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 9px;
`};
`

export const SignButton = styled(RedButton)<{ size?: string; height?: string }>`
  font-size: 12px;
  width: ${({ size }) => size ?? '220px'};
  padding: 1.1rem;
  height: ${({ height }) => height ?? '53px'};
  display: flex;
  overflow: unset;
  z-index: 0;
  border-radius: 5px;
`

export const MainButton = styled(PrimaryButton)<{ size?: string; height?: string }>`
  font-size: 12px;
  width: ${({ size }) => size ?? '220px'};
  padding: 1.1rem;
  height: ${({ height }) => height ?? '53px'};
  display: flex;
  overflow: unset;
  z-index: 0;
  border-radius: 5px;
  border: ${({ theme }) => `1px solid ${theme.red}`};
  background-image: ${({ theme }) => theme.gradCustomRed2};
  background-origin: border-box;
  background-clip: padding-box, border-box;
`

export const InvertedMainButton = styled(PrimaryButton)`
  font-size: 14px;
  width: ${({ size }) => size ?? '220px'};
  padding: 1.1rem;
  height: ${({ height }) => height ?? '53px'};
  display: flex;
  overflow: unset;
  z-index: 0;
  border-radius: 10px;
  background-image: linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%);
  background-origin: border-box;
  background-clip: padding-box, border-box;

  &:hover {
    background-image: ${({ theme }) => theme.gradCustom2};
  }
`

export const GradientSecondaryButton = styled(PrimaryButton)`
  font-size: 14px;
  width: ${({ size }) => size ?? '220px'};
  padding: 1.1rem;
  height: ${({ height }) => height ?? '53px'};
  display: flex;
  overflow: unset;
  z-index: 0;
  border-radius: 10px;
  cursor: default;
  background-image: linear-gradient(270deg, #464f5e 0%, #232a37 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;

  &:hover {
    background-image: linear-gradient(270deg, #464f5e 0%, #232a37 100%);
  }
`

const SecondaryButton = styled(PrimaryButton)<{ size?: string; height?: string }>`
  font-size: 12px;
  width: ${({ size }) => size ?? '220px'};
  padding: 1.1rem;
  height: ${({ height }) => height ?? '53px'};
  display: flex;
  overflow: unset;
  z-index: 0;

  border-radius: 5px;
  border: 1px solid #ffffff1a;
  background: linear-gradient(0deg, #22252e, #22252e),
    linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
`

export default function GradientButton({
  label,
  onClick,
  children,
  buttonFilled = true,
  secondary = false,
  size = '220px',
  height = '53px',
}: {
  label: string
  size?: string
  height?: string
  onClick: () => void
  children?: React.ReactNode
  buttonFilled?: boolean
  secondary?: boolean
}): JSX.Element {
  return buttonFilled ? (
    <SignButton size={size} height={height} onClick={onClick}>
      <GradientButtonLabel>{label}</GradientButtonLabel>
      <div>{children}</div>
    </SignButton>
  ) : secondary ? (
    <SecondaryButton size={size} height={height} onClick={onClick}>
      <GradientButtonLabel>{label}</GradientButtonLabel>
      <div>{children}</div>
    </SecondaryButton>
  ) : (
    <MainButton size={size} height={height} onClick={onClick}>
      <GradientButtonLabel>{label}</GradientButtonLabel>
      <div>{children}</div>
    </MainButton>
  )
}

export function AdvancedGradientButton({
  label,
  onClick,
  children,
  secondary = false,
  size = '100%',
  height = '60px',
}: {
  label: string
  size?: string
  height?: string
  onClick: () => void
  children?: React.ReactNode
  secondary?: boolean
}): JSX.Element {
  return secondary ? (
    <GradientSecondaryButton size={size} height={height} onClick={onClick}>
      <Label>{label}</Label>
      <div>{children}</div>
    </GradientSecondaryButton>
  ) : (
    <InvertedMainButton size={size} height={height} onClick={onClick}>
      <Label>{label}</Label>
      <div>{children}</div>
    </InvertedMainButton>
  )
}
