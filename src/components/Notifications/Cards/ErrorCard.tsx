import React from 'react'
import styled, { useTheme } from 'styled-components'

import HEDGER_ALERT_ICON from '/public/static/images/etc/warning-circle.svg'
import { Account } from 'types/user'
import { Quote } from 'types/quote'

import { NotificationDetails } from 'state/notifications/types'

import { useErrorMessage, useMarket } from 'hooks/useMarkets'

import { PartiallyFillTitle } from './styles'
import BaseItem from 'components/Notifications/Cards/BaseCard'
import ShimmerAnimation from 'components/ShimmerAnimation'

const ErrorMessage = styled.div`
  font-size: 12px;
  font-weight: 400;
  display: flex;
  gap: 5px;
  & > * {
    &:first-child {
      margin-bottom: 4px;
      color: ${({ theme }) => theme.primaryDark};
    }
    &:last-child {
      color: ${({ theme }) => theme.text0};
    }
  }
`

export default function ErrorCard({
  notification,
  account,
  quote,
  loading,
}: {
  notification: NotificationDetails
  account: Account
  quote?: Quote
  loading?: boolean
}): JSX.Element {
  const theme = useTheme()
  const { symbol, asset } = useMarket(quote?.marketId) || {}
  const { modifyTime, quoteId, errorCode } = notification
  const errorMessage = useErrorMessage(errorCode)

  return (
    <BaseItem
      title={
        <PartiallyFillTitle>
          {loading ? (
            <ShimmerAnimation width={'55px'} height={'14px'} />
          ) : (
            <div>
              {symbol}-{asset}{' '}
            </div>
          )}
          <div> - Q{quoteId}</div>
        </PartiallyFillTitle>
      }
      text={
        <ErrorMessage>
          <div>Hedger (Rasa Capital):</div>
          <div>{errorMessage ?? 'Hedger Error'}</div>
        </ErrorMessage>
      }
      icon={HEDGER_ALERT_ICON}
      timestamp={modifyTime}
      loading={loading}
      accountName={account.name}
      bg={theme.bgWarning}
      border={theme.warning}
    />
  )
}
