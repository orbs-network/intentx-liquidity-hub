import { Token } from '@0xsquid/squid-types'
import ExpandArrow from 'components/Icons/ExpandArrow'
import Image from 'next/image'
import { useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import styled, { useTheme } from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  background: #232933;
  cursor: pointer;
  width: 140px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 100px;
  padding: 7px;
`};
`

const Label = styled.span<{ size?: string; weight?: string; reducedOpacity?: boolean; color?: string }>`
  font-weight: ${({ weight }) => (weight ? weight : '400')};
  font-size: ${({ size }) => (size ? size : '14px')};
  color: ${({ color }) => color ?? '#637188'};
  opacity: ${({ reducedOpacity }) => (reducedOpacity ? '0.5' : '1')};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 10px;
`}
`

const Separator = styled.div`
  width: 1px;
  height: 24px;
  margin: 0 8px;
  background: #3d4654;
`

const DropdownButton = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`

export default function TokenDropdown({
  selectedToken,
  onToggle,
}: {
  selectedToken: Token | null
  onToggle?: () => void
}) {
  const theme = useTheme()
  const toggleTokenSelectionModal = useToggleModal(ApplicationModal.TOKEN_SELECTION)

  return (
    <Wrapper
      onClick={() => {
        onToggle && onToggle()
        toggleTokenSelectionModal()
      }}
    >
      {selectedToken && selectedToken.logoURI && (
        <Image src={selectedToken.logoURI} alt="token" width={24} height={24} />
      )}
      <Separator />
      <Label color={theme.white}>{selectedToken?.symbol}</Label>
      <DropdownButton>
        <ExpandArrow disabled isExpanded />
      </DropdownButton>
    </Wrapper>
  )
}
