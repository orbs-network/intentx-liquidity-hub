import React from 'react'
import styled, { keyframes } from 'styled-components'
import Image from 'next/image'

import { RowCenter } from 'components/Row'
import GradientButton from 'components/Button/GradientButton'
import AbstractElement from '/public/static/images/pages/404/absctact-element.png'
import Error404 from '/public/static/images/pages/404/404.png'
import Mountains from '/public/static/images/pages/404/mountains.png'
import { useRouter } from 'next/router'

const keyframesAnimation = keyframes`
  0% {
    color: #BD2738;
  }
  100% {
    color: #F82D3A;
  }
`

const Wrapper = styled(RowCenter)`
  position: relative;
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 100vh;
  `};
`

const AbstractBackgroundElement = styled.div`
  top: 150px;
  left: 0;
  position: absolute;
  width: 160px;
  img {
    width: 100%;
    height: 100%;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

const MountainsContainer = styled.div`
  top: 400px;
  left: 0;
  position: absolute;
  height: 630px;
  width: 100%;
  img {
    width: 100%;
    height: 100%;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

const Content = styled.div`
  display: flex;
  justify-content: center;
  max-width: 1600px;
  z-index: 30;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column-reverse;
  `};
`

const DescriptionContainer = styled.div`
  width: 40%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  `};
`

const Title = styled.h3`
  font-size: 56px;
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  margin-bottom: 20px;
  max-width: 350px;
  span {
    animation: ${keyframesAnimation} 1s infinite linear;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 34px;
    text-align: center;
  `};
`

const Text = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.white};
  font-weight: 400;
  margin-bottom: 50px;
  max-width: 700px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    text-align: center;
  `};
`

const Imagen404Container = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 60%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
    justify-content: center;
    margin-bottom: 50px;
  `};
`

const Imagen404 = styled.div`
  width: 70%;
  height: 300px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 300px;
    height: 140px;
  `};
  img {
    width: 100%;
    height: 100%;
  }
`

export default function Custom404() {
  const router = useRouter()

  return (
    <>
      <Wrapper>
        <AbstractBackgroundElement>
          <Image src={AbstractElement} alt="abstract-element" />
        </AbstractBackgroundElement>
        <MountainsContainer>
          <Image src={Mountains} alt="mountains" />
        </MountainsContainer>
        <Content>
          <DescriptionContainer>
            <Title>
              Something went <span>wrong</span>
            </Title>
            <Text>
              We`re sorry, it seems like the page you requested is no longer available or never existed! Please try to
              come back to home and start your search again!
            </Text>
            <GradientButton buttonFilled={true} onClick={() => router.push('/trade/BTCUSDT')} label=" Go to Back" />
          </DescriptionContainer>
          <Imagen404Container>
            <Imagen404>
              <Image src={Error404} alt="404" />
            </Imagen404>
          </Imagen404Container>
        </Content>
      </Wrapper>
    </>
  )
}
