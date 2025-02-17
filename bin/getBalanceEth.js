#!/usr/bin/env node

/**
 * Retrieves ETH Balance for given wallet addresses.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { Web3 } = require('../lib/libWeb3');
const TokenWallet = require("../lib/tokenWallet");
const { formatRawNumber } = require("../lib/vtruUtils");
const { toConsole } = require("../lib/libPrettyfier");
const { SEC_ETH } = require('../shared/constants');

const TITLE = SEC_ETH;
const KEYS = ['wallet', 'balance'];

function showUsage() {
    console.log("\nUsage: getBalanceEth.js [options] <wallet1> <wallet2> ... <walletN>\n");
    console.log("Options:");
    console.log("  -v <vaultAddress>   Ignored.");
    console.log("  -f                  Format output as an aligned table.");
    console.log("  -h                  Show this usage information.");
    process.exit(0);
}

/**
 * Fetches and formats balance for the given wallets.
 * 
 * @param {string|null} vaultAddress - Vault address, if provided.
 * @param {Array<string>} wallets - Wallet addresses.
 * @param {boolean} formatOutput - Whether to format output as a table.
 */
async function runBalances(vaultAddress, wallets, formatOutput) {
    try {
        const eth = await new Web3(Web3.ETH);
        const token = new TokenWallet(eth);

        let rows = await token.getBalances(wallets);

        let totals = {
            wallet: "Total",
            balance: 0n,
        };

        let formattedData = [];
        for (let i = 0; i < rows.length; i++) {
            const balanceFormatted = rows[i] ? formatRawNumber(rows[i]): "";
            if (rows[i] && balanceFormatted !== "0.00") {
                totals.balance += rows[i];
                formattedData.push({
                    wallet: wallets[i],
                    balance: balanceFormatted,
                });
            }
        }

        formattedData.push({
            wallet: "Total",
            balance: formatRawNumber(totals.balance),
        });

        toConsole(formattedData, TITLE, KEYS, formatOutput);

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

/**
 * Parses command-line arguments and initiates retrieval.
 */
function main() {
    const args = process.argv.slice(2);
    let vaultAddress = null;
    let walletAddresses = [];
    let formatOutput = false;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case "-v":
                if (i + 1 < args.length) {
                    vaultAddress = args[++i];
                }
                break;
            case "-f":
                formatOutput = true;
                break;
            case "-h":
                showUsage();
                break;
            default:
                walletAddresses.push(args[i]);
                break;
        }
    }

    runBalances(vaultAddress, walletAddresses, formatOutput).catch(error => {
        console.error("❌ Error:", error.message);
    });
}

main();

