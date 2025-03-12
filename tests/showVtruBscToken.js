#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the tokenVtruBsc class.
 */

const Web3 = require("../lib/libWeb3");
const TokenVtruBsc = require("../lib/tokenVtruBsc");
const { formatRawNumber, formatNumber } = require("../lib/vtruUtils");

async function getBalanceVtruBsc(wallet) {
    try {
        const web3 = await Web3.create(Web3.BSC);
        const token = new TokenVtruBsc(web3);

        const balance = await token.getVtruBscBalance(wallet);

        if (balance) {
            console.log(`${wallet} ${formatRawNumber(balance, 2)} VTRU BSC`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    const wallet = process.argv[2];
    if (!wallet) {
        console.error("Usage: showVtruBscToken.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getBalanceVtruBsc(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
