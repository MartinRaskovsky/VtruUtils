#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the tokenUsdc Vtru class.
 */

const Web3 = require("../lib/libWeb3");
const TokenUsdc = require("../lib/tokenUsdc");
const { formatVusdNumber } = require("../lib/vtruUtils");

async function getBalanceUsdcVtru(wallet) {
    try {
        const web3 = await Web3.create(Web3.VTRU);
        const token = new TokenUsdc(web3);

        const balance = await token.getUsdcVtruBalance(wallet);

        if (balance) {
            console.log(`${wallet} ${formatVusdNumber(balance, 2)} USDC POL`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    const wallet = process.argv[2];
    if (!wallet) {
        console.error("Usage: showUsdcVtru.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getBalanceUsdcVtru(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
