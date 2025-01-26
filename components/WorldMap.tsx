"use client"

import { useState, useEffect, useRef } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { Download, Palette } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { HexColorPicker } from "react-colorful"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface WorldMapProps {
  selectedCountries: string[]
  onCountryClick: (country: string) => void
  onMapLoad: (countries: string[]) => void
}

export default function WorldMap({ selectedCountries, onCountryClick, onMapLoad }: WorldMapProps) {
  const [geoData, setGeoData] = useState(null)
  const [error, setError] = useState<string | null>(null)
  const [mapCountries, setMapCountries] = useState<string[]>([])
  const mapRef = useRef<SVGSVGElement>(null)
  const [selectedColor, setSelectedColor] = useState("#007848")

  useEffect(() => {
    fetch(geoUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        setGeoData(data)
        const countries = data.objects.countries.geometries.map((geo) => geo.properties.name)
        setMapCountries(countries)
        onMapLoad(countries)
      })
      .catch((error) => {
        console.error("Error fetching map data:", error)
        setError(`Failed to load map data: ${error.message}`)
      })
  }, [onMapLoad])

  const handleExport = () => {
    console.log("Export function started")
    if (mapRef.current) {
      console.log("Map ref found, creating SVG data")
      const svgData = new XMLSerializer().serializeToString(mapRef.current)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const svgUrl = URL.createObjectURL(svgBlob)

      console.log("Creating image from SVG")
      const img = new Image()
      img.onload = () => {
        console.log("Image loaded, creating canvas")
        const canvas = document.createElement("canvas")
        const scaleFactor = /Chrome/.test(navigator.userAgent) ? 4 : 2 // Increase size for Chrome, keep 2x for others
        canvas.width = img.width * scaleFactor
        canvas.height = img.height * scaleFactor
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.fillStyle = "white"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          // Calculate scaling to fit the entire map
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
          const x = canvas.width / 2 - (img.width / 2) * scale
          const y = canvas.height / 2 - (img.height / 2) * scale

          ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

          console.log("Converting canvas to PNG")
          const pngUrl = canvas.toDataURL("image/png")

          console.log("Creating download link")
          const link = document.createElement("a")
          link.href = pngUrl
          link.download = "travel-map.png"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          console.log("Cleaning up")
          URL.revokeObjectURL(svgUrl)
        } else {
          console.error("Failed to get canvas context")
        }
      }
      img.onerror = () => {
        console.error("Error loading image from SVG")
        URL.revokeObjectURL(svgUrl)
      }
      img.src = svgUrl
    } else {
      console.error("Map ref is null")
    }
  }

  if (error) {
    return <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-500">{error}</div>
  }

  return (
    <div className="w-full h-full">
      <div className="w-full h-full relative bg-transparent aspect-[4/3]">
        <svg ref={mapRef} width="100%" height="100%" viewBox="0 0 1600 1200" style={{ backgroundColor: "white" }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 147,
              center: [0, 20],
            }}
          >
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  if (geo.properties.name === "Antarctica") return null
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => onCountryClick(geo.properties.name)}
                      style={{
                        default: {
                          fill: selectedCountries.includes(geo.properties.name) ? selectedColor : "#D6D6DA",
                          outline: "none",
                        },
                        hover: {
                          fill: selectedColor,
                          outline: "none",
                        },
                        pressed: {
                          fill: selectedColor,
                          outline: "none",
                        },
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>
        </svg>
        <div className="absolute bottom-2 left-2 right-2 flex justify-between map-buttons-container">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
              >
                <Palette className="h-4 w-4" />
                <span className="sr-only">Choose annotation color</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start" alignOffset={-45} side="top" sideOffset={5}>
              <div className="flex flex-col space-y-3">
                <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Selected Color:</span>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <span className="text-sm">{selectedColor}</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <button
            onClick={handleExport}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Export map"
          >
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

