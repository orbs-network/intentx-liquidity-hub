import { useEffect } from 'react'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getToken } from 'firebase/messaging'
import { messaging } from 'utils/firebase'

const useFirebaseAuthAndNotification = () => {
  useEffect(() => {
    const firebaseAnonymouslyLogin = () => {
      return signInAnonymously(getAuth()).then((usuario) => {
        console.log(usuario)
        return usuario
      })
    }

    const getFirebaseNotificationToken = async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey: 'BKaexN-pDD8wV5fT9E5LLWpLim310bWhMMsQGOC-MYZuoqdDErsozQGPySdLCHdC_Kd799GIgYgwagdl7XjG5PQ',
        })
        console.log('Firebase Notification Token:', token)
      } catch (error) {
        console.error('Error generating token', error)
      }
    }

    firebaseAnonymouslyLogin().then(() => {
      getFirebaseNotificationToken()
    })
  }, [])
}

export default useFirebaseAuthAndNotification
