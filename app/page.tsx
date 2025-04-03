"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import IntroScreen from "@/components/intro-screen"
import JourneyMap from "@/components/journey-map"
import MemoryGame from "@/components/memory-game"
import QuizGame from "@/components/quiz-game"
import HeartMaze from "@/components/heart-maze"
import LoveLetterGame from "@/components/love-letter-game"
import FinalMessage from "@/components/final-message"
import SecretMessage from "@/components/secret-message"
import FloatingHearts from "@/components/floating-hearts"

export default function LoveJourney() {
  const [currentScreen, setCurrentScreen] = useState("intro")
  const [completedSections, setCompletedSections] = useState({
    memoryGame: false,
    quiz: false,
    maze: false,
    loveLetter: false,
  })
  const [showSecret, setShowSecret] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showSparkle, setShowSparkle] = useState(false)
  const sparkleTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Show sparkle effect on mouse movement
      setShowSparkle(true)

      // Clear previous timeout
      if (sparkleTimeoutRef.current) {
        clearTimeout(sparkleTimeoutRef.current)
      }

      // Hide sparkle after 100ms
      sparkleTimeoutRef.current = setTimeout(() => {
        setShowSparkle(false)
      }, 100)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (sparkleTimeoutRef.current) {
        clearTimeout(sparkleTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Create audio element for background music - Linda Voz de Péricles
    const audio = new Audio("/linda-voz-pericles.mp3")
    audio.loop = true
    audio.volume = 0.7 // Ajustar volume para 70%
    setAudioElement(audio)

    return () => {
      if (audio) {
        audio.pause()
        audio.src = ""
      }
    }
  }, [])

  const toggleMute = () => {
    if (audioElement) {
      if (isMuted) {
        audioElement.play().catch((e) => console.log("Audio play failed:", e))
      } else {
        audioElement.pause()
      }
      setIsMuted(!isMuted)
    }
  }

  const startJourney = () => {
    if (audioElement) {
      audioElement.play().catch((e) => console.log("Audio play failed:", e))
    }
    setCurrentScreen("map")
  }

  const navigateTo = (screen: string) => {
    setCurrentScreen(screen)
  }

  const completeSection = (section: keyof typeof completedSections) => {
    setCompletedSections({
      ...completedSections,
      [section]: true,
    })
    setCurrentScreen("map")
  }

  const allSectionsCompleted = Object.values(completedSections).every((value) => value === true)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Enhanced background with multiple layers */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-rose-100 via-pink-200 to-purple-300" />

      {/* Animated background patterns */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Animated circles with glass effect */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-pink-300/20 to-rose-300/20 backdrop-blur-3xl"
            style={{
              width: `${100 + Math.random() * 300}px`,
              height: `${100 + Math.random() * 300}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 30, 0, -30, 0],
              y: [0, 30, 0, -30, 0],
              scale: [1, 1.1, 1, 0.9, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 via-transparent to-purple-500/5"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        {/* Radial gradient that follows mouse */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-pink-400/10 to-purple-400/5 pointer-events-none"
          animate={{
            x: mousePosition.x - 250,
            y: mousePosition.y - 250,
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 200,
          }}
        />
      </div>

      {/* Floating hearts */}
      <FloatingHearts />

      {/* Mouse sparkle effect */}
      <AnimatePresence>
        {showSparkle && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed pointer-events-none z-50"
            style={{
              left: mousePosition.x - 10,
              top: mousePosition.y - 10,
            }}
          >
            <Sparkles className="text-pink-500 h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio controls */}
      <div className="fixed top-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:text-pink-700 transition-all duration-300"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="h-4 w-4 text-pink-600" /> : <Volume2 className="h-4 w-4 text-pink-600" />}
        </Button>
      </div>

      {/* Interactive elements - floating hearts that respond to clicks */}
      <div
        className="fixed inset-0 z-0 pointer-events-auto"
        onClick={(e) => {
          const heart = document.createElement("div")
          heart.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ec4899" stroke="none"><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>`
          heart.className = "absolute transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
          heart.style.left = `${e.clientX}px`
          heart.style.top = `${e.clientY}px`
          document.body.appendChild(heart)

          // Animate and remove
          const animation = heart.animate(
            [
              { transform: `translate(-50%, -50%) scale(0)`, opacity: 1 },
              { transform: `translate(-50%, -150%) scale(1.5)`, opacity: 0 },
            ],
            {
              duration: 1000,
              easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
            },
          )

          animation.onfinish = () => heart.remove()
        }}
      />

      {/* Main content */}
      <AnimatePresence mode="wait">
        {currentScreen === "intro" && <IntroScreen key="intro" onStart={startJourney} />}

        {currentScreen === "map" && (
          <JourneyMap
            key="map"
            navigateTo={navigateTo}
            completedSections={completedSections}
            allCompleted={allSectionsCompleted}
          />
        )}

        {currentScreen === "memory" && <MemoryGame key="memory" onComplete={() => completeSection("memoryGame")} />}

        {currentScreen === "quiz" && <QuizGame key="quiz" onComplete={() => completeSection("quiz")} />}

        {currentScreen === "maze" && <HeartMaze key="maze" onComplete={() => completeSection("maze")} />}

        {currentScreen === "loveLetter" && (
          <LoveLetterGame key="loveLetter" onComplete={() => completeSection("loveLetter")} />
        )}

        {currentScreen === "final" && <FinalMessage key="final" onRevealSecret={() => setShowSecret(true)} />}
      </AnimatePresence>

      {/* Secret message modal */}
      {showSecret && <SecretMessage onClose={() => setShowSecret(false)} />}
    </div>
  )
}

