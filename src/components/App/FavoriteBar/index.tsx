import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'react-feather'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { Market } from 'types/market'

import { useFavoriteMarkets } from 'hooks/useMarkets'

import { GradientStar, IconWrapper } from 'components/Icons'
import BlinkingPrice from 'components/App/FavoriteBar/BlinkingPrice'
import { Row, RowCenter } from 'components/Row'
import HorizontalScrollBox from 'components/HorizontalScrollBox'
import { useIsLaptop } from 'lib/hooks/useWindowSize'
import { useHideFavouriteBar } from 'state/user/hooks'
import { setHideFavouriteBar } from 'state/user/actions'

const Wrapper = styled(Row)`
  padding: 0 10px;
  background: rgba(29, 33, 40, 1);
  min-height: 29px;
`

const FavoritesWrap = styled(Row)`
  padding: 0 10px;
  margin: 0 10px;
  height: 100%;
  gap: 5px;
  padding: 0;
  position: relative;
  width: 0px;
  z-index: 1;
  overflow-x: auto;
  overflow-y: hidden;
  flex: 1 1 0%;
  border-radius: 4px;
  background: rgba(29, 33, 40, 1);
`

const Item = styled(RowCenter)`
  width: initial;
  min-width: 100px;
  height: 30px;
  padding: 8px 10px;
  border-radius: 4px;
  flex-shrink: 0;

  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.bg5};
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    height: 22px;
    padding: 5px 10px;
  `};
`

const Empty = styled(RowCenter)`
  font-size: 12px;
  color: ${({ theme }) => theme.text1};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 9px;
  `};
`

const Name = styled.div`
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
  line-height: 1;
  margin-right: 8px;

  color: ${({ theme }) => theme.text1};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    font-size: 9px;
    margin-right: 6px;
  `};
`
const CloseIconInput = styled(IconWrapper)`
  flex-shrink: 0;
  height: 100%;
  color: ${({ theme }) => theme.text1};
  z-index: 99;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
    /* color: ${({ theme }) => theme.text2}; */
  }
`

export default function FavoriteBar() {
  const favorites = useFavoriteMarkets()
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const favRef = useRef<HTMLDivElement>(null)
  const isLaptop = useIsLaptop()

  const onMouseDown = (e) => {
    if (favRef.current === null) return
    setIsDragging(true)
    setStartX(e.pageX - favRef.current.offsetLeft)
    setScrollLeft(favRef.current.scrollLeft)
  }

  const onMouseLeave = () => {
    setIsDragging(false)
  }

  const onMouseUp = () => {
    setIsDragging(false)
  }

  const onMouseMove = (e) => {
    if (favRef.current === null) return

    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - favRef.current.offsetLeft
    const walk = (x - startX) * 1.25 //scroll-fast
    favRef.current.scrollLeft = scrollLeft - walk
  }
  const isFavouriteBarHidden = useHideFavouriteBar()
  const dispatch = useDispatch()

  useEffect(() => {
    const onWheel = (e) => {
      const favElement = favRef.current
      if (!favElement) return

      const hasVerticalScrollbar = favElement.scrollHeight > favElement.clientHeight
      const hasHorizontalScrollbar = favElement.scrollWidth > favElement.clientWidth

      if (hasVerticalScrollbar || hasHorizontalScrollbar) {
        e.preventDefault()
        favElement.scrollLeft += e.deltaY
      }
    }

    const favElement = favRef.current
    favElement?.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      favElement?.removeEventListener('wheel', onWheel)
    }
  }, [])

  if (isFavouriteBarHidden) return null
  return (
    <Wrapper>
      <GradientStar />
      <HorizontalScrollBox>
        <FavoritesWrap>
          {favorites.length > 0 ? (
            favorites.map((favorite, index) => <FavoriteItem market={favorite} key={index} />)
          ) : (
            <Empty>There are no markets in your Favorites List</Empty>
          )}
        </FavoritesWrap>
      </HorizontalScrollBox>

      <CloseIconInput
        title="Hide Favourites Bar"
        onClick={() => {
          dispatch(setHideFavouriteBar(true))
        }}
      >
        <X opacity={1} size={isLaptop ? 18 : 25} />
      </CloseIconInput>
    </Wrapper>
  )
}

function FavoriteItem({ market }: { market: Market }) {
  const router = useRouter()

  const onClick = useCallback(() => {
    router.push(`/trade/${market.name}`)
  }, [router, market])

  return (
    <Item onClick={onClick}>
      <Name>
        {market.symbol} / {market.asset}
      </Name>
      <BlinkingPrice market={market} />
    </Item>
  )
}
