import { createCoin, CreateCoinArgs, getCoin, validateMetadataURIContent, ValidMetadataURI } from "@zoralabs/coins-sdk";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, baseSepolia } from "viem/chains";
import "dotenv/config";

if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not set in .env file");
}
if (!process.env.RPC_URL) {
    throw new Error("RPC_URL is not set in .env file");
}

//const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
if (!privateKey.match(/^0x[0-9a-fA-F]{64}$/)) {
  throw new Error("Invalid PRIVATE_KEY format. Expected 0x followed by 64 hex characters.");
}
const account = privateKeyToAccount(privateKey);

console.log("Account address:", account.address);

const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.RPC_URL),
});

const walletClient = createWalletClient({
    account: account,
    chain: baseSepolia,
    transport: http(process.env.RPC_URL),
});


const coinParams: CreateCoinArgs = {
    name: "Fire",
    symbol: "Fire",
    uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy",
    payoutRecipient: account.address,
};

async function createMyCoin(coinParams: CreateCoinArgs) {
    try {
        const result = await createCoin(coinParams, walletClient, publicClient);

        console.log("Transaction hash:", result.hash);
        console.log("Coin address:", result.address);
        console.log("Deployment details:", result.deployment);

        return result;
    } catch (error) {
        console.error("Error creating coin:", error);
        throw error;
    }
}

// export async function fetchSingleCoin(address: string, chain: number) {
//     const response = await getCoin({
//         address,
//         chain,
//     });

//     const coin = response.data?.zora20Token;

//     if (coin) {
//         console.log("Coin Details:");
//         console.log("- Name:", coin.name);
//         console.log("- Symbol:", coin.symbol);
//         console.log("- Description:", coin.description);
//         console.log("- Total Supply:", coin.totalSupply);
//         console.log("- Market Cap:", coin.marketCap);
//         console.log("- 24h Volume:", coin.volume24h);
//         console.log("- Creator:", coin.creatorAddress);
//         console.log("- Created At:", coin.createdAt);
//         console.log("- Unique Holders:", coin.uniqueHolders);

//         console.log("Coin object:", coin)
//     }

//     return response;
// }


const main = async () => {
    //await isUriValid("ipfs://bafkreihfvosyqwbldnotax24t5unc2udan66ko2uooozyeigas67vpgqo4");
    await createMyCoin(coinParams);
    //await fetchSingleCoin("0x8Ff1f3927165520e4e896d5bD672155A4935B6a6", baseSepolia.id);
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});