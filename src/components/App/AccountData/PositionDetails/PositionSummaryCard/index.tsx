import { Modal } from 'components/Modal'
import { Quote } from 'types/quote'

import PositionSummaryCardContent from './content'
import Image from 'next/image'
import { useState } from 'react'

interface PositionSummaryCardProps {
  open: boolean
  setOpen: (b: boolean) => any
  quote: Quote
}

export default function PositionSummaryCard({ open, setOpen, quote }: PositionSummaryCardProps) {
  return (
    <Modal
      width={'769px'}
      onBackgroundClick={() => {
        setOpen(false)
      }}
      isOpen={true}
    >
      <PositionSummaryCardContent quote={quote} width={769} />
    </Modal>
  )
}
