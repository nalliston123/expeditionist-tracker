"use client"

import { useState, useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
import CountryList from "@/components/CountryList"
import { compareCountryLists } from "@/utils/compareCountryLists"
import FlyingPlane from "@/components/FlyingPlane"
import Image from "next/image"
import SplashScreen from "@/components/SplashScreen"

const WorldMap = dynamic(() => import("@/components/WorldMap"), {
  ssr: false,
})

export default function Home() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [mapCountries, setMapCountries] = useState<string[]>([])
  const [planeTrigger, setPlaneTrigger] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const handleCountryToggle = useCallback((country: string) => {
    setSelectedCountries((prev) => {
      if (prev.includes(country)) {
        return prev.filter((c) => c !== country)
      } else {
        setPlaneTrigger((t) => t + 1)
        return [...prev, country]
      }
    })
  }, [])

  const handleMapLoad = useCallback((countries: string[]) => {
    setMapCountries(countries)
  }, [])

  useEffect(() => {
    if (mapCountries.length > 0) {
      compareCountryLists(mapCountries, CountryList.countries)
    }
  }, [mapCountries])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isLoading && <SplashScreen />}
      <div
        className={`min-h-screen lg:h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 overflow-hidden flex flex-col relative transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto h-full w-full flex flex-col flex-grow z-10">
          <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-4 sm:space-y-6 lg:space-y-0 h-full w-full">
            <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-4 flex items-center justify-center lg:h-full">
              <WorldMap
                selectedCountries={selectedCountries}
                onCountryClick={handleCountryToggle}
                onMapLoad={handleMapLoad}
              />
            </div>
            <div className="w-full lg:w-1/3 h-[calc(100vh-8rem)] sm:h-[calc(100vh-12rem)] lg:h-full">
              <CountryList selectedCountries={selectedCountries} onCountryToggle={handleCountryToggle} />
            </div>
          </div>
        </div>
        <FlyingPlane trigger={planeTrigger} />
        <a
          href="https://neilalliston.com"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 w-8 h-8 opacity-50 hover:opacity-100 transition-opacity z-50"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-oriMpcrtL0ucoafsz7Kqe2fNkuGNo9.svg"
            alt="Visit Neil Alliston's website"
            width={32}
            height={32}
            className="w-full h-full"
          />
        </a>
      </div>
    </>
  )
}

