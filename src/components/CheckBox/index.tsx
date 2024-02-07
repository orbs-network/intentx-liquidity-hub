import styled, { keyframes } from 'styled-components'

const Input = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  z-index: -1;
`

const Label = styled.label<{ disabled?: boolean }>`
  position: relative;
  display: inline-block;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  margin: 0.6em 0;
  margin-left: 8px;
  font-size: 12px;
  font-weight: 400;
`

const rotate = keyframes`
 from {
    opacity: 0;
    transform: rotate(0deg);
  }
  to {
    opacity: 1;
    transform: rotate(45deg);
  }
`

const Indicator = styled.div<{ checked?: boolean }>`
  width: 1.4em;
  height: 1.4em;
  background: ${({ theme, checked }) => (checked ? theme.primaryDarkOld : theme.primaryDarkOld)};
  position: absolute;
  top: 0em;
  left: -1.6em;
  border: 1px solid ${({ theme }) => theme.red1};
  border-radius: 0.2em;
  &::after {
    content: '';
    position: absolute;
    display: none;
  }
  ${Input}:checked + &::after {
    display: block;
    top: 0.1em;
    left: 0.35em;
    width: 35%;
    height: 75%;
    border: solid ${({ theme }) => theme.red1};
    border-width: 0 0.2em 0.2em 0;
    animation-name: ${rotate};
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  }
  &::disabled {
    cursor: not-allowed;
  }
`

export default function Checkbox({
  checked,
  label,
  onChange,
  name,
  id,
  disabled,
}: {
  checked?: boolean
  label: string
  onChange: (...arg: any) => void
  name: string
  id: string
  disabled?: boolean
}) {
  return (
    <Label htmlFor={id} disabled={disabled}>
      {label}
      <Input id={id} type="checkbox" name={name} checked={checked} onChange={onChange} disabled={disabled} />
      <Indicator checked={checked} />
    </Label>
  )
}
