"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"
import { ethers } from "ethers"

interface WalletConnectProps {
  onConnect: (address: string) => void
  onDisconnect: () => void
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [address, setAddress] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const accounts = await provider.listAccounts()

          if (accounts.length > 0) {
            const address = accounts[0].address
            setAddress(address)
            onConnect(address)

            // Listen for account changes
            window.ethereum.on("accountsChanged", handleAccountsChanged)
            window.ethereum.on("disconnect", handleDisconnect)
          }
        }
      } catch (err) {
        console.error("Failed to check wallet connection:", err)
      }
    }

    checkConnection()

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("disconnect", handleDisconnect)
      }
    }
  }, [])

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      handleDisconnect()
    } else {
      // User switched accounts
      setAddress(accounts[0])
      onConnect(accounts[0])
    }
  }

  const handleDisconnect = () => {
    setAddress("")
    onDisconnect()
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      if (!window.ethereum) {
        throw new Error("No Ethereum wallet found. Please install MetaMask or another wallet.")
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])

      if (accounts.length > 0) {
        setAddress(accounts[0])
        onConnect(accounts[0])

        // Listen for account changes
        window.ethereum.on("accountsChanged", handleAccountsChanged)
        window.ethereum.on("disconnect", handleDisconnect)
      }
    } catch (err) {
      console.error("Error connecting wallet:", err)
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    if (window.ethereum) {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum.removeListener("disconnect", handleDisconnect)
    }

    setAddress("")
    onDisconnect()
  }

  const formatAddress = (address: string) => {
    return address.substring(0, 6) + "..." + address.substring(address.length - 4)
  }

  return (
    <div>
      {address ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">{formatAddress(address)}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={disconnectWallet} title="Disconnect wallet">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={connectWallet}
          variant="outline"
          size="sm"
          disabled={isConnecting}
          className="flex items-center gap-2"
        >
          <Wallet className="h-4 w-4" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
