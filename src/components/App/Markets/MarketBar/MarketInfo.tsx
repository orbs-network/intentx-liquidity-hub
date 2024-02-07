'use client'
import useCurrencyLogo from 'lib/hooks/useCurrencyLogo'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'

import useOnOutsideClick from 'lib/hooks/useOnOutsideClick'
import { useActiveMarket } from 'state/trade/hooks'

import { MarketsModal } from 'components/App/Markets/MarketBar/MarketsModal'
import { Loader } from 'components/Icons'
import ChevronOutline from 'components/Icons/ChevronOutline'
import { Row, RowEnd, RowFixed, RowStart } from 'components/Row'

const Container = styled.div`
  max-height: 55px;
  display: inline-flex;
  align-items: center;
  height: 100%;
  position: relative;
  user-select: none;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  max-height: 42px;
`};
`

const Wrapper = styled.div`
  gap: 5px;
  font-size: 1.2rem;
  /* margin-right: 10px; */
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    margin-right: 0px;
  `}
  &:hover {
    cursor: pointer;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
    background: linear-gradient(0deg, #22252E, #22252E),linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
    border: 1px solid rgba(255, 255, 255, 0.1);
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 3.75px;
  font-size: 0.9rem;
  // margin-right: 7.5px;
`};
`

const InnerContentWrapper = styled(Row)`
  /* padding: 0 8px 0 12px; */
  min-width: 200px;

  @media (min-width: 1600px) {
    /* padding-right: 8px; */
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  // padding: 8.25px 6.75px 7.5px 9.75px;
  // height: 41.25px;
  min-width: 150px;
`};
`

const Chevron = styled(ChevronOutline)<{
  open: boolean
}>`
  transform: rotateX(${({ open }) => (open ? '180deg' : '0deg')});
  transition: 0.5s;
`

const MarketText = styled(Row)`
  gap: 12px;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  white-space: nowrap;
  color: ${({ theme }) => theme.text0};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 12px!important
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 9px;
  font-size: 12px;
  line-height: 15px;
`};
`

const Dropdown = styled.div`
  background: linear-gradient(0deg, #22252e, #22252e),
    linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 320px;
  width: 100%;
  height: 45px;
  display: inline-flex;
  padding: 8px;
  border-radius: 4px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  max-width: 240px;
  height: 34px;
  padding: 6px;
  border-radius: 3px;
`};
`

export default function MarketSelect() {
  const ref = useRef(null)
  const [clickMarket, setClickMarket] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const market = useActiveMarket()
  useOnOutsideClick(ref, () => setClickMarket(false))
  const icon = useCurrencyLogo(market?.symbol)
  const AssetIcon = useCurrencyLogo(market?.asset)

  function getInnerContent() {
    return (
      <InnerContentWrapper>
        <Dropdown>
          <RowStart style={{ marginRight: '35px' }}>
            {market ? (
              <MarketText align="center">
                <RowFixed>
                  <Image src={icon} alt="currency logo" width={25} />
                  <Image
                    src={AssetIcon}
                    alt="currency logo"
                    width={25}
                    style={{ position: 'relative', left: '-8px' }}
                  />
                  {market.symbol} / {market.asset}
                </RowFixed>
              </MarketText>
            ) : (
              <Loader />
            )}
          </RowStart>
          <RowEnd width={'10%'}>
            <Chevron open={clickMarket} />
          </RowEnd>
        </Dropdown>
      </InnerContentWrapper>
    )
  }
  function getMobileContent() {
    return (
      <InnerContentWrapper>
        <RowStart style={{ marginRight: '35px' }}>
          {market ? (
            <MarketText align="center">
              <RowFixed>
                <Image src={icon} alt="currency logo" width={25} />
                <Image src={AssetIcon} alt="currency logo" width={25} style={{ position: 'relative', left: '-8px' }} />
                {market.symbol} / {market.asset}
              </RowFixed>
            </MarketText>
          ) : (
            <Loader />
          )}
        </RowStart>
        <RowEnd width={'10%'}>
          <Chevron open={clickMarket} />
        </RowEnd>
      </InnerContentWrapper>
    )
  }

  return isMobile ? (
    <>
      <Wrapper onClick={() => setModalOpen(true)}>{getMobileContent()}</Wrapper>
      <MarketsModal isModal isOpen={modalOpen} onDismiss={() => setModalOpen(false)} />
    </>
  ) : (
    <Container ref={ref} onMouseEnter={() =>  setClickMarket(true)} onMouseLeave={() => setClickMarket(false)}>
      <div onKeyDown={(key) => (key.key === 'Escape' ? setClickMarket(!clickMarket) : '')}>
        <MarketsModal isOpen={clickMarket} onDismiss={() => setClickMarket(!clickMarket)} />
      </div>
      <Wrapper>{getInnerContent()}</Wrapper>
    </Container>
  )
}
