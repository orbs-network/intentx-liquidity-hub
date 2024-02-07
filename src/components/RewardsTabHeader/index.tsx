import { Row, RowBetween } from 'components/Row'
import styled from 'styled-components'
import Image from 'next/image'

import GreyCalendar from '/public/static/images/etc/secondary-calendar.svg'

import OutlineBtn from 'components/Button/OutlineButton'
import DatePickerPopPup from 'components/Calendar'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 100;
  margin-top: 20px;
  position: relative;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  margin-top: 14px;
`}
`

const TabOption = styled.div<{ active: boolean }>`
  padding: 10px 75px;
  flex-shrink: 0;
  border-bottom: 2px solid ${({ active, theme }) => (active ? theme.red : '#2A303A')};
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 6px 42px;
`}
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 10px 0;
    flex-shrink: 1;
    width: 100%;
    text-align: center;
    font-size: 12px;
  `}
`

const HeaderLine = styled.div`
  height: 4px;
  width: 100%;

  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, #2a303a 0.5%, rgba(42, 48, 58, 0.958333) 57.51%, rgba(42, 48, 58, 0) 100%);
  border-image-slice: 1;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  height: 2px;
`}
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`

const ResponsiveContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 7px;
`}
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
    justify-content: center;
    gap: 10px;
  `}
`

export default function ReferralsTabHeader({ selectedTab, onChange }: { selectedTab: string; onChange: any }) {
  const handleChangeTab = (tab: string) => (): void => {
    onChange?.(tab)
  }

  return (
    <Wrapper>
      <ResponsiveContainer>
        <Row align="flex-end">
          <TabOption active={selectedTab === 'referral'} onClick={handleChangeTab('referral')}>
            Your Referral Statistics
          </TabOption>
          {/*<TabOption active={selectedTab === 'usage'} onClick={handleChangeTab('usage')}>
            Your Usage Statistics
  </TabOption>*/}
          <HeaderLine />
        </Row>
        {/* <OutlineBtn secondary>
          <Image unoptimized={true} src={GreyCalendar} alt="icon" /> Filter by Date
        </OutlineBtn> */}
        {/* FIXME: HIDDEN UNTIL ANALYTICS ARE DISPLAYED <DatePickerPopPup isSecondary /> */}
      </ResponsiveContainer>
    </Wrapper>
  )
}
