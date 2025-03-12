#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the tokenVtruEth class.
 */

const Web3 = require("../lib/libWeb3");
const TokenVtruEth = require("../lib/tokenVtruEth");
const { formatRawNumber, formatNumber } = require("../lib/vtruUtils");

async function getBalanceVtruEth(wallet) {
    try {
        const web3 = await Web3.create(Web3.ETH);
        const token = new TokenVtruEth(web3);

        const balance = await token.getVtruEthBalance(wallet);

        if (balance) {
            console.log(`${wallet} ${formatRawNumber(balance, 2)} VTRU ETH`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    const wallet = process.argv[2];
    if (!wallet) {
        console.error("Usage: showVtruEthToken.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getBalanceVtruEth(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
