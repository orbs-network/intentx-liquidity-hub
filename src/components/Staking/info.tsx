import { Row, RowBetween } from 'components/Row'
import styled from 'styled-components'
import Image from 'next/image'
import Check from '/public/static/images/stakingIcons/check.svg'
import IntentX from '/public/static/images/stakingIcons/intentXIcon.svg'
import Crown from '/public/static/images/stakingIcons/crown.svg'
import OpenNewTab from '/public/static/images/etc/OpenNewTab.svg'

const Wrapper = styled.div<{ gridAr: string }>`
  width: 100%;
  height: 100%;
  grid-area: ${({ gridAr }) => (gridAr ? gridAr : 'none')};
`
const Title = styled.div`
  font-family: Poppins;
  font-size: 22px;
  font-weight: 600;
  line-height: 33px;
  text-align: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 14px;
`}
`

const TextInfo = styled.div`
  font-family: Poppins;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
`

const InfoContent = styled.div`
  background: rgba(23, 26, 31, 1);
  border-radius: 10px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 50px;
  padding: 90px 15px 30px 15px;
`
const Divider = styled.div`
  border: 1px solid rgba(64, 72, 86, 1);
  width: 100%;
  height: 1px;
`
const CTAButton = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.white};
  opacity: 0.7;
  cursor: pointer;
`

const ImageCenter = styled.div`
  display: flex;
  justify-content: center;
`

export default function Info({
  isMobile,
  gridAr,
  secondary,
}: {
  isMobile: boolean
  gridAr: string
  secondary: boolean
}) {
  function getPrimary() {
    return (
      <Wrapper gridAr={gridAr}>
        <ImageCenter>
          <Image unoptimized={true} src={IntentX} alt="intentx" style={{ position: 'absolute' }} />
        </ImageCenter>
        <InfoContent>
          <Title>Stake INTX into xINTX to earn rewards</Title>
          <Divider />
          <Row gap="5px">
            <Image
              unoptimized={true}
              src={Check}
              alt="icon"
              style={{
                height: '20px',
                width: '20px',
              }}
            />
            <TextInfo>Stake INTX into xINTX to earn rewards</TextInfo>
          </Row>
          <Row gap="5px">
            <Image
              unoptimized={true}
              src={Check}
              alt="icon"
              style={{
                height: '20px',
                width: '20px',
              }}
            />
            <TextInfo>Dynamic Backing Ratio</TextInfo>
          </Row>
          <Row gap="5px">
            <Image
              unoptimized={true}
              src={Check}
              alt="icon"
              style={{
                height: '20px',
                width: '20px',
              }}
            />
            <TextInfo>Dynamic Rewards Multiplier</TextInfo>
          </Row>
          <Row gap="5px" width="fit-content">
            <Image unoptimized={true} src={OpenNewTab} alt="icon" />
            <CTAButton
              onClick={() => {
                window.open('https://docs.intentx.io/introduction/what-is-intentx', '_blank')
              }}
            >
              {' '}
              Learn more about xINTX here
            </CTAButton>
          </Row>
        </InfoContent>
      </Wrapper>
    )
  }

  function getSecondary() {
    return (
      <Wrapper gridAr={gridAr}>
        <ImageCenter>
          <Image unoptimized={true} src={Crown} alt="intentx" style={{ position: 'absolute' }} />
        </ImageCenter>
        <InfoContent>
          <Title>Stake INTX into xINTX to earn rewards</Title>
          <Divider />
          <Row gap="5px">
            <Image
              unoptimized={true}
              src={Check}
              alt="icon"
              style={{
                height: '20px',
                width: '20px',
              }}
            />
            <TextInfo>
              <strong>Maximum Boost: </strong>Get 2.5x revenue (USDC) boost over 16 weeks of staking
            </TextInfo>
          </Row>
          <Row gap="5px">
            <Image
              unoptimized={true}
              src={Check}
              alt="icon"
              style={{
                height: '20px',
                width: '20px',
              }}
            />
            <TextInfo>
              <strong>Early Unstaking Penalty: </strong>
              The 25% fee applies if you unstake immediately, and it reduces linearly to 0.5% over the 16-week period.
              It goes to increase the backing ratio of xINTX.
            </TextInfo>
          </Row>
          <Row gap="5px">
            <Image
              unoptimized={true}
              src={Check}
              alt="icon"
              style={{
                height: '20px',
                width: '20px',
              }}
            />
            <TextInfo>
              <strong>Flat Redemption Fee: </strong>A minimum 0.5% redemption fee remains for all staked positions at max
              maturity (16 weeks)
            </TextInfo>
          </Row>
        </InfoContent>
      </Wrapper>
    )
  }

  return secondary ? getSecondary() : getPrimary()
}
