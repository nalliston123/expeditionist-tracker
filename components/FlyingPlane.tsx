import type React from "react"
import { useEffect, useState } from "react"

interface FlyingPlaneProps {
  trigger: number
}

const FlyingPlane: React.FC<FlyingPlaneProps> = ({ trigger }) => {
  const [isFlying, setIsFlying] = useState(false)
  const [style, setStyle] = useState({})

  useEffect(() => {
    if (trigger) {
      const startX = -100
      const startY = window.innerHeight * (0.7 + Math.random() * 0.3) // Bottom 30% of the screen
      const endX = window.innerWidth + 100
      const endY = window.innerHeight * Math.random() * 0.3 // Top 30% of the screen
      const duration = 1500 + Math.random() * 1000 // 1.5-2.5 seconds

      setStyle({
        position: "fixed",
        left: `${startX}px`,
        top: `${startY}px`,
        fontSize: "48px",
        transition: `all ${duration}ms linear`,
        zIndex: 1,
      })

      setIsFlying(true)

      setTimeout(() => {
        setStyle((prevStyle) => ({
          ...prevStyle,
          left: `${endX}px`,
          top: `${endY}px`,
        }))
      }, 100)

      setTimeout(() => {
        setIsFlying(false)
      }, duration + 100) // Add a small buffer to ensure the animation completes
    }
  }, [trigger])

  if (!isFlying) return null

  return <div style={style as React.CSSProperties}>✈️</div>
}

export default FlyingPlane

