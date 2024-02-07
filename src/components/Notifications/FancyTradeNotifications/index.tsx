import ProcessingTradeNotification, {
  ProcessingTradeNotificationStatus,
} from 'components/Modals/ProcessingTradeNotification'
import { TRANSACTION_SOFT_FAIL_SECONDS } from 'constants/misc'
import { useQuoteFillAmount } from 'hooks/useQuotes'
import useDebounce from 'lib/hooks/useDebounce'
import { FadeInDiv } from 'pages/trade/[symbol]'
import { useEffect, useState } from 'react'
import { useMarkets, useMarketsIdMap, useMarketsInfo } from 'state/hedger/hooks'
import { usePendingsQuotes, usePositionsQuotes, useQuoteDetail } from 'state/quotes/hooks'
import { ApiState } from 'types/api'
import { Quote, QuoteStatus } from 'types/quote'

export default function FancyTradeNotifications() {
  const [processingQuotes, setProcessingQuotes] = useState<{
    [quoteId: string]: Quote
  }>({})

  const pendingQuotes = usePendingsQuotes()
  const openedPositions = usePositionsQuotes()

  const debouncedPendingQuotes = useDebounce(pendingQuotes, 3000)
  const debouncedOpenedPositions = useDebounce(openedPositions, 3000)

  useEffect(() => {
    if (pendingQuotes.state !== ApiState.OK) {
      return
    }
    if (openedPositions.state !== ApiState.OK) {
      return
    }

    // Updating processingQuotes
    const processingQuotesCopy = { ...processingQuotes }
    let changesHappened = false

    pendingQuotes.quotes.forEach((quote) => {
      const existingQuote = processingQuotesCopy[quote.id]
      if ((existingQuote && existingQuote.quoteStatus !== quote.quoteStatus) || !existingQuote) {
        // Making sure that the quote is not soft failed
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const isSoftFailed =
          quote.quoteStatus === QuoteStatus.PENDING &&
          quote.createTimestamp + TRANSACTION_SOFT_FAIL_SECONDS < currentTimestamp

        // Not processing soft failed transactions
        if (!isSoftFailed) {
          changesHappened = true
          processingQuotesCopy[quote.id] = quote
        }
      }
    })

    if (changesHappened) setProcessingQuotes(processingQuotesCopy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuotes, openedPositions])

  useEffect(() => {
    // When a position is opened, finding if it exists on the processing quotes array and setting it to filled
    let changesHappened = false
    const processingQuotesCopy = { ...processingQuotes }
    openedPositions.quotes.forEach((quote) => {
      if (processingQuotesCopy[quote.id]) {
        changesHappened = true
        processingQuotesCopy[quote.id] = quote
      }
    })
  }, [openedPositions, processingQuotes])

  useEffect(() => {
    // Removing opened transactions after a little delay
    let changesHappened = false
    const processingQuotesCopy = { ...processingQuotes }
    debouncedOpenedPositions.quotes.forEach((quote) => {
      if (processingQuotesCopy[quote.id]) {
        changesHappened = true
        delete processingQuotesCopy[quote.id]
      }
    })
    if (changesHappened) setProcessingQuotes(processingQuotesCopy)
  }, [debouncedOpenedPositions, processingQuotes])

  useEffect(() => {
    console.log('Processing quotes ', processingQuotes)
  }, [processingQuotes])

  return (
    <FadeInDiv>
      {Object.keys(processingQuotes).map((quote, key) => {
        return <ProcessingTradeNotification key={key} quote={processingQuotes[quote]} />
      })}
    </FadeInDiv>
  )
}
