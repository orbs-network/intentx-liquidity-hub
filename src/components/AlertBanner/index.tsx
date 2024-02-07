import React from 'react'
import styled from 'styled-components'
import { Container } from 'components/Container'
import { AlertIcon } from 'components/Icons/AlertIcon'

const Section = styled.section`
  width: 100%;
  margin-top: 15px;
  margin-bottom: 100px;
  position: relative;

  @media (min-width: 768px) {
    margin-top: 30px;
    margin-bottom: 200px;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin-top: 10px;
  margin-bottom: 70px;
`}
`

const StyledContainer = styled(Container)`
  position: relative;
  z-index: 10;
`

const AlertWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  max-width: 1800px;
  background: #232731;
  border-radius: 15px;
  gap: 20px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  border-radius: 10px;
  gap: 14px;
`}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 10px;
`}
`

const TabletIconWrapper = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: inline-flex;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%),
      linear-gradient(180deg, #ff0420 0%, #bd2738 100%);
    border-radius: inherit;
    align-items: center;
    justify-content: center;
    padding: 17px;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 10px;
`}
`

const MobileIconWrapper = styled.div`
  display: inline-flex;
  min-width: 30px;
  height: 30px;
  max-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%),
    linear-gradient(180deg, #ff0420 0%, #bd2738 100%);
  border-radius: 10px;

  @media (min-width: 768px) {
    display: none;
  }
`

const ContentWrapper = styled.div`
  @media (min-width: 768px) {
    padding: 6px;
  }
`

const Paragraph = styled.p`
  color: white;
  font-size: 0.875rem;
  font-weight: normal;
  margin-left: 4px;

  @media (min-width: 768px) {
    margin-left: 0;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 0.65rem;
`}
`

const AlertSection = () => {
  return (
    <Section>
      <StyledContainer>
        <AlertWrapper>
          <TabletIconWrapper>
            <AlertIcon />
          </TabletIconWrapper>

          <MobileIconWrapper>
            <AlertIcon height={15} width={15} />
          </MobileIconWrapper>

          <ContentWrapper>
            <Paragraph>
              All Open Beta tasks & campaigns must be completed prior to the start of Phase 3 (Full Launch) in order to
              qualify for airdrops.
            </Paragraph>
          </ContentWrapper>
        </AlertWrapper>
      </StyledContainer>
    </Section>
  )
}

export default AlertSection
