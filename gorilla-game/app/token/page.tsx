"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpDown, TrendingUp, BarChart3, Wallet, Flame } from "lucide-react"
import WalletConnect from "@/components/wallet-connect"

export default function TokenPage() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [tokenAmount, setTokenAmount] = useState("")
  const [ethAmount, setEthAmount] = useState("")

  const handleWalletConnect = (address: string) => {
    setWalletConnected(true)
  }

  const handleWalletDisconnect = () => {
    setWalletConnected(false)
  }

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTokenAmount(value)
    // Mock conversion rate: 1 ETH = 1000 FIRE
    setEthAmount(value ? (Number.parseFloat(value) / 1000).toString() : "")
  }

  const handleEthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEthAmount(value)
    // Mock conversion rate: 1 ETH = 1000 FIRE
    setTokenAmount(value ? (Number.parseFloat(value) * 1000).toString() : "")
  }

  return (
    <main className="flex flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-6xl flex flex-col items-center gap-6">
        <div className="flex flex-col items-center text-center mb-2">
          <h1 className="text-3xl md:text-4xl font-bold">FIRE Token</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Trade and manage your FIRE tokens, the native currency of the Fire game ecosystem.
          </p>
        </div>

        {!walletConnected ? (
          <div className="w-full p-8 border rounded-lg bg-card text-card-foreground shadow text-center">
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to trade FIRE tokens and view your balance.
            </p>
            <WalletConnect onConnect={handleWalletConnect} onDisconnect={handleWalletDisconnect} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Your Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Flame className="h-5 w-5 text-red-500 mr-2" />
                    <div className="text-2xl font-bold">1,250 FIRE</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">≈ 1.25 ETH</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Token Price</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0.001 ETH</div>
                  <p className="text-xs text-muted-foreground mt-1">+5.3% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">125 ETH</div>
                  <p className="text-xs text-muted-foreground mt-1">125,000 FIRE in circulation</p>
                </CardContent>
              </Card>
            </div>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Trade FIRE Tokens</CardTitle>
                <CardDescription>Swap between ETH and FIRE tokens instantly</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="buy" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy">Buy FIRE</TabsTrigger>
                    <TabsTrigger value="sell">Sell FIRE</TabsTrigger>
                  </TabsList>
                  <TabsContent value="buy" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ETH Amount</label>
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={ethAmount}
                        onChange={handleEthChange}
                        min="0"
                        step="0.001"
                      />
                    </div>
                    <div className="flex justify-center my-2">
                      <ArrowUpDown className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">FIRE Amount</label>
                      <Input type="number" placeholder="0" value={tokenAmount} onChange={handleTokenChange} min="0" />
                    </div>
                    <Button className="w-full mt-4">Buy FIRE Tokens</Button>
                  </TabsContent>
                  <TabsContent value="sell" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">FIRE Amount</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={tokenAmount}
                        onChange={handleTokenChange}
                        min="0"
                        max="1250"
                      />
                    </div>
                    <div className="flex justify-center my-2">
                      <ArrowUpDown className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ETH Amount</label>
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={ethAmount}
                        onChange={handleEthChange}
                        min="0"
                        step="0.001"
                        readOnly
                      />
                    </div>
                    <Button className="w-full mt-4">Sell FIRE Tokens</Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Trading fee: 1% • Current rate: 1 ETH = 1,000 FIRE
              </CardFooter>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent FIRE token transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">Bought FIRE</div>
                      <div className="text-sm text-muted-foreground">3 days ago</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">+500 FIRE</div>
                      <div className="text-sm text-muted-foreground">0.5 ETH</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">NFT Purchase</div>
                      <div className="text-sm text-muted-foreground">1 week ago</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-600">-250 FIRE</div>
                      <div className="text-sm text-muted-foreground">Elite Squad NFT</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Game Reward</div>
                      <div className="text-sm text-muted-foreground">2 weeks ago</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">+100 FIRE</div>
                      <div className="text-sm text-muted-foreground">Victory Bonus</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  )
}
