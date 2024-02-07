'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import OutlineBtn from 'components/Button/OutlineButton'
import BarChart from '/public/static/images/etc/red-bar-chart.svg'
import SampleApp from '/public/static/images/sample_app.png'
import { Container } from 'components/Container'
import { Row } from 'components/Row'
import { ExternalLink } from 'components/Link'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import TwitterIcon from 'components/Icons/TwitterIcon'
import RedFeedack from 'components/Icons/RedFeeback'

const Section = styled.section`
  position: relative;
  width: 100%;
  margin-top: 32px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin-top: 20px;
`}
`

const Grid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 1080px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 15px; 
`}
`

const FeatureWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  grid-column: span 1 / span 1;
  grid-row-start: 1;
  grid-row: span 2 / span 2;
  width: 100%;
  background: #232731;
  border-radius: 15px;
  padding: 41px 46px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 6px;
  border-radius: 10px;
  padding: 28px 32px;
`}
`

const CommunityWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  width: 100%;
  background: #232731;
  border-radius: 15px;
  padding: 41px 46px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 6px;
  border-radius: 10px;
  padding: 28px 32px;
`}
`

const FeatureImage = styled.div`
  position: relative;
  overflow: hidden;
  margin: -41px -46px 0 -46px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin: -28px -32px 0 -32px; 
`}
`

const FeatureTitle = styled.h3`
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  margin: 16px 0;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 14px; 
  line-height: 20px;
  margin: 10px 0;
`}
`

const FeatureDescription = styled.p`
  color: white;
  font-weight: 400;
  font-size: 14px;
  max-width: 373px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 10px;
  max-width: 260px;
`}
`

const StyledImage = styled(Image)`
  object-fit: cover;
  object-position: top;
  width: 100%;
  height: 350px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  height: 245px;
`}
`

const GradientOverlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  background: linear-gradient(0deg, #232731 0%, rgba(35.03, 38.98, 48.87, 0) 63%);
`

const TradeContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -41px;
  position: relative;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin-top: -30px;
`}
`

const DescriptionWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 6px;
`}
`

const StyledOutlineBtn = styled(OutlineBtn)`
  margin-top: 8px;
  align-self: flex-end;

  @media (min-width: 768px) {
    margin-left: auto;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin-top: 6px; 
  padding: 12px 21px;
  `}
`

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 16px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 10px; 
  margin-top: 10px;
`}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  align-items: flex-start;
`}
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

export default function FeaturesSection() {
  const features = [
    {
      icon: TwitterIcon,
      title: 'Follow us on Twitter',
      description: 'Follow our twitter account to stay up to date with all the current news and events!',
      btnText: 'Open Twitter',
      btnFunc: () => {},
      url: 'https://twitter.com/IntentX_',
    },
    {
      icon: RedFeedack,
      title: 'Join Our Community',
      description:
        'Join our discord and let us know how your experience is going! Open a ticket if you have any specific issues or requests.',
      btnText: 'Join Discord',
      btnFunc: () => {},
      url: 'https://discord.gg/invite/intentx',
    },
  ]

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin)
  }, [])

  const navigateToUserAirdrops = (): void => {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: '#user-airdrop', offsetY: 150 },
    })
  }

  return (
    <Section>
      <Container className="relative z-10">
        <Grid>
          <FeatureWrapper>
            <FeatureImage>
              <StyledImage
                src={SampleApp}
                alt="."
                objectPosition="top center"
                width={829}
                height={350}
                objectFit="cover"
              />
              <GradientOverlay />
            </FeatureImage>
            <TradeContainer>
              <Image src={BarChart} alt="." />

              <FeatureTitle>Trade on IntentX</FeatureTitle>
              <FeatureDescription>Trade on any of our supported markets to earn xINTX airdrops.</FeatureDescription>
              <FeatureDescription>
                The airdrop is proportional and based on the total traded volume during the Open Beta period.
              </FeatureDescription>

              <ActionsContainer>
                <StyledLink href="/trade/BTCUSDT">
                  <OutlineBtn disabled={false}>Trade Now</OutlineBtn>
                </StyledLink>
                <OutlineBtn disabled={false} onClick={navigateToUserAirdrops}>
                  View Your Points
                </OutlineBtn>
              </ActionsContainer>
            </TradeContainer>
          </FeatureWrapper>
          {features.map(({ title, icon: Icon, btnFunc, btnText, description, url }) => (
            <CommunityWrapper key={title}>
              <Icon />
              <FeatureTitle>{title}</FeatureTitle>
              <DescriptionWrapper>
                <FeatureDescription>{description}</FeatureDescription>

                <ExternalLink href={url}>
                  <StyledOutlineBtn disabled={false} onClick={btnFunc}>
                    {btnText}
                  </StyledOutlineBtn>
                </ExternalLink>
              </DescriptionWrapper>
            </CommunityWrapper>
          ))}
        </Grid>
      </Container>
    </Section>
  )
}
