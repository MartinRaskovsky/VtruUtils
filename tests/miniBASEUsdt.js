#!/usr/bin/env node

const { ethers } = require("ethers");
const { formatVusdNumber } = require("../lib/vtruUtils");

const RPC_BASE = "https://mainnet.base.org";
const provider = new ethers.JsonRpcProvider(RPC_BASE);

// USDT official address on Ethereum
const USDT_ADDRESS = "0xd9aa031C3bFa1aA40e8C6F2d60bB45c0ab2E34D0";
const WALLET = "0xD8da6BF26964aF9D7eEd9e03E53415D37aA96045";

const ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

(async () => {
  try {
    console.log('RPC_BASE      =', RPC_BASE);
    console.log('USDT_ADDRESS =', USDT_ADDRESS);
    console.log('WALLET       =', WALLET);
    
    const usdt = new ethers.Contract(USDT_ADDRESS, ABI, provider);
    const [balance, decimals, symbol] = await Promise.all([
      usdt.balanceOf(WALLET),
      usdt.decimals(),
      usdt.symbol()
    ]);

    const formatted = ethers.formatUnits(balance, decimals);
    console.log(`✅ ${symbol} balance of ${WALLET} on Base: ${formatVusdNumber(balance)} (raw: ${balance}`);
  } catch (err) {
    console.error("❌ Fetch failed:", err.reason || err.message);
  }
})();

