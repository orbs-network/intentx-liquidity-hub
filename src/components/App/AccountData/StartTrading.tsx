import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import { formatAmount } from 'utils/numbers'
import { SupportedChainId } from 'constants/chains'

import { ApplicationModal } from 'state/application/reducer'
import { useAccountPartyAStat, useActiveAccountAddress } from 'state/user/hooks'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useDepositModalToggle, useModalOpen } from 'state/application/hooks'

import { BaseButton } from 'components/Button'
import { Row, RowStart, RowBetween, RowCenter, RowEnd } from 'components/Row'
import DepositToFuturesModal from 'components/Modals/DepositToFuturesModal'
import { COLLATERAL_SYMBOL } from 'constants/addresses'

const Wrapper = styled.div`
  border: none;
  width: 100%;
  min-height: 379px;
  border-radius: 4px;
  background: ${({ theme }) => theme.bg0};
  ${({ theme }) => theme.mediaWidth.upToLarge`
    width: 100%;
  `};
`

const Title = styled(RowStart)`
  padding: 20px 12px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.text0};
`

const ContentWrapper = styled.div`
  display: flex;
  padding: 12px;
  flex-flow: column nowrap;
  /* height: 100%; */
  position: relative;
`

const ImageWrapper = styled(RowCenter)`
  margin-top: 25px;
  margin-bottom: 36px;
`

const DepositButtonWrapper = styled(BaseButton)`
  padding: 1px;
  height: 40px;
  border-radius: 4px;
  background: ${({ theme }) => theme.gradLight};
`

const DepositButton = styled(BaseButton)`
  height: 100%;
  border: 1px solid ${({ theme }) => theme.gradLight};
  border-radius: 4px;
  background: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.gradLight};

  &:focus,
  &:hover,
  &:active {
    cursor: ${({ disabled }) => !disabled && 'pointer'};
    background: ${({ theme }) => theme.black2};
  }
`

const ButtonLabel = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  background: ${({ theme }) => theme.gradLight};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Label = styled.div`
  justify-self: start;
  color: ${({ theme }) => theme.text3};
`

const Value = styled.div`
  justify-self: end;
`

const DepositText = styled.div`
  font-size: 14px;
  text-align: center;
  margin-bottom: 37px;

  background: ${({ theme }) => theme.hoverGrad};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export default function StartTrading({ symbol }: { symbol?: string }) {
  const { chainId } = useActiveConnectionDetails()
  const account = useActiveAccountAddress()
  const { collateralBalance } = useAccountPartyAStat(account)
  const showDepositModal = useModalOpen(ApplicationModal.DEPOSIT)
  const toggleDepositModal = useDepositModalToggle()
  const [imgSrc, setImgSrc] = useState('/static/images/etc/USDTAsset.svg')

  /* const collateralImage = useMemo(() => {
    if (!chainId) return '/static/images/etc/USDTAsset.svg'
    const s = COLLATERAL_SYMBOL[chainId]

    return `/static/images/tokens/${s}.svg`
  }, [chainId]) */

  useEffect(() => {
    if (chainId && chainId === SupportedChainId.FANTOM) {
      setImgSrc('/static/images/etc/USDCAsset.svg')
    }
  }, [chainId])

  return (
    <Wrapper>
      <Row>
        <Title>Deposit {symbol}</Title>
        <RowEnd style={{ marginRight: '12px' }}>
          <Image unoptimized={true} src={imgSrc} alt="Asset" width={103} height={36} />
        </RowEnd>
      </Row>

      <ContentWrapper>
        <ImageWrapper>
          <Image unoptimized={true} src={'/static/images/etc/Asset.svg'} alt="Asset" width={174} height={135} />
        </ImageWrapper>
        <DepositText>Deposit {symbol} and start trading</DepositText>
        <RowBetween style={{ marginBottom: '24px' }}>
          <Label>Account Balance:</Label>
          <Value>
            {formatAmount(collateralBalance)} {symbol}
          </Value>
        </RowBetween>
        <DepositButtonWrapper>
          <DepositButton onClick={() => toggleDepositModal()}>
            <ButtonLabel>Deposit {symbol}</ButtonLabel>
          </DepositButton>
        </DepositButtonWrapper>
      </ContentWrapper>
      
    </Wrapper>
  )
}
