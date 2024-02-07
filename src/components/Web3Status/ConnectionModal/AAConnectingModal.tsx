import GradientButton from 'components/Button/GradientButton'
import { Modal } from 'components/Modal'
import { useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import IntentXLogo from '/public/static/images/socials/intentx-icon-filled.svg'
import Google from '/public/static/images/socials/google.png'
import Apple from '/public/static/images/socials/apple.png'
import Email from '/public/static/images/socials/email-outline.svg'
import Phone from '/public/static/images/socials/phone-outline.svg'
import Metamask from '/public/static/images/socials/metamask.png'
import WebAuth from '/public/static/images/socials/web3auth.svg'

import { Row } from 'components/Row'
import Column from 'components/Column'
import { AccountType, useAA } from 'state/accountAbstraction/provider/AAProvider'

const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 24px 125px 24px;
  border-radius: 5px;
`

const LogoContainer = styled.div`
  width: 85px;
  height: 85px;
  border-radius: 100%;
  background-color: #191c1f;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ConfirmationLabel = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.white};
  max-width: 240px;
  text-align: center;
  margin-top: 40px;
`

const ApprovalLabel = styled.span`
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme }) => theme.white};
  text-align: center;
  margin: 8px 0 30px 0;
  opacity: 0.5;
`

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 23px 0;
  background-color: ${({ theme }) => theme.bg9};
  position: absolute;
  bottom: 0;
  gap: 6px;
`

const Label = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: ${({ theme }) => theme.white};
  text-align: center;
  opacity: 0.5;
`

const ArrowElement = styled.div`
  width: 170px;
  height: 2px;
  background-color: ${({ theme }) => theme.bg9};
  position: absolute;
  z-index: -1;
`

export default function AAConnectingModal() {
  // const [type, setType] = useState<AccountType>()

  const { accountType, isConnecting } = useAA()

  function getLabel(): string | null {
    switch (accountType) {
      case AccountType.GOOGLE_TEST:
        return 'Google Test Account'
      case AccountType.GOOGLE:
        return 'Google Account'
      case AccountType.APPLE:
        return 'Apple Account'
      case AccountType.DISCORD:
        return 'Discord Account'
      default:
        return 'Account'
    }
  }

  function getIcon(): any | null {
    switch (accountType) {
      case AccountType.GOOGLE_TEST:
        return Google
      case AccountType.GOOGLE:
        return Google
      case AccountType.APPLE:
        return Apple
      case AccountType.DISCORD:
        return Email
      default:
        return Email
    }
  }

  return (
    <Modal isOpen={isConnecting} padding="0px">
      <Wrapper>
        <Row justify="center" gap="75px" position="relative">
          <Image unoptimized={true} src={IntentXLogo} alt="icon" width={85} height={85} />
          <ArrowElement />
          <LogoContainer>
            <Image unoptimized={true} src={getIcon()} alt="icon" />
          </LogoContainer>
        </Row>
        <Column>
          <ConfirmationLabel>Please verify your {getLabel()} to continue</ConfirmationLabel>
          <ApprovalLabel>Waiting for your approval...</ApprovalLabel>
        </Column>

        <Footer>
          <Label>Login with auto-management by</Label>
          <Image unoptimized={true} src={WebAuth} alt="icon" />
        </Footer>
      </Wrapper>
    </Modal>
  )
}
