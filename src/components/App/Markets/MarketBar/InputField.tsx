import styled from 'styled-components'

import { RowStart } from 'components/Row'
import { Search as SearchIcon } from 'components/Icons'

const SearchWrapper = styled(RowStart)`
  flex-flow: row nowrap;
  background: #21232a;
  padding: 0.2rem 0;
  height: 40px;
  gap: 5px;
  border-radius: 5px;

  & > * {
    &:first-child {
      width: fit-content;
      padding: 0 0.5rem;
      border-right: 1px solid ${({ theme }) => theme.border1};
    }
  }
`

const Input = styled.input<{
  [x: string]: any
}>`
  height: fit-content;
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.white};
  padding-left: 2px;
  &:focus,
  &:hover {
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 0.6rem;
  `}
`

export function InputField({ searchProps, placeholder }: { searchProps: any; placeholder: string }) {
  return (
    <SearchWrapper>
      <SearchIcon size={20} />
      <Input {...searchProps} autoFocus type="text" placeholder={placeholder} spellCheck="false" onBlur={() => null} />
    </SearchWrapper>
  )
}
