import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import styled from 'styled-components'

import { Info as InfoIcon, ArrowLeft, Gas as GasIcon } from 'components/Icons'
import { Modal } from 'components/Modal'
import { RowStart } from 'components/Row'
import { BaseButton } from 'components/Button'
import { useSetSlippageToleranceCallback, useSlippageTolerance } from 'state/user/hooks'
import { useCallback, useState } from 'react'
import { MAX_SLIPPAGE, MIN_SLIPPAGE } from 'constants/slippage'

const Input = styled.input<{
  [x: string]: any
}>`
  height: fit-content;
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: ${({ theme }) => theme.white};
  &:focus,
  &:hover {
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 0.6rem;
  `}
`

const InputWrapper = styled(RowStart)`
  flex-flow: row nowrap;
  background: #21232a;
  border: 1px solid ${({ theme }) => theme.border1};
  border-radius: 10px;
  padding: 0.2rem 15px;
  font-size: 22px;
  height: 55px;
  gap: 5px;

  & > * {
    &:first-child {
      width: fit-content;
    }
  }
`

const InputControl = styled.span`
  color: ${({ theme }) => theme.text0};
  background-color: ${({ theme }) => theme.bg6};
  font-size: 12px;
  height: 25px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  text-transform: uppercase;
  cursor: pointer;
`

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  width: 100%;
  padding: 1.5rem;
  gap: 0.8rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0.5rem;
  `};
`

const Title = styled.h4`
  color: ${({ theme }) => theme.text0};
  font-size: 18px;
  font-weight: 400;
  text-align: center;
`

const Description = styled.p`
  color: ${({ theme }) => theme.text3};
  font-size: 14px;
  font-weight: 400;
  text-align: center;
`

const Gas = styled.p`
  color: ${({ theme }) => theme.text0};
  font-size: 14px;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border1};
`

const StyledInfoIcon = styled(InfoIcon)`
  color: ${({ theme }) => theme.text2};
  width: 14px;
  height: 14px;
  margin: 4px 4px 0px 4px;
  cursor: default;
`

const GasImage = styled.img`
  width: 230px;
  margin: 0 auto;
`

const ModalButton = styled(BaseButton)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: ${({ theme }) => theme.gradCustom1};
  height: 45px;
  font-weight: 400;
  border-radius: 5px;
  font-size: 14px;
`

export default function SettingModal() {
  const isOpen = useModalOpen(ApplicationModal.INSUFFICIENT_SLIPPAGE)
  const toggleModal = useToggleModal(ApplicationModal.INSUFFICIENT_SLIPPAGE)

  const slippage = useSlippageTolerance()
  const setSlippage = useSetSlippageToleranceCallback()
  const [customSlippage, setCustomSlippage] = useState<string | number>(slippage)

  const handleCustomSlippage = useCallback(
    (e: any) => {
      const value = e.currentTarget.value.replace(',', '.')

      if (value.includes('.')) {
        setCustomSlippage(value)
        if (value >= MIN_SLIPPAGE && value <= MAX_SLIPPAGE) {
          setSlippage(parseFloat(value))
          setCustomSlippage(parseFloat(value))
        }
      } else {
        if (!value) {
          setSlippage(0)
        }
        if (value >= MIN_SLIPPAGE && value <= MAX_SLIPPAGE) {
          setSlippage(parseFloat(value))
          setCustomSlippage(parseFloat(value))
        }
      }
    },
    [setSlippage]
  )

  return (
    <Modal isOpen={isOpen} onBackgroundClick={toggleModal} onEscapeKeydown={toggleModal}>
      <Wrapper>
        <GasImage src="/static/images/modals/insufficient-slippage.png" alt="insufficient-slippage" />
        <Title>Insufficient Slippage</Title>
        <Description>
          Seems your slippage tolerance is lower than expected slippage.
          <br />
          <br /> It is recommended to increase the slippage to optimally execute this market order.
        </Description>
        <Gas>
          <span>Slippage Tolerance</span>
          <StyledInfoIcon />
        </Gas>
        <InputWrapper>
          <GasIcon size="1em" style={{ color: 'red' }} />
          <Input 
            autoFocus
            type="number"
            spellCheck="false"
            value={customSlippage}
            onChange={(e) => handleCustomSlippage(e)}
            placeholder={customSlippage ? customSlippage.toString() : '0'}
            onBlur={() => {
              if (!customSlippage) setSlippage(1)
            }}
          />
          <InputControl>%</InputControl>
        </InputWrapper>
        <ModalButton onClick={toggleModal}>
          Update Slippage
          <ArrowLeft />
        </ModalButton>
      </Wrapper>
    </Modal>
  )
}
