import { ChainData, Estimate, RouteRequest, SquidData, Token } from '@0xsquid/squid-types'
import BigNumber from 'bignumber.js'
import SpotTradeInput from 'components/App/Conversion/ConversionInput'
import Swap from 'components/Icons/Swap'

import { useIsLaptop, useIsMobile } from 'lib/hooks/useWindowSize'
import { AvailableFields } from 'pages/crosschain'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  gap: 24px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 16px;
`}
`

const SwapButton = styled.div<{ isHovering?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ isHovering }) => (isHovering ? '#171A1F' : '#232933')};
  width: 64px;
  height: 64px;
  border-radius: 100%;
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 45px;
  height: 45px;
`};
`

const SwapContainer = styled.div<{ isHovering?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ isHovering }) => (isHovering ? '#232933' : '#1C1F26')};
  transition: all 0.3s ease;
  width: 48px;
  height: 48px;
  border-radius: 100%;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  width: 33px;
  height: 33px;
`};
`

export default function ConversionForm({
  onUpdateFromToken,
  onUpdateToToken,
  currentRoute,

  typedQuantities,
  tokenQuantity,
  onClickSwap,
  tokenFrom,
  tokenTo,
  chainFrom,
  chainTo,
  selectedField,
  setSelectedField,
}: {
  onUpdateFromToken(value: string): void
  onUpdateToToken(value: string): void
  currentRoute:
    | {
        estimate: Estimate
        transactionRequest?: SquidData | undefined
        params: RouteRequest
      }
    | undefined

  typedQuantities: {
    from: string
    to: string
  }
  tokenQuantity: {
    from: string
    to: string
  }
  onClickSwap(): void
  tokenFrom: Token | null
  tokenTo: Token | null
  chainFrom: ChainData | null
  chainTo: ChainData | null
  selectedField: AvailableFields
  setSelectedField: (field: AvailableFields) => void
}) {
  const isMobile = useIsMobile()
  const isLaptop = useIsLaptop()
  const [isHoveringSwapButton, setIsHoveringSwapButton] = useState<boolean>(false)

  const updateFromTokenAmount = (value: string): void => {
    onUpdateFromToken?.(value)
  }

  const updateToTokenAmount = (value: string): void => {
    onUpdateToToken?.(value)
  }

  const handleSwapClick = () => {
    onClickSwap?.()
  }

  const fetchTokenPrice = async (chainId: string, tokenAddress: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      fetch(`https://api.squidrouter.com/v1/token-price?chainId=${chainId}&tokenAddress=${tokenAddress}`)
        .then((response) => response.json())
        .then((data) => {
          resolve(data.price)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const [tokenAPrice, setTokenAPrice] = useState(0)
  const [tokenBPrice, setTokenBPrice] = useState(0)

  useMemo(() => {
    if (tokenFrom) {
      fetchTokenPrice(tokenFrom.chainId, tokenFrom.address).then((price) => {
        setTokenAPrice(price)
      })
    }
  }, [tokenFrom])

  useMemo(() => {
    if (tokenTo) {
      fetchTokenPrice(tokenTo.chainId, tokenTo.address).then((price) => {
        setTokenBPrice(price)
      })
    }
  }, [tokenTo])

  const tokenAValue = useMemo(() => {
    if (tokenAPrice && tokenQuantity.from && tokenFrom) {
      return (
        tokenAPrice *
        BigNumber(tokenQuantity.from)
          .div(10 ** tokenFrom.decimals)
          .toNumber()
      ).toFixed(2)
    }
    return '0'
  }, [tokenAPrice, tokenFrom, tokenQuantity.from])

  const tokenBValue = useMemo(() => {
    if (tokenBPrice && tokenQuantity.to && tokenTo) {
      return (
        tokenBPrice *
        BigNumber(tokenQuantity.to)
          .div(10 ** tokenTo.decimals)
          .toNumber()
      ).toFixed(2)
    }

    return '0'
  }, [tokenBPrice, tokenTo, tokenQuantity.to])

  return (
    <Wrapper>
      <SpotTradeInput
        leftLabel="From"
        rightLabel="Exchange"
        tokenBalance={'0'}
        selectedToken={tokenFrom}
        onUpdateValue={updateFromTokenAmount}
        value={typedQuantities.from}
        tokenValue={tokenAValue}
        onToggle={() => {
          setSelectedField(AvailableFields.FROM)
        }}
        selectedChain={chainFrom}
      />
      <SwapButton
        onMouseEnter={() => setIsHoveringSwapButton(true)}
        onMouseLeave={() => setIsHoveringSwapButton(false)}
        isHovering={isHoveringSwapButton}
        onClick={handleSwapClick}
      >
        <SwapContainer isHovering={isHoveringSwapButton}>
          <Swap size={isLaptop || isMobile ? '16' : '24'} />
        </SwapContainer>
      </SwapButton>
      <SpotTradeInput
        leftLabel="To"
        rightLabel="Receive"
        tokenBalance={'0'}
        selectedToken={tokenTo}
        selectedChain={chainTo}
        onUpdateValue={updateToTokenAmount}
        value={typedQuantities.to}
        tokenValue={tokenBValue}
        onToggle={() => {
          
          setSelectedField(AvailableFields.TO)
        }}
      />
    </Wrapper>
  )
}
