import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import { ApplicationModal } from 'state/application/reducer'
import { useModalOpen, usePWAAlertModalToggle } from 'state/application/hooks'

import WrongNet from '/public/static/images/etc/wrong-net.svg'
import NetAlert from '/public/static/images/etc/net-alert.svg'

import { Modal } from 'components/Modal'
import { Close as CloseIcon } from 'components/Icons'

import { Row, RowBetween, RowStart } from 'components/Row'
import { ColumnCenter } from 'components/Column'
import GradientButton, { GradientButtonLabel, SignButton } from 'components/Button/GradientButton'
import { ContextError, useInvalidContext } from 'components/InvalidContext'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { ChainInfo, getChainInfo } from 'constants/chainInfo'
import PaginationArrow from 'components/Icons/PaginationArrow'
import { FALLBACK_CHAIN_ID } from 'constants/chains'
import useRpcChangerCallback from 'lib/hooks/useRpcChangerCallback'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  width: 100%;
  gap: 0.8rem;
  border-radius: 15px;
  position: relative;
  padding: 18px 0 20px 0;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  text-align: center;
  padding: 22px 40px;
  gap: 10px;
`

const Title = styled.span`
  font-weight: 500;
  font-size: 20px;
`

const Description = styled.span`
  font-weight: 400;
  font-size: 15px;
  opacity: 0.5;
`

const Highlight = styled.span`
  font-weight: 700;
`

const IconContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledImage = styled(Image)`
  position: absolute;
  top: 0;
  right: -10px;
`

const NetworkIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const ButtonLabel = styled(GradientButtonLabel)`
  font-size: 14px;
`

export default function WrongNetworkModal() {
  const [showWorkNetworkModal, setShowWorkNetworkModal] = useState(false)

  const invalidContext = useInvalidContext()
  const rpcChangerCallback = useRpcChangerCallback()

  const { chainId } = useActiveConnectionDetails()
  const chainData = getChainInfo(chainId)

  useEffect(() => {
    if (invalidContext === ContextError.CHAIN_ID) {
      setShowWorkNetworkModal(true)
    } else {
      setShowWorkNetworkModal(false)
    }
  }, [chainId, invalidContext])

  return (
    <Modal isOpen={showWorkNetworkModal} width="420px" radius="5px">
      <Wrapper>
        <NetworkIconContainer>
          <Image src={WrongNet} alt="icon" />
          <IconContainer>
            {chainData && <Image src={chainData.logoUrl.default.src} alt="icon" width={65} height={65} />}

            <StyledImage src={NetAlert} alt="icon" width={34} height={34} />
          </IconContainer>
        </NetworkIconContainer>
        <ContentWrapper>
          <Title>You&apos;re in the Wrong Network</Title>
          <Description>
            You are currently on {chainData?.chainName} Network. Please
            <Highlight> move to Base Chain</Highlight> in order to use our Protocol!
          </Description>
          <SignButton onClick={() => rpcChangerCallback(FALLBACK_CHAIN_ID)} size="100%" height="40px">
            <RowBetween>
              <ButtonLabel>Change Network</ButtonLabel>
              <PaginationArrow isNext disabled={false} />
            </RowBetween>
          </SignButton>
        </ContentWrapper>
      </Wrapper>
    </Modal>
  )
}
