#!/usr/bin/env node
const { ethers } = require("ethers");

const RPC = "https://rpc.mevblocker.io";
const provider = new ethers.JsonRpcProvider(RPC);
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const WALLET = "0x3f5CE5FBFe3E9af3971dD833D26BA9b5C936f0bE";

const ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

(async () => {
  try {
    console.log("RPC         =", RPC);
    console.log("USDT_ADDRESS =", USDT_ADDRESS);
    console.log("WALLET       =", WALLET);
    const usdt = new ethers.Contract(USDT_ADDRESS, ABI, provider);
    const [balance, decimals, symbol] = await Promise.all([
      usdt.balanceOf(WALLET),
      usdt.decimals(),
      usdt.symbol()
    ]);
    const formatted = ethers.formatUnits(balance, decimals);
    console.log(`✅ ${symbol} balance of ${WALLET}: ${formatted}`);
  } catch (err) {
    console.error("❌ Fetch failed:", err.reason || err.message);
  }
})();

