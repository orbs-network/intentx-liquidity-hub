import { createReducer } from '@reduxjs/toolkit'
import find from 'lodash/find'
import unionBy from 'lodash/unionBy'

import { Quote } from 'types/quote'
import { QuotesState } from './types'

import { ApiState } from 'types/api'
import {
  addPending,
  addPosition,
  addQuote,
  addQuoteToHistory,
  removePosition,
  removeQuote,
  setExportData,
  setHistory,
  setPendings,
  setPositions,
  setQuoteDetail,
} from './actions'
import { getFundingRateHistory, getHistory } from './thunks'

export const initialState: QuotesState = {
  history: {},
  pendings: [],
  positions: [],
  listeners: [],

  quoteDetail: null,
  historyState: ApiState.LOADING,

  fundingRateHistory: [],
  fundingRateHistoryState: ApiState.LOADING,

  hasMoreHistory: false,
  exportData: '',
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(addQuote, (state, { payload: { id } }) => {
      if (state.listeners.includes(id)) {
        console.debug('Attempted to add an existing quote id to listeners.', id)
        return
      }
      const listeners = state.listeners
      listeners.push(id)
      state.listeners = listeners
    })

    .addCase(setPendings, (state, { payload: { quotes } }) => {
      state.pendings = quotes
    })

    .addCase(addPending, (state, { payload: { quote } }) => {
      const pendings = state.pendings as unknown as Quote[]

      if (find(pendings, { id: quote.id, quoteStatus: quote.quoteStatus })) {
        console.debug('Attempted to add an existing pending.', quote.id)
        return
      }

      pendings.push(quote)
      state.pendings = pendings
    })

    .addCase(setPositions, (state, { payload: { quotes } }) => {
      // state.positions = [...quotes, ...generateMockQuotesForForceClose()]
      state.positions = [...quotes]
    })

    .addCase(addPosition, (state, { payload: { quote } }) => {
      const positions = state.positions as unknown as Quote[]

      if (find(positions, { id: quote.id })) {
        const newQuotes = positions.filter((q) => q.id !== quote.id)
        newQuotes.push(quote)
        console.debug('Attempted to add an existing positing.', quote.id, positions, newQuotes)
        state.positions = newQuotes
        return
      }

      positions.push(quote)
      state.positions = positions
    })

    .addCase(setHistory, (state, { payload: { quotes, chainId } }) => {
      state.history[chainId] = quotes
    })

    .addCase(removePosition, (state, { payload: { quote } }) => {
      const positions = state.positions as unknown as Quote[]

      if (!find(positions, { id: quote.id })) {
        return
      }

      state.positions = positions.filter((q) => q.id !== quote.id)
    })
    .addCase(removeQuote, (state, { payload: { id } }) => {
      if (!state.listeners.includes(id)) {
        return
      }
      const quotes = state.listeners
      state.listeners = quotes.filter((qid) => qid !== id)
    })

    .addCase(addQuoteToHistory, (state, { payload: { quote, chainId } }) => {
      const history = (state.history[chainId] as unknown as Quote[]) ?? []

      if (find(history, { id: quote.id })) {
        console.debug('Attempted to add an existing quote id to history.', quote.id)
        return
      }

      history.push(quote)

      // Resortening the history
      history.sort((a, b) => {
        return b.statusModifyTimestamp - a.statusModifyTimestamp
      })
      state.history[chainId] = history
    })

    .addCase(setQuoteDetail, (state, { payload: { quote } }) => {
      state.quoteDetail = quote
    })

    .addCase(setExportData, (state, { payload: { data } }) => {
      state.exportData = data
    })

    .addCase(getHistory.pending, (state) => {
      state.historyState = ApiState.LOADING
    })

    .addCase(getHistory.fulfilled, (state, { payload: { quotes, hasMore, chainId } }) => {
      // state.history = unionBy(state.history, quotes, 'id')
      if (quotes && chainId) {
        const history = state.history[chainId]
        state.hasMoreHistory = hasMore
        state.history[chainId] = unionBy(history, quotes, 'id')
        state.historyState = ApiState.OK
      }
    })

    .addCase(getHistory.rejected, (state) => {
      state.historyState = ApiState.ERROR
      console.error('Unable to fetch from The Graph Network')
    })

    .addCase(getFundingRateHistory.pending, (state) => {
      state.fundingRateHistoryState = ApiState.LOADING
    })
    .addCase(getFundingRateHistory.fulfilled, (state, { payload: { fundingRateHistory } }) => {
      if (fundingRateHistory) {
        state.fundingRateHistory = fundingRateHistory
        state.fundingRateHistoryState = ApiState.OK
      }
    })
    .addCase(getFundingRateHistory.rejected, (state) => {
      state.fundingRateHistoryState = ApiState.ERROR
      console.error('Unable to fetch from The Graph Network')
    })
)
