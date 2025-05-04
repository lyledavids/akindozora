import GameContainer from "@/components/game-container"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-5xl flex flex-col items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center">100 Men vs Gorilla</h1>
        <p className="text-center text-muted-foreground mb-4">Choose your side and battle!</p>
        <GameContainer />
      </div>
    </main>
  )
}
