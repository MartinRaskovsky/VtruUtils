#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the VtruVaultDetails class.
 */

const Web3 = require("../lib/libWeb3");
const { getBlockDate } = require("../lib/libWeb3Timer");
const TokenSevoX = require("../lib/tokenStakedSevoX");
const { formatRawNumber, formatNumber } = require("../lib/vtruUtils");

async function getDetailSevo(wallet) {
    try {
        const web3 = await Web3.create(Web3.BSC);
        const tokenSevo = new TokenSevoX(web3);
        
        const data = await tokenSevo.getStakedDetail(wallet);
        if (data) {
            for (let i=0; i<data.length; i++) {
                const { wallet, stamp, locked } = data[i];
                const unlocked = ((locked * 100n) / 95n) - locked;
                const date = await getBlockDate(web3, stamp);
                console.log(`${wallet} unlocked=${formatRawNumber(unlocked)} locked=${formatRawNumber(locked)} date=${date} `);
            }
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
