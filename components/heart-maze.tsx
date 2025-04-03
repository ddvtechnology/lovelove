"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowDown, ArrowUp, ArrowRight, Heart, HelpCircle } from "lucide-react"
import { Confetti } from "@/components/confetti"

interface HeartMazeProps {
  onComplete: () => void
}

// Simple maze representation: 0 = path, 1 = wall, 2 = start, 3 = end
const mazeLayout = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 0, 1, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

export default function HeartMaze({ onComplete }: HeartMazeProps) {
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 }) // Start position
  const [mazeComplete, setMazeComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [moves, setMoves] = useState(0)
  const [showInstructions, setShowInstructions] = useState(true)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    // Check if player reached the end
    if (mazeLayout[playerPosition.y][playerPosition.x] === 3) {
      setMazeComplete(true)
      setShowConfetti(true)
    }

    // Set up keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mazeComplete) return

      const newPosition = { ...playerPosition }

      switch (e.key) {
        case "ArrowUp":
          newPosition.y -= 1
          break
        case "ArrowDown":
          newPosition.y += 1
          break
        case "ArrowLeft":
          newPosition.x -= 1
          break
        case "ArrowRight":
          newPosition.x += 1
          break
        default:
          return // Not an arrow key
      }

      // Check if the new position is valid (not a wall and within bounds)
      if (
        newPosition.y >= 0 &&
        newPosition.y < mazeLayout.length &&
        newPosition.x >= 0 &&
        newPosition.x < mazeLayout[0].length &&
        mazeLayout[newPosition.y][newPosition.x] !== 1
      ) {
        setPlayerPosition(newPosition)
        setMoves((prev) => prev + 1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    // Esconder instruções após 6 segundos
    const timer = setTimeout(() => {
      setShowInstructions(false)
    }, 6000)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      clearTimeout(timer)
    }
  }, [playerPosition, mazeComplete])

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || mazeComplete) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y

    // Determine the direction of the swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 50) {
        movePlayer(1, 0) // Right
      } else if (deltaX < -50) {
        movePlayer(-1, 0) // Left
      }
    } else {
      // Vertical swipe
      if (deltaY > 50) {
        movePlayer(0, 1) // Down
      } else if (deltaY < -50) {
        movePlayer(0, -1) // Up
      }
    }

    touchStartRef.current = null
  }

  const movePlayer = (dx: number, dy: number) => {
    const newPosition = {
      x: playerPosition.x + dx,
      y: playerPosition.y + dy,
    }

    // Check if the new position is valid
    if (
      newPosition.y >= 0 &&
      newPosition.y < mazeLayout.length &&
      newPosition.x >= 0 &&
      newPosition.x < mazeLayout[0].length &&
      mazeLayout[newPosition.y][newPosition.x] !== 1
    ) {
      setPlayerPosition(newPosition)
      setMoves((prev) => prev + 1)
      setShowInstructions(false) // Esconder instruções quando o jogador começar a se mover
    }
  }

  const handleDirectionClick = (dx: number, dy: number) => {
    if (mazeComplete) return
    movePlayer(dx, dy)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto p-6 relative min-h-screen flex flex-col items-center justify-center"
    >
      <Button variant="ghost" className="absolute top-4 left-4 text-pink-600" onClick={() => onComplete()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Mapa
      </Button>

      {showConfetti && <Confetti />}

      <h2 className="text-3xl font-bold text-pink-700 mb-4 text-center">Labirinto do Amor</h2>
      <p className="text-pink-600 mb-4 text-center">Guie o coração até o destino final</p>

      {/* Instruções do jogo */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4 max-w-md text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <HelpCircle className="h-5 w-5 text-pink-500 mr-2" />
              <h3 className="font-medium text-pink-700">Como jogar</h3>
            </div>
            <p className="text-pink-600 text-sm mb-2">
              Use as setas do teclado ou os botões abaixo para mover o coração pelo labirinto até o destino.
            </p>
            <div className="flex justify-center gap-2">
              <ArrowUp className="h-4 w-4 text-pink-500" />
              <ArrowDown className="h-4 w-4 text-pink-500" />
              <ArrowLeft className="h-4 w-4 text-pink-500" />
              <ArrowRight className="h-4 w-4 text-pink-500" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card
        className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg p-4 mb-6"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-10 gap-1">
          {mazeLayout.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square w-6 sm:w-8 md:w-10 flex items-center justify-center rounded-sm ${
                  cell === 1
                    ? "bg-pink-300"
                    : cell === 3
                      ? "bg-pink-100 border border-pink-300"
                      : "bg-white border border-pink-100"
                }`}
              >
                {playerPosition.x === colIndex && playerPosition.y === rowIndex ? (
                  <Heart className="text-pink-500 h-4 w-4 md:h-6 md:w-6" fill="currentColor" />
                ) : cell === 3 ? (
                  <Heart className="text-pink-200 h-4 w-4 md:h-6 md:w-6" />
                ) : null}
              </div>
            )),
          )}
        </div>
      </Card>

      <div className="text-pink-700 mb-6">
        <span className="font-bold">Movimentos:</span> {moves}
      </div>

      {/* Mobile controls - com destaque visual */}
      <div className="grid grid-cols-3 gap-2 max-w-[200px] relative">
        <motion.div
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-pink-100 px-3 py-1 rounded-full text-pink-600 text-sm whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: 3, repeatType: "reverse" }}
        >
          Clique nos botões para mover
        </motion.div>

        <div></div>
        <Button
          variant="outline"
          className="aspect-square p-0 border-pink-300 hover:bg-pink-100 hover:border-pink-400 transition-all"
          onClick={() => handleDirectionClick(0, -1)}
          disabled={mazeComplete}
        >
          <ArrowUp className="h-6 w-6 text-pink-500" />
        </Button>
        <div></div>

        <Button
          variant="outline"
          className="aspect-square p-0 border-pink-300 hover:bg-pink-100 hover:border-pink-400 transition-all"
          onClick={() => handleDirectionClick(-1, 0)}
          disabled={mazeComplete}
        >
          <ArrowLeft className="h-6 w-6 text-pink-500" />
        </Button>
        <div></div>
        <Button
          variant="outline"
          className="aspect-square p-0 border-pink-300 hover:bg-pink-100 hover:border-pink-400 transition-all"
          onClick={() => handleDirectionClick(1, 0)}
          disabled={mazeComplete}
        >
          <ArrowRight className="h-6 w-6 text-pink-500" />
        </Button>

        <div></div>
        <Button
          variant="outline"
          className="aspect-square p-0 border-pink-300 hover:bg-pink-100 hover:border-pink-400 transition-all"
          onClick={() => handleDirectionClick(0, 1)}
          disabled={mazeComplete}
        >
          <ArrowDown className="h-6 w-6 text-pink-500" />
        </Button>
        <div></div>
      </div>

      {mazeComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <Button
            onClick={onComplete}
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 rounded-full text-lg"
          >
            Continuar Nossa Jornada
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

