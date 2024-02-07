export const VERIFICATION_MESSAGE = (referralCode: string) => {
  const label = `I accept terms and conditions of IntentX. ${referralCode}`
  const wrapped = `\x19IntentX Signed Message:\n ${label} | ${label.length}`

  return wrapped
}
