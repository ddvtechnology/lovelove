"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Heart, Info } from "lucide-react"
import Image from "next/image"
import { Confetti } from "@/components/confetti"

interface MemoryGameProps {
  onComplete: () => void
}

interface MemoryCard {
  id: number
  imageUrl: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryGame({ onComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [gameComplete, setGameComplete] = useState<boolean>(false)
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  const [showInfo, setShowInfo] = useState<boolean>(true)

  // Images for the memory game - in a real app, these would be your actual photos
  // Você pode substituir estes placeholders por suas próprias imagens
  const cardImages = [
    "/1.jpeg?height=150&width=150",
    "/2.jpeg?height=150&width=150",
    "/3.jpeg?height=150&width=150",
    "/4.jpeg?height=150&width=150",
    "/5.jpeg?height=150&width=150",
    "/6.jpeg?height=150&width=150",
  ]

  useEffect(() => {
    initializeGame()

    // Esconder a mensagem de informação após 5 segundos
    const timer = setTimeout(() => {
      setShowInfo(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (flippedCards.length === 2) {
      const firstCard = cards.find((card) => card.id === flippedCards[0])
      const secondCard = cards.find((card) => card.id === flippedCards[1])

      if (firstCard && secondCard && firstCard.imageUrl === secondCard.imageUrl) {
        // Match found
        setCards((prevCards) =>
          prevCards.map((card) => (flippedCards.includes(card.id) ? { ...card, isMatched: true } : card)),
        )
        setMatchedPairs((prev) => prev + 1)
        setFlippedCards([])
      } else {
        // No match, flip cards back after a delay
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              flippedCards.includes(card.id) && !card.isMatched ? { ...card, isFlipped: false } : card,
            ),
          )
          setFlippedCards([])
        }, 1000)
      }

      setMoves((prev) => prev + 1)
    }
  }, [flippedCards, cards])

  useEffect(() => {
    if (matchedPairs === cardImages.length && cards.length > 0) {
      setGameComplete(true)
      setShowConfetti(true)
    }
  }, [matchedPairs, cardImages.length, cards.length])

  const initializeGame = () => {
    // Create pairs of cards
    const cardPairs = [...cardImages, ...cardImages].map((imageUrl, index) => ({
      id: index,
      imageUrl,
      isFlipped: false,
      isMatched: false,
    }))

    // Shuffle the cards
    const shuffledCards = shuffleArray(cardPairs)
    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setGameComplete(false)
  }

  const shuffleArray = (array: MemoryCard[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const handleCardClick = (id: number) => {
    // Ignore click if already two cards flipped or this card is already flipped/matched
    const clickedCard = cards.find((card) => card.id === id)
    if (flippedCards.length >= 2 || !clickedCard || clickedCard.isFlipped || clickedCard.isMatched) {
      return
    }

    // Flip the card
    setCards((prevCards) => prevCards.map((card) => (card.id === id ? { ...card, isFlipped: true } : card)))

    // Add to flipped cards
    setFlippedCards((prev) => [...prev, id])
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

      <h2 className="text-3xl font-bold text-pink-700 mb-4 text-center">Jogo da Memória</h2>
      <p className="text-pink-600 mb-8 text-center">Encontre os pares de fotos dos nossos momentos especiais</p>

      {showConfetti && <Confetti />}

      <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 border border-pink-200 shadow-lg w-full">
        <div className="flex justify-between mb-4">
          <div className="text-pink-700">
            <span className="font-bold">Movimentos:</span> {moves}
          </div>
          <div className="text-pink-700">
            <span className="font-bold">Pares:</span> {matchedPairs}/{cardImages.length}
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.id)}
            >
              <Card
                className={`aspect-square flex items-center justify-center cursor-pointer transition-all duration-300 ${card.isMatched
                    ? "bg-pink-100 border-pink-300"
                    : card.isFlipped
                      ? "bg-white border-pink-300"
                      : "bg-gradient-to-r from-pink-400 to-rose-400 border-pink-500"
                  }`}
              >
                {card.isFlipped || card.isMatched ? (
                  <div className="relative w-full h-full p-2">
                    <Image
                      src={card.imageUrl || "/placeholder.svg"}
                      alt="Memory card"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <Heart className="h-12 w-12 text-white" fill="currentColor" />
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {gameComplete && (
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

