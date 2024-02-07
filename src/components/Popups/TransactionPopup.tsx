import React from 'react'
import styled, { useTheme } from 'styled-components'

import DEPOSIT_USDT_ICON from '/public/static/images/etc/DepositUSDTPopUp.svg'
import WITHDRAW_USDT_ICON from '/public/static/images/etc/WithdrawUSDTPopUp.svg'
import DEPOSIT_USDC_ICON from '/public/static/images/etc/DepositUSDCPopUp.svg'
import WITHDRAW_USDC_ICON from '/public/static/images/etc/WithdrawUSDCPopUp.svg'

import { TransferTab } from 'types/transfer'
import { ExplorerDataType } from 'utils/explorers'
import { FALLBACK_CHAIN_ID, SupportedChainId } from 'constants/chains'

import { useTransaction } from 'state/transactions/hooks'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'

import TransactionSummary from 'components/Summaries/TransactionSummary '
import { ExplorerLink } from 'components/Link'
import { Row, RowStart } from 'components/Row'
import { CheckMark, Close } from 'components/Icons'
import ImageWithFallback from 'components/ImageWithFallback'

import LinkIconGradient from 'components/Icons/LinkIconGradient'

const Wrapper = styled(Row)``

const Text = styled(RowStart)`
  font-size: 14px;
  line-height: normal;
  color: ${({ theme }) => theme.text0};
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 3px;
`

const LinkText = styled.div`
  background: ${({ theme }) => theme.gradCustom4};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const { chainId } = useActiveConnectionDetails()
  const tx = useTransaction(hash)
  const status = success ? 'submitted' : 'failed'

  return (
    <Wrapper>
      <Text>
        <TransactionSummary info={tx?.info} summary={summary} status={status} />
        <ExplorerLink
          chainId={chainId ?? FALLBACK_CHAIN_ID}
          type={ExplorerDataType.TRANSACTION}
          value={hash}
          style={{
            height: '100%',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
          }}
        >
          <LinkText>View on Explorer</LinkText>
          {/* <LinkIconGradient /> */}
        </ExplorerLink>
      </Text>
    </Wrapper>
  )
}

export function TransactionPopupIcons({ hash, success }: { hash: string; success?: boolean }) {
  const { chainId } = useActiveConnectionDetails()
  const theme = useTheme()
  const tx = useTransaction(hash)
  const transferType = (() => {
    if (tx?.info && 'transferType' in tx.info) {
      if (tx.info.transferType === TransferTab.DEALLOCATE || tx.info.transferType === TransferTab.WITHDRAW) {
        return chainId === SupportedChainId.FANTOM ? WITHDRAW_USDC_ICON : WITHDRAW_USDT_ICON
      }
      return chainId === SupportedChainId.FANTOM ? DEPOSIT_USDC_ICON : DEPOSIT_USDT_ICON
    }
    return undefined
  })()

  return transferType ? (
    <ImageWithFallback src={transferType} width={46} height={24} alt={`transfer-type`} />
  ) : success ? (
    <CheckMark color={theme.red} size={14} />
  ) : (
    <Close color={theme.red} size={14} />
  )
}
