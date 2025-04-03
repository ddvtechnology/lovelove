"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, Star, Calendar, Map, Gift, MessageCircle } from "lucide-react"

interface JourneyMapProps {
  navigateTo: (screen: string) => void
  completedSections: {
    memoryGame: boolean
    quiz: boolean
    maze: boolean
    loveLetter?: boolean
  }
  allCompleted: boolean
}

export default function JourneyMap({ navigateTo, completedSections, allCompleted }: JourneyMapProps) {
  const [hoverPoint, setHoverPoint] = useState<string | null>(null)

  const mapPoints = [
    {
      id: "memory",
      title: "Nossas Memórias",
      description: "Jogo da memória com nossos momentos especiais",
      icon: <Calendar className="h-6 w-6" />,
      position: "top-1/4 left-1/4",
      completed: completedSections.memoryGame,
    },
    {
      id: "quiz",
      title: "Quanto Você Me Conhece?",
      description: "Responda perguntas sobre nosso relacionamento",
      icon: <Star className="h-6 w-6" />,
      position: "top-1/3 right-1/4",
      completed: completedSections.quiz,
    },
    {
      id: "maze",
      title: "Labirinto do Amor",
      description: "Guie o coração até o destino final",
      icon: <Map className="h-6 w-6" />,
      position: "bottom-1/4 left-1/3",
      completed: completedSections.maze,
    },
    {
      id: "loveLetter",
      title: "Carta de Amor",
      description: "Monte uma mensagem especial para mim",
      icon: <MessageCircle className="h-6 w-6" />,
      position: "bottom-1/3 right-1/3",
      completed: completedSections.loveLetter,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto p-6 relative h-screen flex flex-col items-center justify-center"
    >
      <h2 className="text-3xl font-bold text-pink-700 mb-8 text-center">Nossa Jornada de Amor</h2>

      <div className="relative w-full h-[500px] bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-pink-200 shadow-lg">
        {/* Simple constellation lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <motion.path
            d="M25 25 L40 33 L65 75"
            stroke="rgba(236, 72, 153, 0.2)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="M75 33 L40 33 L33 66"
            stroke="rgba(236, 72, 153, 0.2)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.path
            d="M65 75 L33 66"
            stroke="rgba(236, 72, 153, 0.2)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
          />
        </svg>

        {/* Map points */}
        {mapPoints.map((point) => (
          <motion.div
            key={point.id}
            className={`absolute ${point.position} transform -translate-x-1/2 -translate-y-1/2`}
            whileHover={{ scale: 1.1 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * mapPoints.findIndex((p) => p.id === point.id) }}
            onHoverStart={() => setHoverPoint(point.id)}
            onHoverEnd={() => setHoverPoint(null)}
          >
            <div className="flex flex-col items-center">
              <Button
                variant={point.completed ? "default" : "outline"}
                size="lg"
                className={`rounded-full p-6 ${
                  point.completed ? "bg-pink-500 text-white" : "bg-white/80 text-pink-600 border-pink-300"
                } transition-all duration-300 hover:shadow-lg`}
                onClick={() => navigateTo(point.id)}
              >
                {point.completed ? <Heart className="h-6 w-6" fill="currentColor" /> : point.icon}
              </Button>

              <motion.div
                className="mt-2 text-center bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm border border-pink-100"
                initial={{ opacity: 0.8, y: 0 }}
                animate={{
                  opacity: hoverPoint === point.id ? 1 : 0.8,
                  y: hoverPoint === point.id ? -5 : 0,
                  scale: hoverPoint === point.id ? 1.05 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-semibold text-pink-700">{point.title}</h3>
                <p className="text-xs text-pink-600 max-w-[150px]">{point.description}</p>
              </motion.div>
            </div>
          </motion.div>
        ))}

        {/* Final destination with subtle animation */}
        {allCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              damping: 10,
              stiffness: 100,
            }}
            className="absolute bottom-10 right-10 transform -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigateTo("final")}
                className="rounded-full p-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-rose-600 transition-all"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <Gift className="h-8 w-8" />
                </motion.div>
              </Button>
            </motion.div>
            <div className="mt-2 text-center bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md border border-pink-200">
              <h3 className="font-bold text-pink-700">Mensagem Especial</h3>
              <p className="text-xs text-pink-600">Desbloqueada! Clique para ver</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

