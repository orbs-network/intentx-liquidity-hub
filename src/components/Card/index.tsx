import styled from 'styled-components'
import Column from 'components/Column'

export const Card = styled(Column)`
  background: ${({ theme }) => theme.bg0};
  border-radius: 4px;
  padding: 24px;
  padding-top: 20px;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `}
`

export const InnerCard = styled(Column)`
  background: ${({ theme }) => theme.bg4};
  border-radius: 4px;
  padding: 12px;
  padding-bottom: 8px;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 10px;
  `}
`

export const ChartCard = styled(Card)`
  background-color: rgba(23, 26, 31, 1);
  border-radius: 5px;
  padding: 12px 12px 14px 12px;
  width: 710px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 530px;
  padding: 8px 8px 10px 8px;
  `};

  ${({ theme }) => theme.mediaWidth.upToLarge`
  width: 510px;
  padding: 8px 8px 10px 8px;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 90vw;
  `};
`
