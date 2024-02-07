import { Row, RowBetween } from 'components/Row'
import styled from 'styled-components'
import Image from 'next/image'
import { Z_INDEX } from 'theme'
import ExpandArrow from 'components/Icons/ExpandArrow'
import { useEffect, useState } from 'react'
import { SecondaryButton } from 'components/Button'
import BookOutline from '/public/static/images/book-outline.svg'
import { useIsLaptop } from 'lib/hooks/useWindowSize'
import { useAccountPartyAStat, useActiveAccount } from 'state/user/hooks'
import {
  useApplicationConnectionStatus,
  useConnectionModalToggle,
  useDepositModalToggle,
  useToggleModal,
} from 'state/application/hooks'
import { ApplicationConnectionStatus, ApplicationModal } from 'state/application/reducer'
import { useHistoryQuotes, usePendingsQuotes, usePositionsQuotes } from 'state/quotes/hooks'
import CreateAccountModal from 'components/Modals/CreateAccountModal'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import OnboardingWallet from 'components/OnboardingWallet'
import OnboardingUser from 'components/OnboardingUser'
import OnboardingMoney from 'components/OnboardingMoney'
import OnboardingChart from 'components/OnboardingChart'
import OnboardingNotification from 'components/OnboardingNotification'
import { ColumnCenter } from 'components/Column'
import { onboardingData } from './utils'
import GradientButton from 'components/Button/GradientButton'
import CompleteTask from '/public/static/images/etc/complete-step.svg'

const Wrapper = styled.div`
  width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1d1f26;
  border-radius: 10px;
  gap: 10px;
  z-index: 1040;
  position: fixed;
  bottom: 10px;
  right: 10px;
  padding: 16px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  border-radius: 8px;
  gap: 8px;
  bottom: 8px;
  right: 8px;
  `}

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-bottom: 60px;
  `}
`

const Label = styled.span<{ size?: string; weight?: string; reducedOpacity?: boolean }>`
  font-weight: ${({ weight }) => (weight ? weight : '500')};
  font-size: ${({ size }) => (size ? size : '12px')};
  color: ${({ theme }) => theme.white};
  max-width: 240px;
  text-align: center;
  opacity: ${({ reducedOpacity }) => (reducedOpacity ? '0.5' : '1')};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 10px;
  max-width: 180px; 
  `}
`

const GradientLabel = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;

  background: linear-gradient(180deg, #ff0420 0%, #bd2738 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`

const HeaderContainer = styled.div<{ isExpanded?: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  gap: 16px;
  cursor: pointer;
  background: ${({ isExpanded }) =>
    isExpanded ? 'linear-gradient(90deg, rgba(188, 39, 56, 0.2) 0%, rgba(110, 22, 32, 0.2) 128.07%)' : '#171a1f'};
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  border: ${({ isExpanded }) => (isExpanded ? '1px solid #881c28' : 'none')};

  &:hover {
    background: linear-gradient(90deg, rgba(188, 39, 56, 0.2) 0%, rgba(110, 22, 32, 0.2) 128.07%);
    border: 1px solid #501f27;
  }
`

const MinimizeButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;
`

const ElementDescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 16px;
`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  width: 47px;
  height: 47px;
  background: linear-gradient(90deg, #bc2738 0%, #6e1620 128.07%);
`

const DismissButton = styled.div`
  display: flex;
  width: 100%;
  cursor: pointer;
  text-align: center;
  justify-content: center;
  margin-top: 16px;
`

const StepContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border: 3px solid #232933;
  border-radius: 20px;
  cursor: pointer;
`

const ContentColumn = styled.div``

const OnboardingElement = ({
  title,
  description,
  buttonLabel,
  onActionCall,
  isComplete,
}: {
  title?: string
  description?: string
  buttonLabel?: string
  isComplete?: boolean
  onActionCall?: any
}) => {
  const isLaptop = useIsLaptop()

  const handleStepAction = (): void => {
    onActionCall?.()
  }

  return (
    <ElementDescription>
      <GradientLabel>{title}</GradientLabel>
      <Label size="12px">{description}</Label>
      <GradientButton height="34px" onClick={handleStepAction} label={buttonLabel ?? ''} size="130px" />
    </ElementDescription>
  )
}

export default function OnboardingModalV2() {
  const [isContainerExpanded, setIsContainerExpanded] = useState(true)
  const [selectedStep, setSelectedStep] = useState<any>(null)
  const [hoveredStep, setHoveredStep] = useState<any>(null)

  const [showModal, setShowModal] = useState(false)

  const activeAccount = useActiveAccount()
  const currentApplicationConnectionStatus = useApplicationConnectionStatus()
  const updateExpandedElement = (type: string) => (): void => {
    setExpandedElement(type)
  }
  const { allocatedBalance } = useAccountPartyAStat(activeAccount?.accountAddress) || 0

  const completeStep = (stepIndex: number) => {
    const newCompletedSteps = [...completedSteps]
    newCompletedSteps[stepIndex] = true
    setCompletedSteps(newCompletedSteps)
  }

  const navigateToDocs = (): void => {
    window.open('https://docs.intentx.io/intentx-platform/trading-on-intentx/trading-tutorials/web3-wallet', '_blank')
  }
  const toggleConnectionModal = useConnectionModalToggle()
  const depositModalToggle = useDepositModalToggle()

  const { openConnectModal } = useConnectModal()
  const toggleConnectionModal_temp = useToggleModal(ApplicationModal.ACCOUNT_ABSTRACTION_CONNECTING)

  const loginAction = () => {
    // toggleConnectionModal
    openConnectModal && openConnectModal()
    toggleConnectionModal_temp()
  }

  const { quotes: closed } = useHistoryQuotes()
  const { quotes: positions } = usePositionsQuotes()
  const { quotes: pendings } = usePendingsQuotes()
  useEffect(() => {
    const hideOnboardingModal = localStorage.getItem('hideOnboardingModal') === 'true' || false

    if (!hideOnboardingModal) {
      // Show the modal after 1 second
      setTimeout(() => {
        setShowModal(true)
      }, 1250)
    }
  }, [])
  const [createAccountModal, setCreateAccountModal] = useState(false)
  const walletConnected = currentApplicationConnectionStatus !== ApplicationConnectionStatus.DISCONNECTED
  const accountCreated = walletConnected && activeAccount !== null && activeAccount !== undefined
  const fundsDeposited = closed.length > 0 || parseFloat(allocatedBalance) > 0
  const startedTrading = positions.length > 0 || closed.length > 0 || pendings.length > 0
  const notificationsSet = 'Notification' in window ? window.Notification.permission === 'granted' : false
  const [completedSteps, setCompletedSteps] = useState([
    walletConnected,
    accountCreated,
    fundsDeposited,
    startedTrading,
    notificationsSet,
  ])
  useEffect(() => {
    setCompletedSteps([walletConnected, accountCreated, fundsDeposited, startedTrading, notificationsSet])
  }, [walletConnected, accountCreated, fundsDeposited, startedTrading, notificationsSet])

  const [expandedElement, setExpandedElement] = useState('')
  const hideOnboardingModal = () => {
    localStorage.setItem('hideOnboardingModal', 'true')
    setShowModal(false)
  }
  useEffect(() => {
    const stepNames = ['connect-wallet', 'create-account', 'deposit-funds', 'start-trading', 'notification-preference']

    // Find the first incomplete step
    const firstIncompleteStep = stepNames[completedSteps.indexOf(false)]
    setExpandedElement(firstIncompleteStep || '')

    // If all steps are complete, hide the modal
    if (completedSteps.every((step) => step === true)) {
      hideOnboardingModal()
    }
  }, [completedSteps])

  // To update the steps when the notification permission is granted
  function updateNotificationStatus() {
    setCompletedSteps((prevSteps) => {
      const newSteps = [...prevSteps]
      if ('Notification' in window) newSteps[4] = window.Notification.permission === 'granted'
      return newSteps
    })
  }

  const depositFunds = () => {
    if (!walletConnected) {
      loginAction()
    } else if (walletConnected && !accountCreated) {
      setCreateAccountModal(true)
    } else if (walletConnected && accountCreated) {
      depositModalToggle()
    }
  }

  useEffect(() => {
    function findFirstFalseIndex(array) {
      for (let i = 0; i < array.length; i++) {
        if (!array[i]) {
          return i + 1 // Adding 1 because array indices are 0-based
        }
      }
      return -1 // If no false element is found
    }

    const findFirstIncompleteStep = findFirstFalseIndex(completedSteps)

    setSelectedStep(`${findFirstIncompleteStep}`)
  }, [completedSteps])

  const configNotifications = () => {
    try {
      if ('Notification' in window) {
        window.Notification.requestPermission().then((permission) => {
          if (permission === 'denied') {
            alert(
              'You have denied the permission for notifications. If you are on incognito mode, please switch to normal mode to enable notifications.'
            )
          }
          if (permission === 'granted') {
            updateNotificationStatus()
          }
        })
      }
    } catch (error) {
      alert('There was an error with the notification permission')
    }
  }

  const getStepContent = (step: string) => {
    const stepData = onboardingData.find((element) => element.id === step)

    const handleStepAction = () => {
      switch (stepData?.id) {
        case '1':
          return loginAction()
        case '2':
          return walletConnected ? setCreateAccountModal(true) : loginAction()
        case '3':
          return depositFunds()
        case '4':
          return navigateToDocs()
        case '5':
          return configNotifications()
      }
    }

    return (
      <OnboardingElement
        title={stepData?.title}
        description={stepData?.description}
        buttonLabel={stepData?.btnLabel}
        onActionCall={handleStepAction}
      />
    )
  }

  if (!showModal) return
  return (
    <Wrapper>
      <CreateAccountModal isOpen={createAccountModal} onDismiss={() => setCreateAccountModal(false)} />
      <HeaderContainer onClick={() => setIsContainerExpanded((prev) => !prev)} isExpanded={isContainerExpanded}>
        <RowBetween>
          <Row gap="10px">
            <IconContainer>
              <Image unoptimized={true} src={BookOutline} alt="book" />
            </IconContainer>

            <Label size="14px">Getting started</Label>
          </Row>
          <MinimizeButton>
            <ExpandArrow isExpanded={isContainerExpanded} />
          </MinimizeButton>
        </RowBetween>
      </HeaderContainer>

      {isContainerExpanded ? (
        <ColumnCenter>
          <Row gap="13px">
            <StepContainer
              onClick={() => setSelectedStep('1')}
              onMouseEnter={() => setHoveredStep('1')}
              onMouseLeave={() => setHoveredStep('')}
            >
              {completedSteps[0] === true && hoveredStep !== '1' ? (
                <Image unoptimized={true} src={CompleteTask} alt="icon" width={14} />
              ) : (
                <OnboardingWallet isSelected={selectedStep === '1' || hoveredStep === '1'} />
              )}
            </StepContainer>
            <StepContainer
              onClick={() => setSelectedStep('2')}
              onMouseEnter={() => setHoveredStep('2')}
              onMouseLeave={() => setHoveredStep('')}
            >
              {completedSteps[1] === true && hoveredStep !== '2' ? (
                <Image unoptimized={true} src={CompleteTask} alt="icon" width={14} />
              ) : (
                <OnboardingUser isSelected={selectedStep === '2' || hoveredStep === '2'} />
              )}
            </StepContainer>
            <StepContainer
              onClick={() => setSelectedStep('3')}
              onMouseEnter={() => setHoveredStep('3')}
              onMouseLeave={() => setHoveredStep('')}
            >
              {completedSteps[2] === true && hoveredStep !== '3' ? (
                <Image unoptimized={true} src={CompleteTask} alt="icon" width={14} />
              ) : (
                <OnboardingMoney isSelected={selectedStep === '3' || hoveredStep === '3'} />
              )}
            </StepContainer>
            <StepContainer
              onClick={() => setSelectedStep('4')}
              onMouseEnter={() => setHoveredStep('4')}
              onMouseLeave={() => setHoveredStep('')}
            >
              {completedSteps[3] === true && hoveredStep !== '4' ? (
                <Image unoptimized={true} src={CompleteTask} alt="icon" width={14} />
              ) : (
                <OnboardingChart isSelected={selectedStep === '4' || hoveredStep === '4'} />
              )}
            </StepContainer>
            <StepContainer
              onClick={() => setSelectedStep('5')}
              onMouseEnter={() => setHoveredStep('5')}
              onMouseLeave={() => setHoveredStep('')}
            >
              {completedSteps[4] === true && hoveredStep !== '5' ? (
                <Image unoptimized={true} src={CompleteTask} alt="icon" width={14} />
              ) : (
                <OnboardingNotification isSelected={selectedStep === '5' || hoveredStep === '5'} />
              )}
            </StepContainer>
          </Row>
          {getStepContent(selectedStep)}
          <DismissButton onClick={hideOnboardingModal}>
            <Label size="10px" reducedOpacity>
              Don&apos;t show me this again
            </Label>
          </DismissButton>
        </ColumnCenter>
      ) : null}
    </Wrapper>
  )
}
