#!/usr/bin/env node

const Web3 = require('../lib/libWeb3');
const TokenCommonEvm = require('../lib/tokenCommonEvm');

const web3 = new Web3(Web3.ETH);
const token = new TokenCommonEvm(web3, 'VTRU');

const wallets = [
  '0xa857dfb740396db406d91aea65256da4d21721e4',
  '0x0e476b2dc47643e71d2a85bade57407260d1d976',
  '0x4c3878f9a8751e88a2481ad153763e93d601c727'
];

(async () => {
  const address = token.getAddress();
  console.log(`Token VTRU on ETH Address: ${address}`);

  const balances = await token.getBalances(wallets);

  console.log(`VTRU on ETH Balances:`);
  wallets.forEach((wallet, i) => {
    const balance = balances[i];
    console.log(`- ${wallet}: ${balance !== null ? balance.toString() : 'null'} wei`);
  });
})();

