"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MenSvg } from "./svg/men-svg"
import { GorillaSvg } from "./svg/gorilla-svg"

interface CharacterSelectionProps {
  onSelect: (side: "men" | "gorilla") => void
}

export default function CharacterSelection({ onSelect }: CharacterSelectionProps) {
  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-center mb-6">Choose Your Side</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onSelect("men")}
        >
          <CardContent className="p-6 flex flex-col items-center">
            <div className="h-48 w-48 flex items-center justify-center mb-4">
              <MenSvg />
            </div>
            <h3 className="text-xl font-bold mb-2">100 Men</h3>
            <p className="text-center text-muted-foreground mb-4">
              Strength in numbers! Control 100 men to overwhelm the gorilla with coordinated attacks.
            </p>
            <Button className="w-full" onClick={() => onSelect("men")}>
              Choose 100 Men
            </Button>
          </CardContent>
        </Card>

        <Card
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onSelect("gorilla")}
        >
          <CardContent className="p-6 flex flex-col items-center">
            <div className="h-48 w-48 flex items-center justify-center mb-4">
              <GorillaSvg />
            </div>
            <h3 className="text-xl font-bold mb-2">Gorilla</h3>
            <p className="text-center text-muted-foreground mb-4">
              Raw power! Control the mighty gorilla to crush your opponents with devastating attacks.
            </p>
            <Button className="w-full" onClick={() => onSelect("gorilla")}>
              Choose Gorilla
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
