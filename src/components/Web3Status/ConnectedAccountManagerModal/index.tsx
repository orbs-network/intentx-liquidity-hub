import { Button } from 'rebass'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import Modal from 'styled-react-modal'
import { AccountType, useAA } from 'state/accountAbstraction/provider/AAProvider'
import styled, { useTheme } from 'styled-components'
import Image from 'next/image'
import { Row } from 'components/Row'
import { Copy, IconWrapper, LogOut } from 'components/Icons'
import { SplittedModal, Subtitle, Title } from 'components/Modal'
import ETH from '/public/static/images/tokens/ETH.svg'
import Column from 'components/Column'
import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { truncateAddress } from 'utils/address'
import { SignButton } from 'components/Button'
import { ButtonGray } from '../AccountManager/AccountAbstractionMultiAccount'
import SafeIcon from '/public/static/images/etc/safeIcon.svg'
import ArrowUpRight from 'components/Icons/ArrowUpR'
import { useCurrency } from 'lib/hooks/useTokens'
import { COLLATERAL_ADDRESS } from 'constants/addresses'
import { useAccountPartyAStat } from 'state/user/hooks'
import { formatAmount } from 'utils/numbers'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'

import Google from '/public/static/images/google-fill.svg'
import Apple from '/public/static/images/apple-fill.svg'
import EmailIcon from '/public/static/images/socials/email-outline.svg'
import useCurrencyLogo from 'lib/hooks/useCurrencyLogo'

const ModalContent = styled(SplittedModal)`
  width: 497px;s
  border-radius: 15px;
  background: rgba(23, 26, 31, 1);
  padding: 20px;
`
const ProfileImage = styled(Image)`
  border-radius: 150px;
  display: flex;
`

const HeaderContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3px;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0px;
`

const TitleHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
`
const SocialButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: ${({ theme }) => theme.gradCustom1};
`

const LogoutButton = styled.div`
  display: flex;
  justify-content: center;
`

const AccountButton = styled(SignButton)`
  width: 211px;
  height: 43px;
`
const SafeButton = styled(ButtonGray)`
  width: 230px;
  height: 43px;
  display: flex;
  flex-direction: row;
  gap: 5px;
  cursor: pointer;
`

const WalletContainer = styled.div`
  cursor: pointer;
  display: flex;
  gap: 4px;
  margin-top: 5px;
`

export default function ConnectedAccountManagerModal() {
  const isOpen = useModalOpen(ApplicationModal.CONNECTED_ACCOUNT_MANAGEMENT)
  const { logoutWeb3Auth } = useAA()
  const toggleModal = useToggleModal(ApplicationModal.CONNECTED_ACCOUNT_MANAGEMENT)
  const { userInfo, isConnected } = useAA()
  const { account, chainId } = useActiveConnectionDetails()
  const theme = useTheme()
  const router = useRouter()

  const collateralCurrency = useCurrency(chainId ? COLLATERAL_ADDRESS[chainId] : undefined)
  const { collateralBalance } = useAccountPartyAStat(account)
  const collateralIcon = useCurrencyLogo(collateralCurrency?.symbol)

  const { ownerAddress, accountType } = useAA()

  function getLabel(): string | null {
    switch (accountType) {
      case AccountType.GOOGLE_TEST:
        return 'Google'
      case AccountType.GOOGLE:
        return 'Google'
      case AccountType.APPLE:
        return 'Apple'
      case AccountType.DISCORD:
        return 'Discord'
      default:
        return 'Social Login'
    }
  }

  function getIcon(): any | null {
    switch (accountType) {
      case AccountType.GOOGLE_TEST:
        return Google
      case AccountType.GOOGLE:
        return Google
      case AccountType.APPLE:
        return Apple
      case AccountType.DISCORD:
        return Google
      default:
        return Google
    }
  }

  return (
    <ModalContent isOpen={isOpen} onBackgroundClick={toggleModal} onEscapeKeydown={toggleModal}>
      <Row justify="center">
        <ProfileImage
          unoptimized={false}
          src={userInfo.profileImage!}
          alt="profileImage"
          width={116}
          height={115}
        ></ProfileImage>
      </Row>
      <HeaderContent>
        <TitleHeader>
          <SocialButton>
            <Image src={getIcon()} alt="google" />
          </SocialButton>
          <div>
            <Subtitle>Connected with {getLabel()}</Subtitle>
            <Title>
              <strong>{userInfo.email}</strong>
            </Title>
          </div>
        </TitleHeader>
        <Column>
          <Row gap="5px" justify="flex-end">
            <Image unoptimized={true} src={collateralIcon} alt="icon" width={22} height={22} />
            <Title size="18px">
              <strong>
                {formatAmount(collateralBalance, 4)} {collateralCurrency?.symbol}
              </strong>
            </Title>
          </Row>
          <Row gap="5px">
            <WalletContainer>
              <Copy
                onClick={() => {
                  navigator.clipboard.writeText(account!)
                  toast.success('Copied to clipboard')
                }}
                isHover={false}
                size={18}
              ></Copy>
              <Title size="14px">
                <strong>{account && truncateAddress(account, 5)}</strong>
              </Title>
            </WalletContainer>
          </Row>
        </Column>
      </HeaderContent>
      <Row gap="20px">
        <AccountButton
          onClick={() => {
            toggleModal()
            router.push('/my-account')
          }}
        >
          <Title size="14px">Account Manage</Title>
          <ArrowUpRight
            size={20}
            strokeW="2"
            style={{
              marginLeft: '6px',
              color: theme.white,
            }}
          />
        </AccountButton>
        <SafeButton
          onClick={() => {
            window.open(`https://app.safe.global/home?safe=base:${account}`, '_blank')
          }}
        >
          <Image unoptimized={true} src={SafeIcon} alt="icon" width={16} height={16} />
          <Title size="14px">Safe Wallet</Title>
        </SafeButton>
      </Row>
      <Row justify="center" marginTop="20px">
        <Button
          onClick={() => {
            logoutWeb3Auth()
            toggleModal()
          }}
        >
          <Row gap="5px">
            <LogOut isHover={false}></LogOut>
            <Title>Disconnect account</Title>
          </Row>
        </Button>
      </Row>
    </ModalContent>
  )
}
