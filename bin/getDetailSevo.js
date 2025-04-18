#!/usr/bin/env node

/**
 * Retrieves SEVOX stake balance for given wallet addresses.
 *
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const Web3 = require('../lib/libWeb3');
const VtruVault = require("../lib/vtruVault");
const tokenSevo = require("../lib/tokenSevo");
const { categorizeAddresses } = require('../lib/addressCategorizer');
const { formatRawNumber } = require("../lib/vtruUtils");
const { toConsole } = require("../lib/libPrettyfier");
const { SEC_SEVO } = require('../shared/constants');

const TITLE = SEC_SEVO;
const KEYS = ['wallet', 'withBtc', 'withoutBtc', 'gain', 'priorClaimed'];

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
async function runDetails(vaultAddress, wallets, formatOutput) {
    try {
        const vtru = new Web3(Web3.VTRU);
        const token = new tokenSevo(vtru);

        // Retrieve associated wallets if vault address is provided
        const { merged } = await VtruVault.mergeWallets(vtru, vaultAddress, wallets);
        const { evm, sol, tez, invalid } = categorizeAddresses(merged);
        const details = await token.getDetails(evm);
   
        let totalWithBtc = 0n;
        let totalWithoutBtc = 0n;
        let totalGain = 0n;
        let totalPriorClaimed = 0n;

        const formattedData = details.map(row => {
            totalWithBtc      += row.withBtc;
            totalWithoutBtc   += row.withoutBtc;
            totalGain         += row.gain;
            totalPriorClaimed += row.priorClaimed;

            return {
                wallet: row.wallet,
                withBtc:      formatRawNumber(row.withBtc),
                withoutBtc:   formatRawNumber(row.withoutBtc),
                gain:         formatRawNumber(row.gain),
                priorClaimed: formatRawNumber(row.priorClaimed),
            };
        });

        // Append totals row
        formattedData.push({
        wallet: "Total",
        withBtc:      formatRawNumber(totalWithBtc),
        withoutBtc:   formatRawNumber(totalWithoutBtc),
        gain:         formatRawNumber(totalGain),
        priorClaimed: formatRawNumber(totalPriorClaimed),
    });

        toConsole(formattedData, TITLE, KEYS, formatOutput);
    } catch (error) {
        console.error("❌ Error retrieving SEVO details:", error.message);
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

    runDetails(vaultAddress, walletAddresses, formatOutput).catch(error => {
        console.error("❌ Unexpected error:", error.message);
    });
}

main();
