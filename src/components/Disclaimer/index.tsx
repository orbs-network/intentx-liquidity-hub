import React from 'react'
import Image from 'next/image'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'

import { ExternalLink } from 'components/Link'
import { RowCenter } from 'components/Row'

import Discord from '/public/static/images/footer/Discord.svg'
import Twitter from '/public/static/images/footer/Twitter.svg'
import Medium from '/public/static/images/footer/Medium.svg'
import GitBook from '/public/static/images/footer/GitBook.svg'

// import Github from '/public/static/images/footer/Github.svg'
// import Telegram from '/public/static/images/footer/Telegram.svg'

const Wrapper = styled(RowCenter)`
  background: ${({ theme }) => theme.bg1};
  text-align: center;
  gap: 20px;
  font-size: 13px;
  padding: 12px 100px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
    margin-top: 20px;
    padding: 10px;
  `}
`

const Logos = styled(RowCenter)`
  gap: 28px;
  img {
    &:hover {
      filter: brightness(1.5);
    }
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-content: center;
    gap: 30px;
  `};
`

export default function Disclaimer() {
  function getImageSize() {
    return isMobile ? 25 : 30
  }
  return (
    <Wrapper>
      <Logos>
        <ExternalLink href="https://discord.gg/67XyT4wZeF">
          <Image unoptimized={true} src={Discord} alt="Discord Logo" width={getImageSize()} height={getImageSize()} />
        </ExternalLink>
        <ExternalLink href="https://twitter.com">
          <Image unoptimized={true} src={Twitter} alt="Twitter Logo" width={getImageSize()} height={getImageSize()} />
        </ExternalLink>
        <ExternalLink href="https://medium.com/">
          <Image unoptimized={true} src={Medium} alt="Medium Logo" width={getImageSize()} height={getImageSize()} />
        </ExternalLink>
        <ExternalLink href="https://docs.mono.farm/">
          <Image unoptimized={true} src={GitBook} alt="GitBook Logo" width={getImageSize()} height={getImageSize()} />
        </ExternalLink>
      </Logos>
    </Wrapper>
  )
}
