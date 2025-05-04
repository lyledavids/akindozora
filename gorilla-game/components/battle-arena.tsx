"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { MenSvg } from "./svg/men-svg"
import { GorillaSvg } from "./svg/gorilla-svg"
import { AttackAnimation } from "./svg/attack-animations"
import { cn } from "@/lib/utils"

interface BattleArenaProps {
  playerSide: "men" | "gorilla" | null
  menCount: number
  gorillaHealth: number
  updateGameState: (newMenCount: number, newGorillaHealth: number) => void
}

type AttackType = "normal" | "special" | "defend"
type BattleLog = {
  message: string
  type: "men" | "gorilla" | "system"
}

export default function BattleArena({ playerSide, menCount, gorillaHealth, updateGameState }: BattleArenaProps) {
  const [attackCooldown, setAttackCooldown] = useState(false)
  const [specialCooldown, setSpecialCooldown] = useState(false)
  const [battleLogs, setBattleLogs] = useState<BattleLog[]>([{ message: "The battle begins!", type: "system" }])
  const [currentAttack, setCurrentAttack] = useState<{
    attacker: "men" | "gorilla"
    type: AttackType
    damage: number
  } | null>(null)
  const [showDamage, setShowDamage] = useState(false)
  const [damageValue, setDamageValue] = useState(0)
  const [damagePosition, setDamagePosition] = useState({ x: 0, y: 0 })
  const logEndRef = useRef<HTMLDivElement>(null)

  // AI opponent turn
  useEffect(() => {
    if (playerSide && !attackCooldown) {
      const opponentTurn = setTimeout(() => {
        if (playerSide === "men") {
          // Gorilla AI attacks
          const attackType = Math.random() > 0.7 ? "special" : "normal"
          const damage =
            attackType === "special" ? Math.floor(Math.random() * 15) + 10 : Math.floor(Math.random() * 8) + 3

          setCurrentAttack({
            attacker: "gorilla",
            type: attackType,
            damage: damage,
          })

          // Show damage number
          setDamageValue(damage)
          setDamagePosition({ x: 30, y: 50 })
          setShowDamage(true)

          setTimeout(() => {
            const newMenCount = Math.max(0, menCount - damage)
            updateGameState(newMenCount, gorillaHealth)

            const message =
              attackType === "special"
                ? `The gorilla unleashes a powerful attack, defeating ${damage} men!`
                : `The gorilla swings wildly, defeating ${damage} men!`

            addBattleLog(message, "gorilla")
            setCurrentAttack(null)
            setShowDamage(false)
          }, 1000)
        } else {
          // Men AI attack
          const attackPower = Math.random() * 0.3 * menCount
          const damage = Math.floor(attackPower)

          setCurrentAttack({
            attacker: "men",
            type: Math.random() > 0.7 ? "special" : "normal",
            damage: damage,
          })

          // Show damage number
          setDamageValue(damage)
          setDamagePosition({ x: 70, y: 50 })
          setShowDamage(true)

          setTimeout(() => {
            const newGorillaHealth = Math.max(0, gorillaHealth - damage)
            updateGameState(menCount, newGorillaHealth)

            const message = `The men coordinate an attack, dealing ${damage} damage to the gorilla!`
            addBattleLog(message, "men")
            setCurrentAttack(null)
            setShowDamage(false)
          }, 1000)
        }
      }, 3000)

      return () => clearTimeout(opponentTurn)
    }
  }, [playerSide, attackCooldown, menCount, gorillaHealth])

  // Scroll to bottom of battle log
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [battleLogs])

  const addBattleLog = (message: string, type: "men" | "gorilla" | "system") => {
    setBattleLogs((prev) => [...prev, { message, type }])
  }

  const handleAttack = (attackType: AttackType) => {
    setAttackCooldown(true)

    if (playerSide === "men") {
      // Player controls men
      let damage = 0
      let message = ""

      if (attackType === "normal") {
        damage = Math.floor(Math.random() * 5) + 3
        message = `Your men charge forward, dealing ${damage} damage to the gorilla!`
      } else if (attackType === "special") {
        setSpecialCooldown(true)
        damage = Math.floor(Math.random() * 10) + 8
        message = `Your men execute a coordinated attack, dealing ${damage} damage to the gorilla!`

        setTimeout(() => setSpecialCooldown(false), 10000) // 10 second cooldown for special
      } else {
        // Defend - lose fewer men on next attack
        message = "Your men take defensive positions, preparing for the gorilla's attack!"
      }

      setCurrentAttack({
        attacker: "men",
        type: attackType,
        damage: damage,
      })

      // Show damage number
      setDamageValue(damage)
      setDamagePosition({ x: 70, y: 50 })
      setShowDamage(true)

      setTimeout(() => {
        const newGorillaHealth = Math.max(0, gorillaHealth - damage)
        updateGameState(menCount, newGorillaHealth)
        addBattleLog(message, "men")
        setCurrentAttack(null)
        setShowDamage(false)
      }, 1000)
    } else {
      // Player controls gorilla
      let damage = 0
      let message = ""

      if (attackType === "normal") {
        damage = Math.floor(Math.random() * 8) + 3
        message = `You swing your mighty arms, defeating ${damage} men!`
      } else if (attackType === "special") {
        setSpecialCooldown(true)
        damage = Math.floor(Math.random() * 15) + 10
        message = `You pound your chest and charge, defeating ${damage} men!`

        setTimeout(() => setSpecialCooldown(false), 10000) // 10 second cooldown for special
      } else {
        // Defend - take less damage on next attack
        message = "You take a defensive stance, preparing for the men's attack!"
      }

      setCurrentAttack({
        attacker: "gorilla",
        type: attackType,
        damage: damage,
      })

      // Show damage number
      setDamageValue(damage)
      setDamagePosition({ x: 30, y: 50 })
      setShowDamage(true)

      setTimeout(() => {
        const newMenCount = Math.max(0, menCount - damage)
        updateGameState(newMenCount, gorillaHealth)
        addBattleLog(message, "gorilla")
        setCurrentAttack(null)
        setShowDamage(false)
      }, 1000)
    }

    // Reset attack cooldown after 3 seconds
    setTimeout(() => {
      setAttackCooldown(false)
    }, 3000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
        <div className="battle-scene w-full h-full relative">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>

          {/* Battle characters */}
          <div className="flex items-center justify-around w-full h-full relative">
            {/* Men side */}
            <div
              className={cn(
                "transition-all duration-500 transform",
                currentAttack?.attacker === "men" && currentAttack.type === "normal" && "translate-x-10",
                currentAttack?.attacker === "men" && currentAttack.type === "special" && "translate-x-16",
                currentAttack?.attacker === "gorilla" && "shake-horizontal",
              )}
            >
              <div className="h-24 w-24 md:h-32 md:w-32 relative">
                <MenSvg />
                {currentAttack?.attacker === "men" && (
                  <div className="absolute inset-0">
                    <AttackAnimation attacker="men" attackType={currentAttack.type} />
                  </div>
                )}
              </div>
              <div className="text-sm font-medium mt-2 text-center">{menCount} Men</div>
            </div>

            <div className="text-2xl font-bold">VS</div>

            {/* Gorilla side */}
            <div
              className={cn(
                "transition-all duration-500 transform",
                currentAttack?.attacker === "gorilla" && currentAttack.type === "normal" && "-translate-x-10",
                currentAttack?.attacker === "gorilla" && currentAttack.type === "special" && "-translate-x-16",
                currentAttack?.attacker === "men" && "shake-horizontal",
              )}
            >
              <div className="h-24 w-24 md:h-32 md:w-32 relative">
                <GorillaSvg />
                {currentAttack?.attacker === "gorilla" && (
                  <div className="absolute inset-0">
                    <AttackAnimation attacker="gorilla" attackType={currentAttack.type} />
                  </div>
                )}
              </div>
              <div className="text-sm font-medium mt-2 text-center">Gorilla ({Math.round(gorillaHealth)}%)</div>
            </div>
          </div>

          {/* Damage indicator */}
          {showDamage && (
            <div
              className="absolute text-xl font-bold text-red-500 damage-number"
              style={{
                left: `${damagePosition.x}%`,
                top: `${damagePosition.y}%`,
                animation: "damage-float 1s ease-out forwards",
              }}
            >
              -{damageValue}
            </div>
          )}
        </div>

        {playerSide && (
          <div className="grid grid-cols-3 gap-2 w-full mt-4">
            <Button
              onClick={() => handleAttack("normal")}
              disabled={attackCooldown}
              variant="default"
              className="relative overflow-hidden"
            >
              <span>Attack</span>
              {attackCooldown && (
                <span className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="countdown-timer"></span>
                </span>
              )}
            </Button>
            <Button
              onClick={() => handleAttack("special")}
              disabled={attackCooldown || specialCooldown}
              variant="destructive"
              className="relative overflow-hidden"
            >
              <span>Special Attack</span>
              {specialCooldown && (
                <span className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="countdown-timer"></span>
                </span>
              )}
            </Button>
            <Button
              onClick={() => handleAttack("defend")}
              disabled={attackCooldown}
              variant="outline"
              className="relative overflow-hidden"
            >
              <span>Defend</span>
              {attackCooldown && (
                <span className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="countdown-timer"></span>
                </span>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="bg-muted rounded-lg p-4 flex flex-col h-[300px]">
        <h3 className="font-bold mb-2">Battle Log</h3>
        <div className="flex-1 overflow-y-auto mb-2 text-sm">
          {battleLogs.map((log, index) => (
            <div
              key={index}
              className={`mb-1 p-1 rounded ${
                log.type === "men"
                  ? "text-blue-600 dark:text-blue-400"
                  : log.type === "gorilla"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {log.message}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>

        <div className="text-xs text-muted-foreground">
          {attackCooldown ? "Waiting for opponent's move..." : "Your turn - choose an action!"}
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake-horizontal {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        .shake-horizontal {
          animation: shake-horizontal 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        
        @keyframes damage-float {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        
        .countdown-timer {
          display: inline-block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
