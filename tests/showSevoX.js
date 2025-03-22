#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the VtruVaultDetails class.
 */

const Web3 = require("../lib/libWeb3");
const TokenSevoX = require("../lib/tokenSevoX");
const { formatRawNumber, formatNumber } = require("../lib/vtruUtils");

async function getBalanceSevoX(wallet) {
    try {
        const web3 = await Web3.create(Web3.BSC);
        const tokenSevo = new TokenSevoX(web3);

        
        const balance = await tokenSevo.getSevoXBalance(wallet);
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
        await getBalanceSevoX(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
