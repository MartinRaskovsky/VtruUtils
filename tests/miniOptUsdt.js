#!/usr/bin/env node

const { ethers } = require("ethers");
const { formatVusdNumber } = require("../lib/vtruUtils");

const RPC_OPT = "https://mainnet.optimism.io";
const provider = new ethers.JsonRpcProvider(RPC_OPT);

const USDT_ADDRESS = ethers.getAddress("0x94b008aA00579c1307B0EF2c499aD98a8ce58e58");
//const WALLET = ethers.getAddress("0xB5216CB558Cb018583bED009EE25cA73Eb27bB1d");
const WALLET = ethers.getAddress("0xd07d220d7e43eca35973760f8951c79deebe0dcc");

const ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

(async () => {
  try {
    console.log('RPC_OPT      =', RPC_OPT);
    console.log('USDT_ADDRESS =', USDT_ADDRESS);
    console.log('WALLET       =', WALLET);
    
    const usdt = new ethers.Contract(USDT_ADDRESS, ABI, provider);
    const [balance, decimals, symbol] = await Promise.all([
      usdt.balanceOf(WALLET),
      usdt.decimals(),
      usdt.symbol()
    ]);

    if (!balance) {
      console.log(`⚠️ USDT balance returned empty for ${WALLET} (interpreted as 0)`);
      return;
    }

    if (balance === "0x") {
      console.log(`⚠️ USDT balance returned 0x for ${WALLET} (interpreted as 0)`);
      return;
    }

    const formatted = ethers.formatUnits(balance, decimals);
    console.log(`✅ ${symbol} balance of ${WALLET}: ${formatVusdNumber(balance)} (raw: ${balance}`);
  } catch (err) {
    console.error("❌ Fetch failed:", err.reason || err.message);
  }
})();

