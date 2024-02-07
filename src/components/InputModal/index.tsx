import styled from 'styled-components'
import Image from 'next/image'

import { InputField, NumericalInput } from 'components/Input'
import { IconWrapper, WalletGrad } from 'components/Icons'
import { Subtitle, Title } from 'components/Modal'
import { MaxButtonTransfer } from 'components/Button'
import { RowEnd } from 'components/Row'
import USDC from '/public/static/images/tokens/USDC.svg'

const Start = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
`

const InputStyle = styled.div<{ size?: string; height?: string }>`
  width: ${({ size }) => size ?? '220px'};
  height: ${({ height }) => height ?? '53px'};
  border: 1px solid rgba(56, 64, 79, 1);
  border-radius: 5px;
 background: rgba(29, 33, 41, 1);
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`

const InputStyleTransfer = styled.div<{ size?: string; height?: string }>`
  width: ${({ size }) => size ?? '220px'};
  height: ${({ height }) => height ?? '78px'};
  background: rgba(23, 26, 31, 0.8);
  border-radius: 5px;
  padding: 0 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Input = styled(InputField)`
  font-size: 15px;
  font-weight: 400;
  color: white;
  text-align: left;
`

const ImageUp = styled.div`
  position: relative;
  left: -8px;
`

const RowFlex = styled.div<{ align?: string; gap?: string }>`
  display: flex;
  flex-direction: row;
  align-items: ${({ align }) => (align ? align : 'inherit')};
  gap: ${({ gap }) => (gap ? gap : '0')};
`
const InputNum = styled(NumericalInput)`
  width: 2vw;
  color: white;
`

const CoinBox = styled.div`
  width: 128px;
  height: 45px;
  border-radius: 5px;
  background: rgba(47, 56, 71, 0.7);
  padding: 0px 10px;
  display: flex;
`

export function InputModal({
  onChange,
  value,
  size = '100%',
  height = '62px',
  src,
  numerical,
  disabled,
  placeholder,
}: {
  src?: any
  value?: string
  placeholder?: string
  size?: string
  height?: string
  numerical?: boolean
  disabled?: boolean
  onChange: (value: string) => void
}): JSX.Element {
  return numerical ? (
    <InputStyle size={size} height={height}>
      <Start>
        <Image unoptimized={true} src={src} alt="icon" width={30} height={30} />
        <div>
          <NumericalInput disabled={disabled} value={value || ''} onUserInput={onChange}></NumericalInput>
        </div>
      </Start>
    </InputStyle>
  ) : (
    <InputStyle size={size} height={height}>
        <IconWrapper size={'32px'}>
          <WalletGrad isHover={false} />
        </IconWrapper>
        <Input
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value || '')}
        ></Input>
    </InputStyle>
  )
}

export function InputModalTransfer({
  onChange,
  value,
  size = '100%',
  height = '78px',
  src,
  src2,
  spot,
  disabled,
  title,
}: {
  src?: any
  src2?: any
  value?: string
  title: string
  size?: string
  height?: string
  spot?: boolean
  disabled?: boolean
  onChange: (value: string) => void
}): JSX.Element {
  return (
    <InputStyleTransfer size={size} height={height}>
      <Start>
        <RowFlex align={spot ? 'flex-start' : 'center'} gap={spot ? '0' : '5px'}>
          <RowFlex align="baseline">
            <Image unoptimized={true} src={src} alt="icon" width={15} height={15} />
            {spot && (
              <ImageUp>
                <Image unoptimized={true} src={src2} alt="icon" width={15} height={15} />
              </ImageUp>
            )}
          </RowFlex>
          <Subtitle>
            <strong>{title}</strong> account
          </Subtitle>
        </RowFlex>
        <RowFlex align="center">
          <InputNum disabled={disabled} value={value || ''} onUserInput={onChange}></InputNum>
          {spot && <MaxButtonTransfer>MAX</MaxButtonTransfer>}
        </RowFlex>
      </Start>
      <RowEnd>
        <CoinBox>
          <RowFlex align="center" gap="5px">
            <Image unoptimized={true} src={USDC} alt="icon" width={20} height={20} />
            <div>
              <Title size="12px">USDC</Title>
              <Subtitle size="10px">USDC Coin</Subtitle>
            </div>
          </RowFlex>
        </CoinBox>
      </RowEnd>
    </InputStyleTransfer>
  )
}
