#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the vitex token.
 */

const Web3 = require("../lib/libWeb3");
const TokenVitdex = require("../lib/tokenVitdex");
const { formatRawNumber, formatNumber } = require("../lib/vtruUtils");

async function getDetailVitdex(wallet) {
    try {
        const web3 = await Web3.create(Web3.VTRU);
        const tokenVitdex = new TokenVitdex(web3);

        const nft = await tokenVitdex.getVitdexDetail(wallet);
        if (nft) {
            const {tokenId, units, claimed} = nft;
            console.log(`Wallet: ${wallet}`);
            console.log(`Vitdex TokenId: ${tokenId}`);
            console.log(`Vitdex Units:   ${units}`);
            console.log(`Vitdex Claimed: ${claimed}`);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    const wallet = process.argv[2];
    if (!wallet) {
        console.error("Usage: showVitdexToken.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getDetailVitdex(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
