#!/usr/bin/env node

const { ethers } = require("ethers");

const EVM_RPC = 'https://rpc.mevblocker.io'; // Use any EVM-compatible RPC
const wallet = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'; // Replace with a valid EVM wallet

(async () => {
  try {
    const provider = new ethers.JsonRpcProvider(EVM_RPC);
    const balance = await provider.getBalance(wallet);
    console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
  } catch (error) {
    console.error(`❌ Error fetching EVM balance for ${wallet}:`, error.message);
  }
})();

