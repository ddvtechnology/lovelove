"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Heart, Sparkles, Shuffle } from "lucide-react"
import { Confetti } from "@/components/confetti"

interface LoveLetterGameProps {
  onComplete: () => void
}

// Definição de uma peça do quebra-cabeça
interface PuzzlePiece {
  id: number
  correctPosition: number
  currentPosition: number
  color: string
  letter: string
}

export default function LoveLetterGame({ onComplete }: LoveLetterGameProps) {
  // Número de peças no quebra-cabeça
  const TOTAL_PIECES = 9

  // Estado para as peças do quebra-cabeça
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const [gameComplete, setGameComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [moves, setMoves] = useState(0)
  const [message, setMessage] = useState("")
  const [showHint, setShowHint] = useState(false)

  // Mensagens românticas que aparecem quando o quebra-cabeça é completado
  const romanticMessages = [
    "Meu coração é seu, hoje e sempre",
    "Cada batida do meu coração é por você",
    "Você é o amor da minha vida",
    "Meu coração sempre vai te amar",
    "Nosso amor é eterno",
  ]

  // Inicializar o quebra-cabeça
  useEffect(() => {
    initializePuzzle()
  }, [])

  // Verificar se o quebra-cabeça está completo
  useEffect(() => {
    if (pieces.length > 0 && pieces.every((piece) => piece.currentPosition === piece.correctPosition)) {
      if (!gameComplete) {
        setGameComplete(true)
        setShowConfetti(true)
        // Selecionar uma mensagem romântica aleatória
        const randomMessage = romanticMessages[Math.floor(Math.random() * romanticMessages.length)]
        setMessage(randomMessage)
      }
    }
  }, [pieces, gameComplete])

  // Inicializar o quebra-cabeça com peças embaralhadas
  const initializePuzzle = () => {
    // Cores para formar um degradê de coração
    const colors = [
      "bg-pink-300",
      "bg-pink-400",
      "bg-pink-500",
      "bg-pink-400",
      "bg-pink-500",
      "bg-pink-600",
      "bg-pink-500",
      "bg-pink-600",
      "bg-pink-700",
    ]

    // Letras para formar "EU TE AMO" (distribuídas nas peças)
    const letters = ["E", "U", "", "T", "E", "", "A", "M", "O"]

    // Criar peças na posição correta
    const initialPieces: PuzzlePiece[] = Array.from({ length: TOTAL_PIECES }, (_, i) => ({
      id: i,
      correctPosition: i,
      currentPosition: i,
      color: colors[i],
      letter: letters[i],
    }))

    // Embaralhar as peças
    const shuffledPieces = [...initialPieces]
    for (let i = shuffledPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      // Trocar apenas a posição atual, não a posição correta
      const temp = shuffledPieces[i].currentPosition
      shuffledPieces[i].currentPosition = shuffledPieces[j].currentPosition
      shuffledPieces[j].currentPosition = temp
    }

    setPieces(shuffledPieces)
    setSelectedPiece(null)
    setGameComplete(false)
    setShowConfetti(false)
    setMoves(0)
    setMessage("")
  }

  // Manipular a seleção de uma peça
  const handlePieceClick = (index: number) => {
    if (gameComplete) return

    if (selectedPiece === null) {
      // Selecionar a primeira peça
      setSelectedPiece(index)
    } else {
      // Trocar as peças de lugar
      setPieces((prevPieces) => {
        const newPieces = [...prevPieces]

        // Encontrar as peças pelos índices
        const firstPiece = newPieces.find((p) => p.id === selectedPiece)
        const secondPiece = newPieces.find((p) => p.id === index)

        if (firstPiece && secondPiece) {
          // Trocar as posições atuais
          const tempPosition = firstPiece.currentPosition
          firstPiece.currentPosition = secondPiece.currentPosition
          secondPiece.currentPosition = tempPosition
        }

        return newPieces
      })

      // Incrementar o contador de movimentos
      setMoves((prev) => prev + 1)

      // Limpar a seleção
      setSelectedPiece(null)
    }
  }

  // Embaralhar novamente o quebra-cabeça
  const handleShuffle = () => {
    initializePuzzle()
  }

  // Mostrar dica
  const handleHint = () => {
    setShowHint(true)
    setTimeout(() => setShowHint(false), 3000)
  }

  // Renderizar o quebra-cabeça em forma de coração
  const renderHeartPuzzle = () => {
    // Organizar as peças em uma grade 3x3
    const grid = [
      [null, 0, 1],
      [2, 3, 4],
      [5, 6, 7],
      [null, 8, null],
    ]

    return (
      <div className="flex flex-col items-center">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((pieceId, colIndex) => {
              if (pieceId === null) {
                // Espaço vazio para formar o coração
                return <div key={`empty-${rowIndex}-${colIndex}`} className="w-20 h-20 md:w-24 md:h-24" />
              }

              // Encontrar a peça pelo ID
              const piece = pieces.find((p) => p.currentPosition === pieceId)

              if (!piece) return null

              return (
                <motion.div
                  key={piece.id}
                  className={`w-20 h-20 md:w-24 md:h-24 ${piece.color} rounded-lg m-1 cursor-pointer flex items-center justify-center shadow-md
                    ${selectedPiece === piece.id ? "ring-4 ring-white" : ""}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePieceClick(piece.id)}
                  animate={{
                    scale: selectedPiece === piece.id ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: selectedPiece === piece.id ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                  }}
                >
                  {/* Mostrar a letra da peça */}
                  {piece.letter && <span className="text-white text-2xl md:text-3xl font-bold">{piece.letter}</span>}

                  {/* Indicador de posição correta */}
                  {piece.currentPosition === piece.correctPosition && !piece.letter && (
                    <Heart className="text-white h-8 w-8 opacity-50" fill="white" />
                  )}
                </motion.div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  // Renderizar o coração completo quando o jogo terminar
  const renderCompleteHeart = () => {
    return (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative">
        <div className="flex flex-col items-center">
          <div className="flex">
            <div className="w-24 h-24" />
            <div className="w-24 h-24 bg-pink-500 rounded-tl-full" />
            <div className="w-24 h-24 bg-pink-500 rounded-tr-full" />
          </div>
          <div className="flex">
            <div className="w-24 h-24 bg-pink-500 rounded-tl-full" />
            <div className="w-24 h-24 bg-pink-500" />
            <div className="w-24 h-24 bg-pink-500 rounded-tr-full" />
          </div>
          <div className="flex">
            <div className="w-24 h-24 bg-pink-500 rounded-bl-full" />
            <div className="w-24 h-24 bg-pink-500" />
            <div className="w-24 h-24 bg-pink-500 rounded-br-full" />
          </div>
          <div className="flex">
            <div className="w-24 h-24" />
            <div className="w-24 h-24 bg-pink-500 rounded-b-full" />
            <div className="w-24 h-24" />
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white text-4xl font-bold tracking-wider"
          >
            EU TE AMO
          </motion.div>
        </div>
      </motion.div>
    )
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

      <h2 className="text-3xl font-bold text-pink-700 mb-4 text-center">Quebra-Coração</h2>
      <p className="text-pink-600 mb-8 text-center">
        Monte o coração com a mensagem especial trocando as peças de lugar. Clique em duas peças para trocá-las.
      </p>

      <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg p-6 mb-6">
        <CardContent className="flex flex-col items-center">
          {gameComplete ? renderCompleteHeart() : renderHeartPuzzle()}

          <div className="mt-6 flex items-center gap-4">
            <div className="text-pink-700">
              <span className="font-bold">Movimentos:</span> {moves}
            </div>

            {!gameComplete && (
              <Button variant="outline" size="sm" className="border-pink-300 text-pink-600" onClick={handleShuffle}>
                <Shuffle className="h-4 w-4 mr-2" />
                Embaralhar
              </Button>
            )}

            {!gameComplete && (
              <Button variant="ghost" size="sm" className="text-pink-600" onClick={handleHint}>
                Dica
              </Button>
            )}
          </div>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-center text-sm bg-pink-50 p-2 rounded-md border border-pink-100"
              >
                <p className="text-pink-600">
                  Clique em uma peça para selecioná-la, depois clique em outra peça para trocá-las de lugar. Tente
                  formar as letras "EU TE AMO" dentro do coração!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {gameComplete && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Card className="bg-white/90 backdrop-blur-sm border-pink-200 shadow-lg mb-6">
            <CardContent className="p-6">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" fill="currentColor" />
              </motion.div>

              <h3 className="text-xl font-bold text-pink-700 mb-2">Coração Completo!</h3>
              <p className="text-pink-600">{message}</p>
            </CardContent>
          </Card>

          <Button
            onClick={onComplete}
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 rounded-full text-lg"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Continuar Nossa Jornada
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

