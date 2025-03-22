#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the VtruVaultDetails class.
 */

const Web3 = require("../lib/libWeb3");
const TokenSevo = require("../lib/tokenSevo");
const { formatRawNumber, formatNumber } = require("../lib/vtruUtils");

async function getDetailSevo(wallet) {
    try {
        const web3 = await Web3.create(Web3.VTRU);
        const tokenSevo = new TokenSevo(web3);

        
        const balance = await tokenSevo.getSevoBalance(wallet);
        if (balance) {
            console.log(`${wallet} ${formatRawNumber(balance, 0)} SEVO`);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    const wallet = process.argv[2];
    if (!wallet) {
        console.error("Usage: showSevo.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getDetailSevo(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
