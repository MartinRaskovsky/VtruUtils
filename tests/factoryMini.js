#!/usr/bin/env node

/**
 * factoryMini.js
 *
 * Parallel version of mini.js using TokenFactory for contract instantiation.
 * Usage: factoryMini.js -c <chain> -t <token> [-v for viem]
 */

const Web3 = require("../lib/libWeb3");
const TokenFactory = require("../lib/TokenFactory");
const { ethers } = require("ethers");

require("dotenv").config();

const wallets = {
  ETH: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  VTRU: "0xa857dFB740396db406d91aEA65256da4d21721e4",
  USDC: "7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV",
};
wallets["wVTRU"] = wallets["VTRU"];

function usage() {
  console.log("Usage: factoryMini.js -c <chain> -t <token> [-v for viem]");
  process.exit(1);
}

function getWeb3(chain) {
  try {
    return new Web3(chain.toLowerCase());
  } catch (error) {
    console.error(`❌ Invalid chain for Web3: ${chain} - ${error.message}`);
    return null;
  }
}

async function test(chain, token) {
  const wallet = wallets[token] || wallets[chain];
  if (!wallet) {
    console.error("❌ No wallet found for token:", token);
    return;
  }

  const web3 = getWeb3(chain);
  if (!web3) return;

  const networkMap = new Map([[chain, web3]]);
  //const factoryEntry = TokenFactory.create(token, networkMap);
  const factoryEntry = TokenFactory.createByTokenAndChain(token, chain, networkMap);

  if (!factoryEntry) {
    console.error("❌ TokenFactory failed to create entry for:", token);
    return;
  }

  const contract = factoryEntry.contract;
  const address = contract.getAddress();
  const abi = contract.getAbi();
  console.log(`🧪 Testing ${token} on ${chain} using "ethers"}`);
  console.log(`📬 Contract: ${address}`);
  console.log(`👛 Wallet:   ${wallet}`);

  try {
      const provider = web3.getProvider();
      if (contract.isNativeToken && contract.isNativeToken()) {
        const balance = await provider.getBalance(wallet);
        console.log(`📦 Native Balance: ${balance} (via ethers)`);
      } else {
        const instance = contract.getContract();
        const balance = await instance.balanceOf(wallet);
        console.log(`📦 Token Balance: ${balance} (via ethers)`);
      }
  } catch (err) {
    console.error("❌ Error during balance fetch:", err.message);
  }
}

function main() {
  const args = process.argv.slice(2);
  let chain = "VTRU";
  let token = "VTRU";

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "-c":
        chain = args[++i];
        break;
      case "-t":
        token = args[++i];
        break;
      default:
        usage();
    }
  }

  test(chain, token);
}

main();

