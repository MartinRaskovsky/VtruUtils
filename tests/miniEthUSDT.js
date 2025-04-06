#!/usr/bin/env node

const { ethers } = require("ethers");
const { formatVusdNumber } = require("../lib/vtruUtils");

const RPC_ETH = "https://rpc.mevblocker.io";
const provider = new ethers.JsonRpcProvider(RPC_eth);

// USDT official address on Ethereum
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const WALLET = "0x61e29F5cCEfba15fe1dF9bf962363E02879fbD62";

const ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

(async () => {
  try {
    console.log('RPC-eth      =', RPC_ETH);
    console.log('USDT_ADDRESS =', USDT_ADDRESS);
    console.log('WALLET       =', WALLET);
    
    const usdt = new ethers.Contract(USDT_ADDRESS, ABI, provider);
    const [balance, decimals, symbol] = await Promise.all([
      usdt.balanceOf(WALLET),
      usdt.decimals(),
      usdt.symbol()
    ]);

    const formatted = ethers.formatUnits(balance, decimals);
    console.log(`✅ ${symbol} balance of ${WALLET} on Ethereum: ${formatVusdNumber(balance)} (raw: ${balance}`);
  } catch (err) {
    console.error("❌ Fetch failed:", err.reason || err.message);
  }
})();

