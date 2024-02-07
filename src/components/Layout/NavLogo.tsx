import React, { useMemo } from 'react'
import styled from 'styled-components'

import { ExternalLink } from 'components/Link'
import { RowCenter } from 'components/Row'

import IntentXBaseIcon from 'components/Icons/IntentX/IntentXBaseIcon'
import IntentXChristmasLogo from 'components/Icons/IntentX/Christmas/IntentXChristmasLogo'
import IntentXMobileLogo from 'components/Icons/IntentX/IntentxMobileLogo'
import { useIsMobile } from 'lib/hooks/useWindowSize'
import IntentXMobileChristmasLogo from 'components/Icons/IntentX/Christmas/IntentXMobileChristmasLogo'
import IntentXNewYearLogo from 'components/Icons/IntentX/NewYear/IntentXNewYearLogo'
import IntentXMobileNewYearLogo from 'components/Icons/IntentX/NewYear/IntentXMobileNewYearLogo'

const Wrapper = styled(RowCenter)`
  width: fit-content;

  &:hover {
    cursor: pointer;
  }

  & > div {
    &:first-child {
      margin-right: 10px;
    }
  }
`

export default function NavLogo() {
  const isMobile = useIsMobile()

  // From 23 to 27 days of december, add Christmass logo
  const currentDate = useMemo(() => {
    const date = new Date()
    return date
  }, [])
  const isChristmass = useMemo(() => {
    return currentDate.getDate() >= 23 && currentDate.getDate() <= 31 && currentDate.getMonth() === 11
  }, [currentDate])

  const isNewYear = useMemo(() => {
    return currentDate.getDate() >= 1 && currentDate.getDate() <= 7 && currentDate.getMonth() === 0
  }, [currentDate])

  const getCurrentLogo = () => {
    if (isNewYear) {
      return <IntentXNewYearLogo height={38} width={174} />
    }
    if (isChristmass) {
      return <IntentXChristmasLogo height={40} width={174} />
    }
    return <IntentXBaseIcon height={38} width={174} />
  }

  const getCurrentMobileLogo = () => {
    if (isNewYear) {
      return <IntentXMobileNewYearLogo />
    }
    if (isChristmass) {
      return <IntentXMobileChristmasLogo />
    }
    return <IntentXMobileLogo />
  }

  return (
    <div>
      <ExternalLink href={'/'} target="_self" passHref>
        <Wrapper>
          {isChristmass}

          {isMobile ? getCurrentMobileLogo() : getCurrentLogo()}
          {/*<TextWrapper>
            <ExternalLink href="https://www.symm.io/">
              <SymmetrialText>
                Powered by SYMMIO{' '}
                <Image unoptimized={true} src={SYMMETRIAL_ICON} width={'16px'} height={'12px'} alt="Symmetrial Logo" />
              </SymmetrialText>
            </ExternalLink>
          </TextWrapper>*/}
        </Wrapper>
      </ExternalLink>
    </div>
  )
}
