import React from 'react'
import styled, { useTheme } from 'styled-components'
import { AlertTriangle } from 'react-feather'
import { Currency } from '@uniswap/sdk-core'

import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'

import { ExplorerDataType } from 'utils/explorers'

import { Modal, ModalHeader } from 'components/Modal'
import { ConfirmationAnimation, CheckMark } from 'components/Icons'
import { PrimaryButton } from 'components/Button'
import { ExplorerLink } from 'components/Link'
import useAddTokenToWallet from 'lib/hooks/useAddTokenToWallet'
import { ApplicationConnectionStatus } from 'state/application/reducer'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
`

const PendingWrapper = styled(Wrapper)`
  align-items: center;
  text-align: center;
  & > * {
    margin-bottom: 1rem;
    &:last-child {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.text2};
      margin-top: 1rem;
    }
  }
`

const ErrorWrapper = styled(Wrapper)`
  gap: 1.25rem;
  align-items: center;
  text-align: center;
  margin: 1.25rem;
  font-size: 0.9rem;

  & > * {
    &:nth-child(2) {
      color: ${({ theme }) => theme.red1};
    }
  }
`

const SuccessWrapper = styled(Wrapper)`
  gap: 1.25rem;
  align-items: center;
  text-align: center;
  margin: 1.25rem;
  font-size: 1.2rem;

  & > * {
    &:nth-child(2) {
      font-weight: bold;
    }
    &:nth-child(3) {
      color: ${({ theme }) => theme.blue1};
      font-size: 1rem;
    }
  }
`

// The tx confirmation modal, relies on ConfirmationContent embedded as `content`
export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  summary,
  currencyToAdd,
  content,
}: {
  isOpen: boolean
  onDismiss: () => void
  attemptingTxn: boolean
  hash?: string
  summary: string
  currencyToAdd?: Currency
  content: React.ReactNode
}) {
  const { chainId } = useActiveConnectionDetails()
  if (!chainId) return null

  return (
    <Modal isOpen={isOpen} onBackgroundClick={onDismiss} onEscapeKeydown={onDismiss}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} summary={summary} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content
      )}
    </Modal>
  )
}

/**
 * Content to display in the TransactionConfirmationModal
 * @param title title for the ModalHeader
 * @param mainContent Any of the components within the TransactionConfirmationModal directory
 * @param bottomContent Callback button of some sort
 */
export function ConfirmationContent({
  title,
  onDismiss,
  mainContent,
  bottomContent,
}: {
  title: string
  onDismiss: () => void
  mainContent?: (() => React.ReactNode) | React.ReactNode
  bottomContent?: (() => React.ReactNode) | React.ReactNode
}) {
  return (
    <Wrapper>
      <ModalHeader title={title} onClose={onDismiss} />
      {typeof mainContent === 'function' ? mainContent() : mainContent}
      {typeof bottomContent === 'function' ? bottomContent() : bottomContent}
    </Wrapper>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const theme = useTheme()
  return (
    <div>
      <ModalHeader title="Error" onClose={onDismiss} />
      <ErrorWrapper>
        <AlertTriangle size="80px" color={theme.red1} />
        <div>{message}</div>
        <PrimaryButton onClick={onDismiss}>Dismiss</PrimaryButton>
      </ErrorWrapper>
    </div>
  )
}

// User needs to confirm the transaction in their wallet
function ConfirmationPendingContent({ onDismiss, summary }: { onDismiss: () => void; summary: string }) {
  const { applicationConnectionStatus } = useActiveConnectionDetails()
  return (
    <div>
      <ModalHeader title=" " onClose={onDismiss} />
      <PendingWrapper>
        <ConfirmationAnimation size="80px" />
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Waiting for Confirmation</div>
        <div>{summary}</div>
        <div>
          {applicationConnectionStatus === ApplicationConnectionStatus.ACCOUNT_ABSTRACTION
            ? 'Confirming transaction'
            : 'Confirm this transaction in your wallet'}
        </div>
      </PendingWrapper>
    </div>
  )
}

// Transaction is submitted by the user
function TransactionSubmittedContent({
  chainId,
  hash,
  onDismiss,
  currencyToAdd,
}: {
  chainId: number
  hash: string
  onDismiss: () => void
  currencyToAdd?: Currency | undefined
}) {
  const { addToken, success } = useAddTokenToWallet(currencyToAdd)

  return (
    <div>
      <ModalHeader title=" " onClose={onDismiss} />
      <SuccessWrapper>
        <CheckMark size={80} />
        <div>Transaction Submitted</div>
        <ExplorerLink chainId={chainId} type={ExplorerDataType.TRANSACTION} value={hash}>
          View on Explorer
        </ExplorerLink>
        {currencyToAdd && addToken && (
          <PrimaryButton onClick={!success ? addToken : onDismiss}>
            Add {currencyToAdd.symbol} to Metamask
          </PrimaryButton>
        )}
      </SuccessWrapper>
    </div>
  )
}
