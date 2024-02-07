import { SupportedThemes } from 'theme'

export type Color = string
export interface Colors {
  themeName: SupportedThemes

  // base
  white: Color
  black: Color

  // text
  text0: Color
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color
  text6: Color
  textMuted: Color

  // backgrounds
  bg: Color
  bg0: Color
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color
  bg6: Color
  bg7: Color
  bg8: Color
  bg9: Color
  bg10: Color

  bgCustom1: Color
  bgCustom2: Color
  bgCustom3: Color
  bgCustom4: Color

  bgLoose: Color
  bgWin: Color
  bgWarning: Color

  // borders
  border1: Color
  border2: Color
  border3: Color
  border4: Color

  gradDark: Color
  gradLight: Color
  gradCustom1: Color
  gradCustom2: Color
  gradCustomCleared: Color
  gradCustom3: Color
  gradCustom4: Color
  gradCustom5: Color
  gradCustom6: Color
  gradCustom7: Color
  gradCustomGreen: Color
  gradCustomRed: Color
  gradCustomGreen2: Color
  gradCustomRed2: Color
  gradCustomBg: Color
  gradCustomBg2: Color
  gradCustomBg3: Color
  gradCustomMax: Color
  hoverGrad: Color
  hoverShort: Color
  hoverLong: Color
  primaryBlackNew: Color
  primaryDisable: Color
  primaryDarkBg: Color
  primaryDark: Color
  primaryDarkOld: Color
  gradCustom1Opacity: Color

  //blues
  primary0: Color
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color
  primary6: Color
  primary7: Color
  primary8: Color

  primaryText1: Color

  // pinks
  secondary1: Color
  secondary2: Color

  // other
  black2: Color
  red: Color
  red1: Color
  red2: Color
  red3: Color
  red5: Color
  red6: Color
  green: Color
  green1: Color
  green2: Color
  green3: Color
  green4: Color
  yellow1: Color
  yellow2: Color
  yellow3: Color
  yellow4: Color
  blue1: Color
  blue2: Color
  primaryBlue: Color
  darkPink: Color
  orange: Color
  darkOrange: Color

  error: Color
  success: Color
  warning: Color

  usdt: Color
  twitter: Color
}

export type Shadow = string
export interface Shadows {
  shadow1: Shadow
  boxShadow1: Shadow
  boxShadow2: Shadow
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors, Shadows {
    grids: Grids

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
      upToExtraLarge: ThemedCssFunction<DefaultTheme>
    }
  }
}
