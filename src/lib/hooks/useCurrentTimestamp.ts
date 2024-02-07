import { useEffect, useState } from 'react'

export default function useCurrentTimestamp() {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000))
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return timestamp
}
