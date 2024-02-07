import { Modal, ModalHeader2, SplittedModal } from 'components/Modal'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import styled from 'styled-components'
import { IconWrapper, Search } from 'components/Icons'
import { CustomBox } from 'components/InputBox'
import IntentXIconW from '/public/static/images/stakingIcons/intentXIconW.svg'

const ModalContent = styled.div`
  background: rgba(23, 26, 31, 1);
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
  padding: 0px 20px;
  gap: 15px;
`

const Layout = styled(ColumnFlex)`
  gap: 16px;
  overflow-y: auto;
`
const WrapperInput = styled.div`
  display: flex;
  height: 52px;
  width: 100%;
  border-radius: 4px;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  height: 40px;
  border-radius: 3px;
`};
`

const IconInput = styled(IconWrapper)`
  height: 100%;
  padding-left: 20px;
  padding-right: 15px;
  border-radius: 4px 0px 0px 4px;
  background: rgba(33, 35, 42, 1);
`

const Input = styled.input<{
  [x: string]: any
}>`
  height: 100%;
  flex: 1;
  border: none;
  background: rgba(33, 35, 42, 1);
  border-radius: 0px 4px 4px 0px;
  color: ${({ theme }) => theme.white};
  padding-left: 2px;
  &:focus,
  &:hover {
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      font-size: 0.6rem;
    `}

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    font-size: 0.75rem;
    padding-left: 1.5px;
  `};
`

export default function PositionsModal() {
  const isOpen = useModalOpen(ApplicationModal.POSITIONS_SELECT)
  const toggle = useToggleModal(ApplicationModal.POSITIONS_SELECT)

  return (
    <div>
      <SplittedModal isOpen={isOpen} onEscapeKeydown={toggle}>
        <Layout>
          <ModalContent>
            <Header>
              <ModalHeader2 title="Select your Position" onBack={toggle} />
            </Header>
            <Content>
              <WrapperInput>
                <IconInput>
                  <Search></Search>
                </IconInput>
                <Input
                  onChange={(e) => {
                    ;('')
                  }}
                  autoFocus
                  type="text"
                  placeholder={'Search Position...'}
                  spellCheck="false"
                  onBlur={() => null}
                />
              </WrapperInput>
              <CustomBox symbol={'xINTX'} value={'-,---'} icon={IntentXIconW} id={'-----'} bRatio={'-.--'} />
            </Content>
          </ModalContent>
        </Layout>
      </SplittedModal>
    </div>
  )
}
