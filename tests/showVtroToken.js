#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the tokenVtro class.
 */

const Web3 = require("../lib/libWeb3");
const TokenVtro = require("../lib/tokenVtro");
const { formatRawNumber, formatNumber } = require("../lib/vtruUtils");

async function getBalanceVtro(wallet) {
    try {
        const web3 = await Web3.create(Web3.VTRU);
        const token = new TokenVtro(web3);

        const balance = await token.getVtroBalance(wallet);

        if (balance) {
            console.log(`${wallet} ${formatRawNumber(balance, 2)} VTRO`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    const wallet = process.argv[2];
    if (!wallet) {
        console.error("Usage: showVtroToken.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getBalanceVtro(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
