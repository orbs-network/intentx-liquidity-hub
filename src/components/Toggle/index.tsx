import styled from 'styled-components'

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.bg3};
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;
`

const ToggleSliderBefore = styled.span`
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: ${({ theme }) => theme.text1};
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 50%;
`

const ToggleInputChecked = styled.input`
  &:checked + ${ToggleSlider} {
    background-color: ${({ theme }) => theme.primaryBlue};
  }
  &:focus + ${ToggleSlider} {
    box-shadow: 0 0 1px ${({ theme }) => theme.primaryBlue};
  }
  &:checked + ${ToggleSlider} ${ToggleSliderBefore} {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
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

export default function Toggle({
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
      <ToggleInput id={id} type="checkbox" name={name} checked={checked} onChange={onChange} disabled={disabled} />
      <ToggleInputChecked checked={checked} />
    </Label>
  )
}
