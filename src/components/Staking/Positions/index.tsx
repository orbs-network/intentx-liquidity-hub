import { Row, RowBetween, RowEnd } from 'components/Row'
import styled from 'styled-components'
import Image from 'next/image'
import IntentXIcon from '/public/static/images/stakingIcons/intentXIcon.svg'
import IntentXIconW from '/public/static/images/stakingIcons/intentXIconW.svg'
import Underlying from '/public/static/images/stakingIcons/underlying.svg'
import CPosition from '/public/static/images/stakingIcons/cposition.svg'
import Value from '/public/static/images/stakingIcons/value.svg'
import Column from 'components/Column'
import { Title } from '..'
import { ChevronDown } from 'react-feather'
import GradientButton from 'components/Button/GradientButton'
import Ratio from '/public/static/images/stakingIcons/ratio.svg'

import Maturity from '/public/static/images/stakingIcons/maturity.svg'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import PositionsModal from '../Modals/PositionModal'
import AddModal from '../Modals/AddModal'
import MergeModal from '../Modals/MergeModal'
import TransferModal from '../Modals/TransferModal'

const Wrapper = styled.div`
  width: 100%;
  background: rgba(23, 26, 31, 1);
  border-radius: 10px;
  grid-area: 1 / 1 / 3 / 2;
  min-height: 100%;
  padding: 35px 30px 20px 30px;
`

const BoxInfo = styled.div<{pointer?: boolean}>`
  height: 135px;
  border-radius: 14px;
  background: rgba(29, 33, 41, 1);
  display: flex;
  padding: 10px 20px;
  justify-content: space-between;
  margin-top: 5px;
  cursor:  ${({ pointer }) => pointer? 'pointer': 'auto'};
`

const TitleInfo = styled.div<{ align?: string }>`
  font-family: Poppins;
  font-size: 19px;
  font-weight: 500;
  text-align: ${({ align }) => (align ? align : 'left')};
  color: ${({ theme }) => theme.white};
`

const TitleMuted = styled.div<{ size: string; width: string }>`
  font-family: Poppins;
  font-size: 20px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.3);
  font-size: ${({ size }) => size};
  width: ${({ width }) => width};
  display: inline-flex;
  align-items: center;
  gap: 5px;
`

const Chevron = styled(ChevronDown)<{
  size?: string
  [x: string]: any
}>`
  stroke-width: 2;
  color: ${({ theme }) => theme.white};
  &:hover {
    cursor: pointer;
  }
`
const MultiplyText = styled.div`
  font-family: Poppins;
  font-size: 15px;
  font-weight: 600;
  line-height: 30px;
  background: linear-gradient(180deg, #ff0420 0%, #bd2738 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
`

const Content = styled(Column)`
  gap: 20px;
`

export default function Positions({ isMobile }: { isMobile: boolean }) {
  const showPositionModal = useModalOpen(ApplicationModal.POSITIONS_SELECT)
  const toggleshowPositionModal = useToggleModal(ApplicationModal.POSITIONS_SELECT)
  const showAddModal = useModalOpen(ApplicationModal.ADD_STAKING)
  const toggleshowAddModal = useToggleModal(ApplicationModal.ADD_STAKING)
  const showMergeModal = useModalOpen(ApplicationModal.MERGE_STAKING)
  const toggleshowMergeModal = useToggleModal(ApplicationModal.MERGE_STAKING)
  const showTransferModal = useModalOpen(ApplicationModal.TRANFER_STAKING)
  const toggleshowTransferModal = useToggleModal(ApplicationModal.TRANFER_STAKING)
  return (
    <Wrapper>
      <Title>xINTX Staking</Title>
      <Content>
        <BoxInfo pointer={true} onClick={() => {
            toggleshowPositionModal()
          }}>
          <Row gap="15px">
            <Image unoptimized={true} src={IntentXIcon} alt="intentx" style={{ position: 'relative', width: '65px' }} />
            <Column>
              <TitleMuted size="18px" width="100%">
                Stake
              </TitleMuted>
              <TitleInfo>ID #----</TitleInfo>
            </Column>
          </Row>
          <RowEnd>
            <Chevron size="30px" />
          </RowEnd>
        </BoxInfo>
        <Row justify="space-between">
          <GradientButton buttonFilled={false} label={'Add'} onClick={() => toggleshowAddModal()} size={'185px'} height={'49px'} />
          <GradientButton buttonFilled={false} label={'Merge'} onClick={() => toggleshowMergeModal()} size={'185px'} height={'49px'} />
          <GradientButton buttonFilled={false} label={'Split'} onClick={() => ''} size={'185px'} height={'49px'} />
          <GradientButton buttonFilled={false} label={'Transfer'} onClick={() => toggleshowTransferModal()} size={'185px'} height={'49px'} />
        </Row>
        <BoxInfo>
          <Row gap="15px">
            <Image unoptimized={true} src={CPosition} alt="intentx" style={{ position: 'relative' }} />
            <Column>
              <TitleInfo>Current Position</TitleInfo>
            </Column>
          </Row>
          <RowEnd>
            <Column>
              <Row gap="5px" align="center" justify="flex-end">
                <Image unoptimized={true} src={IntentXIconW} alt="intentx" width={20} />
                <TitleInfo align="right">-,--- xINTX</TitleInfo>
              </Row>
              <Row gap="8px">
                <Row gap="5px">
                  <Image
                    unoptimized={true}
                    src={Maturity}
                    alt="icon"
                    style={{
                      height: '20px',
                      width: '20px',
                    }}
                  />
                  <TitleMuted width="100%" size="13px">
                    Current APR -,--%
                  </TitleMuted>
                </Row>
                <Row gap="5px">
                  <MultiplyText>1x</MultiplyText>
                  <TitleMuted size="13px" width="190px">
                    Current Multiplier --.--x
                  </TitleMuted>
                </Row>
              </Row>
            </Column>
          </RowEnd>
        </BoxInfo>
        <BoxInfo>
          <Row gap="15px">
            <Image unoptimized={true} src={Underlying} alt="intentx" style={{ position: 'relative' }} />
            <Column>
              <TitleInfo>Underlying INTX</TitleInfo>
            </Column>
          </Row>
          <RowEnd>
            <Column>
              <Row gap="5px" align="center" justify="flex-end">
                <Image unoptimized={true} src={IntentXIcon} alt="intentx" width={20} />
                <TitleInfo align="right">-,--- INTX</TitleInfo>
              </Row>
              <Row gap="8px">
                <Image
                  unoptimized={true}
                  src={Ratio}
                  alt="icon"
                  style={{
                    height: '20px',
                    width: '20px',
                  }}
                />
                <TitleMuted width="100%" size="13px">
                  <MultiplyText>Backing Ratio</MultiplyText> (INTX/xINTX) -.--
                </TitleMuted>
              </Row>
            </Column>
          </RowEnd>
        </BoxInfo>
        <BoxInfo>
          <Row gap="15px">
            <Image unoptimized={true} src={Value} alt="intentx" style={{ position: 'relative' }} />
            <Column>
              <TitleInfo>USD Value</TitleInfo>
            </Column>
          </Row>
          <RowEnd>
            <TitleInfo align="right">$-----.--</TitleInfo>
          </RowEnd>
        </BoxInfo>
      </Content>
      {showPositionModal && <PositionsModal></PositionsModal>}
      {showAddModal && <AddModal></AddModal>}
      {showMergeModal && <MergeModal></MergeModal>}
      {showTransferModal && <TransferModal></TransferModal>}
    </Wrapper>
  )
}
