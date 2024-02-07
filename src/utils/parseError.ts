function getErrorState(error: any): string | undefined {
  let reason: string | undefined
  let message: string | undefined

  //rejected tx from the wallet
  if (error?.code === 4001) {
    return 'Transaction rejected'
  }

  while (Boolean(error)) {
    reason = error.reason ?? error.message ?? reason
    message = error.data?.message ?? message
    error = error.error ?? error.data?.originalError
  }
  reason = message ?? reason
  if (reason?.indexOf('execution reverted: ') === 0) reason = reason.substr('execution reverted: '.length)
  return reason
}

export function DefaultHandlerError(error: any): string | null {
  const reason = getErrorState(error)
  return `${reason ? `"${reason}"` : ''}.`
}

export function DefaultHandlerWagmiError(error: any) {
  const regex = /ContractFunctionExecutionError:\s(.+)$/m
  const match = error.match(regex)

  if (match) {
    const errorMessage = match[1]
    console.log(errorMessage)
  } else {
    console.log('Error message not found')
  }
}
