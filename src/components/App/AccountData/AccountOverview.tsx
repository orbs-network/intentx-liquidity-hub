import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import styled, { useTheme } from 'styled-components'

import { COLLATERAL_TOKEN } from 'constants/tokens'
import { formatAmount, formatDollarAmount, toBN } from 'utils/numbers'
import { getTokenWithFallbackChainId } from 'utils/token'

import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useDepositModalToggle, useModalOpen, useWithdrawModalToggle } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { useAccountPartyAStat, useActiveAccount, useLeverage, useSetExpertModeCallback } from 'state/user/hooks'

import useAccountData from 'hooks/useAccountData'
import { useAccountsLength } from 'hooks/useAccounts'

import AccountUpnl from 'components/App/AccountData/AccountUpnl'
import DataRow from 'components/App/AccountData/DataRow'
import Emoji from 'components/App/AccountData/Emoji'
import GradientButton from 'components/Button/GradientButton'
import { ColumnCenter } from 'components/Column'
import HealthGauge from 'components/Gauge/HealthGauge'
import { AddUser as AddUserIcon, ChartRingIcon, EmptyPosition } from 'components/Icons'
import WalletGrad2 from 'components/Icons/WalletGrad2'
import { ContextError, useInvalidContext } from 'components/InvalidContext'
import CreateAccountModal from 'components/Modals/CreateAccountModal'
import { Row, RowBetween, RowEnd } from 'components/Row'
import { ToolTipBottomEnd } from 'components/ToolTip'
import useGradient from 'hooks/useGradient'
import useAccountAverageCrossMargin from 'hooks/user/useAccountAverageCrossMargin'
import { useIsLaptop, useIsMobile } from 'lib/hooks/useWindowSize'
import { EmptyRow } from '../UserPanel/Common'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  border-radius: 4px;
  flex-grow: 1;
`

const Title = styled(Row)`
  font-weight: 500;
  font-size: 13px;
  line-height: 12px;
  padding: 12px;
  color: ${({ theme }) => theme.text0};
  padding-bottom: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 14px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px;
`};
`

const AccountHealth = styled(RowEnd)<{ color?: string }>`
  font-weight: 500;
  font-size: 16px;
  padding: 12px 12px 12px 0px;
  color: ${({ theme, color }) => color ?? theme.text1};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px;
  padding: 9px;
`};
`

export const AccountHealthText = styled.div`
  font-size: 14px;
  margin-right: 4px;
  margin-top: 2px;
  color: ${({ theme }) => theme.text3};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 11px;
  margin-right: 3px;
  margin-top: 1.5px;
`};
`

const CrossMargin = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  font-size: 12px;
  line-height: 0;
  font-weight: 600;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    opacity: 0.3;
    background: ${({ theme }) => theme.gradCustom1};
  }
`

const CrossMarginLeft = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px 7px;
  gap: 5px;
  margin-right: auto;
`

const CrossMarginIcon = styled.div`
  line-height: 0;
  font-size: 18px;
`

const CrossMarginText = styled.div``

const CrossMarginRight = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 41px 7px 40px;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    opacity: 0.3;
    background: ${({ theme }) => theme.gradCustom1};
  }
`

const ContentWrapper = styled.div`
  display: flex;
  padding: 12px;
  flex-flow: column nowrap;
  position: relative;
  flex-grow: 1;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 9px;
`};
`

const DataWrap = styled.div`
  display: flex;
  padding: 4px 12px;
  flex-flow: column nowrap;
  position: relative;
  background: ${({ theme }) => theme.bgCustom2};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  padding: 2px 9px;
`};
`

const TopRow = styled(RowBetween)`
  flex-flow: row nowrap;
  margin-top: 4px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
`};
`

const Label = styled.div`
  font-size: 13px;
  justify-self: start;
  color: ${({ theme }) => theme.text3};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 12px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px;
`};
`

const ButtonsWrapper = styled(RowEnd)`
  margin-top: 16px;
  gap: 8px;
  display: flex;
  justify-content: center;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-top: 12px;
  gap: 6px;
`};
`

const ContextText = styled.div`
  font-size: 14px;
  margin-top: 20px;
  color: ${({ theme }) => theme.text3};

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px;
  margin-top: 15px;
`};
`

const LiquidatedHealth = styled.span`
  font-size: 14px;
  font-weight: 600;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  font-size: 12px;
`};
`

const BackgroundImage = styled.div`
  background: rgba(30, 34, 40, 1);
  border-radius: 5px;
  padding: 10px;
  width: 77.54px;
  height: 78px;
`

const HealthContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
const CreateAccountButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  font-size: 14px;
  background: ${({ theme }) => theme.gradCustom5};
  height: 53px;
  gap: 5px;
  width: 90%;
  margin-top: 20px;
  border-radius: 4px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
  gap: 3.75px;
  min-width: 178px;
  font-size: 11px;
`};
`

const EmptyPositionContainer = styled.div`
  margin-top: 30px;
`

export enum PanelType {
  POSITION_OVERVIEW = 'POSITION OVERVIEW',
  ACCOUNT_OVERVIEW = 'ACCOUNT OVERVIEW',
}

export default function AccountOverview() {
  const theme = useTheme()
  const { chainId } = useActiveConnectionDetails()
  const { accountAddress } = useActiveAccount() || {}
  const { accountLength, loading: accountsLoading } = useAccountsLength()
  const validatedContext = useInvalidContext()
  const userLeverage = useLeverage()
  const averageLeverageCrossMargin = useAccountAverageCrossMargin()

  const accountCrossMargin = useAccountAverageCrossMargin()

  const {
    allocatedBalance,
    accountBalance,
    lockedPartyAMM,
    loading: statsLoading,
    liquidationStatus,
  } = useAccountPartyAStat(accountAddress)

  const {
    equity,
    maintenanceMargin,
    accountHealthData: { health: accountHealth, healthColor, healthEmoji },
    availableForOrder,
  } = useAccountData()

  const isLaptop = useIsLaptop()
  const isMobile = useIsMobile()

  const collateralCurrency = getTokenWithFallbackChainId(COLLATERAL_TOKEN, chainId)

  const showDepositModal = useModalOpen(ApplicationModal.DEPOSIT)
  const showWithdrawModal = useModalOpen(ApplicationModal.WITHDRAW)
  const toggleDepositModal = useDepositModalToggle()
  const toggleWithdrawModal = useWithdrawModalToggle()
  const [createAccountModal, setCreateAccountModal] = useState(false)
  const formattedAccountHealth = formatAmount(Number(accountHealth), 3)

  const redToGreenFade = useGradient('#BD2738', '#27F290', formattedAccountHealth, 'gauge-gradient-id')

  const arcSegments = [
    {
      min: 0,
      max: 1,
      ...redToGreenFade,
    },
  ]

  if (validatedContext !== ContextError.VALID) {
    return <NotValidState text={'You are not connected'} />
  } else if (statsLoading || accountsLoading) {
    return <NotValidState text={'loading ...'} />
  } else if (accountLength === 0) {
    return (
      <>
        <EmptyRow>
          <EmptyPositionContainer>
            <EmptyPosition style={{ margin: '40px auto 16px auto' }} />
          </EmptyPositionContainer>
          You have no account!
        </EmptyRow>
        <CreateAccountButton onClick={() => setCreateAccountModal(true)}>
          <AddUserIcon width={18} height={18} />
          Create Account
        </CreateAccountButton>
        <CreateAccountModal isOpen={createAccountModal} onDismiss={() => setCreateAccountModal(false)} />
      </>
    )
  } /* else if (toBN(allocatedBalance).isZero() && toBN(accountBalance).isZero()) {
    return <StartTrading symbol={collateralCurrency?.symbol} />
  } */ else {
    return (
      <>
        <Wrapper>
          <TopRow>
            <DeveloperModeTitle title={'Account Health:'} />
            <AccountHealth color={liquidationStatus ? theme.red1 : healthColor}>
              {liquidationStatus ? (
                <>
                  <LiquidatedHealth>Liquidation Pending</LiquidatedHealth>
                  <Emoji
                    symbol={healthEmoji.symbol}
                    label={healthEmoji.label}
                    style={{ width: '22px', marginLeft: '4px' }}
                  />
                </>
              ) : isNaN(Number(accountHealth)) ? (
                '-'
              ) : (
                <HealthContainer>
                  {formatAmount(Number(accountHealth), 3)}%
                  {/* <Emoji
                    symbol={healthEmoji.symbol}
                    label={healthEmoji.label} 
                    style={{ width: '22px', marginLeft: '4px' }}
                  /> */}
                  <HealthGauge
                    min={0}
                    max={100}
                    height={160}
                    width={250}
                    value={formattedAccountHealth}
                    maxAngle={90}
                    minAngle={-90}
                    pointerLabel={formattedAccountHealth}
                    arcSegments={arcSegments}
                  />
                </HealthContainer>
              )}
            </AccountHealth>
          </TopRow>
          {!isMobile && (
            <CrossMargin data-for="cross-margin" data-tip="Current account leverage. Accounts are in cross-margin.">
              <CrossMarginLeft>
                <CrossMarginIcon>
                  <ChartRingIcon />
                </CrossMarginIcon>
                <CrossMarginText>Cross Margin</CrossMarginText>
              </CrossMarginLeft>
              <CrossMarginRight>{averageLeverageCrossMargin}x</CrossMarginRight>

              <div style={{ lineHeight: 'initial' }}>
                <ToolTipBottomEnd id="cross-margin" />
              </div>
            </CrossMargin>
          )}
          <DataWrap>
            <TopRow>
              <Label style={{ color: theme.text0 }}>Account Total uPnL:</Label>
              <AccountUpnl />
            </TopRow>
            <DataRow
              label={'Maintenance Margin (CVA):'}
              value={formatDollarAmount(maintenanceMargin, false)}
              ticker={collateralCurrency?.symbol}
              margin="3px"
            />
            <DataRow
              label={'Equity Balance:'}
              value={formatDollarAmount(equity, false)}
              ticker={collateralCurrency?.symbol}
              margin="3px"
            />
            <DataRow
              label={'Remaining Equity To Liquidation'}
              value={formatDollarAmount(toBN(equity).minus(toBN(maintenanceMargin)), false)}
              ticker={collateralCurrency?.symbol}
              margin="3px"
            />
          </DataWrap>
          {isMobile && (
            <CrossMargin data-for="cross-margin" data-tip="Current account leverage. Accounts are in cross-margin.">
              <CrossMarginLeft>
                <CrossMarginIcon>
                  <ChartRingIcon />
                </CrossMarginIcon>
                <CrossMarginText>Cross Margin</CrossMarginText>
              </CrossMarginLeft>
              <CrossMarginRight>{averageLeverageCrossMargin}x</CrossMarginRight>

              <div style={{ lineHeight: 'initial' }}>
                <ToolTipBottomEnd id="cross-margin" />
              </div>
            </CrossMargin>
          )}
          <ContentWrapper>
            <DataRow
              label={'Allocated Balance:'}
              value={formatDollarAmount(allocatedBalance, false)}
              ticker={collateralCurrency?.symbol}
              margin="3px"
            />
            <DataRow
              label={'Locked Margin:'}
              value={formatDollarAmount(lockedPartyAMM, false)}
              ticker={collateralCurrency?.symbol}
              margin="3px"
            />
            <DataRow
              label={'Available for Orders:'}
              value={formatDollarAmount(availableForOrder, false)}
              ticker={collateralCurrency?.symbol}
              margin="3px"
            />

            <ButtonsWrapper>
              <GradientButton
                buttonFilled={false}
                label={'Withdraw'}
                onClick={() => toggleWithdrawModal()}
                size={isLaptop ? '165px' : '220px'}
                height={isLaptop ? '40px' : '53px'}
              />
              <GradientButton
                buttonFilled={true}
                label={'Deposit'}
                onClick={() => toggleDepositModal()}
                size={isLaptop ? '165px' : '220px'}
                height={isLaptop ? '40px' : '53px'}
              />
            </ButtonsWrapper>
          </ContentWrapper>
        </Wrapper>
      </>
    )
  }
}

function NotValidState({ text }: { text: string }) {
  return (
    <Wrapper>
      <ColumnCenter style={{ marginTop: '90px' }}>
        <BackgroundImage>
          <WalletGrad2></WalletGrad2>
        </BackgroundImage>
        <ContextText>{text}</ContextText>
      </ColumnCenter>
    </Wrapper>
  )
}

export const DeveloperModeTitle = ({ title }: { title: string | undefined }) => {
  const setExpertMode = useSetExpertModeCallback()
  const [tries, setTries] = useState(0)

  const handleAccountOverviewClick = () => {
    setTries(tries + 1)
  }

  useEffect(() => {
    if (tries === 5) {
      toast('Developer mode enabled')
      setExpertMode(true)
    }
  }, [tries, setExpertMode])

  return <Title onClick={handleAccountOverviewClick}>{title}</Title>
}
