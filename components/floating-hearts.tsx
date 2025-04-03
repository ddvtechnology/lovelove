"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<
    {
      id: number
      x: number
      y: number
      size: number
      rotation: number
      color: string
    }[]
  >([])

  useEffect(() => {
    // Create initial hearts - aumentado para 25
    const createHearts = () => {
      const newHearts = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -20 + Math.random() * 120, // Distribuir em diferentes alturas iniciais
        size: 8 + Math.random() * 16,
        rotation: Math.random() * 30 - 15,
        color: Math.random() > 0.5 ? "#ec4899" : "#f472b6",
      }))

      setHearts(newHearts)
    }

    createHearts()

    // Periodically refresh hearts
    const interval = setInterval(() => {
      setHearts((prev) =>
        prev.map((heart) => ({
          ...heart,
          y: heart.y > 120 ? -20 : heart.y + 0.2, // Reset position when it goes off screen
          x: heart.x + (Math.random() * 0.4 - 0.2), // Slight horizontal drift
        })),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="absolute"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              zIndex: 0,
            }}
          >
            <motion.div
              animate={{
                rotate: [heart.rotation, heart.rotation + 10, heart.rotation],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Heart size={heart.size} fill={heart.color} stroke="none" className="opacity-70" />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

