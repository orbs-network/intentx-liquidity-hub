import DepositToFuturesModal from 'components/Modals/DepositToFuturesModal'
import WithdrawModal from 'components/Modals/WithdrawModal'
import { useModalOpen } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'

export default function CommonModals() {
  const showDepositModal = useModalOpen(ApplicationModal.DEPOSIT)
  const showWithdrawModal = useModalOpen(ApplicationModal.WITHDRAW)
  return (
    <>
      {showDepositModal && <DepositToFuturesModal />}
      {showWithdrawModal && <WithdrawModal />}
    </>
  )
}
