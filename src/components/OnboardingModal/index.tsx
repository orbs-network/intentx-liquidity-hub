import { useConnectModal } from '@rainbow-me/rainbowkit'
import { SecondaryButton } from 'components/Button'
import ExpandArrow from 'components/Icons/ExpandArrow'
import CreateAccountModal from 'components/Modals/CreateAccountModal'
import { Row, RowBetween } from 'components/Row'
import { useIsLaptop } from 'lib/hooks/useWindowSize'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  useApplicationConnectionStatus,
  useConnectionModalToggle,
  useDepositModalToggle,
  useToggleModal,
} from 'state/application/hooks'
import { ApplicationConnectionStatus, ApplicationModal } from 'state/application/reducer'
import { useHistoryQuotes, usePendingsQuotes, usePositionsQuotes } from 'state/quotes/hooks'
import { useAccountPartyAStat, useActiveAccount } from 'state/user/hooks'
import styled from 'styled-components'
import { Z_INDEX } from 'theme'
import CompleteTask from '/public/static/images/etc/complete-step.svg'

const Wrapper = styled.div`
  width: 290px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bg4};
  border-radius: 10px;
  padding: 8px;
  gap: 10px;
  z-index: ${Z_INDEX.offcanvas};
  position: fixed;
  bottom: 10px;
  left: 10px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 240px;
  border-radius: 8px;
  padding: 6px;
  gap: 8px;
  bottom: 8px;
  left: 8px;
  `}

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 180px;
    margin-bottom: 60px;
  `}
`

const Label = styled.span<{ size?: string; weight?: string; reducedOpacity?: boolean }>`
  font-weight: ${({ weight }) => (weight ? weight : '500')};
  font-size: ${({ size }) => (size ? size : '12px')};
  color: ${({ theme }) => theme.white};
  max-width: 240px;
  text-align: left;
  opacity: ${({ reducedOpacity }) => (reducedOpacity ? '0.5' : '1')};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 10px;
  max-width: 180px; 
  `}
`

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  padding: 8px;
  gap: 8px;
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 6px;
  gap: 6px;
  `}
`

const StepsCount = styled.div`
  display: flex;
  width: 100%;
  height: 10px;
  border-radius: 10px;
  overflow: hidden;
  gap: 4px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  height: 8px;
  border-radius: 8px;
  gap: 2px;
  `}
`

const StepElement = styled.div<{ isComplete?: boolean }>`
  width: 100%;
  background: ${({ theme, isComplete }) => (isComplete ? theme.gradCustom1 : theme.bg6)};
  height: 100%;
`

const OnboardElementsContainer = styled.div`
  background: ${({ theme }) => theme.bg9};
  border-radius: 5px;
  padding: 8px 12px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  border-radius: 4px;
  padding: 6px 8px;
  gap: 6px;
  `}
`

const ElementContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ElementHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
`

const TickBox = styled.div`
  height: 20px;
  width: 20px;
  background: ${({ theme }) => theme.bg6};
  border-radius: 100%;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  height: 16px;
  width: 16px;
  `}
`

const ElementDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 6px;
  `}
`

const MinimizeButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const DismissButton = styled.div`
  display: flex;
  width: 100%;
  cursor: pointer;
`

const OnboardingElement = ({
  title,
  description,
  buttonLabel,
  isExpanded,
  onExpand,
  onActionCall,
  isComplete,
}: {
  title: string
  description: string
  buttonLabel: string
  isExpanded: boolean
  isComplete: boolean
  onExpand: any
  onActionCall?: any
}) => {
  const isLaptop = useIsLaptop()
  const handleExpand = (): void => {
    onExpand?.()
  }

  const handleStepAction = (): void => {
    onActionCall?.()
  }

  return (
    <ElementContainer>
      <ElementHeader onClick={handleExpand}>
        <Row gap="12px" align="center">
          {isComplete ? (
            <Image unoptimized={true} src={CompleteTask} alt="icon" width={isLaptop ? 16 : 20} />
          ) : (
            <TickBox />
          )}

          <Label reducedOpacity={isComplete}>{title}</Label>
        </Row>

        <ExpandArrow isExpanded={isExpanded} />
      </ElementHeader>
      {isExpanded ? (
        <ElementDescription>
          <Label size="11px">{description}</Label>
          <SecondaryButton width="fit-content" height="30px" onClick={handleStepAction}>
            {buttonLabel}
          </SecondaryButton>
        </ElementDescription>
      ) : null}
    </ElementContainer>
  )
}

export default function OnboardingModal() {
  const [isContainerExpanded, setIsContainerExpanded] = useState(true)

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

  if (!showModal) return
  return (
    <Wrapper>
      <CreateAccountModal isOpen={createAccountModal} onDismiss={() => setCreateAccountModal(false)} />
      <HeaderContainer onClick={() => setIsContainerExpanded((prev) => !prev)}>
        <RowBetween>
          <Label size="14px">Get started on IntentX</Label>
          <MinimizeButton>
            <ExpandArrow isExpanded={!isContainerExpanded} />
          </MinimizeButton>
        </RowBetween>
        {isContainerExpanded ? (
          <StepsCount>
            {/* Render five sections, and apply a CSS class to make them red based on the completed steps */}
            {completedSteps.map((isComplete, index) => (
              <StepElement key={index} isComplete={isComplete} />
            ))}
          </StepsCount>
        ) : null}
      </HeaderContainer>
      {isContainerExpanded ? (
        <>
          <OnboardElementsContainer>
            <OnboardingElement
              title="Connect Wallet"
              description="Click “Connect Wallet” and select your wallet type. Confirm you are on the correct network and follow the prompts to connect."
              isExpanded={expandedElement === 'connect-wallet'}
              onActionCall={loginAction}
              onExpand={
                expandedElement === 'connect-wallet'
                  ? updateExpandedElement('')
                  : updateExpandedElement('connect-wallet')
              }
              buttonLabel="Connect Wallet"
              isComplete={walletConnected}
            />
            <OnboardingElement
              title="Create an Account"
              description="Create an account post-connection. Name your account, click ”Create Account” and sign transaction"
              isExpanded={expandedElement === 'create-account'}
              onActionCall={() => {
                walletConnected ? setCreateAccountModal(true) : loginAction
              }}
              onExpand={
                expandedElement === 'create-account'
                  ? updateExpandedElement('')
                  : updateExpandedElement('create-account')
              }
              buttonLabel="Create Account"
              isComplete={accountCreated}
            />
            <OnboardingElement
              title="Deposit Funds"
              description="Click “Deposit” and enter the $USDC amount to be deposited into your account for use as collateral when trading."
              isExpanded={expandedElement === 'deposit-funds'}
              onExpand={
                expandedElement === 'deposit-funds' ? updateExpandedElement('') : updateExpandedElement('deposit-funds')
              }
              onActionCall={() => {
                if (!walletConnected) {
                  loginAction()
                } else if (walletConnected && !accountCreated) {
                  setCreateAccountModal(true)
                } else if (walletConnected && accountCreated) {
                  depositModalToggle()
                }
              }}
              buttonLabel="Deposit Now"
              isComplete={fundsDeposited}
            />
            <OnboardingElement
              title="Start Trading"
              description="You are now ready to trade! Select your desired trading asset from the dropdown menu and enter your trade details before submitting your request to trade."
              isExpanded={expandedElement === 'start-trading'}
              onExpand={
                expandedElement === 'start-trading' ? updateExpandedElement('') : updateExpandedElement('start-trading')
              }
              buttonLabel="Learn More"
              onActionCall={navigateToDocs}
              isComplete={startedTrading}
            />
            <OnboardingElement
              title="Set notification preferences"
              description="Enable notifications to receive real-time alerts."
              isExpanded={expandedElement === 'notification-preference'}
              onActionCall={() => {
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
              }}
              onExpand={
                expandedElement === 'notification-preference'
                  ? updateExpandedElement('')
                  : updateExpandedElement('notification-preference')
              }
              buttonLabel="Turn on"
              isComplete={notificationsSet}
            />
          </OnboardElementsContainer>
          <DismissButton onClick={hideOnboardingModal}>
            <Label reducedOpacity>Don&apos;t show me this again</Label>
          </DismissButton>
        </>
      ) : null}
    </Wrapper>
  )
}
