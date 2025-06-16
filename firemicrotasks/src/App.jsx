"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import TaskList from "./components/TaskList"
import CreateTask from "./components/CreateTask"
import Header from "./components/Header"
import GetFire from "./components/GetFire"
import { TaskContractABI } from "./contracts/TaskContractABI"
import { FireTokenABI } from "./contracts/FireTokenABI"
import { getWorkSubmissions, addWorkSubmission } from "./data/workSubmissions"
import "./App.css"

function App() {
  const [account, setAccount] = useState("")
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [taskContract, setTaskContract] = useState(null)
  const [fireToken, setFireToken] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("browse")
  const [contractError, setContractError] = useState("")
  // Use the utility function to get work submissions
  const [workSubmissions, setWorkSubmissions] = useState(getWorkSubmissions())

  const FIRE_TOKEN_ADDRESS = "0x6d3A433919F2894cB8Fbf5b4CD1149a1e34e32dF"
  const TASK_CONTRACT_ADDRESS = "0xDbC67cc119427A1d926fe003e06145Da23Ea5b8e"

  // Function to handle work submissions
  const handleWorkSubmission = (taskId, data) => {
    // Use the utility function to add a work submission
    const newSubmission = addWorkSubmission(taskId, {
      worker: account,
      ...data,
    })

    // Update the state with the new submissions
    setWorkSubmissions(getWorkSubmissions())

    console.log("Work submission added:", taskId, newSubmission)
    console.log("All submissions after adding:", getWorkSubmissions())

    return newSubmission
  }

const BASE_SEPOLIA_CHAIN_ID = "0x14A34"; // Hex for 84532

const init = async () => {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask to use this application.")
    return
  }

  try {
    const provider = window.ethereum

    // Request account access
    const accounts = await provider.request({ method: "eth_requestAccounts" })
    if (!accounts || accounts.length === 0) {
      throw new Error("No account found")
    }

    // Check network
    const chainId = await provider.request({ method: "eth_chainId" })
    if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
      // Optionally request a switch
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
        })
      } catch (switchError) {
        throw new Error("Please switch to Base Sepolia network in MetaMask.")
      }
    }

    const web3Provider = new ethers.BrowserProvider(provider)
    const signer = await web3Provider.getSigner()

    // Replace these with your actual addresses + ABIs
    const taskContractInstance = new ethers.Contract(TASK_CONTRACT_ADDRESS, TaskContractABI, signer)
    const fireTokenInstance = new ethers.Contract(FIRE_TOKEN_ADDRESS, FireTokenABI, signer)

    setAccount(accounts[0])
    setProvider(web3Provider)
    setSigner(signer)
    setTaskContract(taskContractInstance)
    setFireToken(fireTokenInstance)

    await loadTasks(taskContractInstance)

    // Listeners
    provider.on("accountsChanged", (newAccounts) => {
      if (newAccounts.length > 0) {
        setAccount(newAccounts[0])
        loadTasks(taskContractInstance)
      } else {
        setContractError("Wallet disconnected.")
      }
    })

    provider.on("chainChanged", (newChainId) => {
      if (newChainId !== BASE_SEPOLIA_CHAIN_ID) {
        setContractError("Wrong network. Please switch to Base Sepolia.")
      } else {
        setContractError("")
        init() // Re-init
      }
    })

  } catch (err) {
    console.error("init error", err)
    setContractError(err.message || "Failed to connect.")
  } finally {
    setLoading(false)
  }
}


  // const init = async () => {
  //   if (window.ethereum) {
  //     try {
  //       // Request account access
  //       const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

  //       // Create Web3 provider
  //       const web3Provider = new ethers.BrowserProvider(window.ethereum)
  //       const web3Signer = await web3Provider.getSigner()

  //       // Create contract instances
  //       const taskContractInstance = new ethers.Contract(TASK_CONTRACT_ADDRESS, TaskContractABI, web3Signer)
  //       const fireTokenInstance = new ethers.Contract(FIRE_TOKEN_ADDRESS, FireTokenABI, web3Signer)

  //       setAccount(accounts[0])
  //       setProvider(web3Provider)
  //       setSigner(web3Signer)
  //       setTaskContract(taskContractInstance)
  //       setFireToken(fireTokenInstance)

  //       // Load tasks
  //       await loadTasks(taskContractInstance)

  //       // Listen for account changes
  //       window.ethereum.on("accountsChanged", (newAccounts) => {
  //         setAccount(newAccounts[0])
  //         // Reload tasks when account changes
  //         loadTasks(taskContractInstance)
  //       })
  //     } catch (error) {
  //       console.error("Error initializing app:", error)
  //       setContractError("Failed to connect to the contract. Please check if you're on Base Sepolia network.")
  //     }
  //   } else {
  //     alert("Please install MetaMask to use this application")
  //   }
  //   setLoading(false)
  // }

  useEffect(() => {
    init()

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners()
      }
    }
  }, [])

  // Refresh work submissions periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Update the work submissions from the utility
      setWorkSubmissions(getWorkSubmissions())
    }, 3000) // Check every 3 seconds

    return () => clearInterval(intervalId)
  }, [])

  const loadTasks = async (contract) => {
    try {
      setLoading(true)
      const taskCount = await contract.getTaskCount()
      console.log("Task count:", Number(taskCount))

      const taskArray = []

      for (let i = 1; i <= Number(taskCount); i++) {
        try {
          console.log("Loading task:", i)
          const task = await contract.tasks(i)
          console.log("Task loaded:", task)

          taskArray.push({
            id: i,
            title: task.title,
            description: task.description,
            reward: ethers.formatEther(task.reward),
            client: task.client,
            worker: task.worker,
            completed: task.completed,
            approved: task.approved,
          })
        } catch (error) {
          console.error(`Error loading task ${i}:`, error)
        }
      }

      console.log("All tasks loaded:", taskArray)
      setTasks(taskArray)
    } catch (error) {
      console.error("Error loading tasks:", error)
      setContractError("Failed to load tasks. Please check if the contract is deployed correctly.")
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (title, description, reward) => {
    try {
      setLoading(true)

      // Convert reward to wei
      const rewardInWei = ethers.parseEther(reward)

      // Approve token transfer
      const approveTx = await fireToken.approve(TASK_CONTRACT_ADDRESS, rewardInWei)
      await approveTx.wait()

      // Create task
      const tx = await taskContract.createTask(title, description, rewardInWei)
      await tx.wait()

      // Reload tasks
      await loadTasks(taskContract)
      setActiveTab("browse")
    } catch (error) {
      console.error("Error creating task:", error)
      alert("Error creating task. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  const acceptTask = async (taskId) => {
    try {
      setLoading(true)
      const tx = await taskContract.acceptTask(taskId)
      await tx.wait()
      await loadTasks(taskContract)
    } catch (error) {
      console.error("Error accepting task:", error)
      alert("Error accepting task. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  const completeTask = async (taskId, submissionData) => {
    try {
      setLoading(true)

      // First, add the work submission to our state
      if (submissionData) {
        handleWorkSubmission(taskId, submissionData)
      }

      // Then complete the task on the blockchain
      const tx = await taskContract.completeTask(taskId)
      await tx.wait()
      await loadTasks(taskContract)
    } catch (error) {
      console.error("Error completing task:", error)
      alert("Error completing task. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  const approveTask = async (taskId) => {
    try {
      setLoading(true)
      const tx = await taskContract.approveTask(taskId)
      await tx.wait()
      await loadTasks(taskContract)
    } catch (error) {
      console.error("Error approving task:", error)
      alert("Error approving task. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Header account={account} />

      <div className="tabs">
        <button className={activeTab === "browse" ? "active" : ""} onClick={() => setActiveTab("browse")}>
          Browse Tasks
        </button>
        <button className={activeTab === "create" ? "active" : ""} onClick={() => setActiveTab("create")}>
          Create Task
        </button>
        <button className={activeTab === "my-tasks" ? "active" : ""} onClick={() => setActiveTab("my-tasks")}>
          My Tasks
        </button>
        <button className={activeTab === "get-fire" ? "active" : ""} onClick={() => setActiveTab("get-fire")}>
          Get FIRE
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : contractError ? (
        <div className="error-message">{contractError}</div>
      ) : (
        <div className="content">
          {activeTab === "browse" && (
            <TaskList
              tasks={tasks}
              account={account}
              acceptTask={acceptTask}
              completeTask={completeTask}
              approveTask={approveTask}
              filter="all"
              workSubmissions={workSubmissions}
            />
          )}

          {activeTab === "create" && <CreateTask createTask={createTask} />}

          {activeTab === "my-tasks" && (
            <TaskList
              tasks={tasks.filter(
                (task) =>
                  task.client.toLowerCase() === account.toLowerCase() ||
                  task.worker.toLowerCase() === account.toLowerCase(),
              )}
              account={account}
              acceptTask={acceptTask}
              completeTask={completeTask}
              approveTask={approveTask}
              filter="my"
              workSubmissions={workSubmissions}
            />
          )}

          {activeTab === "get-fire" && <GetFire account={account} />}
        </div>
      )}
    </div>
  )
}

export default App
