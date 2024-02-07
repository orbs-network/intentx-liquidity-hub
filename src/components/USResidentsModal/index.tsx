import React from 'react'
import styled from 'styled-components'
import { Z_INDEX } from 'theme'

import { Card } from 'components/Card'
import { Modal } from 'components/Modal'
import { BaseButton } from 'components/Button'
import ArrowLeft from '../Icons/ArrowLeft'

const ModalWrapper = styled(Card)`
  border: none;
  background: ${({ theme }) => theme.bg3};
`

const InlineModal = styled(Card)<{
  isOpen: boolean
  height?: string
}>`
  padding: 10px;
  width: 404px;
  max-height: ${({ height }) => height ?? '554px'};
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: absolute;
  z-index: ${Z_INDEX.modal};
  transform: translate(-364px, 10px);
  background: ${({ theme }) => theme.bg3};
  border: 2px solid ${({ theme }) => theme.bg6};

  & > * {
    &:last-child {
      overflow-y: scroll;
      overflow-x: hidden;
      width: 100%;
    }
  }
`

const ModalContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
`

const ModalTitle = styled.h4`
  text-align: center;
  color: ${({ theme }) => theme.text0};
  font-size: 20px;
  margin-bottom: 15px;
`
const ModalText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.text3};
  font-size: 16px;
  margin-bottom: 20px;
`

const UsFlag = styled.img`
  width: 230px;
`

const ModalButton = styled(BaseButton)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: ${({ theme }) => theme.gradCustom1};
  height: 45px;
  font-weight: 400;
  border-radius: 5px;
`

export default function USResidentsModal({
  isModal,
  isOpen,
  onDismiss,
}: {
  isModal?: boolean
  isOpen: boolean
  onDismiss: () => void
}) {
  function getInnerContent() {
    return (
      <div>
        <ModalContent>
          <UsFlag src="/static/images/modals/us-residents.png" alt="us-flag" />
          <ModalTitle>Seems like you’re in United States</ModalTitle>
          <ModalText>
            Currently, the solver during Open Beta does not support quotes to United States residents. We are working to
            expand the solver network to support your region
          </ModalText>
          <ModalButton onClick={onDismiss}>
            Acknowledge
            <ArrowLeft />
          </ModalButton>
        </ModalContent>
      </div>
    )
  }

  return isModal ? (
    <Modal isOpen={isOpen} onBackgroundClick={onDismiss} onEscapeKeydown={onDismiss}>
      <ModalWrapper>{getInnerContent()}</ModalWrapper>
    </Modal>
  ) : (
    <InlineModal isOpen={isOpen} height="288px">
      {getInnerContent()}
    </InlineModal>
  )
}
