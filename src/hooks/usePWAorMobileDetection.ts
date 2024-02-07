import { useEffect, useState } from 'react'

const usePWAAndPlatformDetection = () => {
  const [isPWA, setIsPWA] = useState(false)
  const [platform, setPlatform] = useState('unknown')

  useEffect(() => {
    const handleDetection = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const IOS = navigator.userAgent.match(/iPhone|iPad|iPod/)
      const ANDROID = navigator.userAgent.match(/Android/)
      const isInstalled = !!(isStandalone || (IOS && !navigator.userAgent.match(/Safari/)))

      setIsPWA(isInstalled)
      setPlatform(IOS ? 'ios' : ANDROID ? 'android' : 'unknown')
    }

    handleDetection()

    window.addEventListener('beforeinstallprompt', handleDetection)
    window.addEventListener('appinstalled', handleDetection)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleDetection)
      window.removeEventListener('appinstalled', handleDetection)
    }
  }, [])

  return { isPWA, platform }
}

export default usePWAAndPlatformDetection
