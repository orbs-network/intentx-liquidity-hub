import styled from 'styled-components'

export const Column = styled.div<{
  gap?: string
}>`
  gap: ${({ gap }) => gap && `${gap}`};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`
export const ColumnCenter = styled(Column)`
  align-items: center;
  margin-top: 10px;
`

export const AutoColumn = styled.div<{
  gap?: 'sm' | 'md' | 'lg' | string
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
}>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
  justify-items: ${({ justify }) => justify && justify};
`

export const ColumnContainer = styled.div<{ orientation?: string }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ orientation }) => (orientation === 'left' ? 'flex-start' : 'flex-end')};
`

export default Column
