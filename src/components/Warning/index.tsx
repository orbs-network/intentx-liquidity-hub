import styled from 'styled-components'
import { Card } from 'components/Card'
import { RowCenter } from 'components/Row'

export const Warning = styled.div`
  text-align: center;
  width: 100%;
  height: fit-content;
  padding: 10px;
  font-size: 0.6rem;
  border: 1px solid ${({ theme }) => theme.red1};
  box-shadow: 1px 1px ${({ theme }) => theme.red2};
`
export const SmallWarning = styled(RowCenter)`
  padding: 0 8px;
  padding: 12px 6px;
  margin-top: 16px;
  font-size: 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.bg4};
  color: ${({ theme }) => theme.warning};
  text-align: center;
`
export const SmallInfo = styled(RowCenter)`
  margin-top: 28px;
  font-size: 12px;
  text-align: center;
  color: ${({ theme }) => theme.text2};
`

export const Maintenance = styled(Card)`
  border: 1px solid ${({ theme }) => theme.warning};
  margin-bottom: 30px;
`

export const WarningModal = styled(RowCenter)`
  position: fixed;
  top: 55px;
  left: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  color: ${({ theme }) => theme.warning};

  backdrop-filter: blur(3px);
`
