#!/usr/bin/env node

/**
 * demo.js
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 *
 */

const { Web3 } = require("../lib/libWeb3");
const { Network } = require("../lib/libNetwork");
const TokenWallet = require("../lib/tokenWallet");
const { scaleDown, formatNumber, formatRawNumber } = require("../lib/vtruUtils");

// Define test wallet addresses (configure accordingly)
const wallets = [
    '0xWALLET_ADDRESS_1', 
    '0xWALLET_ADDRESS_2',
];

async function getWalletBalance(web3) {
    const id = web3.getId();
    const totkenWallet = new TokenWallet(web3);
    const balances = await totkenWallet.getBalances(wallets);
    balances.map((balance, index) => {
      console.log(`${wallets[index]}: ${Web3.currency[id]} ${formatRawNumber(balance,3)}`);
    });
}

async function runTests() {
     /* Mutiple networks  */
    const network = await new Network([Web3.VTRU, Web3.BSC]);
    const vtru = network.get(Web3.VTRU);
    const bsc = network.get(Web3.BSC);

    /* Single network  */
    const eth = Web3.create(Web3.ETH);

    await getWalletBalance(vtru);
    await getWalletBalance(bsc);
    await getWalletBalance(eth);
}

runTests().catch(error => console.error("❌ Test execution failed:", error));

