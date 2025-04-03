"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Heart } from "lucide-react"
import { Confetti } from "@/components/confetti"

interface SecretMessageProps {
  onClose: () => void
}

export default function SecretMessage({ onClose }: SecretMessageProps) {
  const [accepted, setAccepted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleAccept = () => {
    setAccepted(true)
    setShowConfetti(true)
    // Don't close immediately to show the animation
    setTimeout(onClose, 8000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={!accepted ? onClose : undefined}
    >
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-white border-pink-300 shadow-xl p-6 relative overflow-hidden">
          {!accepted && (
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-pink-500 z-10" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}

          <AnimatePresence mode="wait">
            {!accepted ? (
              <motion.div key="invitation" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-6">
                  <Heart className="h-12 w-12 text-pink-500 mx-auto mb-2" fill="currentColor" />
                  <h3 className="text-2xl font-bold text-pink-700">Convite Especial</h3>
                </div>

                <div className="prose prose-pink mx-auto text-center">
                  <p className="text-pink-600">Meu amor, tenho um convite muito especial para você...</p>

                  <div className="my-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <Heart className="h-6 w-6 text-pink-500 mx-auto mb-2" fill="currentColor" />
                    <p className="font-semibold text-pink-700">Você aceita ser feliz ao meu lado pelo resto da vida?</p>
                  </div>

                  <p className="text-pink-600">
                    Quero construir memórias, sonhos e uma vida inteira com você.
                    <br />
                    Cada dia ao seu lado é uma bênção que quero para sempre.
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <Button
                    className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-2 rounded-full"
                    onClick={handleAccept}
                  >
                    Sim, aceito! ❤️
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="love-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="min-h-[300px] flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [0, 1.2, 1],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    times: [0, 0.6, 1],
                    y: {
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      duration: 1.5,
                      delay: 1,
                    },
                  }}
                  className="text-center"
                >
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-transparent bg-clip-text mb-6">
                    Te amo vida!
                  </h2>

                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                      repeatType: "reverse",
                    }}
                  >
                    <Heart className="h-24 w-24 text-pink-500 mx-auto" fill="currentColor" />
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-6 text-pink-600 font-medium text-lg"
                  >
                    Para todo o sempre...
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </motion.div>
  )
}

