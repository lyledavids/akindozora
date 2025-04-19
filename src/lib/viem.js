import { createPublicClient, createWalletClient, http, custom } from "viem";
import { baseSepolia } from "viem/chains";

//const ALCHEMY_RPC = "https://sepolia.base.org"
const ALCHEMY_RPC = "https://base-sepolia.g.alchemy.com/v2/faeDCee5QQFLz_AoCd8R5ysX90YaV1p8"
// Public client for reading blockchain data
export const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(ALCHEMY_RPC),
  });
  
  // Wallet client for transactions (MetaMask)
  export function getWalletClient(account) {
    if (!account) {
      throw new Error("Account is required for wallet client");
    }
    return createWalletClient({
      account,
      chain: baseSepolia,
      transport: window.ethereum ? custom(window.ethereum) : http(ALCHEMY_RPC),
    });
  }
  
  // Connect wallet and get account
  export async function connectWallet() {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }
  
      // Request chain switch to Base Sepolia
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x14a34" }], // Base Sepolia chainId (84532 in hex)
      });
  
      // Request accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
  
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }
  
      return accounts[0]; // Return the first account
    } catch (error) {
      console.error("Wallet connection failed:", error);
      throw new Error(error.message || "Failed to connect wallet");
    }
  }