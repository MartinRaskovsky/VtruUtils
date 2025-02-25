#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: January 2025
 *
 * Active test for the VtruVaultDetails class.
 */

const Web3 = require("../lib/libWeb3");
const TokenVerse = require("../lib/tokenVerse");
const { formatRawNumber, formatNumber } = require("../lib/vtruUtils");

async function getVerseDetails(outWallet) {
    try {
        const web3 = await Web3.create(Web3.VTRU);
        const tokenVerse = new TokenVerse(web3);

        
        const data = await tokenVerse.getVerseDetail(outWallet);
        if (!data) return;
        const { wallet, balance } = data;
        console.log(`Verse Balance: ${formatNumber(balance, 0)} in ${wallet}`);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    const wallet = process.argv[2];
    if (!wallet) {
        console.error("Usage: showVerseContract.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getVerseDetails(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
