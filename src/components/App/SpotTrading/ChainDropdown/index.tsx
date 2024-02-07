import ExpandArrow from 'components/Icons/ExpandArrow'
import useCurrencyLogo from 'lib/hooks/useCurrencyLogo'
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

export default function ChainDropdown({ chainName }: { chainName: string }) {
  const icon = useCurrencyLogo(chainName)
  const theme = useTheme()
  const toggleChainSelectionModal = useToggleModal(ApplicationModal.CHAIN_SELECTION)

  return (
    <Wrapper onClick={() => toggleChainSelectionModal()}>
      <Image src={icon} alt="chain" width={24} />
      <Separator />
      <Label color={theme.white}>{chainName}</Label>
      <DropdownButton>
        <ExpandArrow disabled isExpanded />
      </DropdownButton>
    </Wrapper>
  )
}
