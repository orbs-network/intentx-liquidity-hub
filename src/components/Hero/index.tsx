import styled from 'styled-components'
import { lighten } from 'polished'

import { Info } from 'components/Icons'
import { RowStart } from 'components/Row'
import { MediumTitle } from 'components/Title'
import { ToolTip } from 'components/ToolTip'

const Hero = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  width: 100%;
  min-height: 200px;
  height: 340px;
  align-items: center;
  text-align: center;
  font-size: 60px;
  font-weight: bold;
  background: ${({ theme }) => lighten(0.2, theme.bg0)};
  padding: 10px;
  padding-bottom: 10px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-height: 100px;
    font-size: 40px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 30px;
  `}
`

export const HeroSubtext = styled.div`
  font-size: 0.8rem;
  font-weight: normal;
  text-align: center;
  width: 50%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    font-size: 0.7rem;
  `}
`

const CustomTooltip = styled(ToolTip)`
  background: ${({ theme }) => theme.bg2} !important;
  color: ${({ theme }) => theme.text1} !important;
  /* max-width: 380px !important; */
`

export function HeaderTitle({
  Title,
  SubTitle,
  tooltip,
}: {
  Title: string | JSX.Element
  SubTitle?: string | JSX.Element
  tooltip?: string
}): JSX.Element | null {
  if (!Title) return null
  const id = Math.random().toString()
  return (
    <>
      <RowStart width={'unset'} style={{ marginRight: 'auto' }}>
        {tooltip && <CustomTooltip id={id} />}
        <div>
          <MediumTitle>{Title}</MediumTitle>
          {SubTitle ? (
            !tooltip ? (
              <MediumTitle>{SubTitle}</MediumTitle>
            ) : (
              <RowStart width={'unset'} style={{ marginRight: 'auto' }}>
                <MediumTitle>{SubTitle}</MediumTitle>
                <Info data-for={id} data-tip={tooltip} />
              </RowStart>
            )
          ) : null}
        </div>
        {tooltip && !SubTitle && <Info data-for={id} data-tip={tooltip} />}
      </RowStart>
    </>
  )
}

export default Hero
