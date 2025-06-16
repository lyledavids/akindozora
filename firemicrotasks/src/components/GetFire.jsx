"use client"

import { useState } from "react"
import { tradeCoin, simulateBuy } from "@zoralabs/coins-sdk"
import { createWalletClient, createPublicClient, http, parseEther, custom } from "viem"
import { baseSepolia } from "viem/chains"

function GetFire({ account }) {
  const [buyAmount, setBuyAmount] = useState("0.1")
  const [sellAmount, setSellAmount] = useState("100")
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [simulation, setSimulation] = useState(null)

  const FIRE_TOKEN_ADDRESS = "0x6d3A433919F2894cB8Fbf5b4CD1149a1e34e32dF"
  const RPC_URL = "https://sepolia.base.org" // Base testnet RPC

  // Set up viem clients
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  })

  const getWalletClient = () => {
    if (typeof window !== "undefined" && window.ethereum) {
      return createWalletClient({
        account: account,
        chain: baseSepolia,
        transport: custom(window.ethereum),
      })
    }
    return null
  }

  const clearMessages = () => {
    setError("")
    setSuccessMessage("")
    setTxHash("")
  }

  const simulateBuyTransaction = async () => {
    try {
      setLoading(true)
      clearMessages()

      const simulation = await simulateBuy({
        target: FIRE_TOKEN_ADDRESS,
        requestedOrderSize: parseEther(buyAmount),
        publicClient,
      })

      setSimulation(simulation)
      console.log("Buy simulation:", simulation)
    } catch (err) {
      console.error("Simulation error:", err)
      setError(`Simulation failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const buyTokens = async () => {
    try {
      setLoading(true)
      clearMessages()

      const walletClient = getWalletClient()
      if (!walletClient) {
        throw new Error("Wallet not connected")
      }

      const buyParams = {
        direction: "buy",
        target: FIRE_TOKEN_ADDRESS,
        args: {
          recipient: account,
          orderSize: parseEther(buyAmount),
          minAmountOut: 0n,
        }
      }

      const result = await tradeCoin(buyParams, walletClient, publicClient)
      
      setTxHash(result.hash)
      setSuccessMessage(`Successfully bought FIRE tokens!`)
      console.log("Buy transaction:", result)
      
    } catch (err) {
      console.error("Buy error:", err)
      setError(`Buy failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const sellTokens = async () => {
    try {
      setLoading(true)
      clearMessages()

      const walletClient = getWalletClient()
      if (!walletClient) {
        throw new Error("Wallet not connected")
      }

      const sellParams = {
        direction: "sell",
        target: FIRE_TOKEN_ADDRESS,
        args: {
          recipient: account,
          orderSize: parseEther(sellAmount),
          minAmountOut: parseEther("0.01"), // Minimum ETH to receive
        }
      }

      const result = await tradeCoin(sellParams, walletClient, publicClient)
      
      setTxHash(result.hash)
      setSuccessMessage(`Successfully sold FIRE tokens!`)
      console.log("Sell transaction:", result)
      
    } catch (err) {
      console.error("Sell error:", err)
      setError(`Sell failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="get-fire-container">
      <h2>Get FIRE Tokens</h2>

      <div className="fire-info">
        <div className="fire-logo">🔥</div>
        <div className="fire-details">
          <h3>FIRE Token</h3>
          <p>The utility token for the FireTasks platform</p>
          <p className="fire-address">
            Contract: <span>{FIRE_TOKEN_ADDRESS}</span>
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          {successMessage}
          {txHash && (
            <div className="tx-hash">
              Transaction: {txHash}
            </div>
          )}
        </div>
      )}

      <div className="get-fire-options">
        <div className="option-card">
          <h3>💰 Buy FIRE Tokens</h3>
          <p>Purchase FIRE tokens with ETH</p>
          
          <div className="amount-input">
            <label>ETH Amount:</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              disabled={loading}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button
              className="get-fire-button"
              onClick={simulateBuyTransaction}
              disabled={loading || !account}
              style={{ backgroundColor: '#3498db' }}
            >
              {loading ? "Simulating..." : "Simulate Buy"}
            </button>
            
            <button
              className="get-fire-button"
              onClick={buyTokens}
              disabled={loading || !account}
            >
              {loading ? "Buying..." : "Buy Tokens"}
            </button>
          </div>

          {simulation && (
            <div style={{ 
              backgroundColor: '#f0f8ff', 
              padding: '10px', 
              borderRadius: '8px', 
              fontSize: '14px',
              marginBottom: '10px'
            }}>
              <p><strong>Simulation Result:</strong></p>
              <p>ETH to spend: {(Number(simulation.orderSize) / 1e18).toFixed(4)} ETH</p>
              <p>FIRE tokens you'll receive: {(Number(simulation.amountOut) / 1e18).toFixed(2)} FIRE</p>
            </div>
          )}
        </div>

        <div className="option-card">
          <h3>💸 Sell FIRE Tokens</h3>
          <p>Sell your FIRE tokens for ETH</p>
          
          <div className="amount-input">
            <label>FIRE Amount:</label>
            <input
              type="number"
              step="1"
              min="1"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            className="get-fire-button"
            onClick={sellTokens}
            disabled={loading || !account}
            style={{ backgroundColor: '#e74c3c' }}
          >
            {loading ? "Selling..." : "Sell Tokens"}
          </button>
        </div>

        
      </div>

      <div className="fire-instructions">
        <h3>How to use FIRE tokens</h3>
        <ol>
          <li>Use FIRE tokens to create tasks on the platform</li>
          <li>Complete tasks to earn more FIRE tokens</li>
          <li>Build your reputation in the FireTasks ecosystem</li>
          <li>Buy tokens with ETH or sell tokens back to ETH</li>
        </ol>
      </div>

      {!account && (
        <div style={{
          backgroundColor: 'rgba(243, 156, 18, 0.1)',
          color: '#f39c12',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          Please connect your wallet to buy or sell FIRE tokens
        </div>
      )}
    </div>
  )
}

export default GetFire