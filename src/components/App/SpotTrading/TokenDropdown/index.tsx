import { Token } from '@orbs-network/liquidity-hub-ui-sdk'
import { Loader } from 'components/Icons'
import ExpandArrow from 'components/Icons/ExpandArrow'
import Image from 'next/image'
import styled, { useTheme } from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  background: #232933;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 140px;
  padding: 0px 7px;
  height: 38px;
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

export default function TokenDropdown({ token, onClick }: { token?: Token; onClick: () => void }) {
  const theme = useTheme()

  return (
    <Wrapper onClick={onClick}>
      {token ? (
        <>
          <Image src={token.logoUrl || ''} alt="token" width={24} height={24} style={{borderRadius:'50%'}} />
          <Separator />
          <Label color={theme.white}>{token.symbol}</Label>
        </>
      ) : (
        <Label color={theme.white}>Select token</Label>
      )}
      <DropdownButton>
        <ExpandArrow disabled isExpanded />
      </DropdownButton>
    </Wrapper>
  )
}
