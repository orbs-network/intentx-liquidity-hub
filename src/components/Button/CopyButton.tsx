import { Subtitle, Title } from 'components/Modal'
import styled from 'styled-components'
import Image from 'next/image'
import ArrowUpRight from 'components/Icons/ArrowUpR'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { truncateAddress } from 'utils/address'
import WalletGrad from 'components/Icons/WalletGrad'
import { Copy, IconWrapper } from 'components/Icons'
import { useState } from 'react'

const TitleHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`

const Button = styled.div<{ size?: string; height?: string }>`
  width: ${({ size }) => size ?? '220px'};
  height: ${({ height }) => height ?? '53px'};
  border: 1px solid rgba(56, 64, 79, 1);
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`

const SelectorButton = styled(Button)`
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.bgCustom4};
  }
`

export default function CopyButton({
  onClick,
  children,
  buttonRedirect = true,
  size = '100%',
  height = '62px',
  title,
  subtitle,
  src,
}: {
  src?: any
  title?: string
  subtitle?: string
  size?: string
  height?: string
  onClick?: () => void
  children?: React.ReactNode
  buttonRedirect?: boolean
}): JSX.Element {
  const { account } = useActiveConnectionDetails()
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseOver = () => {
    setIsHovering(true)
  }
  const handleMouseOut = () => {
    setIsHovering(false)
  }

  return buttonRedirect ? (
    <SelectorButton size={size} height={height} onClick={onClick}>
      <TitleHeader>
        <Image unoptimized={true} src={src} alt="icon" width={30} height={30} />
        <div>
          <Title size="16px">{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </div>
      </TitleHeader>
      <ArrowUpRight size={20} />
    </SelectorButton>
  ) : (
    <Button size={size} height={height} onClick={onClick}>
      <TitleHeader>
        <IconWrapper size={'28px'}>
          <WalletGrad isHover={false}></WalletGrad>
        </IconWrapper>
        <div>
          <Title size="14px"> {title}</Title>
        </div>
      </TitleHeader>
      <Copy onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} isHover={isHovering} size={18}></Copy>
    </Button>
  )
}
