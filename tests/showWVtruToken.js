#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the tokenWVtru class.
 */

const Web3 = require("../lib/libWeb3");
const TokenWVtru = require("../lib/tokenWVtru");
const { formatRawNumber, formatNumber } = require("../lib/vtruUtils");

async function getBalanceWVtru(wallet) {
    try {
        const web3 = await Web3.create(Web3.VTRU);
        const token = new TokenWVtru(web3);

        const balance = await token.getWVtruBalance(wallet);

        if (balance) {
            console.log(`${wallet} ${formatRawNumber(balance, 0)} WVTRU`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    const wallet = process.argv[2];
    if (!wallet) {
        console.error("Usage: showWVtruToken.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getBalanceWVtru(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
