#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the tokenVusd class.
 */

const { formatVusdNumber } = require("../lib/vtruUtils");
const Web3 = require("../lib/libWeb3");
const TokenVusd = require("../lib/tokenVusd");


async function getBalanceVusd(wallet) {
    try {
        const web3 = await Web3.create(Web3.VTRU);
        const token = new TokenVusd(web3);

        const balance = await token.getVusdBalance(wallet);

        if (balance) {
            console.log(`${wallet} ${formatVusdNumber(balance)} VUSD`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    const wallet = process.argv[2];
    if (!wallet) {
        console.error("Usage: showVusdToken.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getBalanceVusd(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
