#!/usr/bin/env node

const { ethers } = require("ethers");

const RPC_BASE = "https://base.publicnode.com";
const provider = new ethers.JsonRpcProvider(RPC_BASE);

// ✅ Circle-issued Base USDC address (checksummed properly)
//const USDC_ADDRESS = ethers.getAddress("0xd9aaec86b65d86f6a9b61b2af5dda7fc9c89e5b7");
const USDC_ADDRESS = ethers.getAddress("0x833589fcd6edb6e08f4c7c32d4f71b54bda02913");

// 🧪 Use a wallet with known USDC (non-zero)
// const WALLET = ethers.getAddress("0xa7c0a2b85c0ed5f9dcf9b098c0f20b59b62f360f"); // yours
//const WALLET = ethers.getAddress("0x5d7b76d3c5bdfd43a96149aa1477c6b14d62e9e7"); // test whale wallet
const WALLET = ethers.getAddress("0x4200000000000000000000000000000000000006");

const ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

(async () => {
  try {
    console.log('USDC_ADDRESS =', USDC_ADDRESS);
    console.log('WALLET       =', WALLET);

    const usdc = new ethers.Contract(USDC_ADDRESS, ABI, provider);

    // Manually encode the balanceOf call
    const callData = usdc.interface.encodeFunctionData("balanceOf", [WALLET]);

    // Execute raw RPC call
    const raw = await provider.call({ to: USDC_ADDRESS, data: callData });

    console.log("📦 Raw result:", raw);

    if (!raw || raw === "0x") {
      console.log(`⚠️ USDC balance returned empty for ${WALLET} (interpreted as 0)`);
      return;
    }

    const [balance] = usdc.interface.decodeFunctionResult("balanceOf", raw);
    const decimals = await usdc.decimals();

    console.log(`✅ USDC balance on Base for ${WALLET}: ${ethers.formatUnits(balance, decimals)} USDC`);
  } catch (err) {
    console.error("❌ Low-level fetch failed:", err.reason || err.message);
  }
})();

