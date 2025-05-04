"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import WalletConnect from "./wallet-connect"
import CharacterSelection from "./character-selection"
import BattleArena from "./battle-arena"

type GamePhase = "connect" | "select" | "battle" | "gameover"
type PlayerSide = "men" | "gorilla" | null

export default function GameContainer() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("connect")
  const [playerSide, setPlayerSide] = useState<PlayerSide>(null)
  const [menCount, setMenCount] = useState(100)
  const [gorillaHealth, setGorillaHealth] = useState(100)
  const [winner, setWinner] = useState<PlayerSide>(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const handleWalletConnect = (address: string) => {
    setWalletConnected(true)
    setWalletAddress(address)
    setGamePhase("select")
  }

  const handleWalletDisconnect = () => {
    setWalletConnected(false)
    setWalletAddress("")
    setGamePhase("connect")
  }

  const selectSide = (side: PlayerSide) => {
    setPlayerSide(side)
    setGamePhase("battle")
    resetGame()
  }

  const resetGame = () => {
    setMenCount(100)
    setGorillaHealth(100)
    setWinner(null)
  }

  const handleGameOver = (victor: PlayerSide) => {
    setWinner(victor)
    setGamePhase("gameover")
  }

  const playAgain = () => {
    setGamePhase("select")
  }

  const updateGameState = (newMenCount: number, newGorillaHealth: number) => {
    setMenCount(newMenCount)
    setGorillaHealth(newGorillaHealth)

    // Check win conditions
    if (newGorillaHealth <= 0) {
      handleGameOver("men")
    } else if (newMenCount <= 0) {
      handleGameOver("gorilla")
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center w-full">
        <WalletConnect onConnect={handleWalletConnect} onDisconnect={handleWalletDisconnect} />

        {gamePhase === "battle" && (
          <div className="text-sm font-medium">
            Playing as: <span className="font-bold">{playerSide === "men" ? "100 Men" : "Gorilla"}</span>
          </div>
        )}
      </div>

      <Card className="w-full">
        <CardContent className="p-4">
          {gamePhase === "connect" && (
            <div className="flex flex-col items-center justify-center py-12">
              <h2 className="text-2xl font-bold mb-4">Welcome to 100 Men vs Gorilla!</h2>
              <p className="text-center mb-8 max-w-md">
                Connect your wallet to start the game and choose your side in this epic battle.
              </p>
              <WalletConnect onConnect={handleWalletConnect} onDisconnect={handleWalletDisconnect} />
            </div>
          )}

          {gamePhase === "select" && <CharacterSelection onSelect={selectSide} />}

          {gamePhase === "battle" && (
            <>
              <div className="flex justify-between mb-2">
                <div className="font-semibold">Men Remaining: {menCount}</div>
                <div className="font-semibold">Gorilla Health: {Math.round(gorillaHealth)}%</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2">
                  <Progress value={menCount} max={100} className="h-2" />
                </div>
                <div className="flex flex-col gap-2">
                  <Progress value={gorillaHealth} max={100} className="h-2" />
                </div>
              </div>

              <BattleArena
                playerSide={playerSide}
                menCount={menCount}
                gorillaHealth={gorillaHealth}
                updateGameState={updateGameState}
              />
            </>
          )}

          {gamePhase === "gameover" && (
            <div className="flex flex-col items-center justify-center py-8">
              <h2 className="text-3xl font-bold mb-4">{winner === playerSide ? "Victory!" : "Defeat!"}</h2>
              <p className="text-xl mb-6">
                {winner === "men"
                  ? `The men defeated the gorilla with ${menCount} survivors!`
                  : `The mighty gorilla defeated all 100 men with ${Math.round(gorillaHealth)}% health remaining!`}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={playAgain}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
