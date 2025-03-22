#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the tokenUsdc Eth class.
 */

const Web3 = require("../lib/libWeb3");
const TokenUsdc = require("../lib/tokenUsdc");
const { formatRawNumber, formatNumber } = require("../lib/vtruUtils");

async function getBalanceUsdcEth(wallet) {
    try {
        const web3 = await Web3.create(Web3.ETH);
        const token = new TokenUsdc(web3);

        const balance = await token.getUsdcEthBalance(wallet);

        if (balance) {
            console.log(`${wallet} ${formatRawNumber(balance, 2)} USDC ETH`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    const wallet = process.argv[2];
    if (!wallet) {
        console.error("Usage: showUsdcEth.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getBalanceUsdcEth(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
