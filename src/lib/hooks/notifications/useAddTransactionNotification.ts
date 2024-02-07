import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'

export default function useAddTransactionNotification() {
  const transactionAdder = useTransactionAdder()
  const addRecentTransaction = useAddRecentTransaction()

  return useCallback(() => {}, [])
}
