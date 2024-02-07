import { useState } from 'react'
import styled from 'styled-components'

const SwitchWrapper = styled.label<{ width?: string; height?: string; translateDot?: string }>`
  position: relative;
  display: inline-block;
  width: ${({ width }) => width ?? '34px'};
  height: ${({ height }) => height ?? '17px'};

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input:checked + .slider {
    background: linear-gradient(to bottom, #ff0420, #bd2738);
  }

  input:checked + .slider:before {
    transform: ${({ translateDot }) => (translateDot ? `translateX(${translateDot})` : 'translateX(17px)')};
    opacity: 1;
  }
`

const Slider = styled.span<{ size?: string }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(217, 217, 217, 0.3);
  transition: 0.3s;

  &::before {
    position: absolute;
    content: '';
    height: ${({ size }) => size ?? '13px'};
    width: ${({ size }) => size ?? '13px'};
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: transform 0.4s;
    opacity: 0.5;
  }

  &.round {
    border-radius: 34px;
  }

  &.round:before {
    border-radius: 50%;
  }
`

function Switch({
  value = false,
  onChange,
  width,
  height,
  dotSize,
  translateDot,
}: {
  value?: boolean
  onChange?: (value: boolean) => void
  width?: string
  height?: string
  dotSize?: string
  translateDot?: string
}) {
  const [isSwitchOn, setSwitchState] = useState(value)

  const toggleSwitch = () => {
    setSwitchState(!isSwitchOn)
    if (onChange) onChange(!isSwitchOn)
  }

  return (
    <>
      <SwitchWrapper width={width} height={height} translateDot={translateDot}>
        <input type="checkbox" checked={isSwitchOn} onChange={toggleSwitch} />
        <Slider className="slider round" size={dotSize} />
      </SwitchWrapper>
    </>
  )
}

export default Switch
