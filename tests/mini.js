#!/usr/bin/env node

/* TODO

Add decimals from config and format balances into human-readable units.

Loop over multiple wallets for a given token.

Test on more chains and tokens (just expand your wallet/config).

Add gas estimation / cost per call (handy for optimizations).

Save test results to a timestamped JSON for audit or diffing.
*/

const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const { createPublicClient, http } = require("viem");
const { resolveViemChain } = require("../lib/viemChains");

require("dotenv").config();

const nativeTokens = new Set(['VTRU', 'ETH', 'BSC', 'POL', 'TEZ', 'SOL']);

const rpcs = {
  VTRU: "https://rpc.vitruveo.xyz",
  BSC: "https://bsc-dataseed.binance.org",
  ETH: "https://rpc.mevblocker.io",
  POL: "https://polygon-rpc.com",
  SOL: "https://api.mainnet-beta.solana.com",
  TEZ: "https://mainnet.api.tez.ie",
};

const wallets = {
  ETH: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  //VTRU: "0xa857dFB740396db406d91aEA65256da4d21721e4",
  VTRU: "0xa857dFB740396db406d91aEA65256da4d21721e4",
};
wallets["wVTRU"] = wallets["VTRU"];

function usage() {
  console.log("Usage: miniTest.js -c <chain> -t <token> [-v for viem]");
  process.exit(1);
}

async function test(chain, token, useViem = false) {
  const wallet = wallets[token] || wallets[chain];
  const rpc = rpcs[chain];
  if (!wallet || !rpc) {
    console.error("Invalid wallet or RPC for", chain, token);
    return;
  }

  // Load config based on chain
  const configPath = path.join(__dirname, `../data/${chain.toLowerCase()}-contracts.json`);
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const abi = config.abi[token];
  const address = config.mainnet[token];

  if (!abi || !address) {
    console.error("Missing ABI or contract address for", token, "on", chain);
    return;
  }

  console.log(`🧪 Testing ${token} on ${chain} using ${useViem ? "viem" : "ethers"}`);
  console.log(`📬 Contract: ${address}`);
  console.log(`👛 Wallet:   ${wallet}`);

  try {
    if (useViem) {
        const client = createPublicClient({
          chain: resolveViemChain(chain),
          transport: http(rpc),
        });
      
        let balance;
        if (nativeTokens.has(token)) {
          balance = await client.getBalance({ address: wallet });
          console.log(`📦 Native Balance: ${balance} (via viem)`);
        } else {
          balance = await client.readContract({
            address,
            abi,
            functionName: "balanceOf",
            args: [wallet],
          });
          console.log(`📦 Token Balance: ${balance} (via viem)`);
        }
      } else {
        const provider = new ethers.JsonRpcProvider(rpc);
      
        let balance;
        if (nativeTokens.has(token)) {
          balance = await provider.getBalance(wallet);
          console.log(`📦 Native Balance: ${balance} (via ethers)`);
        } else {
          const contract = new ethers.Contract(address, abi, provider);
          balance = await contract.balanceOf(wallet);
          console.log(`📦 Token Balance: ${balance} (via ethers)`);
        }
      }
      
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

function main() {
  const args = process.argv.slice(2);
  let chain = "VTRU";
  let token = "VTRU";
  let useViem = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "-c":
        chain = args[++i];
        break;
      case "-t":
        token = args[++i];
        break;
      case "-v":
        useViem = true;
        break;
      default:
        usage();
    }
  }

  test(chain, token, useViem);
}

main();
