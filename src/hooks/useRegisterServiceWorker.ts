import { useEffect } from 'react'

function useRegisterServiceWorker(url: string) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(url)
        .then((registration) => {
          console.log('Service register', registration.scope)
        })
        .catch((err) => {
          console.log('Service Worker register failed:', err)
        })
    }
  }, [url])
}

export default useRegisterServiceWorker
