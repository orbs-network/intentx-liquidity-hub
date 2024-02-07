import Ratio from 'components/Icons/Ratio'
import { CustomBox, CustomInputBox4 } from 'components/InputBox'
import { Modal, ModalHeader2, SplittedModal, Subtitle, Title, WarnModal } from 'components/Modal'
import { Row, RowBetween, RowEnd } from 'components/Row'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import styled from 'styled-components'
import IntentXIcon from '/public/static/images/stakingIcons/intentXIcon.svg'
import IntentXIconW from '/public/static/images/stakingIcons/intentXIconW.svg'
import ArrowDownDark from 'components/Icons/ArrowDownDark'
import PositionsModal from './PositionModal'
import AlertTriangle from 'components/Icons/AlertTriangle'

const ModalContent = styled.div`
  background: rgba(35, 41, 51, 1);
  min-height: 401px;
  height: 100%;
  width: 100%;
`

const ColumnFlex = styled.div<{ align?: string; gap?: string }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ align }) => (align ? align : 'inherit')};
  gap: ${({ gap }) => (gap ? gap : '0')};
`

const Header = styled(ColumnFlex)`
  gap: 5px;
  padding: 15px;
`
const Content = styled(ColumnFlex)`
  padding: 0px 15px;
  gap: 5px;
`

const Layout = styled(ColumnFlex)`
  gap: 16px;
  overflow-y: auto;
`
const ChangeButton = styled(ColumnFlex)`
  width: 35px;
  height: 35px;
  border-radius: 10px;
  background: rgba(47, 56, 71, 1);
  position: relative;
  justify-content: center;
  cursor: pointer;
`

const WithdrawButton = styled.div<{ completed?: boolean }>`
  height: 61px;
  border-radius: 0 0 5px 5px;
  background: ${({ completed, theme }) => (completed ? theme.gradCustom2 : theme.gradCustomRed)};
  display: flex;
  position: absolute;
  width: 100%;
  bottom: 0px;
  justify-content: center;
  align-items: center;
  cursor: ${({ completed }) => (completed ? 'pointer' : 'default')};
`

const PriceTitleMuted = styled(Title)`
  color: rgba(255, 255, 255, 0.4);
`

export default function MergeModal() {
  const isOpen = useModalOpen(ApplicationModal.MERGE_STAKING)
  const toggle = useToggleModal(ApplicationModal.MERGE_STAKING)
  const showPositionModal = useModalOpen(ApplicationModal.POSITIONS_SELECT)
  const toggleshowPositionModal = useToggleModal(ApplicationModal.POSITIONS_SELECT)
  return (
    <div>
      <SplittedModal isOpen={isOpen} onEscapeKeydown={toggle}>
        <Layout>
          <WarnModal height="40px">
            <AlertTriangle size={16} />
            <Title size="12px">You must know that you will lose your maturity.</Title>
          </WarnModal>
          <ModalContent>
            <Header>
              <ModalHeader2 merge={true} title="Merge Position" onBack={toggle} />
            </Header>
            <Content>
              <CustomBox symbol={'xINTX'} value={'-,---'} icon={IntentXIconW} id={'-----'} bRatio={'-.--'} />
              <RowBetween align="flex-end">
                <Row>
                  <PriceTitleMuted>Merge with</PriceTitleMuted>
                </Row>
                <RowEnd>
                  <ChangeButton align="center">
                    <ArrowDownDark colored={true}></ArrowDownDark>
                  </ChangeButton>
                </RowEnd>
              </RowBetween>
              <Row
                onClick={() => {
                  toggleshowPositionModal()
                }}
              >
                <CustomBox symbol={'xINTX'} value={'-,---'} icon={IntentXIconW} id={'-----'} />
              </Row>
            </Content>
            <WithdrawButton completed={true}>
              <Title>Add funds</Title>
            </WithdrawButton>
          </ModalContent>
        </Layout>
      </SplittedModal>
      {showPositionModal && <PositionsModal></PositionsModal>}
    </div>
  )
}
