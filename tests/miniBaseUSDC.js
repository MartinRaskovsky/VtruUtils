#!/usr/bin/env node

const { ethers } = require("ethers");

const RPC_BASE = "https://base.publicnode.com";
const provider = new ethers.JsonRpcProvider(RPC_BASE);

// ✅ Circle-issued Base USDC address (checksummed properly)
const USDC_ADDRESS = ethers.getAddress("0x833589fcd6edb6e08f4c7c32d4f71b54bda02913");

// 🧪 Use a wallet with known USDC (non-zero)
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

