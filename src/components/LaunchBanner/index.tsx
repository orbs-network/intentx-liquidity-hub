import Image from 'next/image'
import { FC } from 'react'
import styled from 'styled-components'
import { TitlePhase } from 'components/TitlePhase'
import { Container } from 'components/Container'
import { CTABtn } from 'components/CTABtn'
import OpenTabIcon from 'components/Icons/OpenTabIcon'
import Cube from '/public/images/cube.png'

const CubeImage = styled(Image)`
  width: 500px;
  height: 450px;
  object-fit: contain;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  transform: translateX(-19.56%) translateY(24.67%);

  @media (min-width: 768px) {
    max-width: 30%;
    width: 100%;
    object-position: left bottom;
    self-start: auto;
    self-end: tablet;
    margin-top: -320px;
    margin-right: -50px;
    border-radius: 20px;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 350px;
  height: 350px; 
  max-width: 80%;
  transform: translateX(-22.56%) translateY(24.67%);
`}
`

interface Props {
  title: string
  number: string
  description: string
  subDescription: string
  url?: string
}

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  padding-top: 120px;
  height: 100%;
  margin-bottom: 2.5rem;
  border-radius: 15px;
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding-top: 80px;
  margin-bottom: 1.7rem;
  border-radius: 10px;
`}
`

const ContentContainer = styled.div`
  background-color: #232731;
  width: 100%;
  overflow: visible;
  border-radius: inherit;
  height: 100%;
  flex: 1;
  display: flex;
  gap: 0.5rem;
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 0.3rem;
`}

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`

const StyledCTABtn = styled(CTABtn)`
  align-self: end;
  display: none;
  position: absolute;
  top: 140px;
  right: 30px;

  @media (min-width: 768px) {
    display: flex;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  top: 95px;
  right: 20px;
`}
`

const BannerContainer = styled(Container)`
  position: relative;
  z-index: 10;
`

const MoreDetailsLink = styled.a`
  align-self: center;
  margin-top: auto;
`

const DescriptionContainer = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  border-bottom: 2px solid #555e6c;
  padding-bottom: 20px;

  @media (min-width: 768px) {
    border: none;
    padding-bottom: 0;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 11px;
  line-height: 16px; 
  padding-bottom: 13px;
`}
`

const SubDescriptionContainer = styled.p`
  color: white;
  font-size: 13px;

  @media (min-width: 768px) {
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 400;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 11px;
  line-height: 16px;
`}
`

const MoreDetailsIconContainer = styled.div`
  align-self: center;
  display: flex;
  gap: 4px;
  color: #b0bbce;
  margin-bottom: 30px;

  @media (min-width: 768px) {
    display: none;
    margin-bottom: 0px;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 3px;
  margin-bottom: 20px;
  font-size: 9px;
`}
`

const StyledBanner = styled.div`
  padding-bottom: 300px;
  padding-top: 100px;
  max-width: 80%;
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding-bottom: 200px;
  padding-top: 70px;
  gap: 0.6rem;
`}

  @media (min-width: 768px) {
    padding-top: 0px;
    align-self: start;
    padding-left: 0px;
    padding-right: 45px;
    align-items: start;
    padding-bottom: 20px;
    margin-left: 200px;
  }
`

export const LaunchBanner: FC<Props> = ({
  number = '01',
  title = 'Open Beta',
  description = '',
  subDescription = '',
  url = '',
}) => {
  return (
    <BannerContainer>
      <ImageContainer>
        <ContentContainer>
          <CubeImage alt="Cube" src={Cube} draggable={false} />
          <StyledBanner>
            <MoreDetailsLink href={url} target="_blank">
              <StyledCTABtn>More Details</StyledCTABtn>
            </MoreDetailsLink>

            <TitlePhase title={title} number={number} />

            <DescriptionContainer>{description}</DescriptionContainer>

            <SubDescriptionContainer>{subDescription}</SubDescriptionContainer>
            <MoreDetailsIconContainer>
              <OpenTabIcon isHovering={false} />
              More Details
            </MoreDetailsIconContainer>
          </StyledBanner>
        </ContentContainer>
      </ImageContainer>
    </BannerContainer>
  )
}

export default LaunchBanner
