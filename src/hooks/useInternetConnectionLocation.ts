import { useEffect, useState } from 'react'

interface LocationAPIDetails {
  ip: string
  network: string
  version: string
  city: string
  region: string
  region_code: string
  country: string
  country_name: string
  country_code: string
  country_code_iso3: string
  country_capital: string
  country_tld: string
  continent_code: string
  in_eu: boolean
  postal: string
  latitude: string
  longitude: number
  timezone: string
  utc_offset: string
  country_calling_code: string
  currency: string
  currency_name: string
  languages: string
  country_area: number
  country_population: number
  asn: string
  org: string
}

export default function useInternetConnectionLocation() {
  const [locationDetails, setLocationDetails] = useState<LocationAPIDetails | null>(null)
  const getInfo = () => {
    fetch('https://ipapi.co/json/')
      .then((response) => response.json())
      .then((data: LocationAPIDetails) => {
        setLocationDetails(data)
      })
  }

  useEffect(() => {
    getInfo()
  }, [])

  const isLoading = locationDetails === null
  const isUSResident = locationDetails?.continent_code === 'US'

  return { locationDetails, isLoading, isUSResident }
}
