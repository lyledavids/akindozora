import express from 'express';
import { createCoin } from "@zoralabs/coins-sdk";
import { createWalletClient, createPublicClient, http } from 'viem';
import { zora } from 'viem/chains';
import axios from 'axios';
import { CID } from 'multiformats/cid';

const app = express();
app.use(express.json());

// 1. Configure Blockchain Clients
const publicClient = createPublicClient({
  chain: zora,
  transport: http(process.env.RPC_URL)
});

const walletClient = createWalletClient({
  chain: zora,
  transport: http(process.env.RPC_URL),
  account: process.env.SERVER_WALLET
});

// 2. AI Generation Function
async function generateAIArt(prompt) {
  try {
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        input: { prompt: `${prompt}, trending on art station, 4k` }
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const predictionId = response.data.id;
    let prediction;
    
    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statusResponse = await axios.get(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        { headers: { Authorization: `Token ${process.env.REPLICATE_KEY}` } }
      );
      prediction = statusResponse.data;
    } while (prediction.status !== 'succeeded');

    return prediction.output[0];
  } catch (error) {
    throw new Error(`AI generation failed: ${error.message}`);
  }
}

// 3. Get Farcaster Address (Free Method)
async function getFarcasterAddress(fid) {
  try {
    const response = await axios.get(
      `https://api.farcaster.xyz/v1/addresses/${fid}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.FARCASTER_API_KEY}`
        }
      }
    );
    return response.data.result[0].eth_address;
  } catch (error) {
    throw new Error(`Failed to get address: ${error.message}`);
  }
}

// 4. Main Frame Handler
app.post('/frame', async (req, res) => {
  try {
    const { untrustedData } = req.body;
    const userFid = untrustedData.fid;
    const userAddress = await getFarcasterAddress(userFid);
    const prompt = untrustedData.inputText || 'digital masterpiece';

    // Generate AI Art
    const imageUrl = await generateAIArt(prompt);
    
    // Upload to IPFS (Simple HTTP)
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const cid = CID.createV0(await imageResponse.data).toString();

    // Create Zora Coin
    const coinParams = {
      name: `AIART-${cid.slice(0,8)}`,
      symbol: `AI${Math.random().toString(36).substring(2,6).toUpperCase()}`,
      uri: `ipfs://${cid}`,
      payoutRecipient: userAddress,
      platformReferrer: process.env.SERVER_ADDRESS,
      initialPurchaseWei: BigInt(777000000000) // 0.000777 ETH
    };

    const { hash, address } = await createCoin(
      coinParams,
      walletClient,
      publicClient
    );

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext">
          <meta property="fc:frame:image" content="https://ipfs.io/ipfs/${cid}">
          <meta property="fc:frame:button:1" content="Mint ${coinParams.symbol}">
          <meta property="fc:frame:post_url" content="/mint?cid=${cid}">
        </head>
      </html>
    `);

  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.listen(3000, () => console.log('Running on 3000'));