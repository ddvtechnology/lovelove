"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import { Confetti } from "@/components/confetti"

interface QuizGameProps {
  onComplete: () => void
}

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

export default function QuizGame({ onComplete }: QuizGameProps) {
  // In a real app, you would customize these questions about your relationship
  const questions: Question[] = [
    {
      id: 1,
      question: "O que eu mais gosto de fazer?",
      options: ["Comer", "Dormir", "Treinar", "Assistir filmes"],
      correctAnswer: 2,
    },
    {
      id: 2,
      question: "Qual é minha comida favorita?",
      options: ["Pizza", "Hambúrguer", "Churrasco", "Lasanha"],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: "Onde nós nos conhecemos?",
      options: ["Na faculdade", "Por amigos em comum", "No EJC", "Em uma festa"],
      correctAnswer: 2,
    },
    {
      id: 4,
      question: "Qual é minha cor favorita?",
      options: ["Azul", "Verde", "Vermelho", "Roxo"],
      correctAnswer: 0,
    },
    {
      id: 5,
      question: "Qual é a data do nosso aniversário de namoro?",
      options: ["10 de Janeiro", "15 de Novembro", "23 de Dezembro", "30 de Abril"],
      correctAnswer: 2,
    },
  ]

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return // Prevent changing answer after selection

    setSelectedOption(optionIndex)
    const correct = optionIndex === currentQuestion.correctAnswer
    setIsAnswerCorrect(correct)

    if (correct) {
      setScore(score + 1)
    }

    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedOption(null)
        setIsAnswerCorrect(null)
      } else {
        setQuizComplete(true)
        if (score + (correct ? 1 : 0) >= 3) {
          // If score is 3 or higher (out of 5)
          setShowConfetti(true)
        }
      }
    }, 1500)
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

      <AnimatePresence mode="wait">
        {!quizComplete ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <h2 className="text-3xl font-bold text-pink-700 mb-4 text-center">Quanto Você Me Conhece?</h2>
            <p className="text-pink-600 mb-2 text-center">Responda perguntas sobre nosso relacionamento</p>
            <div className="text-center mb-8">
              <span className="text-pink-700 font-semibold">
                Pergunta {currentQuestionIndex + 1} de {questions.length}
              </span>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg w-full mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-pink-700 mb-6">{currentQuestion.question}</h3>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <motion.div key={index} whileHover={{ scale: selectedOption === null ? 1.02 : 1 }}>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left p-4 h-auto ${
                          selectedOption === index
                            ? index === currentQuestion.correctAnswer
                              ? "bg-green-100 border-green-500 text-green-700"
                              : "bg-red-100 border-red-500 text-red-700"
                            : "border-pink-200 text-pink-700"
                        } ${
                          selectedOption !== null && index === currentQuestion.correctAnswer
                            ? "bg-green-100 border-green-500"
                            : ""
                        }`}
                        onClick={() => handleOptionSelect(index)}
                        disabled={selectedOption !== null}
                      >
                        <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                        {selectedOption === index && isAnswerCorrect && (
                          <CheckCircle2 className="ml-auto h-5 w-5 text-green-600" />
                        )}
                        {selectedOption === index && !isAnswerCorrect && (
                          <XCircle className="ml-auto h-5 w-5 text-red-600" />
                        )}
                        {selectedOption !== null &&
                          selectedOption !== index &&
                          index === currentQuestion.correctAnswer && (
                            <CheckCircle2 className="ml-auto h-5 w-5 text-green-600" />
                          )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="w-full bg-white/50 rounded-full h-2.5 mb-4">
              <div
                className="bg-pink-500 h-2.5 rounded-full"
                style={{
                  width: `${((currentQuestionIndex + (selectedOption !== null ? 1 : 0)) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <h2 className="text-3xl font-bold text-pink-700 mb-4">Quiz Completo!</h2>
            <p className="text-xl text-pink-600 mb-6">
              Você acertou {score} de {questions.length} perguntas
            </p>

            <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg mb-8 max-w-md mx-auto">
              <CardContent className="p-6">
                {score === questions.length ? (
                  <p className="text-lg text-pink-700">
                    Uau! Você me conhece perfeitamente! Isso mostra o quanto estamos conectados. ❤️
                  </p>
                ) : score >= 3 ? (
                  <p className="text-lg text-pink-700">
                    Muito bom! Você realmente me conhece bem. Isso me deixa muito feliz!
                  </p>
                ) : (
                  <p className="text-lg text-pink-700">
                    Hmm, parece que ainda temos muito a descobrir um sobre o outro. Vamos criar mais memórias juntos!
                  </p>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={onComplete}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 rounded-full text-lg"
            >
              Continuar Nossa Jornada
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

