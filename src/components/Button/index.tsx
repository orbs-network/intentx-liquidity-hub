import { RowCenter } from 'components/Row'
import { lighten } from 'polished'
import styled from 'styled-components'

export const BaseButton = styled(RowCenter)<{ active?: boolean; disabled?: boolean }>`
  padding: 1rem;
  height: 100%;
  font-weight: 600;
  border-radius: 4px;
  outline: none;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  z-index: 1;

  &:disabled {
    opacity: 50%;
    cursor: auto;
    pointer-events: none;
  }

  will-change: transform;
  transition: transform 450ms ease;
  transform: perspective(1px) translateZ(0);

  > * {
    user-select: none;
  }

  > a {
    text-decoration: none;
  }
`

export const NavButton = styled(BaseButton)<{ width?: number | string; isMobile?: boolean }>`
  height: ${({ isMobile }) => (isMobile ? '24px' : '40px')};
  width: ${({ isMobile }) => (isMobile ? '24px' : '40px')};
  height: ${({ isMobile }) => (isMobile ? '24px' : '40px')};
  font-size: 14px;
  padding: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  transition: background-color 0.3s linear;

  &:hover {
    background: ${({ theme }) => theme.bg4};
  }
`

export const PrimaryButton = styled(BaseButton)<{ height?: string | number; width?: string | number }>`
  z-index: 0;
  width: ${({ width }) => (width ? width : '100%')};
  font-size: 14px;
  font-weight: 400;
  border-radius: 8px;
  height: ${({ height }) => (height ? height : '45px')};
  color: ${({ theme }) => theme.white};
  background: ${({ theme }) => theme.gradCustom3};
  &:focus,
  &:hover {
    background: ${({ theme }) => theme.gradCustom1};
    /* box-shadow: 0 0 0 1px ${({ theme }) => theme.primary0}; */
  }

  &:hover {
    /* filter: brightness(0.1); */
    /* background: ${({ theme }) => lighten(0.03, theme.primary0)}; */
  }

  ${({ theme, disabled }) =>
    disabled &&
    `
      // background: ${theme.bg2};
      // border: 1px solid ${theme.border1};
      cursor: default;
      opacity:0.5;
      // &:focus,
      // &:hover {
      //   filter:brightness(0.1);
      // }
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    font-size: 12px;
`};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 10px;
`};
`

export const MainButton = styled(PrimaryButton)<{ long?: boolean }>`
  height: 51.25px;
  border: 2px solid ${({ long }) => (long ? '#27F29180' : '#FA3F4C')};
  border-radius: 8px;
  background-image: ${({ theme, long }) => (long ? theme.gradCustomGreen : theme.gradCustomRed)};
  white-space: nowrap;
  gap: 4px;
  font-size: 12px !important;

  &:hover {
    background-image: ${({ theme, long }) => (long ? theme.gradCustomGreen2 : theme.gradCustomRed2)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  height: 36px;
  border-radius: 6px;
  gap: 3px;
  `};
`

export const MainButtonWithdraw = styled(PrimaryButton)`
  height: 48px;
  border: double 1px transparent;
  border-radius: 8px;
  background-image: ${({ theme }) => theme.gradCustom1};
  background-origin: border-box;
  background-clip: padding-box, border-box;
`

export const RedButton = styled(BaseButton)`
  height: 48px;
  border-radius: 8px;
  background: ${({ theme }) => theme.gradCustom2};

  &:hover {
    background: ${({ theme }) => theme.gradCustom3};
  }
`

export const SecondaryButton = styled(PrimaryButton)`
  background: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ theme }) => theme.bg7};
  border-radius: 8px;
  font-weight: 500;
  font-size: 12px;

  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg1};
  }

  &:hover {
    background: ${({ theme }) => lighten(0.1, theme.bg1)};
  }
`

export const ButtonEmpty = styled(BaseButton)`
  background-color: transparent;
  color: ${({ theme }) => theme.red1};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: underline;
  }

  &:hover {
    text-decoration: none;
  }

  &:active {
    text-decoration: none;
  }

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const TableButton = styled(PrimaryButton)<{ width?: string | number }>`
  width: ${({ width }) => (width ? width : '132px')};
  height: 40px;
  padding: 0;
  border-radius: 8px;
  white-space: nowrap;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    & > * {
      margin: -4px;
    }
  `}
`

export const WhiteButton = styled(TableButton)`
  background: ${({ theme }) => theme.bg1};
  border: 2px solid ${({ theme }) => theme.text0};
  color: ${({ theme }) => theme.text0};

  &:focus,
  &:hover {
    background: ${({ theme }) => theme.bg3};
  }
`
export const BlueButton = styled(TableButton)`
  background: ${({ theme }) => theme.bg0};
  border: 2px solid ${({ theme }) => theme.primary0};
  color: ${({ theme }) => theme.primary0};

  &:focus,
  &:hover {
    background: ${({ theme }) => theme.bg2};
  }

  ${({ theme, disabled }) =>
    disabled &&
    `
    opacity:0.5;
    &:focus,
    &:hover {
      background: ${theme.bg0};
    }
  `}
`

export const MaxButton = styled.div`
  bottom: 8px;
  height: 21px;
  width: 26px;
  font-size: 8px;
  background: ${({ theme }) => theme.gradCustomMax};
  font-weight: 500;
  position: absolute;
  right: 110px;
  padding: 5px 1%;
  border-radius: 10px;

  &:hover {
    cursor: pointer;
    filter: brightness(0.9);
  }
`

export const MaxButtonWithdraw = styled.div`
  height: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  position: relative;
  margin-left: 10px;
  font-size: 8px;
  background: ${({ theme }) => theme.gradCustomMax};
  padding: 10px;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
    filter: brightness(0.9);
  }
`

export const SignButton = styled(RedButton)`
  font-size: 12px;
  width: 220px;
  padding: 1.4rem;
  height: 55px;
  display: flex;
  overflow: unset;
  z-index: 0;
`

export const MaxButtonTransfer = styled.div<{ active?: boolean }>`
  height: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  font-size: 10px;
  background: ${({ theme, active }) => (active ? theme.gradCustom4 : theme.gradCustomCleared)};
  border-radius: 5px;
  border: solid 1px rgba(188, 39, 56, 1);
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.gradCustom1};
    transition: all 0.3s;
  }
`

export const OptionButton = styled(BaseButton)<{ active?: boolean }>`
  height: 36px;
  width: 62px;
  font-size: 13px;
  padding: 0;
  border-radius: 6px;
  color: ${({ theme }) => theme.text1};
  border: 1.5px solid ${({ theme, active }) => (active ? theme.border2 : theme.border1)};
  background: ${({ theme, active }) => (active ? theme.bg3 : 'transparent')};
  position: relative;
  z-index: 1;
  transition: all 0.1s;
  cursor: ${({ active }) => active && 'pointer'};

  ${({ theme }) => theme.mediaWidth.upToMedium`
      margin-right: 3px;
  `}
  &:hover {
    border: 1.5px solid ${({ theme, active }) => (active ? theme.border3 : theme.text1)};
  }
`

export const EnterButton = styled(BaseButton)<{ active?: boolean; calculationLoading?: boolean }>`
  width: 100px;
  height: 26px;
  padding: 8px 16px;
  border-radius: 5px;
  margin-bottom: 6px;
  background: transparent;
  background-color: ${({ theme }) => theme.primaryDarkBg};
  opacity: ${({ calculationLoading }) => (calculationLoading ? 0.4 : 1)};

  &:focus {
    text-decoration: underline;
  }

  &:hover {
    text-decoration: none;
  }

  &:active {
    text-decoration: none;
  }
`

export const PositionActionButton = styled(SecondaryButton)<{
  expired?: boolean
  liquidatePending?: boolean
  hasCooldown?: boolean
  height?: string
  width?: string
}>`
  width: ${({ width }) => (width ? width : '100px')};
  height: ${({ height }) => (height ? height : '30px')};
  padding: 6px;
  border: 1px solid ${({ theme }) => theme.red};
  font-size: 12px;
  color: ${({ theme }) => theme.text0};
  --bg-opacity: 0.3;
  background: ${({ theme }) => theme.gradCustom1Opacity};

  &:hover {
    --bg-opacity: 1;
    background: ${({ theme }) => theme.gradCustom1Opacity};
  }

  ${({ hasCooldown, theme }) => {
    if (hasCooldown) {
      return `
      &:hover {
        ${CooldownTimer} {
          display: flex;
        }
      }
      `
    }
  }}

  ${({ expired, theme }) =>
    expired &&
    `
    color: ${theme.warning};
    background: ${theme.bgWarning};
    border-color: ${theme.warning};

    &:hover {
    background: ${lighten(0.05, theme.bgWarning)};
  }`}

  ${({ liquidatePending, theme }) =>
    liquidatePending &&
    `
    color: ${theme.red1};
    background: ${theme.red5};
    border-color: ${theme.red1};

    &:hover {
    background: ${lighten(0.05, theme.red5)};
  }`}

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-top: 5px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 10px;
  padding: 0;
  `}
`
export const CooldownTimer = styled.div`
  ${({ theme }) => {
    return `
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${theme.gradCustom1Opacity};
      color: ${theme.text1};
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      font-size: 12px;
      font-weight: 500;
      z-index: 1;
    `
  }}
`

export const ConfigButton = styled(BaseButton)<{ isActive: boolean }>`
  width: 36px;
  height: 34px;
  padding: 0;
  border-radius: 5px;
  background: ${({ isActive, theme }) =>
    isActive ? 'linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%)' : theme.bg9};
  transition: background 0.3s ease;

  &:focus {
    text-decoration: underline;
    background: linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%);
  }

  &:hover {
    text-decoration: none;
    background: linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%);
  }
`

export const NavigationButton = styled.div<{ width?: string }>`
  display: flex;
  flex-shrink: 0;
  width: ${({ width }) => width ?? '36px'};
  height: 36px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s linear;
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.bg4};
  }

  ${({ theme, width }) => theme.mediaWidth.upToExtraLarge`
  height: 30px;
  width: ${width ?? '30px'};
  `};
`
