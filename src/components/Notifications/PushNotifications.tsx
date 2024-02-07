import { useEffect } from 'react'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getToken, onMessage } from 'firebase/messaging'
import { messaging } from 'utils/firebase'
import { toast } from 'react-toastify'
import useFirebaseAuthAndNotification from 'hooks/useFirebaseAuthAndNotification'
import useRegisterServiceWorker from 'hooks/useRegisterServiceWorker'
import { useAppDispatch } from 'state'
import { NotificationDetails, NotificationType } from 'state/notifications/types'
import { addUnreadNotification } from 'state/notifications/actions'
import { useAddPopup } from 'state/application/hooks'
import { useNotificationAdderCallback, useSetNewNotificationFlag } from 'state/notifications/hooks'
import { setInterval } from 'timers/promises'

export default function PushNotifications() {
  useFirebaseAuthAndNotification()
  useRegisterServiceWorker('/firebase-messaging-sw.js')
  const dispatch = useAppDispatch()
  const addPopup = useAddPopup()
  const newNotificationNotifier = useSetNewNotificationFlag()
  const notificationAdder = useNotificationAdderCallback()

  useEffect(() => {
    onMessage(messaging, (payload) => {
      // console.log('Message received. ', payload)
      const notification: NotificationDetails = {
        id: '0',
        createTime: Math.floor(Date.now() / 1000).toString(),
        modifyTime: Math.floor(Date.now() / 1000).toString(),
        showInModal: true,
        quoteId: null,
        stateType: null,
        counterpartyAddress: null,
        notificationType: NotificationType.PUSH,
        filledAmountClose: null,
        filledAmountOpen: null,
        lastSeenAction: null,
        actionStatus: null,
        failureType: null,
        failureMessage: null,
        errorCode: null,
        pushNotificationTitle: payload?.notification?.title || '',
        pushNotificationBody: payload?.notification?.body || '',
      }
      notificationAdder(notification, 'unread')
      addPopup(notification, 'push-notification-' + Math.random().toString(), 5000)
      newNotificationNotifier()
    })
  }, [dispatch, addPopup, newNotificationNotifier, notificationAdder])
  return <></>
}
