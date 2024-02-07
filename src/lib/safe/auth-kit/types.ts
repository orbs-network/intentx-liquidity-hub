export type AuthKitSignInData =
  | {
      eoa: string
      safes?: string[]
      session?: boolean
    }
  | {
      eoa: undefined
      safes?: string[]
      session: false
    }
