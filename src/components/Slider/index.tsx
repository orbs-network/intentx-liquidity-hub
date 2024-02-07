import { ChangeEvent, useCallback } from 'react'
import styled from 'styled-components'

import { RowBetween } from 'components/Row'

const Wrapper = styled.div`
  height: 70px;
  overflow: hidden;
  border-radius: 4px;
  padding: 8px 12px;
  color: ${({ theme }) => theme.text1};
  background: ${({ theme }) => theme.bg4};
`

const Title = styled.div`
  width: fit-content;
  color: ${({ theme }) => theme.text1};
  font-weight: 400;
  font-size: 12px;
`

const StyledRangeInput = styled.input<{ size: number }>`
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &::-moz-focus-outer {
    border: 0;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    border: 1px solid ${({ theme }) => theme.bg0};
    background: ${({ theme }) => theme.green4};
    border-radius: 2px;
    transform: translateY(-35%);

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-moz-range-thumb {
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    border: 1px solid ${({ theme }) => theme.bg0};
    background: ${({ theme }) => theme.green4};
    border-radius: 2px;

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-ms-thumb {
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    border: 1px solid ${({ theme }) => theme.bg0};
    background: ${({ theme }) => theme.green4};
    border-radius: 2px;
    transform: translateY(-35%);

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-webkit-slider-runnable-track {
    background: ${({ theme }) => theme.primary6};
    height: 4px;
  }

  &::-moz-range-track {
    background: ${({ theme }) => theme.primary6};
    height: 4px;
  }

  &::-ms-track {
    width: 100%;
    border-color: transparent;
    color: transparent;

    background: ${({ theme }) => theme.bg5};
    height: 4px;
  }

  /* &::-moz-range-progress {
    background-color: ${({ theme }) => theme.bg5};
} */
`

// const Test = styled.div<{ width?: string }>`
//   width: ${({ width }) => width ?? '100%'};

//   position: absolute;
//   right: 0px;
//   background: ${({ theme }) => theme.bg8};

//   height: 4px;
//   z-index: 0;
// `

interface InputSliderProps {
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  size?: number
}

export default function Slider({
  value,
  onChange,
  min = 1,
  step = 1,
  max = 100,
  size = 12,
  ...rest
}: InputSliderProps) {
  const changeCallback = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(parseInt(e.target.value))
    },
    [onChange]
  )

  // const width = useMemo(() => {
  //   return 100 - leverage
  // }, [leverage])

  return (
    <Wrapper>
      <RowBetween>
        <Title>Leverage</Title>
      </RowBetween>
      <RowBetween style={{ position: 'relative', marginTop: '20px' }}>
        <StyledRangeInput
          size={size}
          {...rest}
          type="range"
          value={value}
          style={{ padding: '5px 0' }}
          onChange={changeCallback}
          aria-labelledby="input slider"
          step={step}
          min={min}
          max={max}
        />

        {/* <Test width={`${width}%`} /> */}
      </RowBetween>
    </Wrapper>
  )
}
