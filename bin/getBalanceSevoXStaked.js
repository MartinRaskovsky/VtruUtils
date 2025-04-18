#!/usr/bin/env node

/**
 * Retrieves and formats sevox balance for given wallet addresses.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const Web3 = require('../lib/libWeb3');
const tokenStakedSevoX = require('../lib/tokenStakedSevoX');
const { formatRawNumber } = require("../lib/vtruUtils");
const { toConsole } = require("../lib/libPrettyfier");
const { SEC_SEVOX_STAKED } = require('../shared/constants');

const TITLE = SEC_SEVOX_STAKED;
const KEYS = ['wallet', 'locked'];

/**
 * Displays usage instructions.
 */
function showUsage() {
    console.log(`\nUsage: getBalanceSevoX.js [options] <wallet1> <wallet2> ... <walletN>\n`);
    console.log(`Options:`);
    console.log("  -v <vaultAddress>   (Ignored)");
    console.log(`  -f                  Format output as an aligned table.`);
    console.log(`  -h                  Show this usage information.`);
    process.exit(0);
}

/**
 * Fetches and formats staking details for the given wallets.
 *
 * @param {string|null} vaultAddress - Vault address, if specified.
 * @param {Array<string>} wallets - List of wallet addresses.
 * @param {boolean} formatOutput - Whether to format output as a table.
 */
async function runDetails(vaultAddress, wallets, formatOutput) {
    try {
        const bsc = new Web3(Web3.BSC);
        const token = new tokenStakedSevoX(bsc);

        const balances = await token.getBalances(wallets);
        let totalBalance = 0n;
        const formattedData = [];

        wallets.forEach((wallet, index) => {
            const balance = balances[index];
            if (balance) {
                const formattedBalance = formatRawNumber(balance);
                if (formattedBalance !== "0.00") {
                    formattedData.push({ wallet, locked: formattedBalance });
                    totalBalance += balance;
                }
            }
        });

        // Append totals row
        formattedData.push({
            wallet: 'Total',
            locked: formatRawNumber(totalBalance),
            date: "",
        });

        toConsole(formattedData, TITLE, KEYS, formatOutput);
    } catch (error) {
        console.error("❌ Error retrieving staking details:", error.message);
    }
}

/**
 * Parses command-line arguments and initiates staking data retrieval.
 */
function main() {
    const args = process.argv.slice(2);
    let vaultAddress = null;
    let walletAddresses = [];
    let formatOutput = false;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-v':
                if (i + 1 < args.length) {
                    vaultAddress = args[++i];
                } else {
                    console.error("❌ Error: Missing vault address after '-v'.");
                    process.exit(1);
                }
                break;
            case '-f':
                formatOutput = true;
                break;
            case '-h':
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

    runDetails(vaultAddress, walletAddresses, formatOutput).catch(error => {
        console.error("❌ Unexpected error:", error.message);
    });
}

main();
