import React from 'react'
import Image, { StaticImageData } from 'next/image'
import styled from 'styled-components'

import DEFAULT_TOKEN from '/public/static/images/tokens/default-token.svg'

import { RowBetween } from 'components/Row'
import ShimmerAnimation from 'components/ShimmerAnimation'

const Wrapper = styled(RowBetween)<{ bg?: string; border?: string }>`
  width: ${({ width }) => width ?? '46px'};
  padding: 2px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;

  ${({ border }) =>
    border &&
    `
    border: 1px dashed ${border};
  `}
`

export default function Logos({
  img1,
  border,
  imgSize,
  bg,
  width,
  loading,
}: {
  img1?: string | StaticImageData
  border?: string
  imgSize?: string
  bg?: string
  width?: string
  loading?: boolean
}) {
  const getImageSize = () => {
    return imgSize ? imgSize : 20
  }
  return loading ? (
    <ShimmerAnimation width={width ?? '24px'} height={'24px'} borderRadius={'12px'} />
  ) : (
    <Wrapper width={width} bg={bg} border={border}>
      <Image
        unoptimized={true}
        src={img1 ?? DEFAULT_TOKEN}
        width={getImageSize() as number}
        height={getImageSize() as number}
        alt={`icon`}
      />
    </Wrapper>
  )
}
