"use client"

import { useEffect, useRef } from "react"

interface GameCanvasProps {
  gameStarted: boolean
  gameOver: boolean
  menCount: number
  gorillaHealth: number
  winner: "men" | "gorilla" | null
}

export default function GameCanvas({ gameStarted, gameOver, menCount, gorillaHealth, winner }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation variables
    let animationFrameId: number
    const men: { x: number; y: number; size: number; speed: number; color: string }[] = []
    const gorilla = {
      x: canvas.width * 0.7,
      y: canvas.height * 0.5,
      size: 60,
      color: "#663300",
    }

    // Initialize men positions
    const initializeMen = () => {
      men.length = 0
      for (let i = 0; i < menCount; i++) {
        men.push({
          x: Math.random() * (canvas.width * 0.4),
          y: Math.random() * canvas.height,
          size: 10,
          speed: 0.5 + Math.random() * 1,
          color: `hsl(${Math.random() * 40 + 200}, 70%, 60%)`,
        })
      }
    }

    // Draw functions
    const drawMen = () => {
      men.forEach((man) => {
        ctx.fillStyle = man.color
        ctx.beginPath()
        ctx.arc(man.x, man.y, man.size, 0, Math.PI * 2)
        ctx.fill()

        // Move men toward gorilla if game is active
        if (gameStarted && !gameOver) {
          const dx = gorilla.x - man.x
          const dy = gorilla.y - man.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > gorilla.size + man.size) {
            man.x += (dx / distance) * man.speed
            man.y += (dy / distance) * man.speed
          }
        }
      })
    }

    const drawGorilla = () => {
      // Draw gorilla body
      ctx.fillStyle = gorilla.color
      ctx.beginPath()
      ctx.arc(gorilla.x, gorilla.y, gorilla.size, 0, Math.PI * 2)
      ctx.fill()

      // Draw gorilla face
      ctx.fillStyle = "#000000"
      ctx.beginPath()
      ctx.arc(gorilla.x - gorilla.size * 0.3, gorilla.y - gorilla.size * 0.2, gorilla.size * 0.15, 0, Math.PI * 2)
      ctx.arc(gorilla.x + gorilla.size * 0.3, gorilla.y - gorilla.size * 0.2, gorilla.size * 0.15, 0, Math.PI * 2)
      ctx.fill()

      // Draw mouth
      ctx.beginPath()
      ctx.arc(gorilla.x, gorilla.y + gorilla.size * 0.1, gorilla.size * 0.3, 0, Math.PI)
      ctx.stroke()
    }

    const drawGameState = () => {
      if (!gameStarted && !gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 24px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Click Start Battle to begin!", canvas.width / 2, canvas.height / 2)
      }

      if (gameOver) {
        ctx.fillStyle = winner === "men" ? "rgba(0, 100, 0, 0.7)" : "rgba(139, 0, 0, 0.7)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 28px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(winner === "men" ? "The Men Won!" : "The Gorilla Won!", canvas.width / 2, canvas.height / 2)
      }
    }

    // Main render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update men count based on game state
      if (men.length > menCount) {
        men.length = menCount
      } else if (men.length < menCount && men.length > 0) {
        const menToAdd = menCount - men.length
        for (let i = 0; i < menToAdd; i++) {
          men.push({
            x: Math.random() * (canvas.width * 0.4),
            y: Math.random() * canvas.height,
            size: 10,
            speed: 0.5 + Math.random() * 1,
            color: `hsl(${Math.random() * 40 + 200}, 70%, 60%)`,
          })
        }
      }

      // Update gorilla size based on health
      gorilla.size = 60 * (gorillaHealth / 100) + 20

      // Draw game elements
      drawMen()
      drawGorilla()
      drawGameState()

      animationFrameId = requestAnimationFrame(render)
    }

    // Initialize and start animation
    initializeMen()
    render()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [gameStarted, gameOver, menCount, gorillaHealth, winner])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
