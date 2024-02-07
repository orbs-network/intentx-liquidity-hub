import ConnectWallet from 'components/Web3Status/ConnectWallet'
import { SplittedModal } from 'components/Modal'
import { useConnectionModalToggle, useModalOpen, useToggleOpenPositionModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import styled from 'styled-components'
import { Row, RowFixed, RowStart } from 'components/Row'
import Image from 'next/image'
import Info from 'components/Icons/Info'

import Apple from '/public/static/images/apple-fill.svg'
import Reddit from '/public/static/images/reddit-fill.svg'
import Discord from '/public/static/images/discord-fill.svg'
import Twitter from '/public/static/images/twitter-fill.svg'
import Medium from '/public/static/images/medium-fill.svg'
import OpenTab from '/public/static/images/open-tab-red.svg'
import Google from '/public/static/images/google-fill.svg'
import WalletIcon from '/public/static/images/wallet-outline.svg'
import Web3Background from '/public/static/images/web-three-bg.svg'

import { ButtonEmpty, PrimaryButton } from 'components/Button'
import SocialContainer from '../SocialContainer'
import { AccountType } from 'state/accountAbstraction/provider/AAProvider'

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
`

const LogInContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
  background-color: #121417;
  border-radius: 15px;
`

const WalletConnectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 16px;
  background-color: #121417;
  border-radius: 15px;
  width: 100%;
  height: 144px;
  position: relative;
  overflow: hidden;
`

const Title = styled.span`
  font-weight: 500;
  font-size: 22px;
  color: ${({ theme }) => theme.white};
  text-align: center;
`

const Subtitle = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: #677583;
  text-align: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 12px;
  `};
`

const SectionLabel = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.white};
  margin-top: 16px;
`

// const SocialContainer = styled.div`
//   display: flex;
//   border: 1px solid rgba(255, 255, 255, 0.2);
//   border-radius: 10px;
//   padding: 16px;
//   margin-top: 8px;
//   cursor: pointer;

//   ${({ theme }) => theme.mediaWidth.upToSmall`
//   padding: 8px;
//   `};
// `

const SocialButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 15px;
  background: ${({ theme }) => theme.gradCustom1};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 32px;
    height: 32px;
    border-radius: 10px;
  `};
`

const DisclaimerLabel = styled.span`
  font-weight: 400;
  font-size: 14px;
  color: #677583;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 10px;
  `};
`

const MoreInfoButton = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  cursor: pointer;
`

const InfoLabel = styled.span`
  font-weight: 400;
  font-size: 14px;
  background: ${({ theme }) => theme.gradCustom1};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 10px;
  `};
`

const Input = styled.input<{
  [x: string]: any
}>`
  height: fit-content;
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: ${({ theme }) => theme.white};
  padding-left: 2px;
  &:focus,
  &:hover {
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 0.6rem;
  `}
`

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  height: 50px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 0 13px;
  margin-top: 14px;
`

const AccountAbstractionButton = styled(PrimaryButton)`
  height: 55px;
  border: 1px solid #bd2738;
  border-radius: 5px;
  background: #121417;
  background-origin: border-box;
  background-clip: padding-box, border-box;
  margin-top: 16px;
  gap: 10px;
`

const SecondaryButton = styled(PrimaryButton)`
  background: #2d323f;
  border: none;
  border-radius: 5px;
  font-weight: 400;
  font-size: 14px;
  margin-top: 16px;

  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg1};
  }
`
const InfoButton = styled.div`
  background: ${({ theme }) => theme.gradCustom1};
  border-radius: 2px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 4px;
  right: 4px;
`

const ConnectionTitle = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.white};
`

const FooterButton = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.white};
  opacity: 0.5;
  cursor: pointer;
`

const Divider = styled.div`
  width: 1px;
  height: 18px;
  background-color: ${({ theme }) => theme.white};
  opacity: 0.5;
`

export default function ConnectionModal() {
  const isOpen = useModalOpen(ApplicationModal.CONNECT_ACCOUNT)
  const toggleModal = useConnectionModalToggle()

  return (
    <SplittedModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
      width="500px"
      borderRadius="15px"
    >
      <Layout>
        <LogInContainer>
          <Title>Log In</Title>
          <Row gap="5px" justify="center">
            <Subtitle>Your Blockchain wallet in just one click</Subtitle>
            <Info stroke="#677583" />
          </Row>
          <RowStart>
            <SectionLabel>Most Used</SectionLabel>
          </RowStart>
          <Row gap="16px" position="relative">
            <SocialContainer
              full
              verifier={AccountType.GOOGLE}
              logo={Google}
              alt="google"
              description="Continue with Google"
            />
          </Row>
          <Row gap="15px" marginTop="8px" align="center" justify="space-between">
            <SocialContainer verifier={AccountType.APPLE} logo={Apple} alt="apple" />
            <SocialContainer logo={Reddit} alt="reddit" />
            <SocialContainer logo={Discord} alt="discord" />
            <SocialContainer logo={Twitter} alt="twitter" />
            <SocialContainer verifier={AccountType.GOOGLE_TEST} logo={Google} alt="medium" />
          </Row>
          <Row justify="center" gap="20px" marginTop="8px">
            <DisclaimerLabel>We do not store any data related to your login.</DisclaimerLabel>
            <MoreInfoButton>
              <Image src={OpenTab} alt="open-tab" />
              <InfoLabel>More info</InfoLabel>
            </MoreInfoButton>
          </Row>
          {/*
          <RowStart>
            <SectionLabel>Other</SectionLabel>
          </RowStart>
          <InputContainer>
            <Image src={Email} alt="email" />
            <Input autoFocus type="text" placeholder="name@example.com" spellCheck="false" onBlur={() => null} />
          </InputContainer>
          <InputContainer>
            <Image src={Phone} alt="phone" />
            <Input autoFocus type="text" placeholder="+1 000 000 000" spellCheck="false" onBlur={() => null} />
          </InputContainer>
          
          <SecondaryButton onClick={handleContinue}>Continue with...</SecondaryButton>
          <AccountAbstractionButton>
            <Image unoptimized={true} src={WalletIcon} alt="WalletIcon" />
            Account abstraction for Wallets
            <InfoButton>
              <Info size={10} />
            </InfoButton>
          </AccountAbstractionButton>*/}
        </LogInContainer>

        <WalletConnectionContainer>
          <Image
            unoptimized={true}
            src={Web3Background}
            alt="WalletIcon"
            style={{ position: 'absolute', top: '0', left: '0' }}
          />
          <ConnectionTitle>Web 3.0</ConnectionTitle>
          <ConnectionTitle>Connection</ConnectionTitle>
          <ConnectWallet />
        </WalletConnectionContainer>
        <Row justify="center" align="center" gap="12px">
          <FooterButton>Terms & Conditions</FooterButton>
          <Divider />
          <FooterButton>Privacy Policy</FooterButton>
        </Row>
      </Layout>
    </SplittedModal>
  )
}
