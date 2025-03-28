#!/usr/bin/env node

/**
 * Basic minimal script to retrieve the TEZ balance for a given wallet.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const Web3 = require("../lib/libWeb3");
const { formatNativeBalance } = require("../lib/libTezos.js");

/**
 * Retrieves and displays the VTRU balance for a given wallet.
 *
 * @param {string} wallet - Wallet address to check.
 */
async function getBalance(wallet) {
    try {
        const web3 = new Web3(Web3.TEZ);
        const connection = web3.getConnection();
        const balance = await connection.getBalance(wallet);
        console.log(`${wallet} balance=${balance}`);
        console.log(`${wallet} balance=${formatNativeBalance(balance)}`);
    } catch (error) {
        console.error("❌ Error retrieving balance:", error.message);
    }
}

// Example wallet address
getBalance('tz1R7tXrF5LM783mQFmEPp3qg14ooqakCcJ8');
