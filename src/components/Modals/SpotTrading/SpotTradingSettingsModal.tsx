import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import styled from 'styled-components'

import GradientButton from 'components/Button/GradientButton'
import { ArrowUpLeft, Info as InfoIcon, Settings } from 'components/Icons'
import { Modal } from 'components/Modal'
import { RowStart } from 'components/Row'
import { ToolTipLeft } from 'components/ToolTip'
import { MAX_SLIPPAGE, MIN_SLIPPAGE } from 'constants/slippage'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useSetSlippageToleranceCallback, useSlippageTolerance } from 'state/user/hooks'

const Input = styled.input<{
  [x: string]: any
}>`
  height: fit-content;
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.8rem;
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
  border-radius: 5px;
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
  justify-content: flex-start;
  width: 100%;
  padding: 1.5rem;
  gap: 0.8rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0.5rem;
  `};
`

const BackTo = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text3};
  cursor: pointer;
  gap: 10px;
  &:hover {
    color: ${({ theme }) => theme.red};
  }
`

const Title = styled.h4`
  color: ${({ theme }) => theme.text0};
  font-size: 18px;
  font-weight: 400;
`

const Gas = styled.div`
  color: ${({ theme }) => theme.text0};
  font-size: 14px;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border1};
`

const Token = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 25px;
  margin-right: 10px;
`

const StyledInfoIcon = styled(InfoIcon)`
  color: ${({ theme }) => theme.text2};
  width: 14px;
  height: 14px;
  margin: 4px 4px 0px 4px;
  cursor: default;
`

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`

const LowSlippageWarning = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.yellow1};
`

const HighSlippageWarning = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 10px;
  color: ${({ theme }) => theme.red};
`

export default function SpotTradingSettingsModal() {
  const isOpen = useModalOpen(ApplicationModal.SPOT_SETTINGS)
  const toggleModal = useToggleModal(ApplicationModal.SPOT_SETTINGS)

  const slippage = useSlippageTolerance()
  const setSlippage = useSetSlippageToleranceCallback()
  const [customSlippage, setCustomSlippage] = useState<string | number>(slippage)
  const dispatch = useDispatch()

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
        <BackTo onClick={() => toggleModal()}>
          <ArrowUpLeft />
          <span>Go Back</span>
        </BackTo>
        <Title>Advanced Settings</Title>
        <Gas>
          <span>Gas on deestination chain</span>
          <StyledInfoIcon />
        </Gas>
        <ButtonGroup>
          <GradientButton buttonFilled={true} label={'None'} onClick={() => console.log('none')} />
          <GradientButton buttonFilled={false} label={'Default'} onClick={() => console.log('default')} />
        </ButtonGroup>
        <InputWrapper>
          <Token src="/static/images/tokens/ETH.svg" />
          <Input
            onChange={(e) => {
              console.log(e.target.value)
            }}
            autoFocus
            type="number"
            placeholder={'0.00'}
            spellCheck="false"
            onBlur={() => null}
          />
          <InputControl>Max</InputControl>
        </InputWrapper>

        <Gas>
          <span>Slippage Tolerance</span>
          <StyledInfoIcon data-tip data-for="slippage-tolerance-settings-tooltip" />
          <ToolTipLeft id="slippage-tolerance-settings-tooltip" aria-haspopup="true">
            Set your preferred slippage tolerance.
            <br />
            This determines the maximum price change
            <br /> you&apos;re willing to accept for your transaction
          </ToolTipLeft>
        </Gas>
        <ButtonGroup>
          <GradientButton
            buttonFilled={slippage == 0.1}
            height="42px"
            label={'0.1%'}
            onClick={() => {
              setSlippage(0.1)
              setCustomSlippage(0.1)
            }}
          />
          <GradientButton
            buttonFilled={slippage == 0.5}
            label={'0.5%'}
            height="42px"
            onClick={() => {
              setSlippage(0.5)
              setCustomSlippage(0.5)
            }}
          />
          <GradientButton
            buttonFilled={slippage == 1}
            label={'1%'}
            height="42px"
            onClick={() => {
              setSlippage(1)
              setCustomSlippage(1)
            }}
          />
        </ButtonGroup>
        <InputWrapper>
          <Settings size="1em" style={{ color: 'red' }} />
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
        {slippage !== 'auto' && (
          <>
            {slippage < 0.5 && (
              <LowSlippageWarning>
                Warning: Your transaction may fail. Consider increasing your slippage if it happens.
              </LowSlippageWarning>
            )}
            {slippage >= 5 && (
              <HighSlippageWarning>
                Warning: Your slippage is too high. Your transaction might have a loss greater than expected.
              </HighSlippageWarning>
            )}
          </>
        )}
      </Wrapper>
    </Modal>
  )
}
