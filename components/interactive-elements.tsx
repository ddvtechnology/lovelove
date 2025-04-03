"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Stars } from "lucide-react"

export default function InteractiveElements() {
  const [clickPositions, setClickPositions] = useState<{ x: number; y: number; id: number; type: string }[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const trailRef = useRef<{ x: number; y: number }[]>([])
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Random choice between heart and star
      const type = Math.random() > 0.3 ? "heart" : "star"

      const newElement = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
        type,
      }

      setClickPositions((prev) => [...prev, newElement])

      // Remove element after animation
      setTimeout(() => {
        setClickPositions((prev) => prev.filter((item) => item.id !== newElement.id))
      }, 2000)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Add to trail
      trailRef.current.push({ x: e.clientX, y: e.clientY })

      // Keep only the last 10 positions
      if (trailRef.current.length > 10) {
        trailRef.current.shift()
      }

      // Update trail state (but not on every mouse move to avoid performance issues)
      if (Math.random() > 0.7) {
        setTrail(trailRef.current.map((pos, i) => ({ ...pos, id: i })))
      }
    }

    window.addEventListener("click", handleClick)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("click", handleClick)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <>
      {/* Mouse trail */}
      <AnimatePresence>
        {trail.map((point, i) => (
          <motion.div
            key={`trail-${point.id}`}
            initial={{ opacity: 0.7, scale: 0.5 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            className="fixed z-0 pointer-events-none"
            style={{
              left: point.x,
              top: point.y,
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <div
              className="rounded-full bg-pink-400"
              style={{
                width: `${4 * (1 - i / 10)}px`,
                height: `${4 * (1 - i / 10)}px`,
                opacity: 1 - i / 10,
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Click animations */}
      <AnimatePresence>
        {clickPositions.map((item) => (
          <motion.div
            key={item.id}
            initial={{ scale: 0, x: item.x, y: item.y, opacity: 1 }}
            animate={{
              scale: 1.5,
              y: item.y - 100,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: 0,
              top: 0,
              translateX: item.x,
              translateY: item.y,
            }}
          >
            {item.type === "heart" ? (
              <Heart className="text-pink-500" fill="currentColor" />
            ) : (
              <Stars className="text-pink-400" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  )
}

