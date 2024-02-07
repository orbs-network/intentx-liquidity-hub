import { useCallback, useState } from 'react'

import { COLLATERAL_TOKEN } from 'constants/tokens'
import { TransferTab } from 'types/transfer'
import { formatPrice } from 'utils/numbers'
import { getTokenWithFallbackChainId } from 'utils/token'

import { useAccountPartyAStat, useActiveAccountAddress } from 'state/user/hooks'

import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'

import useCombinedTransferCollateral from 'callbacks/combined/useCombinedTransferCollateral'
import { PrimaryButton } from 'components/Button'
import { DotFlashing } from 'components/Icons'
import { useIsLaptop, useIsMobile } from 'lib/hooks/useWindowSize'

export function CancelWithdraw() {
  const isMobile = useIsMobile()
  const isLaptop = useIsLaptop()
  const { chainId } = useActiveConnectionDetails()

  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const activeAccountAddress = useActiveAccountAddress()
  const { accountBalance } = useAccountPartyAStat(activeAccountAddress)
  const collateralCurrency = getTokenWithFallbackChainId(COLLATERAL_TOKEN, chainId)

  const { callback: transferBalanceCallback } = useCombinedTransferCollateral(
    formatPrice(accountBalance, collateralCurrency?.decimals),
    TransferTab.ALLOCATE
  )
  const handleAction = useCallback(async () => {
    if (!transferBalanceCallback) {
      return
    }

    try {
      setAwaitingConfirmation(true)
      await transferBalanceCallback()
      setAwaitingConfirmation(false)
    } catch (e) {
      setAwaitingConfirmation(false)
      if (e instanceof Error) {
        console.log('setAwaitingConfirmation', e.message)
      } else {
        console.error(e)
      }
    }
  }, [transferBalanceCallback])

  if (awaitingConfirmation) {
    return (
      <PrimaryButton disabled={true} height={isMobile || isLaptop ? '35px' : '45px'} width={isMobile ? '60px' : '100%'}>
        Cancel
        <DotFlashing />
      </PrimaryButton>
    )
  }
  return (
    <PrimaryButton
      height={isMobile || isLaptop ? '35px' : '45px'}
      width={isMobile ? '60px' : '100%'}
      onClick={handleAction}
    >
      Cancel
    </PrimaryButton>
  )
}
