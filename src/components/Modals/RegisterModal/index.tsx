import { Modal } from 'components/Modal'
import styled from 'styled-components'
import RegisterForm from './RegsiterForm'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  width: 100%;
`

export default function RegisterModal({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  return (
    <Modal isOpen={isOpen} onBackgroundClick={onDismiss} onEscapeKeydown={onDismiss}>
      <Wrapper>
        <RegisterForm onClose={onDismiss} />
      </Wrapper>
    </Modal>
  )
}
