import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import { PrimaryButton } from 'components/Button'

const MainButton = styled(PrimaryButton).attrs({
  height: '10px',
})<{ active: boolean }>`
  font-size: 12px !important;
  overflow: unset;
  z-index: 0;

  border: double 1px transparent;
  border-radius: 5px;
  background-image: ${({ theme }) => theme.gradCustomBg}, ${({ theme }) => theme.gradCustom1};
  background-origin: border-box;
  background-clip: padding-box, border-box;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 8px;
`}
`

const MobileButton = styled(MainButton)`
  background: ${({ theme }) => theme.bg10}80;
  justify-content: flex-start;
  gap: 4px;
  padding: 10px 15px;
  height: 45px;
`

export default function MenuButton({
  isMobile,
  children,
  onDismiss,
  onMouseEnter,
  onMouseLeave,
}: {
  isMobile?: boolean
  children: React.ReactNode | string
  onDismiss: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const router = useRouter()
  const isActive = false

  const onClick = useCallback(() => {
    //router.push(`/trade/${option}`)

    onDismiss()
  }, [router, onDismiss])

  if (isMobile) {
    return (
      <MobileButton active={isActive} onClick={onClick} onMouseOver={onMouseEnter} onMouseLeave={onMouseLeave}>
        {children}
      </MobileButton>
    )
  }

  return (
    <MainButton active={isActive} onClick={onClick}>
      {children}
    </MainButton>
  )
}
