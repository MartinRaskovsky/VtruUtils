#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the tokenUsdcPol class.
 */

const Web3 = require("../lib/libWeb3");
const TokenUsdcPol = require("../lib/tokenUsdcPol");
const { formatVusdNumber } = require("../lib/vtruUtils");

async function getBalanceUsdcPol(wallet) {
    try {
        const web3 = await Web3.create(Web3.VTRU);
        const token = new TokenUsdcPol(web3);

        const balance = await token.getUsdcPolBalance(wallet);

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
        console.error("Usage: showUsdcPol.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getBalanceUsdcPol(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
