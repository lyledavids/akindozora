import { publicClient } from "./viem";
import { getWalletClient } from "./viem";
import { createCoin, tradeCoin, getCoin } from "@zoralabs/coins-sdk";

// Mock profile data for fallback
const mockProfile = {
  coins: [
    {
      coinAddress: "0xmock1",
      name: "Mock Tech Hub",
      symbol: "$TECH",
      image: "https://via.placeholder.com/150",
      volume: 10,
    },
    {
      coinAddress: "0xmock2",
      name: "Mock City Park",
      symbol: "$PARK",
      image: "https://via.placeholder.com/150",
      volume: 5,
    },
  ],
};

// Mint a district coin
export async function mintDistrict({
  account,
  payoutRecipient,
  platformReferrer = "0x0000000000000000000000000000000000000000",
  name,
  symbol,
  uri,
}) {
  try {
    if (!uri.startsWith("ipfs://")) {
      throw new Error("Invalid IPFS URI: Must start with ipfs://");
    }
    const walletClient = getWalletClient(account);
    const coinParams = {
      name,
      symbol,
      uri,
      payoutRecipient: payoutRecipient || account,
      platformReferrer,
    };
    console.log("Minting with params:", coinParams);

    // Simulate raw call to catch revert reasons
    try {
      await publicClient.call({
        account,
        to: "0x777777751622c0d3258f214F9DF38E35BF45baF3",
        data: encodeFunctionData({
          abi: [
            {
              inputs: [
                { type: "address", name: "payoutRecipient" },
                { type: "address[]", name: "owners" },
                { type: "string", name: "uri" },
                { type: "string", name: "name" },
                { type: "string", name: "symbol" },
                { type: "address", name: "platformReferrer" },
              ],
              name: "deploy",
              type: "function",
            },
          ],
          functionName: "deploy",
          args: [
            coinParams.payoutRecipient,
            [account],
            uri,
            name,
            symbol,
            coinParams.platformReferrer,
          ],
        }),
      });
    } catch (simError) {
      console.error("Simulation failed:", simError);
    }

    const coin = await createCoin(coinParams, walletClient, publicClient);
    return coin;
  } catch (error) {
    console.error("Minting failed:", error);
    throw new Error(error.message || "Failed to mint district");
  }
}

// Buy/sell coins
export async function tradeDistrict({ account, coinAddress, amount, isBuy }) {
  try {
    const walletClient = getWalletClient(account);
    const result = await tradeCoin({
      account,
      coinAddress,
      amount,
      tradeType: isBuy ? "buy" : "sell",
      chainId: 84532,
      publicClient,
      walletClient,
    });
    return result;
  } catch (error) {
    console.error("Trade failed:", error);
    throw new Error("Failed to trade district");
  }
}

// Fetch coin data
export async function fetchCoin(coinAddress) {
  try {
    const coin = await getCoin({ coinAddress, chainId: 84532, publicClient });
    return coin;
  } catch (error) {
    console.error("Fetch coin failed:", error);
    return null;
  }
}

// Fetch profile data
export async function fetchProfile(account) {
  console.log(`Fetching profile for ${account}; using mock data`);
  return mockProfile;
}