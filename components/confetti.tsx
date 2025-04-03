"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

export function Confetti() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    if (typeof window !== "undefined") {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Since particles fall down, start a bit higher than random
        confetti({
          particleCount,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#f472b6", "#ec4899", "#db2777", "#be185d"],
        })

        // And start a bit lower than random
        confetti({
          particleCount,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#f472b6", "#ec4899", "#db2777", "#be185d"],
        })
      }, 250)
    }
  }, [])

  // Don't render anything on the server
  if (!isClient) return null

  return null
}

