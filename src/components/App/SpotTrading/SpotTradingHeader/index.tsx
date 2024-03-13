import Reload from 'components/Icons/Reload'
import SettingsCog from 'components/Icons/SettingsCog'
import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'

import { ColumnContainer } from 'components/Column'
import { useIsLaptop, useIsMobile } from 'lib/hooks/useWindowSize'
import { useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import HeaderMask from '/public/images/spot-header-mask.png'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 104px;
  padding: 0px 24px;
  background: linear-gradient(90deg, rgba(110, 22, 32, 0.4) 0%, rgba(188, 39, 56, 0.4) 128.07%);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  min-width: 480px;
  border: 1px solid #bc2738;
  position: relative;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    padding: 0px 16px;
    min-width: 360px;
    height: 72px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  min-width: unset;
  width: 100%;
  `};
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`
const OptionsContainer = styled.div`
  display: flex;
  align-items: center;
`

const Label = styled.span<{ size?: number; weight?: string; reducedOpacity?: boolean }>`
  font-weight: ${({ weight }) => weight ?? '400'};
  font-size: ${({ size }) => (size ? `${size}px` : '20px')};
  color: ${({ theme }) => theme.white};
  opacity: ${({ reducedOpacity }) => (reducedOpacity ? '0.5' : '1')};

  ${({ theme, size }) => theme.mediaWidth.upToExtraLarge`
  font-size:  ${size ? `${size * 0.7}px` : '14px'};
`}
`

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 6px;
`}
`

const ActionButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 9999;
`

export default function SpotTradingHeader() {
  const isMobile = useIsMobile()
  const isLaptop = useIsLaptop()
  const toggleSettingModal = useToggleModal(ApplicationModal.SPOT_SETTINGS)

  const [hoveredElement, setHoveredElement] = useState<string | undefined>(undefined)


  const handleOpenSettings = (): void => {
    toggleSettingModal()
  }

  return (
    <Wrapper>
      <ColumnContainer orientation="left">
        <Image
          src={HeaderMask}
          alt=""
          style={{
            position: 'absolute',
            right: '0',
            top: '0',
            mixBlendMode: 'exclusion',
            opacity: '0.8',
          }}
          width={isMobile || isLaptop ? 335 : 479}
          height={isMobile || isLaptop ? 72 : 104}
        />
        <Image
          src={HeaderMask}
          alt=""
          style={{
            position: 'absolute',
            right: '0',
            top: '0',
            mixBlendMode: 'exclusion',
            opacity: '0.8',
          }}
          width={isMobile || isLaptop ? 335 : 479}
          height={isMobile || isLaptop ? 72 : 104}
        />
        <Label>Spot Trading</Label>
      </ColumnContainer>

      <ColumnContainer>
        <ActionsContainer>
          {/* <ActionButton
            onClick={handleReload}
            onMouseEnter={() => setHoveredElement('reload')}
            onMouseLeave={() => setHoveredElement(undefined)}
          >
            <Reload hovered={hoveredElement === 'reload'} size={isLaptop || isMobile ? '16' : '24'} />
          </ActionButton> */}
          <ActionButton
            onClick={handleOpenSettings}
            onMouseEnter={() => setHoveredElement('settings')}
            onMouseLeave={() => setHoveredElement(undefined)}
          >
            <SettingsCog hovered={hoveredElement === 'settings'} size={isLaptop || isMobile ? '16' : '24'} />
          </ActionButton>
        </ActionsContainer>
      </ColumnContainer>
    </Wrapper>
  )
}
