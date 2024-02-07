import Image from 'next/image'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import PWAIllustration from '/public/images/pwa-alert.png'

import { Close as CloseIcon } from 'components/Icons'
import { Modal } from 'components/Modal'

import useMobilePlatformDetection from 'hooks/useDetectPlatform'
import useDebounce from 'lib/hooks/useDebounce'
import { useIsMobile } from 'lib/hooks/useWindowSize'
import usePWAAndPlatformDetection from 'hooks/usePWAorMobileDetection'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  width: 100%;
  gap: 0.8rem;
  border-radius: 15px;
  position: relative;
`

const Close = styled.div`
  width: 24px;
  height: 24px;
  padding: 6px;
  cursor: pointer;
  margin: -15px 4px 1px 0px;
  position: absolute;
  right: 10px;
  top: 20px;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  text-align: center;
  padding: 22px 34px;
  gap: 10px;
`

const Title = styled.span`
  font-weight: 500;
  font-size: 16px;
`

const Description = styled.span`
  font-weight: 400;
  font-size: 12px;
  opacity: 0.5;
`

const Highlight = styled.span`
  font-weight: 700;
  font-size: 12px;
`

const StyledImage = styled(Image)``

const Divider = styled.div`
  width: 50px;
  height: 2px;

  background: linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%);
  border-radius: 100px;

  flex: none;
  flex-grow: 0;
`

export default function PWAAlertModal() {
  const [showModal, setShowModal] = useState(false)
  const devicePlatform = useMobilePlatformDetection()

  const isMobile = useIsMobile()
  const { isPWA } = usePWAAndPlatformDetection()

  const debouncedIsMobile = useDebounce(isMobile, 3000)

  useEffect(() => {
    const hidePWAModal = localStorage.getItem('hidePWAModal') === 'true' || false

    if (isMobile && !hidePWAModal && !isPWA) {
      setShowModal(true)
    }
  }, [isMobile, isPWA])

  const dismissPWAAlert = (): void => {
    localStorage.setItem('hidePWAModal', 'true')
    setShowModal(false)
  }

  return (
    <Modal
      isOpen={showModal}
      onBackgroundClick={dismissPWAAlert}
      onEscapeKeydown={dismissPWAAlert}
      width="350px"
      radius="15px"
    >
      <Wrapper>
        <Close>
          <CloseIcon size={12} onClick={dismissPWAAlert} style={{ cursor: 'pointer' }} />
        </Close>

        <StyledImage src={PWAIllustration} alt="icon" />
        <ContentWrapper>
          <Title>Utilize our PWA App</Title>
          <Divider />
          {devicePlatform === 'android' ? (
            <Description>
              To set up the application, please add this website to your device&apos;s home screen. In your Web Browser
              browser,
              <Highlight>
                click the Settings icon in the menu and select the &apos;Add to Home Screen&apos; or &apos;Install
                APP&apos; option.
              </Highlight>{' '}
              Once added, access the intentx.io app from your home screen.
            </Description>
          ) : (
            <Description>
              To set up the application, please add this website to your device&apos;s home screen. In your Safari
              browser,
              <Highlight>
                click the Share icon in the menu and select the &apos;Add to Home Screen&apos; option.
              </Highlight>{' '}
              Once added, access the intentx.io app from your home screen.
            </Description>
          )}
        </ContentWrapper>
      </Wrapper>
    </Modal>
  )
}
