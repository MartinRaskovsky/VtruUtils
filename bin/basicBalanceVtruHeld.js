#!/usr/bin/env node

/**
 * Basic minimal script to retrieve the VTRU held balance for a given wallet.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const Web3 = require("../lib/libWeb3");
const EvmBlockchain = require("../lib/evmBlockchain");
const { formatNativeBalance } = require("../lib/libEvm");

/**
 * Retrieves and displays the VTRU balance for a given wallet.
 *
 * @param {string} wallet - Wallet address to check.
 */
async function getBalance(wallet) {
    try {
        const web3 = new Web3(Web3.VTRU);
        const evmProvider = web3.getProvider();
        const token = new EvmBlockchain(evmProvider);
        const balance = await token.getBalance(wallet);
        console.log(`${wallet} balance=${formatNativeBalance(balance)}`);
    } catch (error) {
        console.error("❌ Error retrieving balance:", error.message);
    }
}

// Example wallet address
getBalance('0x0e476b2dc47643e71d2a85bade57407260d1d976');
