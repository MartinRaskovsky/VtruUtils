#!/usr/bin/env node

/**
* Author: Dr Martín Raskovsky
* Date: January 2025
* 
* Unit tests for the VtruTransaction class.
* These tests use the actual class and do not rely on mocks.
*/

const Config = require('../lib/libConfig');
const vtruTransaction = require('../lib/vtruTransaction');
const VtruTransaction = require("../lib/vtruTransaction");

const { formatRawNumber } = require('../lib/vtruUtils');
const { format } = require('date-fns'); // Add date-fns for formatting

async function main() {
    try {
        const config  = new Config('CONFIG_JSON_FILE_PATH', 'mainnet');
   
        const wallet  = config.get('WALLET_ADDRESS');

        const explorerApiUrl = "https://explorer.vitruveo.xyz/api";
        const startBlock = 5923741;//config.get("START_BLOCK");
        const endBlock = 7923741;//config.get("END_BLOCK");
        const transaction = new vtruTransaction(explorerApiUrl);

        console.log("\nTransactions with Wallet: ", wallet);
        const transactions = await transaction.getTransactions(wallet, startBlock, endBlock);
    
        for (const tx of transactions) {
            if (!tx.contractAddress && tx.value && tx.value !== "0") {
                const toAddress = tx.to.toLowerCase();
                const fromAddress = tx.from.toLowerCase();
                const date = format(new Date(tx.timeStamp * 1000), "dd-MM-yy"); // Convert timestamp to DD-MM-YY
                const vtru = formatRawNumber(BigInt(tx.value));
                if (!this.headerDone) {
                    this.headerDone = 1;
                    console.log(
                        `| ${"From".padEnd(42)} | ${"To".padEnd(42)} | ${"VTRU".padStart(10)} | ${"Date".padStart(10)} | ${"Hash".padEnd(66)} |`
                    );
                    console.log("-".repeat(147)); // Separator line for the table
                }
                console.log(
                        `| ${fromAddress.padEnd(42)} | ${toAddress.padEnd(42)} | ${vtru.padStart(10)} | ${date.padStart(10)} | ${tx.hash.padEnd(66)} |`
                );
            }

        }

    } catch (error) {
        console.error("Error during walking:", error.message);
    }
};

main();

