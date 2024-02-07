import { useState, useEffect } from 'react'

const useMobilePlatformDetection = () => {
  const [platform, setPlatform] = useState<string | null>(null)

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase()

    console.log('userAgent', userAgent)

    // Check if the user agent string contains "android"
    if (userAgent.includes('android')) {
      setPlatform('android')
    }

    // Check if the user agent string contains "iphone" or "ipad" for iOS
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      setPlatform('iOS')
    }
  }, [])

  return platform
}

export default useMobilePlatformDetection
