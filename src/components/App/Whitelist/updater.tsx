import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import useActiveConnectionDetails from 'lib/hooks/useActiveConnectionDetails'
import { useActiveAccount, useAddInWhitelist, useIsWhiteList, useUserWhitelist } from 'state/user/hooks'
import { MULTI_ACCOUNT_ADDRESS } from 'constants/addresses'
import { FALLBACK_CHAIN_ID } from 'constants/chains'
import { CHECK_IS_WHITE_LIST } from 'config/index'

export default function Updater() {
  const { account, chainId } = useActiveConnectionDetails()
  const subAccount = useActiveAccount()

  const [whitelist, setWhitelist] = useState<null | boolean>(null)
  const [subWhitelist, setSubWhitelist] = useState<null | boolean>(null)
  const multiAccountAddress = chainId ? MULTI_ACCOUNT_ADDRESS[chainId] : MULTI_ACCOUNT_ADDRESS[FALLBACK_CHAIN_ID]

  const userIsWhitelist = useUserWhitelist()
  const getSubAccountWhitelist = useIsWhiteList(subAccount?.accountAddress, multiAccountAddress)
  const addInWhitelist = useAddInWhitelist(subAccount?.accountAddress, multiAccountAddress)

  useEffect(() => {
    if (account && subAccount && whitelist && subWhitelist == false) {
      addInWhitelist()
        .then((res: { successful: boolean; message: string }) => {
          // response
          // SUCCESS : {'successful'=True, message=''}
          // FAILED : {'successful'=False, message=''}
          // EXISTS : {'successful'=False, message='exists'}
          if (res.successful) {
            setSubWhitelist(true)
            toast.success('Activating succeeded')
          } else if (!res.successful && res.message === 'exists') {
            setSubWhitelist(true)
          } else {
            setSubWhitelist(null)
            toast.error('Not activated')
          }
        })
        .catch((e) => {
          console.log(e)
          CHECK_IS_WHITE_LIST && toast.error('Not activated')
        })
    }
  }, [addInWhitelist, subWhitelist, whitelist, account, subAccount])

  useEffect(() => {
    if (subAccount)
      getSubAccountWhitelist()
        .then((res) => {
          setSubWhitelist(res)
        })
        .catch((e) => {
          console.log(e)
          setSubWhitelist(null)
        })
  }, [getSubAccountWhitelist, subAccount])

  useEffect(() => {
    if (userIsWhitelist) setWhitelist(true)
  }, [userIsWhitelist])

  return <></>
}
