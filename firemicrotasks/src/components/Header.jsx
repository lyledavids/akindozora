"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { FireTokenABI } from "../contracts/FireTokenABI"

function Header({ account }) {
  const [balance, setBalance] = useState("0")
  const [network, setNetwork] = useState("")

  const FIRE_TOKEN_ADDRESS = "0x6d3A433919F2894cB8Fbf5b4CD1149a1e34e32dF"

  useEffect(() => {
    const getBalance = async () => {
      if (account && window.ethereum) {
        try {
          // Create provider without specifying network options
          // ethers.js will automatically detect the network
          const provider = new ethers.BrowserProvider(window.ethereum)

          // Create contract instance with the correct ABI
          const fireToken = new ethers.Contract(FIRE_TOKEN_ADDRESS, FireTokenABI, provider)

          // Fetch balance and log it for debugging
          const bal = await fireToken.balanceOf(account)
          console.log("Raw FIRE balance:", bal.toString())

          // Format the balance and set it
          const formattedBalance = ethers.formatEther(bal)
          console.log("Formatted FIRE balance:", formattedBalance)
          setBalance(formattedBalance)

          // Get network information
          try {
            const networkInfo = await provider.getNetwork()
            setNetwork(networkInfo.name)
          } catch (networkError) {
            console.error("Error getting network:", networkError)
            setNetwork("Base Sepolia") // Fallback to Base Sepolia
          }
        } catch (error) {
          console.error("Error getting balance:", error)
        }
      }
    }

    // Call getBalance immediately when account changes
    if (account) {
      getBalance()
    }

    // Set up an interval to refresh the balance every 10 seconds
    const intervalId = setInterval(() => {
      if (account) {
        getBalance()
      }
    }, 10000)

    // Clean up the interval on unmount
    return () => clearInterval(intervalId)
  }, [account])

  return (
    <header className="header">
      <div className="logo">
        <h1>🔥 FireTasks</h1>
        <p>Decentralized Microtasks powered by Zora x Base Sepolia</p>
      </div>

      <div className="account-info">
        {account ? (
          <>
            <div className="network">
              <span className="network-indicator"></span>
              {network || "Base Sepolia"}
            </div>
            <div className="balance">
              <span>{Number.parseFloat(balance || "0").toFixed(2)} FIRE</span>
            </div>
            <div className="address">
              {account.substring(0, 6)}...{account.substring(account.length - 4)}
            </div>
          </>
        ) : (
          <button className="connect-button">Connect Wallet</button>
        )}
      </div>
    </header>
  )
}

export default Header
