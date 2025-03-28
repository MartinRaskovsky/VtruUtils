#!/usr/bin/env node

/**
 * Basic minimal script to retrieve the VTRU held balance for a given wallet.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const Web3 = require("../lib/libWeb3");
const { formatNativeBalance } = require("../lib/libSolana.js");
const { formatRawNumber, formatNumber, formatSolNumber, formatVusdNumber  } = require("../lib/vtruUtils");

/**
 * Retrieves and displays the VTRU balance for a given wallet.
 *
 * @param {string} wallet - Wallet address to check.
 */
async function getBalance(wallet) {
    try {
        const web3 = new Web3(Web3.SOL);
        const connection = web3.getConnection();
        const balance = await connection.getBalance(wallet);
        //console.log(`${wallet} balance=${balance}`);
        //console.log(`${wallet} balance=${formatVusdNumber(balance/1000n, 3)}`);
        console.log(`${wallet} balance=${formatNativeBalance(Number(balance), 3)}`);
    } catch (error) {
        console.error("❌ Error retrieving balance:", error.message);
    }
}

// Example wallet address
getBalance('7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV');
getBalance('38ixPfa9kYoppvNJmWRQU5iyzBGStGYoyMtFDSn7ktXd');
