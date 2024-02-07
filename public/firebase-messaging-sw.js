importScripts('https://www.gstatic.com/firebasejs/9.8.4/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.8.4/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: 'AIzaSyBGGCEmvblehRn9Ky_2ObknyX_TfPfx-QA',
  authDomain: 'intentx-production.firebaseapp.com',
  projectId: 'intentx-production',
  storageBucket: 'intentx-production.appspot.com',
  messagingSenderId: '217087796622',
  appId: '1:217087796622:web:c912ca92df8caaa15330df',
}

if (firebase.messaging.isSupported()) {
  const app = firebase.initializeApp(firebaseConfig)
  const messaging = firebase.messaging(app)
  
  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/images/icon-512x512.png',
    }
  
    return self.registration.showNotification(notificationTitle, notificationOptions)
  })
  
}