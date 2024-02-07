import { Info as InfoIcon } from 'components/Icons'
import { NumericalInput } from 'components/Input'
import { RowBetween, RowEnd, RowStart } from 'components/Row'
import { ToolTip } from 'components/ToolTip'
import useCurrencyLogo from 'lib/hooks/useCurrencyLogo'
import Image from 'next/image'
import styled from 'styled-components'
import { formatPrice, toBN } from 'utils/numbers'

export const Wrapper = styled(RowBetween)`
  width: 100%;
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;
  background: rgba(217, 217, 217, 0.025);
  position: relative;
  border-radius: 4px;
  padding: 6px;
  padding-left: 12px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 9px;
  
  border-radius: 3px;
  padding: 1.5px;
  padding-left: 9px;
  `};
`

const DisplayLabelWrapper = styled(Wrapper)`
  padding: 0px;
  margin-top: 2px;
  border: 2px solid rgba(189, 39, 56, 0.5);

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin-top: 1.5px;
  `};
`

export const NumericalWrapper = styled(RowBetween)`
  width: 100%;
  font-size: 16px;
  font-weight: 600;

  position: relative;
  margin-left: 8px;
  color: ${({ theme }) => theme.text0};
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px 0px 0px 4px;
  padding: 4px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
    right: 0;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px;
  
  margin-left: 6px;
  border-radius: 3px 0px 0px 3px;
  padding: 7.5px 9px;
  `};

  & > * {
    &:nth-child(2) {
      display: flex;
      right: 0px;
      position: absolute;
    }
  }
`

export const CurrencySymbol = styled.div<{ active?: any }>`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text0};
  display: flex;
  gap: 4px;
  background: ${({ theme }) => theme.bg5};
  padding: 8px 12px;
  border-radius: 0px 4px 4px 0px;
  align-items: center;
  

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
font-size: 12px;
gap: 3px;
padding: 11px 9px;
border-radius: 0px 3px 3px 0px;

  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    // font-size: 12px;
  `}
  }
`
export const CurrencySymbolModal = styled.div<{ active?: any }>`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text0};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px;
    `};
  

  ${({ theme }) => theme.mediaWidth.upToSmall`
    // font-size: 12px;
  `}
  }
`

const StyledInfoIcon = styled(InfoIcon)`
  color: ${({ theme }) => theme.text2};
  width: 12px;
  height: 12px;
  margin-bottom: -2px;
  cursor: default;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 9px;
  height: 9px;
  margin-bottom: -1.5px;
    `};
`

export const LabelWrap = styled(RowStart)`
  padding-left: 10px;
  height: 100%;
  font-weight: 400;
  font-size: 12px;
  width: 98px;
  gap: 4px;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    white-space: nowrap;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding-left: 7.5px;
  font-size: 11px;
  width: 74px;
  gap: 2.25px; 
    `};
`

export const LabelWrapModal = styled(LabelWrap)`
  border-radius: 5px 0px 0px 5px;
  background: ${({ theme }) => theme.bg2};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  border-radius: 3.75px 0px 0px 3.75px;
    `};
`

const DataWrap = styled(RowEnd)`
  gap: 4px;
  height: 100%;
  font-size: 16px;
  max-width: 282px;
  font-weight: 500;
  padding-right: 10px;
  border-radius: 4px;
  color: ${({ theme }) => theme.text0};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 2.25px;
  font-size: 12px;
  max-width: 210px;
  padding-right: 7.5px;
  border-radius: 3px;
    `};
`

export function InputLabel({
  value,
  label,
  placeholder,
  tooltip,
  symbol,
  onChange,
  disabled,
  autoFocus,
  precision,
}: {
  label: string | undefined
  value: string
  placeholder?: string
  symbol?: string
  tooltip?: string
  onChange(values: string): void
  disabled?: boolean
  autoFocus?: boolean
  precision?: number
}) {
  return (
    <Wrapper>
      <LabelWrap>
        <div>{label}</div>
        <a data-tip data-for={label}>
          {tooltip && <StyledInfoIcon />}
          <ToolTip id={label} aria-haspopup="true">
            {tooltip}
          </ToolTip>
        </a>
      </LabelWrap>
      <NumericalWrapper>
        <NumericalInput
          value={value && value !== 'NaN' ? value : ''}
          onUserInput={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          precision={precision}
        />
      </NumericalWrapper>
      <CurrencySymbol>
        <Image src={useCurrencyLogo(symbol)} alt="currency-logo" width={20} />
        {symbol}
      </CurrencySymbol>
    </Wrapper>
  )
}

export function DisplayLabel({
  value,
  leverage,
  symbol,
  precision,
}: {
  value: number | string
  label: string | undefined
  leverage?: number
  symbol?: string
  tooltip?: string
  precision?: number
}) {
  const amount = isNaN(Number(value)) ? 0 : value
  return (
    <DisplayLabelWrapper>
      <LabelWrapModal>
        <Image src={useCurrencyLogo(symbol)} alt="currency-logo" width={20} />
        <CurrencySymbolModal>{symbol}</CurrencySymbolModal>
      </LabelWrapModal>
      <DataWrap>
        <div>{leverage && `${formatPrice(amount, 2, true)} x ${formatPrice(leverage, 2, true)} = `}</div>
        <div>{leverage ? formatPrice(toBN(amount).times(leverage), precision, true) : formatPrice(value, 2, true)}</div>
      </DataWrap>
    </DisplayLabelWrapper>
  )
}
