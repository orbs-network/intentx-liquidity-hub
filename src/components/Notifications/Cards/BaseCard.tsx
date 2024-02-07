import React, { useMemo } from 'react'
import styled, { useTheme } from 'styled-components'
import Image, { StaticImageData } from 'next/image'
import { isMobile } from 'react-device-detect'

import DefaultToken from '/public/static/images/tokens/default-token.svg'

import { formatTimestamp } from 'utils/time'

import Column from 'components/Column'
import Logos from 'components/Notifications/Logos'
import { Row, RowCenter, RowEnd, RowStart } from 'components/Row'
import ShimmerAnimation from 'components/ShimmerAnimation'

const Container = styled(Row)<{ bg?: string; border?: string; report?: boolean; cursor?: string }>`
  border-radius: ${({ report }) => (report ? '4px 4px 0px 0px' : '6px')};
  background: ${({ theme, bg }) => (bg ? bg : theme.bg3)};
  cursor: ${({ cursor }) => (cursor ? cursor : 'default')};
  border: ${({ border, theme }) => (border ? `1px solid ${border}` : `1px solid ${theme.border2}`)};
  margin-bottom: 8px;
  min-height: 60px;
  padding: 8px 0;
  &:hover {
    background: ${({ theme, bg }) => (bg ? bg : theme.bg5)};
  }
`

const Wrapper = styled(Column)`
  width: 100%;
  padding: 0 12px;
  overflow: hidden;
`

const LogoWrapper = styled(RowCenter)<{ rotate?: number }>`
  width: unset;
  min-width: 44px;
  padding: 0px;
  rotate: ${({ rotate }) => (rotate ? `${rotate}deg` : 'none')};
`

const TextRow = styled(Row)`
  font-weight: 400;
  font-size: 12px;
  color: ${({ theme }) => theme.text0};
`

const TextGrid = styled.div`
  font-weight: 400;
  font-size: 12px;
  color: ${({ theme }) => theme.text0};
  display: grid;
  grid-template-columns: 1fr 60px;
`

const TextStatusRow = styled(Row)`
  font-weight: 400;
  font-size: 12px;
  color: ${({ theme }) => theme.text3};
`

const AccountName = styled(RowEnd)<{ alert?: string }>`
  font-weight: 400;
  font-size: 12px;
  width: unset;
  color: ${({ theme, alert }) => (alert ? alert : theme.text0)};
`

const Timestamp = styled(AccountName)`
  margin-left: 6px;
  color: ${({ theme, alert }) => (alert ? alert : theme.text3)};
`

const Report = styled(RowCenter)`
  height: 24px;
  font-weight: 500;
  font-size: 10px;
  text-align: center;
  margin-top: -10px;
  border-radius: 0px 0px 2px 2px;
  color: ${({ theme }) => theme.text0};
  background: ${({ theme }) => theme.bg6};
`

export default function BaseCard({
  title,
  text,
  icon,
  bg,
  border,
  timestamp,
  accountName,
  token1,
  rotate,
  status,
  report,
  onClick,
  loading,
}: {
  title: string | JSX.Element
  text: string | JSX.Element
  icon?: string | StaticImageData
  token1?: string | StaticImageData
  token2?: string | StaticImageData
  rotate?: number
  status?: string | JSX.Element
  timestamp: string
  accountName: string
  bg?: string
  border?: string
  report?: string
  onClick?: () => void
  loading?: boolean
}): JSX.Element {
  const theme = useTheme()

  const timeFormat = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0)
    const thatDay = new Date(Number(timestamp) * 1000).setHours(0, 0, 0, 0)
    return today === thatDay ? 'HH:mm' : undefined
  }, [timestamp])

  const time = formatTimestamp(Number(timestamp) * 1000, timeFormat)
  const getImageSize = () => {
    return isMobile ? 24 : 34
  }

  const onClickItem = () => {
    onClick && onClick()
  }

  return (
    <>
      <Container
        bg={bg}
        border={border}
        report={!!report}
        onClick={onClickItem}
        cursor={!!onClick ? 'pointer' : 'default'}
      >
        <LogoWrapper rotate={rotate}>
          {loading ? (
            <ShimmerAnimation width={'40px'} height={'40px'} borderRadius={'20px'} />
          ) : (
            <>
              {icon && (
                <Image unoptimized={true} src={icon} width={getImageSize()} height={getImageSize()} alt={`icon`} />
              )}
              {token1 && <Logos img1={token1 ?? DefaultToken} />}
            </>
          )}
        </LogoWrapper>

        <Wrapper>
          <TextRow>
            <RowStart width={'80%'}>{title}</RowStart>
            <RowEnd>
              <Timestamp alert={!!border ? theme.text1 : undefined}>{time}</Timestamp>
            </RowEnd>
          </TextRow>
          <TextGrid>
            <RowStart>
              {text} {status && status}
            </RowStart>
            <RowEnd>
              <AccountName alert={!!border ? theme.text0 : undefined}>{`${accountName}`}</AccountName>
            </RowEnd>
          </TextGrid>
        </Wrapper>
      </Container>
      {report && <Report>{report}</Report>}
    </>
  )
}
