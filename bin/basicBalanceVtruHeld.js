#!/usr/bin/env node

/**
 * Basic minimal script to retrieve the VTRU held balance for a given wallet.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const Web3 = require("../lib/libWeb3");
const TokenWallet = require("../lib/tokenWallet");
const { formatRawNumber } = require("../lib/vtruUtils");

/**
 * Retrieves and displays the VTRU balance for a given wallet.
 *
 * @param {string} wallet - Wallet address to check.
 */
async function getBalance(wallet) {
    try {
        const web3 = new Web3(Web3.VTRU);
        const token = new TokenWallet(web3);
        const balance = await token.getBalance(wallet);
        console.log(formatRawNumber(balance));
    } catch (error) {
        console.error("❌ Error retrieving balance:", error.message);
    }
}

// Example wallet address
getBalance('0x0e476b2dc47643e71d2a85bade57407260d1d976');
