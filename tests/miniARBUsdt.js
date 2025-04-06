#!/usr/bin/env node

const { ethers } = require("ethers");
const { formatVusdNumber } = require("../lib/vtruUtils");

const RPC_ARB = "https://arb1.arbitrum.io/rpc";
const provider = new ethers.JsonRpcProvider(RPC_ARB);

// USDT official address on Ethereum
const USDT_ADDRESS = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
//const WALLET = "0x51f9C432A4e59aC86282D6ADaB4c2EB8919160EB"; // balance = 0
const WALLET = "0x7E55b63EAE9E7d64d6a5b1dC8365E2DCC048C26f";

const ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

(async () => {
  try {
    console.log('RPC_ARB      =', RPC_ARB);
    console.log('USDT_ADDRESS =', USDT_ADDRESS);
    console.log('WALLET       =', WALLET);
    
    const usdt = new ethers.Contract(USDT_ADDRESS, ABI, provider);
    const [balance, decimals, symbol] = await Promise.all([
      usdt.balanceOf(WALLET),
      usdt.decimals(),
      usdt.symbol()
    ]);

    const formatted = ethers.formatUnits(balance, decimals);
    console.log(`✅ ${symbol} balance of ${WALLET} on Arbitum: ${formatVusdNumber(balance)} (raw: ${balance}`);
  } catch (err) {
    console.error("❌ Fetch failed:", err.reason || err.message);
  }
})();

