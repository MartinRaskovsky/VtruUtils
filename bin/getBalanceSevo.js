#!/usr/bin/env node

/**
 * Retrieves SEVOX stake balance for given wallet addresses.
 *
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const Web3 = require('../lib/libWeb3');
const tokenSevo = require("../lib/tokenSevo");
const { formatRawNumber } = require("../lib/vtruUtils");
const { toConsole } = require("../lib/libPrettyfier");
const { SEC_SEVO } = require('../shared/constants');

const TITLE = SEC_SEVO;
const KEYS = ['wallet', 'balance'];

/**
 * Displays usage instructions.
 */
function showUsage() {
    console.log("\nUsage: getBalanceSevo.js [options] <wallet1> <wallet2> ... <walletN>\n");
    console.log("Options:");
    console.log("  -v <vaultAddress>   (Ignored)");
    console.log("  -f                  Format output as an aligned table.");
    console.log("  -h                  Show this usage information.");
    process.exit(0);
}

/**
 * Fetches and formats staking balances for the given wallets.
 *
 * @param {string|null} vaultAddress - Vault address, if specified.
 * @param {Array<string>} wallets - List of wallet addresses.
 * @param {boolean} formatOutput - Whether to format output as a table.
 */
async function runBalances(vaultAddress, wallets, formatOutput) {
    try {
        const net = new Web3(Web3.VTRU);
        const token = new tokenSevo(net);

        const balances = await token.getBalances(wallets);
        let totalBalance = 0n;
        const formattedData = [];

        wallets.forEach((wallet, index) => {
            const balance = balances[index];
            if (balance) {
                const formattedBalance = formatRawNumber(balance);
                if (formattedBalance !== "0.00") {
                    formattedData.push({ wallet, balance: formattedBalance });
                    totalBalance += balance;
                }
            }
        });

        formattedData.push({
            wallet: "Total",
            balance: formatRawNumber(totalBalance),
        });

        toConsole(formattedData, TITLE, KEYS, formatOutput);
    } catch (error) {
        console.error("❌ Error retrieving SEVO stake balances:", error.message);
    }
}

/**
 * Parses command-line arguments and initiates balance retrieval.
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
                } else {
                    console.error("❌ Error: Missing vault address after '-v'.");
                    process.exit(1);
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

    if (walletAddresses.length === 0) {
        console.error("❌ Error: No wallet addresses provided.");
        showUsage();
    }

    runBalances(vaultAddress, walletAddresses, formatOutput).catch(error => {
        console.error("❌ Unexpected error:", error.message);
    });
}

main();
