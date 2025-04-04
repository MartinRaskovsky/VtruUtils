#!/usr/bin/env node

const { ethers } = require("ethers");

//const RPC_ETH = "https://ethereum.publicnode.com";
const RPC_ETH   = "https://rpc.mevblocker.io";

const provider = new ethers.JsonRpcProvider(RPC_ETH);

// Pass lowercase and fix with getAddress()
//const USDC_ADDRESS = ethers.getAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
//const WALLET = ethers.getAddress("0x55fe002aeff02f77364de339a1292923a15844b8");

const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const WALLET = "0x55fe002aeff02f77364de339a1292923a15844b8";

const ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

(async () => {
  try {
    console.log('RPC_ETH      =', RPC_ETH);
    console.log('USDC_ADDRESS =', USDC_ADDRESS);
    console.log('WALLET       =', WALLET);
    
    const usdc = new ethers.Contract(USDC_ADDRESS, ABI, provider);
    const [balance, decimals, symbol] = await Promise.all([
      usdc.balanceOf(WALLET),
      usdc.decimals(),
      usdc.symbol()
    ]);

    const formatted = ethers.formatUnits(balance, decimals);
    console.log(`✅ ${symbol} balance of ${WALLET} on Ethereum: ${formatted}`);
  } catch (err) {
    console.error("❌ Fetch failed:", err.reason || err.message);
  }
})();

