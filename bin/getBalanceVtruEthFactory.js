#!/usr/bin/env node

/**
 * getBalanceVtruEthFactory.js
 * 
 * Tests the TokenFactory mechanism for loading TokenCommonEvm instances.
 * Compares with direct usage to validate address and multicall behavior.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const Web3 = require('../lib/libWeb3');
const TokenFactory = require('../lib/TokenFactory');
const { SEC_VTRU_ETH } = require('../shared/constants');

// Build a full network map like the VaWa app
const networks = new Map();
networks.set(Web3.ETH, new Web3(Web3.ETH));
networks.set(Web3.VTRU, new Web3(Web3.VTRU));
networks.set(Web3.BSC, new Web3(Web3.BSC));
networks.set(Web3.POL, new Web3(Web3.POL));

const web3 = new Web3(Web3.ETH);
const wallets = [
  '0xa857dfb740396db406d91aea65256da4d21721e4',
  '0x0e476b2dc47643e71d2a85bade57407260d1d976',
  '0x4c3878f9a8751e88a2481ad153763e93d601c727'
];

(async () => {
  const section = TokenFactory.create(SEC_VTRU_ETH, networks);
  if (!section || !section.contract) {
    console.error(`❌ Failed to create token from factory using key ${SEC_VTRU_ETH}`);
    process.exit(1);
  }

  const token = section.contract; // ✅ Grab the actual token instance
  if (!token) {
    console.error(`❌ Failed to create token from factory using key ${SEC_VTRU_ETH}`);
    process.exit(1);
  }

  const address = token.getAddress?.();
  console.log(`Token VTRU on ETH Address: ${address}`);

  const balances = await token.getBalances(wallets);

  console.log(`VTRU on ETH Balances (via Factory):`);
  wallets.forEach((wallet, i) => {
    const balance = balances[i];
    console.log(`- ${wallet}: ${balance !== null ? balance.toString() : 'null'} wei`);
  });
})();

