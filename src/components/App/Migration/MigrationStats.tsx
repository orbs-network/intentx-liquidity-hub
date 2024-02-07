import styled from 'styled-components'

import { RowStart } from 'components/Row'
import InfoItem from 'components/InfoItem'
import { PrimaryButton } from 'components/Button'

const Wrapper = styled(RowStart)`
  background: ${({ theme }) => theme.primary2};
  border-radius: 4px;
  margin-top: 22px;
  margin-bottom: 16px;
  height: 48px;
  gap: 60px;
  padding-left: 16px;
  padding-right: 8px;
  & > * {
    &:last-child {
      margin-left: auto;
    }
  }
`
const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
`
export default function PoolStats({ onClaimAll }: { onClaimAll: (() => Promise<string>) | null }): JSX.Element | null {
  const rewards = '23.19 moSOLID'

  return (
    <Wrapper>
      <Title>Your Migration</Title>
      <InfoItem label="Total Claimable moSOLID" amount={rewards} />
      <PrimaryButton
        style={{ width: '212px' }}
        disabled={!onClaimAll}
        onClick={() => (onClaimAll ? onClaimAll() : undefined)}
      >
        Claim All
      </PrimaryButton>
    </Wrapper>
  )
}
