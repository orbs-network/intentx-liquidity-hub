import { PrimaryButton } from 'components/Button'
import { Row } from 'components/Row'
import { AppThunkDispatch, useAppDispatch } from 'state'
import { AccountType, useAA } from 'state/accountAbstraction/provider/AAProvider'
import { useConnectionModalToggle } from 'state/application/hooks'
import styled from 'styled-components'
import Image from 'next/image'

import Google from '/public/static/images/google-fill.svg'

// Define the props for this component. If full is true then the description must be string, otherwise it must be undefined.
// create the dynamic type for the props
type SocialContainerProps =
  | {
      verifier?: AccountType
      logo: any
      alt: string
      description: string
      full: true
    }
  | {
      verifier?: AccountType
      logo: any
      alt: string
      description?: undefined
      full?: false
    }
export default function SocialContainer({ verifier, logo, alt, description, full = false }: SocialContainerProps) {
  const { loginWeb3Auth } = useAA()

  const toggleConnectionModal = useConnectionModalToggle()

  const Container = styled.div`
    position: relative;
    gap: 16px;
    display: flex;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    ${full ? 'width: 100%;' : ''}
    padding: 16px;
    margin-top: 8px;
    cursor: pointer;
  `

  const SocialButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 15px;
    background: ${({ theme }) => theme.gradCustom1};
  `

  const ButtonLabel = styled.span`
    font-weight: 400;
    font-size: 14px;
    color: ${({ theme }) => theme.white};
  `

  const RecentButton = styled.div`
    background: ${({ theme }) => theme.gradCustom1};
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    position: absolute;
    top: -6px;
    right: 0;
  `

  const RecentLabel = styled.span`
    font-weight: 400;
    font-size: 12px;
    color: ${({ theme }) => theme.white};
    opacity: 0.5;
  `

  return (
    <Container
      onClick={() => {
        toggleConnectionModal()
        try {
          loginWeb3Auth(verifier)
        } catch (e) {
          console.log(e)
        }
      }}
    >
      <SocialButton>
        <Image src={logo} alt={alt} />
      </SocialButton>
      {full && (
        <>
          <ButtonLabel>{description}</ButtonLabel>
          {/* <RecentButton>
            <RecentLabel>Recent</RecentLabel>
          </RecentButton> */}
        </>
      )}
    </Container>
  )
}
