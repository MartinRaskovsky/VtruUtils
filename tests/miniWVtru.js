#!/usr/bin/env node

const { ethers } = require("ethers");

const ETH_RPC    = 'https://rpc.mevblocker.io';
const ETH_wallet = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

const WVTRU_RPC    = 'https://rpc.vitruveo.xyz';  // VTRU
const WVTRU_wallet = '0xa857dFB740396db406d91aEA65256da4d21721e4'; // wVTRU on VTRU

const rpcs = {
  ['ETH']:  ETH_RPC,
  ['wVTRU']:  WVTRU_RPC,
};

const wallets = {
  ['ETH']:  ETH_wallet,
  ['wVTRU']:  WVTRU_wallet,
}

async function test(target) {
  try {
    const wallet = wallets[target];
    const rpc = rpcs[target];
    const provider = new ethers.JsonRpcProvider(rpc);
    const balance = await provider.getBalance(wallet);
    console.log(`${wallet} ${balance} ${target}`);
  } catch (error) {
    console.error(`❌ Error fetching balance for ${wallet}:`, error.message);
  }
};

function main() {
  const args = process.argv.slice(2);
  const target = 'wVTRU';
 
  if ( args.length == 0) {
    test(target);
  } else {
    for (let i = 0; i < args.length; i++) {
      test(args[i]);
    }
  }
}

main();
