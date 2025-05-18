# FireTasks - Decentralized Microtasks Platform

FireTasks is a decentralized microtasks platform built on the Base Sepolia testnet. It enables users to post tasks by locking FIRE tokens as escrow and allows workers to complete these tasks to earn rewards.

https://firezora.netlify.app/

## Overview

FireTasks creates a trustless environment for freelance work by using smart contracts to handle task creation, acceptance, completion, and payment. The platform uses FIRE tokens (created using the Zora Coins Protocol) as the currency for all transactions.

## Key Features

- **Decentralized Task Management**: Create, accept, complete, and approve tasks without intermediaries
- **Escrow System**: FIRE tokens are locked in the smart contract until work is approved
- **Transparent Workflow**: All task statuses and transactions are visible on the blockchain
- **Simple User Interface**: Easy-to-use interface for both clients and workers

## How It Works

1. **Clients** create tasks by locking FIRE tokens in the smart contract
2. **Workers** browse available tasks and accept those they want to work on
3. **Workers** complete tasks and submit their work through the platform
4. **Clients** review the submitted work and approve it if satisfactory
5. **Smart Contract** automatically transfers the FIRE tokens to the worker upon approval

## Contract Addresses (Base Sepolia Testnet)

- **FIRE Token**: `0x6d3A433919F2894cB8Fbf5b4CD1149a1e34e32dF`
- **MicrotaskPlatform**: `0xDbC67cc119427A1d926fe003e06145Da23Ea5b8e`

## FIRE Token

The FIRE token was created using the Zora Coins Protocol, which provides a simple way to create and manage tokens on the Base network. FIRE serves as the utility token for the FireTasks platform, enabling:

- Task creation and escrow
- Worker payments
- Platform governance (future feature)

## Getting Started

1. Connect your wallet to the Base Sepolia testnet
2. Get FIRE tokens from the faucet in the app
3. Create tasks or start working on existing ones

## Future Development

- Task categories and tags
- Worker reputation system
- Dispute resolution mechanism
- Task deadlines and milestones
- Enhanced work submission with file uploads

## Acknowledgements

- Built on Base Sepolia testnet
- FIRE token created with Zora Coins Protocol(Check tokenCreationScript folder and the notes.txt in folder)
- Developed during the Base x Zora hackathon
