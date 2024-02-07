import useCombinedTransaction from 'hooks/useCombinedTransaction'
import { useMemo } from 'react'

export default function useCombinedExecute(target, data, value) {
  const callData = useMemo(() => {
    return {
      to: target,
      data: data,
      value: value,
    }
  }, [data, target, value])

  return useCombinedTransaction(callData, undefined, undefined)
}
