import React, { useMemo, useCallback } from 'react'
import styled from 'styled-components'

import { toBN } from 'utils/numbers'

import QuestionMark from 'components/Icons/QuestionMark'
import { ToolTip } from 'components/ToolTip'
import {
  AmountsWrapper,
  CustomOption,
  DefaultOptionButton,
  QuestionMarkWrap,
  Title,
  InputAmount,
  AmountsInnerWrapper,
} from './index'
import { Row } from 'components/Row'

const Wrapper = styled.div`
  margin-top: 5px;
  justify-content: space-between;
  padding: 10px 20px;
`

const UnlockDateValue = styled.div`
  color: ${({ theme }) => theme.border2};
  margin-top: 6px;
  font-weight: 400;
  font-size: 12px;
`

export default function AdvancedOptions({
  title,
  amount,
  setAmount,
  defaultAmounts,
  unit,
  date,
  hasCustom = true,
  toolTipData,
}: {
  title: string
  amount: string
  setAmount: (value: any) => void
  defaultAmounts: string[]
  unit?: string
  date?: string
  hasCustom?: boolean
  toolTipData: string
}) {
  const MIN = defaultAmounts[0]

  const handleMinAmount = useCallback(() => {
    if (toBN(amount).lte(0)) {
      setAmount(MIN)
    }
  }, [amount, MIN, setAmount])

  const handleCustomChange = useCallback(
    (e) => {
      const value = e.currentTarget.value
      if (value !== '' && value >= 0) {
        setAmount(value)
      } else {
        setAmount('0')
      }
    },
    [setAmount]
  )

  const customSelected = useMemo(() => !defaultAmounts.includes(amount), [defaultAmounts, amount])

  return useMemo(() => {
    return (
      <Wrapper>
        <Title>
          <Row>
            {title}
            <QuestionMarkWrap>
              <ToolTip id="id" />
              <QuestionMark data-for="id" data-tip={toolTipData} width={12} height={12} />
            </QuestionMarkWrap>
          </Row>
          {!hasCustom && <UnlockDateValue>{date}</UnlockDateValue>}
        </Title>

        <AmountsWrapper>
          <AmountsInnerWrapper hasCustom={hasCustom}>
            {defaultAmounts.map((a) => {
              return (
                <DefaultOptionButton
                  key={a}
                  active={a === amount}
                  onClick={() => {
                    setAmount(a)
                  }}
                >
                  {a} {unit}
                </DefaultOptionButton>
              )
            })}
          </AmountsInnerWrapper>
          {hasCustom && (
            <CustomOption active={customSelected}>
              <InputAmount
                value={toBN(amount).gt(0) ? amount : ''}
                active={customSelected}
                onBlur={() => {
                  handleMinAmount()
                }}
                onChange={(e) => handleCustomChange(e)}
                placeholder={amount.toString()}
              />
              {unit}
            </CustomOption>
          )}
        </AmountsWrapper>
      </Wrapper>
    )
  }, [
    title,
    toolTipData,
    hasCustom,
    date,
    defaultAmounts,
    customSelected,
    amount,
    unit,
    setAmount,
    handleMinAmount,
    handleCustomChange,
  ])
}
