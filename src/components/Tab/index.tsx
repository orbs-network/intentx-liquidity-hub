import styled from 'styled-components'
import { RowCenter, RowStart } from 'components/Row'
import { lighten } from 'polished'

export const TabWrapper = styled(RowCenter)`
  width: unset;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text0};
  overflow: hidden;
  gap: 1px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 9px;
  `};
`

export const TabButton = styled(RowCenter)<{
  active: boolean
  hideOuterBorder: boolean
  showBottomBorder?: boolean
  redTab?: boolean
  greenTab?: boolean
  tab?: string
  isTail?: boolean
}>`<
  width: 100%;
  max-width: ${({ tab }) => (tab === 'Market' ? '138px' : '100%')};
  height: 40px;
  position: relative;
  text-align: center;
  overflow: hidden;
  font-weight: ${({ active }) => (active ? 500 : 400)};
  font-size: 11px;
  color: ${({ active, theme }) => (active ? theme.text0 : theme.text4)};
  background: transparent;
  border: ${({ theme, active, hideOuterBorder, showBottomBorder, redTab, greenTab }) => {
    if (hideOuterBorder) return 'transparent'
    const weight = showBottomBorder ? '2px' : '2px'
    const borderColor = redTab ? theme.red : greenTab ? theme.green : theme.bg1

    return active ? `solid ${weight} ${borderColor} ` : `transparent`
  }};
  border-bottom: ${({ showBottomBorder }) => {
    if (showBottomBorder) return 'showBottomBorder'
  }};

  border-bottom: ${({ active }) => (active ? '' : '2px solid transparent!important')};
  border-image: ${({ active, isTail }) =>
    active
      ? ''
      : !isTail
      ? 'linear-gradient(90deg, #2A303A 0.5%, rgba(42, 48, 58, 1) 79.37%, rgba(42, 48, 58, 1) 100%)!important'
      : 'linear-gradient(90deg, #2A303A 0.5%, rgba(42, 48, 58, 0.958333) 79.37%, rgba(42, 48, 58, 0) 100%)!important'};
  border-image-slice: ${({ active }) => (active ? '' : '1!important')};

  border-top: ${({ showBottomBorder }) => {
    if (showBottomBorder) return 'transparent'
  }};

  border-left: ${({ showBottomBorder }) => {
    if (showBottomBorder) return 'transparent'
  }};

  border-right: ${({ showBottomBorder }) => {
    if (showBottomBorder) return 'transparent'
  }};

  &:hover {
    cursor: ${({ active }) => (active ? 'default' : 'pointer')};
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
  max-width: unset;
`};

${({ theme, tab }) => theme.mediaWidth.upToExtraLarge`
max-width: ${tab === 'Market' ? '103px' : '100%'};
height: 30px;
font-size: 11px;
`};

${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 100%;
    font-size: 11px;
`};
`

export const Option = styled.div<{ active?: boolean }>`
  width: fit-content;
  color: ${({ theme }) => theme.white};
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  padding: 4px 0px 8px 0px;

  ${({ active, theme }) =>
    active &&
    `
    background: ${theme.white};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `}
  &:hover {
    cursor: pointer;
    color: ${({ theme, active }) => (active ? theme.gradLight : theme.text1)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px;
  line-height: 15px;
  padding: 3px 0px 6px 0px;
  `};
`

export function Tab({
  tabOptions,
  activeOption,
  hideOuterBorder,
  showBottomBorder,
  onChange,
}: {
  tabOptions: string[]
  activeOption: string
  hideOuterBorder?: boolean
  showBottomBorder?: boolean
  onChange: (tab: string) => void
}): JSX.Element {
  return (
    <TabWrapper>
      {tabOptions.map((tab, i) => (
        <TabButton
          key={i}
          active={tab === activeOption}
          onClick={() => onChange(tab)}
          hideOuterBorder={!!hideOuterBorder}
          showBottomBorder={!!showBottomBorder}
          redTab={true}
          greenTab={false}
          tab={tab}
        >
          {tab}
        </TabButton>
      ))}
    </TabWrapper>
  )
}

export function TabModal({
  tabOptions,
  activeOption,
  onChange,
  hideOuterBorder,
  ...rest
}: {
  tabOptions: string[]
  activeOption: string
  onChange: (tab: string) => void
  hideOuterBorder?: boolean
  [x: string]: any
}): JSX.Element {
  return (
    <TabWrapper width={'100%'} justifyContent={'space-between'} {...rest}>
      {tabOptions.map((tab, i) => (
        <TabButton
          key={i}
          active={tab === activeOption}
          onClick={() => onChange(tab)}
          hideOuterBorder={!!hideOuterBorder}
        >
          <div>{tab}</div>
        </TabButton>
      ))}
    </TabWrapper>
  )
}

export function GradientTabs({
  tabOptions,
  activeOption,
  onChange,
}: {
  tabOptions: string[]
  activeOption: string
  onChange: (tab: string) => void
}) {
  return (
    <RowStart style={{ gap: '16px' }}>
      {tabOptions.map((option, index) => (
        <Option key={index} active={option === activeOption} onClick={() => onChange(option)}>
          {option}
        </Option>
      ))}
    </RowStart>
  )
}

export function TabModalJSX({
  tabOptions,
  activeOption,
  onChange,
  hideOuterBorder,
  ...rest
}: {
  tabOptions: {
    label: string
    content: string | JSX.Element
    showBottomBorder?: boolean
    redTab?: boolean
    greenTab?: boolean
  }[]
  activeOption: string
  onChange: (tab: string) => void
  hideOuterBorder?: boolean
  [x: string]: any
}): JSX.Element {
  return (
    <TabWrapper width={'100%'} justifyContent={'space-between'} {...rest}>
      {tabOptions.map((tab, i) => (
        <TabButton
          key={i}
          active={tab.label === activeOption}
          onClick={() => onChange(tab.label)}
          hideOuterBorder={!!hideOuterBorder}
          showBottomBorder={tab.showBottomBorder}
          redTab={tab.redTab}
          greenTab={tab.greenTab}
        >
          <div>{tab.content}</div>
        </TabButton>
      ))}
    </TabWrapper>
  )
}
