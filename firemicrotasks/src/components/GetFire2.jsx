"use client"

import { useState } from "react"

function GetFire({ account }) {
  const [amount, setAmount] = useState("10")
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [error, setError] = useState("")

  

  return (
    <div className="get-fire-container">
      <h2>Get FIRE Tokens</h2>

      <div className="fire-info">
        <div className="fire-logo">🔥</div>
        <div className="fire-details">
          <h3>FIRE Token</h3>
          <p>The utility token for the FireTasks platform</p>
          <p className="fire-address">
            Contract: <span>0x6d3A433919F2894cB8Fbf5b4CD1149a1e34e32dF</span>
          </p>
        </div>
      </div>

      <div className="get-fire-options">
        

        <div className="option-card">
          <h3>💱 Swap</h3>
          <p>Swap ETH for FIRE tokens</p>
          <p className="coming-soon">Coming soon</p>
        </div>

      </div>

      <div className="fire-instructions">
        <h3>How to use FIRE tokens</h3>
        <ol>
          <li>Use FIRE tokens to create tasks on the platform</li>
          <li>Complete tasks to earn more FIRE tokens</li>
          <li>Build your reputation in the FireTasks ecosystem</li>
        </ol>
      </div>
    </div>
  )
}

export default GetFire
