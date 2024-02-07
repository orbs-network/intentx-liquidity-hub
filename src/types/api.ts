export enum ApiState {
  OK = 'OK',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
}

export type ReferralApiResponse<T> = {
  success: boolean
  statusMessage: string
  data: T
}
