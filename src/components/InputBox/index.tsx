import { Currency } from '@uniswap/sdk-core'
import { MaxButton, MaxButtonTransfer, MaxButtonWithdraw } from 'components/Button'
import { InnerCard } from 'components/Card'
import Column from 'components/Column'
import { ChevronDown as ChevronDownIcon } from 'components/Icons'
import ImageWithFallback from 'components/ImageWithFallback'
import { NumericalInput } from 'components/Input'
import { Title } from 'components/Modal'
import { Row, RowBetween, RowCenter, RowEnd, RowStart } from 'components/Row'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import useCurrencyLogo from 'lib/hooks/useCurrencyLogo'
import { useIsMobile } from 'lib/hooks/useWindowSize'
import Image, { StaticImageData } from 'next/image'
import { darken } from 'polished'
import React, { useCallback, useEffect, useMemo } from 'react'
import { isMobile } from 'react-device-detect'
import { useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { useSetSlippageToleranceCallback, useSlippageTolerance } from 'state/user/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import styled, { useTheme } from 'styled-components'
import { maxAmountSpend } from 'utils/currency'
import IntentXIcon from '/public/static/images/stakingIcons/intentXIcon.svg'

export const Wrapper = styled.div`
  width: 100%;
  font-size: 12px;
  font-weight: 400;
  border-radius: 12px;
  white-space: nowrap;
  background: rgba(217, 217, 217, 0.025);
  position: relative;
  border-radius: 4px;
  padding: 5px 0px 10px 10px;
  display: flex;
  align-items: center;
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  
  font-size: 9px;
  border-radius: 9px;
  border-radius: 3px;
  padding: 7.5px 0px 7.5px 7.5px;
  `};
`

export const DarkWrapper = styled.div`
  width: 100%;
  font-size: 12px;
  font-weight: 400;
  border-radius: 12px;
  white-space: nowrap;
  background: rgba(23, 26, 31, 0.8);
  position: relative;
  border-radius: 4px;
  padding: 10px 0px 10px 10px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 9px;
  border-radius: 9px;
  border-radius: 3px;
  padding: 7.5px 0px 7.5px 7.5px;
  `};
`

export const CustomWrapper = styled.div<{ background?: string; border?: string }>`
  background: ${({ background }) => (background ? background : 'transparent')};
  border: ${({ border }) => (border ? border : '1px solid rgba(56, 64, 79, 1)')};
  width: 100%;
  position: relative;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 400;
  border-radius: 5px;
  padding: 10px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 9px;
  border-radius: 9px;
  border-radius: 3px;
  padding: 7.5px 0px 7.5px 7.5px;
  `};
`

const NumericalWrapper = styled(RowBetween)`
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  position: relative;
  color: ${({ theme }) => theme.text0};
  margin-top: 10px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
    right: 0;
`};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
font-size: 12px;
margin-top: 7.5px;
  `};
`

export const CurrencySymbol = styled.div<{ active?: any }>`
  font-size: 12px;
  font-weight: 500;
  text-align: end;
  color: ${({ theme }) => theme.text0};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 9px;
    `};
`

export const SymbolWrapper = styled.div`
  flex-direction: column;
  font-size: 12px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 9px;
    `};
`

export const PriceTitle = styled.div`
  align-items: center;
  font-size: 12px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 11px;
    `};
`

const PriceTitleMuted = styled(PriceTitle)`
  color: rgba(255, 255, 255, 0.4);
`

export const PriceTitleRow = styled(RowStart)`
  min-width: fit-content;
`

export const PriceShow = styled.div`
  background: ${({ theme }) => theme.bg3};
  border-radius: 5px 0 0 5px;
  padding: 8px 10px;
  padding-left: min(6rem, 6rem);

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 6px 8px;
  padding-left: min(4.5rem, 4.5rem);
    `};
`

export const PriceShowRow = styled.div``

export const Price = styled.div`
  flex-direction: row;
  color: ${({ theme }) => theme.text3};
  display: flex;
  }
`

export const EnterBox = styled.div`
  padding: 8px 16px;
  border-radius: 5px;
  background: transparent;
  margin-bottom: 10px;
  background-color: #44322280;
  color: #e3c2609e;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 6px 12px;
  margin-bottom: 7.5px;
    `};
`

export const CalculationResult = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-top: 5px;
  margin-bottom: 3px;
  color: ${({ theme }) => theme.text3};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px; 
  margin-top: 4px;
  margin-bottom: 2px;
    `};
`

export const RightWrapper = styled.div``

export const BalanceTitle = styled.p`
  color: ${({ theme }) => theme.text3};
`

export const LogoWrapper = styled(RowCenter)<{ active?: any }>`
  height: 100%;
  width: 80px;
  min-width: 60px;
  cursor: ${({ active }) => active && 'pointer'};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 60px; 
  min-width: 45px;
    `};
`

export const ChevronDown = styled(ChevronDownIcon)`
  margin-left: 7px;
  width: 16px;
  color: ${({ theme }) => theme.text1};

  ${({ theme }) => theme.mediaWidth.upToSmall`
      margin-left: 4px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin-left: 6px;
  width: 12px;
    `};
`
const TitleInfo = styled.div<{ align?: string }>`
  font-family: Poppins;
  font-size: 16px;
  font-weight: 500;
  text-align: ${({ align }) => (align ? align : 'left')};
  color: ${({ theme }) => theme.white};
`

export const BalanceComponent = styled(RowEnd)`
  width: 550px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: 680px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 412px;
    `};
`

const Balance = styled(RowEnd)<{ disabled?: boolean }>`
  width: 100%;
  text-align: right;
  display: flex;
  gap: 5px;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  &:hover {
    color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.text0)};
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 4px;
  font-size: 10px;
    `};
`
const BalanceSlip = styled(RowEnd)<{ disabled?: boolean }>`
  width: 100%;
  text-align: right;
  display: flex;
  gap: 5px;
  align-items: center;
  display: flex;

  &:hover {
    color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.text0)};
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }
`

const MinBalance = styled(Balance)`
  font-size: 12px;
  background: ${({ theme }) => theme.primaryBlue};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  &:hover {
    cursor: pointer;
    filter: brightness(0.9);
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 10px;
    `};
`

const SlippageWrap = styled(InnerCard)`
  background: ${({ theme }) => theme.red};
  padding: 5px;
  font-size: 10px;
  padding-left: 10px;
  padding-right: 10px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 3.75px;
  font-size: 7.5px;
  padding-left: 7.5px;
  padding-right: 7.5px;
    `};
`

export const TextLabel = styled.span`
  font-size: 10px;
  line-height: 14px;
  background: ${({ theme }) => theme.blue2};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 7.5px;
  line-height: 10.5px;
    `};
`

const Amount = styled.div`
  display: flex;
  flex-direction: column;
`

const CurrentBalance = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 5px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 3.75px;
    `};
`

const InfoBalance = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(217, 217, 217, 0.05);
  border-radius: 5px 0 0 5px;
  padding: 5px 10px;
  align-items: flex-end;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  border-radius: 3.75px;
  padding: 3.75px 7.5px;
    `};
`

const PriceInfoMobile = styled.div`
  font-size: 12px;
  margin-top: 4px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 10px;
  margin-top: 3px;
  `};
`

const PriceInfo = styled(Row)`
  font-size: 14px;
  font-weight: 200;
  color: ${({ theme }) => theme.text0};
  flex-shrink: 0;
  width: fit-content;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px;
  `};
`

export const getImageSize = () => {
  return isMobile ? 35 : 38
}

export function InputBox({
  currency,
  value,
  onChange,
  onTokenSelect,
  autoFocus,
  disabled,
}: {
  currency: Currency
  value: string
  onChange(values: string): void
  onTokenSelect?: () => void
  autoFocus?: boolean
  disabled?: boolean
}) {
  const { account } = useActiveConnectionDetails()
  const currencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const [balanceExact, balanceDisplay] = useMemo(() => {
    return [maxAmountSpend(currencyBalance)?.toExact(), currencyBalance?.toSignificant(6)]
  }, [currencyBalance])

  const placeholder = useMemo(() => (disabled ? '0.0' : 'Enter amount'), [disabled])

  return (
    <CustomInputBox
      balanceDisplay={balanceDisplay}
      placeholder={placeholder}
      value={value}
      // icon={logo}
      name={currency?.symbol}
      balanceExact={balanceExact}
      onChange={onChange}
      onSelect={onTokenSelect}
      disabled={disabled}
      autoFocus={autoFocus ?? true}
    />
  )
}

export function CustomInputBox({
  value,
  icon,
  name,
  placeholder,
  balanceTitle,
  balanceDisplay,
  balanceExact,
  onChange,
  onSelect,
  disabled,
  autoFocus,
  max,
}: {
  name: string | undefined
  value: string
  placeholder?: string
  balanceTitle?: string
  balanceDisplay: string | number | undefined
  balanceExact: string | number | undefined
  icon?: string | StaticImageData
  onChange(values: string): void
  onSelect?: () => void
  disabled?: boolean
  autoFocus?: boolean
  max?: boolean
}) {
  const hasMax = max || max === undefined

  const handleClick = useCallback(() => {
    if (!balanceExact || !onChange || disabled || !hasMax) return
    onChange(balanceExact.toString())
  }, [balanceExact, disabled, onChange, hasMax])

  return (
    <Wrapper>
      <RowBetween>
        {icon && (
          <LogoWrapper onClick={onSelect ? () => onSelect() : undefined} active={onSelect ? true : false}>
            <ImageWithFallback src={icon} width={getImageSize()} height={getImageSize()} alt={`${name} icon`} round />
            {onSelect ? <ChevronDown /> : null}
          </LogoWrapper>
        )}
        <CurrencySymbol onClick={onSelect ? () => onSelect() : undefined} active={onSelect ? true : false}>
          {name}
        </CurrencySymbol>
        <Balance disabled={disabled || !hasMax} onClick={handleClick}>
          <BalanceTitle>{balanceTitle || 'Balance'}</BalanceTitle>: {balanceDisplay ? balanceDisplay : '0.00'}
        </Balance>
      </RowBetween>
      <RightWrapper>
        <NumericalWrapper>
          <NumericalInput
            value={value || ''}
            onUserInput={onChange}
            placeholder={placeholder}
            autoFocus={autoFocus}
            disabled={disabled}
          />
          {hasMax && <MaxButton onClick={handleClick}>MAX</MaxButton>}
        </NumericalWrapper>
      </RightWrapper>
    </Wrapper>
  )
}

export function CustomInputBox2({
  value,
  title,
  placeholder,
  symbol = 'USDC',
  balanceTitle,
  balanceDisplay,
  balanceExact,
  minBalanceTitle,
  minBalanceDisplay,
  minBalanceExact,
  onChange,
  disabled,
  autoFocus,
  precision,
  calculationMode = false,
  calculationEnabled,
  calculationLoading,
  onEnterPress,
  max,
  auto,
  minBalanceMax,
  pinMaxOnClick,
}: {
  title: string | undefined
  value: string
  placeholder?: string
  symbol?: string
  balanceTitle?: string
  balanceDisplay: string | number | undefined
  balanceExact: string | number | undefined
  minBalanceTitle?: string
  minBalanceDisplay?: string | number
  minBalanceExact?: string | number
  icon?: string | StaticImageData
  onChange(values: string): void
  disabled?: boolean
  autoFocus?: boolean
  precision?: number
  calculationMode?: boolean
  calculationEnabled?: boolean
  calculationLoading?: boolean
  onEnterPress?: () => void
  max?: boolean
  auto?: boolean
  minBalanceMax?: boolean
  pinMaxOnClick?: boolean
}) {
  const theme = useTheme()
  const handleClick = useCallback(() => {
    if (!balanceExact || !onChange || disabled) return
    onChange(balanceExact.toString())
    if (pinMaxOnClick) {
      setPinMax(true)
    }
  }, [balanceExact, disabled, onChange, pinMaxOnClick])

  const minBalanceHandleClick = useCallback(() => {
    if (!minBalanceExact || !onChange || disabled) return
    onChange(minBalanceExact.toString())
  }, [minBalanceExact, disabled, onChange])

  const currencyLogo = useCurrencyLogo(symbol)
  const [pinMax, setPinMax] = React.useState(false)

  const onCustomChange = useCallback(
    (value: string) => {
      if (pinMax) {
        setPinMax(false)
      }
      onChange(value)
    },
    [onChange, pinMax]
  )

  useEffect(() => {
    if (pinMax && balanceExact) {
      onChange(balanceExact.toString())
    } else {
      /*if (balanceExact && value && Number(value) > Number(balanceExact)) {
        onChange(balanceExact.toString())
      }*/
    }
  }, [balanceExact, onChange, pinMax])

  // if balanceExact is less the input value, set the input value to balanceExact
  /* useEffect(() => {
    if (balanceExact && value && Number(value) > Number(balanceExact)) {
      onChange(balanceExact.toString())
    }
  }, [balanceExact, onChange, value]) */

  return (
    <Wrapper>
      <RowBetween>
        <Amount>
          <PriceTitleRow gap="10px">
            <PriceTitle>{title}</PriceTitle>
            {max && (
              <MaxButtonTransfer
                active={pinMax}
                onClick={() => {
                  if (!balanceExact || !onChange || disabled) return
                  onChange(balanceExact.toString())
                  setPinMax(true)
                }}
              >
                Max
              </MaxButtonTransfer>
            )}
            {auto && (
              <MaxButtonTransfer
                onClick={() => {
                  setPinMax(true)
                }}
              >
                Auto
              </MaxButtonTransfer>
            )}
          </PriceTitleRow>
        </Amount>
        <BalanceComponent>
          <RowEnd style={{ width: '50vw', marginLeft: '4px', gap: '20px', cursor: 'pointer' }}>
            <PriceShowRow>
              <NumericalInput
                value={value || ''}
                onUserInput={onCustomChange}
                placeholder={placeholder}
                autoFocus={autoFocus}
                disabled={disabled}
                precision={precision}
                calculational={calculationEnabled}
                onEnterPress={onEnterPress}
                calculationMode={calculationMode}
                calculationLoading={calculationLoading}
              />
            </PriceShowRow>
            <InfoBalance onClick={handleClick}>
              <Balance disabled={disabled}>
                <BalanceTitle>{balanceTitle || 'Balance'} </BalanceTitle>
              </Balance>
              <CurrentBalance>
                <Image unoptimized={true} src={currencyLogo} alt="icon" width={14} height={14} />
                <Price>{balanceDisplay ? balanceDisplay : '12.958,21'} </Price>
                <CurrencySymbol>{symbol}</CurrencySymbol>
              </CurrentBalance>
            </InfoBalance>
            {minBalanceTitle && (
              <MinBalance disabled={disabled} onClick={minBalanceHandleClick}>
                <BalanceTitle>{minBalanceTitle || 'Balance'} </BalanceTitle>{' '}
                {minBalanceDisplay ? minBalanceDisplay : '12.958,21'}
                <SymbolWrapper>
                  <CurrencySymbol>{symbol}</CurrencySymbol>
                </SymbolWrapper>
                {minBalanceMax && <MaxButton>MAX</MaxButton>}
              </MinBalance>
            )}
          </RowEnd>
        </BalanceComponent>
      </RowBetween>
    </Wrapper>
  )
}

export function CustomInputBox3({
  value,
  title,
  symbol,
  balanceTitle,
}: {
  title: string | undefined
  value: string
  symbol?: string
  balanceTitle?: string
}) {
  const theme = useTheme()
  const slippage = useSlippageTolerance()
  const setSlippage = useSetSlippageToleranceCallback()
  const toggleSlippageModal = useToggleModal(ApplicationModal.CHANGE_MARKET_SLIPPAGE)

  function getMobileContent() {
    return (
      <>
        <Wrapper>
          <RowBetween>
            <Amount>
              <PriceTitleRow>
                <PriceTitle>{title}</PriceTitle>
              </PriceTitleRow>
              <PriceInfoMobile>
                {symbol} {value}
              </PriceInfoMobile>
            </Amount>
            <BalanceComponent>
              <RowEnd style={{ width: '170px', marginLeft: '4px', marginRight: '10px' }}>
                <Balance
                  onClick={() => {
                    toggleSlippageModal()
                  }}
                >
                  <BalanceTitle>{balanceTitle || 'Slippage'} </BalanceTitle>
                  {slippage === 'auto' ? (
                    <button>
                      <SlippageWrap> Auto Slippage </SlippageWrap>
                    </button>
                  ) : (
                    <>{slippage}%</>
                  )}
                </Balance>
              </RowEnd>
            </BalanceComponent>
          </RowBetween>
        </Wrapper>
      </>
    )
  }
  function getDefaultContent() {
    return (
      <>
        <Wrapper>
          <RowBetween>
            <RowStart>
              <PriceTitle>{title}</PriceTitle>
            </RowStart>

            <RowEnd gap="20px">
              <PriceInfo>
                {symbol}
                {value}
              </PriceInfo>
              <div
                onClick={() => {
                  toggleSlippageModal()
                }}
              >
                <InfoBalance>
                  <BalanceTitle>{balanceTitle || 'Slippage'} </BalanceTitle>
                  {slippage === 'auto' ? (
                    <button>
                      <SlippageWrap> Auto Slippage </SlippageWrap>
                    </button>
                  ) : (
                    <>{slippage}%</>
                  )}
                </InfoBalance>
              </div>
            </RowEnd>
          </RowBetween>
        </Wrapper>
      </>
    )
  }
  const isMobile = useIsMobile()
  return isMobile ? getMobileContent() : getDefaultContent()
}

export function CustomInputBox4({
  value,
  title,
  placeholder,
  balanceTitle,
  balanceDisplay,
  balanceExact,
  symbol,
  minBalanceTitle,
  minBalanceDisplay,
  minBalanceExact,
  onChange,
  disabled,
  autoFocus,
  precision,
  icon,
  calculationMode = false,
  calculationEnabled,
  calculationLoading,
  onEnterPress,
  max,
  totalValue,
  auto,
  minBalanceMax,
  background,
  border,
  iconWidth,
}: {
  title?: string | undefined
  value: string
  totalValue?: string
  symbol?: string
  placeholder?: string
  balanceTitle?: string
  balanceDisplay: string | number | undefined
  balanceExact: string | number | undefined
  minBalanceTitle?: string
  minBalanceDisplay?: string | number
  minBalanceExact?: string | number
  icon?: any
  onChange(values: string): void
  disabled?: boolean
  autoFocus?: boolean
  precision?: number
  calculationMode?: boolean
  calculationEnabled?: boolean
  calculationLoading?: boolean
  onEnterPress?: () => void
  max?: boolean
  auto?: boolean
  minBalanceMax?: boolean
  background?: string
  border?: string
  iconWidth?: number
}) {
  const theme = useTheme()
  const handleClick = useCallback(() => {
    if (!balanceExact || !onChange || disabled) return
    onChange(balanceExact.toString())
  }, [balanceExact, disabled, onChange])

  const minBalanceHandleClick = useCallback(() => {
    if (!minBalanceExact || !onChange || disabled) return
    onChange(minBalanceExact.toString())
  }, [minBalanceExact, disabled, onChange])

  const currencyLogo = useCurrencyLogo(symbol)
  const [pinMax, setPinMax] = React.useState(false)

  const onCustomChange = useCallback(
    (value: string) => {
      if (pinMax) {
        setPinMax(false)
      }
      onChange(value)
    },
    [onChange, pinMax]
  )

  useEffect(() => {
    if (pinMax && balanceExact && value) {
      onChange(balanceExact.toString())
    } else {
      if (balanceExact && value && Number(value) > Number(balanceExact)) {
        // onChange(balanceExact.toString())
      }
    }
  }, [balanceExact, onChange, value, pinMax])

  // if balanceExact is less the input value, set the input value to balanceExact
  /* useEffect(() => {
    if (balanceExact && value && Number(value) > Number(balanceExact)) {
      onChange(balanceExact.toString())
    }
  }, [balanceExact, onChange, value]) */

  return (
    <CustomWrapper border={border} background={background}>
      <RowBetween>
        <Amount>
          <PriceTitleRow gap="10px">
            <Column>
              {title && <PriceTitleMuted>{title}</PriceTitleMuted>}
              <PriceShowRow>
                <NumericalInput
                  style={{ textAlign: 'left', width: '40px', fontSize: '18px' }}
                  value={value || ''}
                  onUserInput={onCustomChange}
                  placeholder={placeholder}
                  autoFocus={autoFocus}
                  disabled={disabled}
                  precision={precision}
                  calculational={calculationEnabled}
                  onEnterPress={onEnterPress}
                  calculationMode={calculationMode}
                  calculationLoading={calculationLoading}
                />
              </PriceShowRow>
            </Column>
            {max && (
              <MaxButtonTransfer
                active={pinMax}
                onClick={() => {
                  if (!balanceExact || !onChange || disabled) return
                  onChange(balanceExact.toString())
                  setPinMax(true)
                }}
              >
                Max
              </MaxButtonTransfer>
            )}
          </PriceTitleRow>
        </Amount>
        <BalanceComponent>
          <RowEnd style={{ gap: '8px', marginRight: '10px' }}>
            <Image unoptimized={true} src={icon} width={iconWidth ? iconWidth : 32} alt={'INTX'}></Image>
            {totalValue && (
              <Title size="14px" style={{ fontWeight: '400' }}>
                {totalValue}
              </Title>
            )}
            <Title size="14px" style={{ fontWeight: '400' }}>
              {symbol}
            </Title>
          </RowEnd>
        </BalanceComponent>
      </RowBetween>
    </CustomWrapper>
  )
}

export function CustomBox({
  value,
  id,
  symbol,
  icon,
  bRatio,
  background,
  border,
}: {
  id: string | undefined
  value: string
  symbol?: string
  icon?: any
  bRatio?: string
  background?: string
  border?: string
}) {
  return (
    <CustomWrapper border={border} background={background}>
      <RowBetween>
        <Row gap="15px">
          <Image
            unoptimized={true}
            src={IntentXIcon}
            alt="intentx"
            style={{ position: 'relative', width: '30px', height: '30px' }}
          />
          <Column>
            <PriceTitleMuted>Stake</PriceTitleMuted>
            <TitleInfo>ID #----</TitleInfo>
          </Column>
        </Row>
        <RowEnd>
          <Column gap="5px">
            <Row gap="8px">
              <Image unoptimized={true} src={icon} width={25} alt={'INTX'}></Image>
              <Title>{value}</Title>
              <Title>{symbol}</Title>
            </Row>
            {bRatio && (
              <PriceTitleMuted>
                <Row>Backing Ratio {bRatio}</Row>
              </PriceTitleMuted>
            )}
          </Column>
        </RowEnd>
      </RowBetween>
    </CustomWrapper>
  )
}

export const Subtitle = styled.div<{
  size?: string
}>`
  color: ${({ theme }) => theme.textMuted};
  font-size: ${({ size }) => (size ? size : '12px')};
  font-weight: 300;
  gap: 4px;
  display: flex;
`

const ImageUp = styled.div`
  position: relative;
  left: -8px;
`

export function AccountAssociatedInputModal({
  src1,
  src2,
  value,
  title,
  subtitle,
  placeholder,
  symbol = 'USDC',
  balanceTitle,
  balanceDisplay,
  balanceExact,
  minBalanceTitle,
  minBalanceDisplay,
  minBalanceExact,
  onChange,
  disabled,
  autoFocus,
  precision,
  calculationMode = false,
  calculationEnabled,
  calculationLoading,
  onEnterPress,
  max,
  minBalanceMax,
}: {
  src1?: any
  src2?: any
  title: string | undefined
  subtitle: string | undefined
  value: string
  placeholder?: string
  symbol?: string
  balanceTitle?: string
  balanceDisplay: string | number | undefined
  balanceExact: string | number | undefined
  minBalanceTitle?: string
  minBalanceDisplay?: string | number
  minBalanceExact?: string | number
  icon?: string | StaticImageData
  onChange(values: string): void
  disabled?: boolean
  autoFocus?: boolean
  precision?: number
  calculationMode?: boolean
  calculationEnabled?: boolean
  calculationLoading?: boolean
  onEnterPress?: () => void
  max?: boolean
  minBalanceMax?: boolean
}) {
  const theme = useTheme()
  const handleClick = useCallback(() => {
    if (!balanceExact || !onChange || disabled) return
    onChange(balanceExact.toString())
  }, [balanceExact, disabled, onChange])

  const minBalanceHandleClick = useCallback(() => {
    if (!minBalanceExact || !onChange || disabled) return
    onChange(minBalanceExact.toString())
  }, [minBalanceExact, disabled, onChange])

  return (
    <DarkWrapper>
      <RowBetween>
        <Amount>
          <PriceTitleRow>
            <Row gap={'4px'}>
              {src1 ||
                (src2 && (
                  <Row>
                    {src1 && <Image unoptimized={true} src={src1} alt="icon" width={15} height={15} />}
                    {src2 && (
                      <ImageUp>
                        <Image unoptimized={true} src={src2} alt="icon" width={15} height={15} />
                      </ImageUp>
                    )}
                  </Row>
                ))}
              <Subtitle>
                <strong>{title}</strong>
                <div>{subtitle}</div>
              </Subtitle>
            </Row>
          </PriceTitleRow>
          <PriceShowRow>
            <NumericalInput
              value={value || ''}
              onUserInput={onChange}
              placeholder={placeholder}
              autoFocus={autoFocus}
              disabled={disabled}
              precision={precision}
              calculational={calculationEnabled}
              onEnterPress={onEnterPress}
              calculationMode={calculationMode}
              calculationLoading={calculationLoading}
            />
          </PriceShowRow>
        </Amount>
        <BalanceComponent>
          <RowEnd style={{ width: '50vw', marginLeft: '4px' }}>
            <InfoBalance>
              <Balance disabled={disabled} onClick={handleClick}>
                <BalanceTitle>{balanceTitle || 'Balance'} </BalanceTitle>
                <Price>{balanceDisplay ? balanceDisplay : '12.958,21'} </Price>
                {max && <MaxButtonWithdraw>MAX</MaxButtonWithdraw>}
              </Balance>
              <CurrencySymbol>{symbol}</CurrencySymbol>
            </InfoBalance>
            {minBalanceTitle && (
              <MinBalance disabled={disabled} onClick={minBalanceHandleClick}>
                <BalanceTitle>{minBalanceTitle || 'Balance'} </BalanceTitle>{' '}
                {minBalanceDisplay ? minBalanceDisplay : '12.958,21'}
                <SymbolWrapper>
                  <CurrencySymbol>{symbol}</CurrencySymbol>
                </SymbolWrapper>
                {minBalanceMax && <MaxButton>MAX</MaxButton>}
              </MinBalance>
            )}
          </RowEnd>
        </BalanceComponent>
      </RowBetween>
    </DarkWrapper>
  )
}

export function SpotCustomBox({
  value,
  placeholder,
  onChange,
  disabled,
  autoFocus,
  precision,
  calculationMode = false,
  calculationEnabled,
  calculationLoading,
  onEnterPress,
  max,
  isLaptop,
}: {
  value: string
  onChange(value: string): void
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  precision?: number
  calculationMode?: boolean
  calculationEnabled?: boolean
  calculationLoading?: boolean
  onEnterPress?: () => void
  max?: boolean
  isLaptop?: boolean
}) {
  const updateValue = (value: string): void => {
    onChange?.(value)
  }

  return (
    <NumericalInput
      style={{
        textAlign: 'right',
        width: isLaptop ? '100px' : '140px',
        fontSize: isLaptop ? '10px' : '14px',
        background: '#232933',
        padding: isLaptop ? '13px' : '14px',
        borderRadius: '10px',
      }}
      value={value || ''}
      onUserInput={updateValue}
      placeholder={placeholder}
      autoFocus={autoFocus}
      disabled={disabled}
      precision={precision}
      calculational={calculationEnabled}
      onEnterPress={onEnterPress}
      calculationMode={calculationMode}
      calculationLoading={calculationLoading}
    />
  )
}
