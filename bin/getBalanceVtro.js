#!/usr/bin/env node

/**
 * getBalanceVtro.js
 * 
 * Test script to retrieve VTRO token balance using tokenCommonEvm (via viem multicall).
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const Web3 = require("../lib/libWeb3");
const TokenCommonEvm = require("../lib/tokenCommonEvm");

// Replace with valid addresses
const wallets = [
    "0x9780e0f65Df2A5F11665e002Cb0A041a078EF0B8",
    "0xe807627990010f5fC9A0D71264402475aEd81390",
    "0x349a6fDD48Dd109f996D37c43B2df3476972E45A"
];

(async () => {
    try {
        const web3 = Web3.create(Web3.VTRU); // or BSC / POL depending on VTRO deployment
        console.log("VTRO Address:", web3.getConfig().getContractAddress("VTRO"));

        const token = new TokenCommonEvm(web3, "VTRO");

        const balances = await token.getBalances(wallets);

        console.log("VTRO Balances:");
        wallets.forEach((wallet, i) => {
            console.log(`- ${wallet}: ${balances[i]} wei`);
        });

    } catch (err) {
        console.error("❌ Error during balance test:", err.message);
    }
})();

