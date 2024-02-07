import '@rainbow-me/rainbowkit/styles.css'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { UNDER_MAINTENANCE } from 'config'

import { UnderMaintenance } from 'components/Icons'
import OnboardingModalV2 from 'components/OnboardingModal/OnboardingV2'
import { RowCenter } from 'components/Row'
import USResidentsModal from 'components/USResidentsModal'
import useInternetConnectionLocation from 'hooks/useInternetConnectionLocation'
import { useAppDispatch } from 'state'
import CommonModals from './CommonModals'
import Footer from './Footer'
import NavBar from './NavBar'
// import Footer from 'components/Disclaimer'
import { useAddPopup } from 'state/application/hooks'

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  background: ${({ theme }) => theme.bg};
  overflow-x: hidden;
`
const HeaderWrap = styled.div`
  width: 100%;
  position: fixed;
  z-index: 300;
  background: ${({ theme }) => theme.bg};
`

const Content = styled.div`
  position: relative;
  height: 100%;
  min-height: calc(110vh - 90px);
  background: ${({ theme }) => theme.bg};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-height: calc(100vh - 60px);
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-bottom: 60px;
  `}
`

const UnderMaintenanceWrap = styled(RowCenter)`
  height: 100%;
  z-index: 1000;
  position: absolute;
  background: rgba(18, 20, 25, 0.8);
  backdrop-filter: blur(6px);
`

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoading, isUSResident } = useInternetConnectionLocation()

  const [showUSResidentsModal, setShowUSResidentsModal] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (isUSResident) {
        setShowUSResidentsModal(true)
      }
    }
  }, [isLoading, isUSResident])
  const dispatch = useAppDispatch()
  const addPopup = useAddPopup()
  return (
    <Wrapper>
      {UNDER_MAINTENANCE && (
        <UnderMaintenanceWrap>
          <UnderMaintenance />
        </UnderMaintenanceWrap>
      )}
      <HeaderWrap>
        <NavBar />
      </HeaderWrap>
      <Content>{children}</Content>

      <USResidentsModal
        isOpen={showUSResidentsModal}
        isModal={true}
        onDismiss={() => {
          setShowUSResidentsModal(false)
        }}
      />
      <CommonModals />

      {/* <OnboardingModal /> */}
      <OnboardingModalV2 />
      {/*<p
        onClick={() => {
          const notification: NotificationDetails = {
            id: '1',
            createTime: Date.now().toString(),
            modifyTime: Date.now().toString(),
            showInModal: true,
            quoteId: null,
            stateType: null,
            counterpartyAddress: null,
            notificationType: NotificationType.PUSH,
            filledAmountClose: null,
            filledAmountOpen: null,
            lastSeenAction: null,
            actionStatus: null,
            failureType: null,
            failureMessage: null,
            errorCode: null,
            pushNotificationTitle: 'title',
            pushNotificationBody:
              '"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et',
          }
          // dispatch(
          //   updateIsNewNotification({
          //     flag: true,
          //   })
          // )
          addPopup(notification, 'hello ad', 5000)

          dispatch(
            addUnreadNotification({
              notification,
            })
          )
        }}
      >
        sdkjfl
      </p>*/}
      <Footer />
    </Wrapper>
  )
}
