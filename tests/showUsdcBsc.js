#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the tokenUsdcBsc class.
 */

const Web3 = require("../lib/libWeb3");
const TokenUsdcBsc = require("../lib/tokenUsdcBsc");
const { formatRawNumber, formatNumber } = require("../lib/vtruUtils");

async function getBalanceUsdcBsc(wallet) {
    try {
        const web3 = await Web3.create(Web3.BSC);
        const token = new TokenUsdcBsc(web3);

        const balance = await token.getUsdcBscBalance(wallet);

        if (balance) {
            console.log(`${wallet} ${formatRawNumber(balance, 2)} USDC BSC`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    const wallet = process.argv[2];
    if (!wallet) {
        console.error("Usage: showUsdcBsc.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getBalanceUsdcBsc(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
