#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 *
 * Active test for the SOL .
 */

const Web3 = require("../lib/libWeb3");
const TokenSol = require("../lib/tokenWallet");
const { formatSolNumber } = require("../lib/vtruUtils");

async function getBalanceSol(wallet) {
    try {
        const web3 = await Web3.create(Web3.SOL);
        const tokenSol = new TokenSol(web3);

        
        const balance = await tokenSol.getBalance(wallet);
        if (balance) {
            console.log(`${wallet} ${formatSolNumber(balance)} SOL`);
	    console.log(`${wallet} ${balance} `);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    const wallet = process.argv[2];
    if (!wallet) {
        console.error("Usage: showSol.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getBalanceSol(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
