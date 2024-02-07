import React, { useState } from 'react'
import styled from 'styled-components'
import { Row, RowBetween, RowEnd, RowStart } from 'components/Row'
import { Z_INDEX } from 'theme'
import IntentXBaseLogo from 'components/Icons/IntentX/IntentXBaseLogo'
import { Status as StatusIcon } from 'components/Icons'
import SupportIcon from 'components/Icons/Support'
import Image from 'next/image'

import DISCORD from '/public/static/images/footer/Discord.svg'
import GITBOOK from '/public/static/images/footer/GitBook.svg'
import GECKO from '/public/static/images/footer/Gecko.svg'
import MEDIUM from '/public/static/images/footer/Medium.svg'
import TELEGRAM from '/public/static/images/footer/Telegram.svg'
import TWITTER from '/public/static/images/footer/Twitter.svg'
import EAGLE from '/public/static/images/footer/Eagle.svg'
import SymmioLogo from '/public/static/images/footer/symmio-icon.svg'

import LinkFooter from 'components/LinkFooter'
import { useIsMobile } from 'lib/hooks/useWindowSize'
import FooterButtonMobile from 'components/FooterButtonMobile'

interface Option {
  name: string
  path: string
  icon: string
}

const Wrapper = styled(Row)<{ height: string }>`
  gap: 5px;
  font-size: 16px;
  flex-wrap: nowrap;
  padding: 30px 2rem;
  position: relative;
  bottom: 0;
  height: ${({ height }) => height};
  background-color: ${({ theme }) => theme.bgCustom1};
  z-index: ${Z_INDEX.fixed};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0;
    justify-content: center;
  `}
`

const WrapperMobile = styled.div`
  background: rgba(23, 26, 31, 1);
  bottom: 0;
  position: fixed;
  flex: none;
  z-index: ${Z_INDEX.fixed};
  height: 60px;
  min-width: 100vw;
  padding: 15px 8px;
`

const Separator = styled.div`
  width: 1px;
  height: 40px;
  border-radius: 4px;
  margin: 0 20px;
  background: #363a45;
`

const Info = styled.div`
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  gap: 15px;
  flex-shrink: 0;
`
const Status = styled.div`
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  gap: 6px;
`

const Text = styled.div<{ isClickable?: boolean }>`
  font-size: 12px;
  font-weight: 200;
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'default')};
  flex-shrink: 0;
`

const MobileContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 25px;

  & > * {
    &:nth-child(3) {
      position: relative;
      top: 10px;
    }
    &:nth-child(4) {
      width: 60px;
    }
  }
`

const optionsMobile: Option[] = [
  { name: 'Account', path: '/my-account', icon: 'user' },
  { name: 'Analytics', path: '/analytics', icon: 'graph' },
  { name: 'Trade', path: '/trade', icon: 'tradebar' },
  { name: 'Leaderboard', path: '/leaderboard', icon: 'medaloutline' },
  { name: 'Referrals', path: '/referrals', icon: 'users' },
]

const OPTIONS = [
  {
    image: DISCORD,
    link: 'https://discord.gg/intentx',
  },
  {
    image: GITBOOK,
    link: 'https://docs.intentx.io',
  },
  {
    image: MEDIUM,
    link: 'https://medium.com/@IntentX',
  },
  {
    image: TWITTER,
    link: 'https://twitter.com/IntentX_',
  },
]

export default function Footer() {
  function getDefaultContent() {
    return (
      <Wrapper height="69px">
        <RowBetween>
          <RowStart>
            <IntentXBaseLogo width={98} height={30} />
            <Row gap="5px" marginBottom="0px" width="fit-content">
              <Text style={{ marginLeft: '8px', color: '#b0bbce', fontSize: 8 }}>Powered By</Text>
              <Image src={SymmioLogo} alt="symmio-logo" width={50} style={{ marginBottom: '4px' }} />
            </Row>

            <Separator />
            <Info>
              <Status>
                <StatusIcon connected style={{ marginTop: '5px' }} />
                <Text
                  onClick={() => {
                    window.open('https://intentx.betteruptime.com/', '_blank')
                  }}
                  isClickable
                >
                  Operational
                </Text>
              </Status>
              {'·'}
              <Status>
                <Text>{process.env.NEXT_PUBLIC_SHA_VERSION}</Text>
              </Status>
            </Info>
          </RowStart>
          <RowEnd style={{ width: 'initial' }}>
            <Info>
              {OPTIONS.map((option, index) => (
                <LinkFooter key={index} option={option} />
              ))}
            </Info>
          </RowEnd>
        </RowBetween>
      </Wrapper>
    )
  }

  function getMobileContent() {
    return (
      <WrapperMobile>
        <MobileContent>
          {optionsMobile.map((option, index) => (
            <FooterButtonMobile key={index} isMobile={isMobile} option={option} />
          ))}
        </MobileContent>
      </WrapperMobile>
    )
  }

  const isMobile = useIsMobile()
  return isMobile ? getMobileContent() : getDefaultContent()
}
