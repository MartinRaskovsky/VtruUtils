#!/usr/bin/env node

const { ethers } = require("ethers");
const { formatVusdNumber } = require("../lib/vtruUtils");


const RPC_OPT = "https://mainnet.optimism.io";
const provider = new ethers.JsonRpcProvider(RPC_OPT);

const USDT_ADDRESS = ethers.getAddress("0x94b008aA00579c1307B0EF2c499aD98a8ce58e58");
const WALLET = ethers.getAddress("0xB5216CB558Cb018583bED009EE25cA73Eb27bB1d");

const ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

(async () => {
  try {
    console.log('RPC_OPT      =', RPC_OPT);
    console.log('USDT_ADDRESS =', USDT_ADDRESS);
    console.log('WALLET       =', WALLET);

    const usdt = new ethers.Contract(USDT_ADDRESS, ABI, provider);

    // Manually encode the balanceOf call
    const callData = usdt.interface.encodeFunctionData("balanceOf", [WALLET]);

    // Execute raw RPC call
    const raw = await provider.call({ to: USDT_ADDRESS, data: callData });

    console.log("📦 Raw result:", raw);

    if (!raw || raw === "0x") {
      console.log(`⚠️ USDT balance returned empty for ${WALLET} (interpreted as 0)`);
      return;
    }

    const [balance] = usdt.interface.decodeFunctionResult("balanceOf", raw);

    console.log(`✅ USDT balance of ${WALLET}: ${formatVusdNumber(balance)} (raw: ${balance}`);
  } catch (err) {
    console.error("❌ Low-level fetch failed:", err.reason || err.message);
  }
})();

