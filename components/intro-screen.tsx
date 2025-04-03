"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, Sparkles } from "lucide-react"

interface IntroScreenProps {
  onStart: () => void
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [text, setText] = useState("")
  const fullText = "O Caminho do Nosso Amor"
  const [showButton, setShowButton] = useState(false)
  const [showHearts, setShowHearts] = useState(false)

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      setText(fullText.substring(0, index))
      index++
      if (index > fullText.length) {
        clearInterval(timer)
        setTimeout(() => {
          setShowButton(true)
          setShowHearts(true)
        }, 500)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-screen w-full max-w-md mx-auto px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="mb-8 relative"
      >
        <Heart className="h-24 w-24 text-pink-500" fill="currentColor" />

        {/* Animated sparkles around the heart */}
        {showHearts && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                  x: [0, Math.cos((i * Math.PI) / 4) * 50],
                  y: [0, Math.sin((i * Math.PI) / 4) * 50],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
                style={{
                  left: "50%",
                  top: "50%",
                  translateX: "-50%",
                  translateY: "-50%",
                }}
              >
                <Sparkles className="text-pink-400 h-4 w-4" />
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      <h1 className="text-4xl font-bold text-pink-700 mb-6 h-16">
        {text}
        <span className="animate-pulse">|</span>
      </h1>

      <p className="text-lg text-pink-600 mb-8">Uma jornada interativa pelos momentos especiais do nosso amor</p>

      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <Button
            onClick={onStart}
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Iniciar Nossa Jornada
          </Button>

          {/* Animated hearts around the button */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`btn-heart-${i}`}
              className="absolute"
              animate={{
                y: [0, -20],
                x: [(i - 2) * 10, (i - 2) * 20],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
                repeatType: "loop",
              }}
              style={{
                bottom: "100%",
                left: "50%",
              }}
            >
              <Heart className="text-pink-400 h-4 w-4" fill="currentColor" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

