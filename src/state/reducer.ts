import { combineReducers } from '@reduxjs/toolkit'

import application from './application/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'
import wallets from './wallet/reducer'
import hedger from './hedger/reducer'
import trade from './trade/reducer'
import notifications from './notifications/reducer'
import quotes from './quotes/reducer'
import analytics from './analytics/reducer'
import referrals from './referrals/reducer'
import tradingIncentives from "./tradingIncentives/reducer"

const reducer = combineReducers({
  application,
  transactions,
  user,
  wallets,
  hedger,
  trade,
  notifications,
  quotes,
  analytics,
  referrals,
  tradingIncentives
})

export default reducer
