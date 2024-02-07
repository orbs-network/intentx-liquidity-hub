import {
  AddAccountSummary,
  ApproveSummary,
  CancelQuoteSummary,
  ForceCloseSummary,
  MintSummary,
  Summary,
  TradeSummary,
  TransferBalanceSummary,
} from 'components/TransactionItem'
import { TransactionInfo, TransactionType } from 'state/transactions/types'

export default function TransactionSummary({
  info,
  summary,
  status,
}: {
  info: TransactionInfo | undefined
  summary: string | undefined
  status?: string
}): JSX.Element | null {
  if (summary) {
    return <Summary>{summary}</Summary>
  }
  if (!info) {
    return <Summary>Unknown</Summary>
  }

  switch (info.type) {
    case TransactionType.APPROVAL:
      return <ApproveSummary info={info} status={status} />
    case TransactionType.TRADE:
      return <TradeSummary info={info} status={status} />
      {
        // Need to hide trade summary with pretty notifications
      } // We don't want to show the trade summary
      return <></>
    case TransactionType.CANCEL:
      return <CancelQuoteSummary info={info} status={status} />
    case TransactionType.ADD_ACCOUNT:
      return <AddAccountSummary info={info} status={status} />
    case TransactionType.TRANSFER_COLLATERAL:
      return <TransferBalanceSummary info={info} status={status} />
    case TransactionType.MINT:
      return <MintSummary info={info} status={status} />
    case TransactionType.FORCE_CLOSE:
      return <ForceCloseSummary info={info} status={status} />
  }
}
