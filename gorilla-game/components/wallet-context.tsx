"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type WalletContextType = {
  address: string
  isConnected: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType>({
  address: "",
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
})

export const useWallet = () => useContext(WalletContext)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string>("")
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)
          }
        }
      } catch (err) {
        console.error("Failed to check wallet connection:", err)
      }
    }

    checkConnection()

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else {
        setAddress(accounts[0])
        setIsConnected(true)
      }
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("No Ethereum wallet found. Please install MetaMask.")
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
      }
    } catch (err) {
      console.error("Error connecting wallet:", err)
      throw err
    }
  }

  const disconnectWallet = () => {
    setAddress("")
    setIsConnected(false)
  }

  return (
    <WalletContext.Provider value={{ address, isConnected, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  )
}
