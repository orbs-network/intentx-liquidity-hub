import { createAction } from '@reduxjs/toolkit'

export const updateSelectedEpochDateForLeaderboard = createAction<{
  date: number
}>('tradingIncentives/updateSelectedEpochForLeaderboard') // Compare this snippet from src/state/transactions/actions.ts:
