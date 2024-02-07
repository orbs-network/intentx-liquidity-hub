import { useCallback, useEffect } from 'react'

import { RETRY_OPTIONS_BY_CHAIN_ID, DEFAULT_RETRY_OPTIONS } from 'constants/misc'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { retry, RetryableError } from 'utils/retry'
import { Address, usePublicClient } from 'wagmi'
import { TransactionReceipt } from 'viem'
interface Transaction {
  addedTime: number
  receipt?: unknown
  lastCheckedBlockNumber?: number
}

export function shouldCheck(lastBlockNumber: number, tx: Transaction): boolean {
  if (!tx) return false
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 60_000
  if (minutesPending > 100) {
    return false
  } else if (minutesPending > 60) {
    // every 10 blocks if pending longer than an hour
    return blocksSinceCheck > 9
  } else if (minutesPending > 5) {
    // every 3 blocks if pending longer than 5 minutes
    return blocksSinceCheck > 2
  } else {
    // otherwise every block
    return true
  }
}

interface UpdaterProps {
  pendingTransactions: { [hash: string]: Transaction }
  onCheck: (tx: { chainId: number; hash: string; blockNumber: number }) => void
  onReceipt: (tx: { chainId: number; hash: string; receipt: TransactionReceipt }) => void
}

export default function Updater({ pendingTransactions, onCheck, onReceipt }: UpdaterProps): null {
  const { chainId } = useActiveConnectionDetails()
  const provider = usePublicClient()

  const lastBlockNumber = useBlockNumber()
  // const fastForwardBlockNumber = useFastForwardBlockNumber()

  const getReceipt = useCallback(
    (hash: string) => {
      if (!provider || !chainId) throw new Error('No provider or chainId')
      const retryOptions = RETRY_OPTIONS_BY_CHAIN_ID[chainId] ?? DEFAULT_RETRY_OPTIONS

      return retry(() => {
        return provider.getTransactionReceipt({ hash: hash as Address }).then((receipt) => {
          if (receipt === null) {
            //console.debug(`Retrying transaction receipt for ${hash}`)
            // console.error("Transaction receipt doesn't exist")
            throw new RetryableError()
          }
          return receipt
        })

      }, retryOptions)
    },
    [chainId, provider]
  )

  useEffect(() => {
    if (!chainId || !provider || !lastBlockNumber) return

    const cancels = Object.keys(pendingTransactions)
      .filter((hash) => shouldCheck(lastBlockNumber, pendingTransactions[hash]))
      .map((hash) => {
        const { promise, cancel } = getReceipt(hash)
        console.debug('Fetched for hash ', hash, promise, cancel)
        promise
          .then((receipt) => {
            if (receipt) {
              // fastForwardBlockNumber(Number(receipt.blockNumber))
              onReceipt({ chainId, hash, receipt })
            } else {
              onCheck({ chainId, hash, blockNumber: lastBlockNumber })
            }
          })
          .catch((error) => {
            if (!error.isCancelledError) {
              console.warn(`Failed to get transaction receipt for ${hash}`, error)
            }
          })
        return cancel
      })

    return () => {
      cancels.forEach((cancel) => cancel())
    }
  }, [chainId, provider, lastBlockNumber, getReceipt, onReceipt, onCheck, pendingTransactions])

  return null
}
