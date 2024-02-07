import { useCallback, useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { animated } from 'react-spring'
import { useSpring } from '@react-spring/web'

import { PopupContent } from 'state/application/reducer'
import { useRemovePopup } from 'state/application/hooks'
import { getFromNow } from 'utils/time'

import TransactionPopup, { TransactionPopupIcons } from './TransactionPopup'
import NotificationPopup, { NotificationPopupIcons } from './NotificationPopup'

import BellOutline from 'components/Icons/BellOutline'

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  position: relative;
  width: 288px;
  margin-bottom: 20px;
  background: ${({ theme }) => theme.bg10};
  border-radius: 5px;
  box-shadow: 0px 10px 15px 0px #00000014;
  text-align: right;
  font-weight: 400;
`

const Content = styled.div`
  overflow: hidden;
  padding: 10px 17px;
  position: relative;
  width: 100%;
  border-radius: 0 0 0 5px;
`

const Lateral = styled.div`
  width: 32px;
  flex-shrink: 0;
  border-radius: 5px;
  background: ${({ theme }) => theme.bg};
  padding: 3px 8px 3px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
`

const LateralIcon = styled.div`
  width: 27px;
  height: 27px;
  border-radius: 5px;
  background: ${({ theme }) => theme.gradCustom1};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`

const CreatedAgo = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.white};
  opacity: 0.5;
  line-height: normal;
  margin-top: 3px;
`

const Fader = styled.div<{
  success: boolean
}>`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.primary1};
`

const AnimatedFader = animated(Fader)

export default function PopupItem({
  removeAfterMs,
  content,
  popKey,
}: {
  removeAfterMs: number | null
  content: PopupContent
  popKey: string
}) {
  const theme = useTheme()
  const removePopup = useRemovePopup()
  const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])
  const [createdAt, setCreatedAt] = useState(Date.now())
  const [createdAgo, setCreatedAgo] = useState('')

  const handleCreatedAgo = () => {
    setCreatedAgo(getFromNow(createdAt))
  }

  useEffect(() => {
    if (removeAfterMs === null) return undefined

    const timeout = setTimeout(() => {
      removeThisPopup()
    }, removeAfterMs)

    return () => {
      clearTimeout(timeout)
    }
  }, [removeAfterMs, removeThisPopup])

  useEffect(() => {
    handleCreatedAgo()

    const interval = setInterval(() => {
      handleCreatedAgo()
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [createdAt])

  const faderStyle = useSpring({
    from: { width: '100%' },
    to: { width: '0%' },
    config: { duration: removeAfterMs ?? undefined },
  })

  function getPopupContent(): JSX.Element | null {
    if ('txn' in content) {
      const {
        txn: { hash, summary, success },
      } = content
      return <TransactionPopup hash={hash} success={success} summary={summary} />
    } else if ('quoteId' in content) {
      return <NotificationPopup content={content} />
      // return null
    } else {
      return null
    }
  }

  function getPopupIcons(): JSX.Element | null {
    if ('txn' in content) {
      const {
        txn: { hash, success },
      } = content
      return <TransactionPopupIcons hash={hash} success={success} />
    } else if ('quoteId' in content) {
      return <NotificationPopupIcons content={content} />
    } else {
      return null
    }
  }

  /* Fix to not show opening trade popups */
  /* if ('quoteId' in content && content.lastSeenAction === 'SendQuote') {
    return <></>
  } */

  return (
    <Wrapper>
      <Content>
        {getPopupContent()}
        <CreatedAgo>{createdAgo}</CreatedAgo>
        {removeAfterMs !== null ? <AnimatedFader style={faderStyle} /> : null}
      </Content>

      <Lateral>
        <LateralIcon>
          <BellOutline />
        </LateralIcon>
        {getPopupIcons()}
      </Lateral>
    </Wrapper>
  )
}
