import { Row, RowBetween } from 'components/Row'
import styled from 'styled-components'
import Image from 'next/image'
import GradientButton from 'components/Button/GradientButton';

const Wrapper = styled.div<{ width?: string; height?: string; gridAr?: string; button: boolean }>`
  width: ${({ width }) => (width ? width : '100%')};
  height: ${({ height }) => (height ? height : '100%')};
  background: rgba(29, 33, 41, 1);
  border-radius: 10px;
  display: flex;
  flex-direction: ${({ button }) => (button ? 'row' : 'column')};
  justify-content: ${({ button }) => (button ? 'space-between' : 'center')};
  align-content: center;
  gap: 5px;
  grid-area: ${({ gridAr }) => (gridAr ? gridAr : 'none')};
  padding: 15px;
`
const WrapperButton = styled(Wrapper)`
  align-items: center;
  padding: 0px 15px 0px 0px;
`

const Title = styled.div`
  font-family: Poppins;
  font-size: 16px;
  font-weight: 600;
  line-height: 27px;
  letter-spacing: 0em;
  text-align: left;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 14px;
`}
`

const Quantity = styled.div`
  font-family: Poppins;
  font-size: 16px;
  font-weight: 300;
  line-height: 27px;
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 14px;
`}
`

const MultiplyText = styled.div`
  font-family: Poppins;
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  background: linear-gradient(180deg, #ff0420 0%, #bd2738 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
`

export default function Cards({
  isMobile,
  width,
  height,
  title,
  value,
  icon,
  type,
  button,
  multiply,
  gridAr,
}: {
  isMobile: boolean
  width: string
  height: string
  title: string
  value: string
  type: string
  icon?: any
  button: boolean
  multiply?: number
  gridAr: string
}) {
  function withoutButton() {
    return (
      <Wrapper width={width} height={height} gridAr={gridAr} button={button}>
        {multiply ? (
          <MultiplyText>{multiply}x</MultiplyText>
        ) : (
          <Image
            unoptimized={true}
            src={icon}
            alt="icon"
            style={{
              height: '25px',
              width: '25px',
            }}
          />
        )}
        <Title>{title}</Title>
        <Quantity>
          {value} {type}
        </Quantity>
      </Wrapper>
    )
  }
  function withButton() {
    return (
      <WrapperButton width={width} height={height} gridAr={gridAr} button={button}>
        <Wrapper button={false}>
          {multiply ? (
            <MultiplyText>{multiply}x</MultiplyText>
          ) : (
            <Image
              unoptimized={true}
              src={icon}
              alt="icon"
              style={{
                height: '25px',
                width: '25px',
              }}
            />
          )}
          <Title>{title}</Title>
          <Quantity>
            {value} {type}
          </Quantity>
        </Wrapper>
        <GradientButton
          buttonFilled={true}
          label={'Redeem xINTX to INTX'}
          onClick={() => console.log('')}
          size="228px"
          height="51px"
        />
      </WrapperButton>
    )
  }

  return button ? withButton() : withoutButton()
}
