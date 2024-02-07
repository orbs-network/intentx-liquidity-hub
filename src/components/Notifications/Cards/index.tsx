import React from 'react'

import { Quote } from 'types/quote'

import { useActiveAccount } from 'state/user/hooks'
import { NotificationDetails, NotificationType } from 'state/notifications/types'
import { useGetExistedQuoteByIdsCallback } from 'state/quotes/hooks'

import { useGetQuoteByIds } from 'hooks/useQuotes'
import TransferCollateral from './TransferCollateralCard'
import LiquidationAlert from './LiquidationAlertCard'
import PartiallyFill from './PartialFillCard'
import SeenByHedger from './SeenCard'
import SuccessQuote from './SuccessQuoteCard'
import HedgerError from './ErrorCard'
import Default from './DefaultCard'
import PushCard from './PushCard'

export default function Cards({ notification }: { notification: NotificationDetails }) {
  // TODO:handling state when user account didn't selected
  const { quoteId, notificationType } = notification
  const activeAccount = useActiveAccount()
  const existedQuoteCallback = useGetExistedQuoteByIdsCallback()
  const existedQuote = existedQuoteCallback(quoteId)
  const { quotes, loading } = useGetQuoteByIds([Number(quoteId)])
  const quoteData = existedQuote ? existedQuote : !loading ? quotes[0] : ({} as Quote)

  if (!activeAccount) return <></>

  switch (notificationType) {
    case NotificationType.TRANSFER_COLLATERAL:
      return <TransferCollateral notification={notification} account={activeAccount} />

    case NotificationType.LIQUIDATION_ALERT:
      return <LiquidationAlert notification={notification} account={activeAccount} loading={loading} />

    case NotificationType.PARTIAL_FILL:
      return <PartiallyFill notification={notification} account={activeAccount} quote={quoteData} loading={loading} />

    case NotificationType.SEEN_BY_HEDGER:
      return <SeenByHedger notification={notification} account={activeAccount} quote={quoteData} loading={loading} />

    case NotificationType.SUCCESS:
      return <SuccessQuote notification={notification} account={activeAccount} quote={quoteData} loading={loading} />

    case NotificationType.HEDGER_ERROR:
      return <HedgerError notification={notification} account={activeAccount} quote={quoteData} loading={loading} />

    case NotificationType.PUSH:
      return <PushCard notification={notification} account={activeAccount} />
    case NotificationType.OTHER:
      return <></>

    default:
      return <Default notification={notification} account={activeAccount} quote={quoteData} loading={loading} />
  }
}
