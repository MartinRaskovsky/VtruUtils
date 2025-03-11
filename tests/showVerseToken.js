#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the tokenVerse class.
 */

const Web3 = require("../lib/libWeb3");
const TokenVerse = require("../lib/tokenVerse");
const { formatRawNumber, formatNumber } = require("../lib/vtruUtils");

async function getBalanceVerse(wallet) {
    try {
        const web3 = await Web3.create(Web3.VTRU);
        const token = new TokenVerse(web3);
        const balance = await token.getBalance(wallet);
        //const balance = await token.getVerseBalance(wallet);
        console.log(`Wallet: ${wallet}`);
        console.log(`Verse Balance: ${formatNumber(balance, 0)}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    const wallet = process.argv[2];
    if (!wallet) {
        console.error("Usage: showVerseToken.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getBalanceVerse(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
