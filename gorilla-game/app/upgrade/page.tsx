"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Sword, Shield, Zap, Crown, Flame } from "lucide-react"
import WalletConnect from "@/components/wallet-connect"

// NFT types
type NFTRarity = "common" | "uncommon" | "rare" | "epic" | "legendary"
type NFTCategory = "attack" | "defense" | "special" | "cosmetic"

interface NFT {
  id: string
  name: string
  description: string
  image: string
  price: number
  rarity: NFTRarity
  category: NFTCategory
  bonusPercentage: number
  owned: boolean
}

const mockNFTs: NFT[] = [
  {
    id: "1",
    name: "Gorilla Rage",
    description: "Increases gorilla's normal attack damage by 15%",
    image: "/placeholder.svg?height=200&width=200",
    price: 0.05,
    rarity: "uncommon",
    category: "attack",
    bonusPercentage: 15,
    owned: false,
  },
  {
    id: "2",
    name: "Men Formation",
    description: "Improves men's defensive stance, reducing damage taken by 20%",
    image: "/placeholder.svg?height=200&width=200",
    price: 0.05,
    rarity: "uncommon",
    category: "defense",
    bonusPercentage: 20,
    owned: false,
  },
  {
    id: "3",
    name: "Primal Fury",
    description: "Gorilla's special attack has 30% increased damage but 5% self-damage",
    image: "/placeholder.svg?height=200&width=200",
    price: 0.1,
    rarity: "rare",
    category: "special",
    bonusPercentage: 30,
    owned: false,
  },
  {
    id: "4",
    name: "Tactical Genius",
    description: "Men's special attack cooldown reduced by 25%",
    image: "/placeholder.svg?height=200&width=200",
    price: 0.1,
    rarity: "rare",
    category: "special",
    bonusPercentage: 25,
    owned: false,
  },
  {
    id: "5",
    name: "Golden Gorilla",
    description: "Transforms your gorilla into a majestic golden beast",
    image: "/placeholder.svg?height=200&width=200",
    price: 0.2,
    rarity: "epic",
    category: "cosmetic",
    bonusPercentage: 0,
    owned: false,
  },
  {
    id: "6",
    name: "Elite Squad",
    description: "Your men appear as an elite tactical unit with special animations",
    image: "/placeholder.svg?height=200&width=200",
    price: 0.2,
    rarity: "epic",
    category: "cosmetic",
    bonusPercentage: 0,
    owned: false,
  },
  {
    id: "7",
    name: "Silverback Alpha",
    description: "Gorilla gains a 10% chance to perform two attacks in one turn",
    image: "/placeholder.svg?height=200&width=200",
    price: 0.5,
    rarity: "legendary",
    category: "special",
    bonusPercentage: 10,
    owned: false,
  },
  {
    id: "8",
    name: "Hundred Heroes",
    description: "Men gain a 5% chance to completely avoid damage from an attack",
    image: "/placeholder.svg?height=200&width=200",
    price: 0.5,
    rarity: "legendary",
    category: "defense",
    bonusPercentage: 5,
    owned: false,
  },
]

const rarityColors = {
  common: "bg-gray-200 text-gray-800",
  uncommon: "bg-green-100 text-green-800",
  rare: "bg-blue-100 text-blue-800",
  epic: "bg-purple-100 text-purple-800",
  legendary: "bg-amber-100 text-amber-800",
}

const categoryIcons = {
  attack: <Sword className="h-4 w-4" />,
  defense: <Shield className="h-4 w-4" />,
  special: <Zap className="h-4 w-4" />,
  cosmetic: <Sparkles className="h-4 w-4" />,
}

export default function UpgradePage() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [nfts, setNfts] = useState<NFT[]>(mockNFTs)

  const handleWalletConnect = (address: string) => {
    setWalletConnected(true)
  }

  const handleWalletDisconnect = () => {
    setWalletConnected(false)
  }

  const handlePurchase = (id: string) => {
    setNfts(
      nfts.map((nft) => {
        if (nft.id === id) {
          return { ...nft, owned: true }
        }
        return nft
      }),
    )
  }

  const filteredNfts =
    activeTab === "all"
      ? nfts
      : nfts.filter((nft) => nft.category === activeTab || (activeTab === "owned" && nft.owned))

  return (
    <main className="flex flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-6xl flex flex-col items-center gap-6">
        <div className="flex flex-col items-center text-center mb-2">
          <h1 className="text-3xl md:text-4xl font-bold">NFT Marketplace</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Upgrade your characters with powerful NFTs that provide in-game advantages and unique visual effects.
          </p>
        </div>

        {!walletConnected ? (
          <div className="w-full p-8 border rounded-lg bg-card text-card-foreground shadow text-center">
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">Connect your wallet to browse and purchase NFT upgrades.</p>
            <WalletConnect onConnect={handleWalletConnect} onDisconnect={handleWalletDisconnect} />
          </div>
        ) : (
          <>
            <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="attack">Attack</TabsTrigger>
                  <TabsTrigger value="defense">Defense</TabsTrigger>
                  <TabsTrigger value="special">Special</TabsTrigger>
                  <TabsTrigger value="cosmetic">Cosmetic</TabsTrigger>
                  <TabsTrigger value="owned">Owned</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-red-500" />
                  <span className="font-bold">1,250 FIRE</span>
                </div>
              </div>

              <TabsContent value={activeTab} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredNfts.map((nft) => (
                    <Card key={nft.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{nft.name}</CardTitle>
                          <Badge variant="outline" className={rarityColors[nft.rarity]}>
                            {nft.rarity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          {categoryIcons[nft.category]}
                          <span className="capitalize">{nft.category}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="aspect-square bg-muted rounded-md overflow-hidden mb-3">
                          <img
                            src={nft.image || "/placeholder.svg"}
                            alt={nft.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardDescription className="min-h-[60px]">{nft.description}</CardDescription>
                        {nft.bonusPercentage > 0 && (
                          <div className="mt-2 text-sm font-medium flex items-center gap-1">
                            <Crown className="h-4 w-4 text-amber-500" />
                            <span>+{nft.bonusPercentage}% Bonus</span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        {nft.owned ? (
                          <Button className="w-full" variant="secondary" disabled>
                            Owned
                          </Button>
                        ) : (
                          <Button className="w-full" onClick={() => handlePurchase(nft.id)}>
                            Buy for {nft.price} ETH
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </main>
  )
}
