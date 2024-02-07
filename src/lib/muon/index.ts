import { ForceCloseQuotesClient } from './client/close'
import { DeallocateClient } from './client/deallocate'
import { QuotesClient } from './client/quotes'

import { WEB_SETTING } from 'config'

export const SendOrCloseQuoteClient = QuotesClient.createInstance(WEB_SETTING.muonEnabled)
export const DeallocateCollateralClient = DeallocateClient.createInstance(WEB_SETTING.muonEnabled)
export const ForceCloseClient = ForceCloseQuotesClient.createInstance(WEB_SETTING.muonEnabled)
