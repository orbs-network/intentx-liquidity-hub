'use client'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyBGGCEmvblehRn9Ky_2ObknyX_TfPfx-QA',
  authDomain: 'intentx-production.firebaseapp.com',
  projectId: 'intentx-production',
  storageBucket: 'intentx-production.appspot.com',
  messagingSenderId: '217087796622',
  appId: '1:217087796622:web:c912ca92df8caaa15330df',
}
let app, analytics, messaging

if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig)
  analytics = getAnalytics(app)
  messaging = getMessaging(app)
}

export { app, analytics, messaging }
