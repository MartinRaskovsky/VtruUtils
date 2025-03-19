#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the tokenV3dex class.
 */

const Web3 = require("../lib/libWeb3");
const TokenV3dex = require("../lib/tokenV3dex");
const { formatRawNumber, formatNumber } = require("../lib/vtruUtils");

async function getBalanceV3dex(wallet) {
    try {
        const web3 = await Web3.create(Web3.VTRU);
        const token = new TokenV3dex(web3);

        const balance = await token.getV3dexBalance(wallet);

        if (balance) {
            console.log(`${wallet} ${formatRawNumber(balance, 2)} V3DEX`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    const wallet = process.argv[2];
    if (!wallet) {
        console.error("Usage: showV3dexToken.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getBalanceV3dex(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
