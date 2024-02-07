import Ratio from 'components/Icons/Ratio'
import { CustomInputBox4 } from 'components/InputBox'
import { Modal, ModalHeader2, SplittedModal, Subtitle, Title, WarnModal } from 'components/Modal'
import { RowBetween } from 'components/Row'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import styled from 'styled-components'
import IntentXIcon from '/public/static/images/stakingIcons/intentXIcon.svg'
import IntentXIconW from '/public/static/images/stakingIcons/intentXIconW.svg'

const ModalContent = styled.div`
  background: rgba(35, 41, 51, 1);
  min-height: 433px;
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
  gap: 15px;
`

const Layout = styled(ColumnFlex)`
  gap: 16px;
  overflow-y: auto;
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

const RatioInfo = styled.div`
  border: 1px solid #373f4d;
  color: white;
  display: flex;
  width: 100%;
  height: 40px;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-radius: 4px;
`

const TitleStake = styled(Title)`
  display: inline-flex;
  gap: 5px;
`

export default function RedeemModal() {
  const isOpen = useModalOpen(ApplicationModal.REDEEM_INTX)
  const toggle = useToggleModal(ApplicationModal.REDEEM_INTX)

  return (
    <div>
      <SplittedModal isOpen={isOpen} onEscapeKeydown={toggle}>
        <Layout>
          <ModalContent>
            <Header>
              <ModalHeader2 reedem={true} title="Reedem xINTX" onBack={toggle} />
              <ColumnFlex gap="20px"></ColumnFlex>
            </Header>
            <Content>
              <RatioInfo>
                <TitleStake size="12px">
                  <Ratio /> Backing Ratio (INTX/xINTX)
                </TitleStake>
                <TitleStake size="12px">-.--</TitleStake>
              </RatioInfo>
              <CustomInputBox4
                background="rgba(23, 26, 31, 0.8)"
                border="none"
                symbol={'xINTX'}
                title={`Stake`}
                value={'0.00'}
                onChange={() => {
                  console.log('')
                }}
                max={true}
                icon={IntentXIconW}
                balanceDisplay={undefined}
                balanceExact={undefined}
              />
              <CustomInputBox4
                background="rgba(23, 26, 31, 0.8)"
                border="none"
                symbol={'INTX'}
                title={`You Recieve`}
                value={'0.00'}
                onChange={() => {
                  console.log('')
                }}
                max={false}
                icon={IntentXIcon}
                balanceDisplay={undefined}
                balanceExact={undefined}
              />
            </Content>
            <WithdrawButton completed={true}>
              <Title>Reedem</Title>
            </WithdrawButton>
          </ModalContent>
        </Layout>
      </SplittedModal>
    </div>
  )
}
