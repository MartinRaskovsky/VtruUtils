#!/usr/bin/env node

/**
 * Retrieves JSON of VIBE details for given wallet addresses.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const Web3 = require("../lib/libWeb3");
const VtruVault = require("../lib/vtruVault");
const TokenVibe = require("../lib/tokenVibe");
const { formatNumber, formatRawNumber } = require("../lib/vtruUtils");
const { toConsole } = require("../lib/libPrettyfier");
const { SEC_VIBE } = require('../shared/constants');

const TITLE = SEC_VIBE;
const KEYS = ['wallet', 'noTokens', 'balance', 'claimed', 'unclaimed'];

/**
 * Displays usage instructions.
 */
function showUsage() {
    console.log("\nUsage: getDetailVive.js [options] <wallet1> <wallet2> ... <walletN>\n");
    console.log("Options:");
    console.log("  -v <vaultAddress>   Specify a vault address to retrieve associated wallets.");
    console.log("  -f                  Format output as an aligned table.");
    console.log("  -h                  Show this usage information.");
    process.exit(0);
}

/**
 * Fetches and formats VIBE token details for the given wallets.
 *
 * @param {string|null} vaultAddress - Vault address, if specified.
 * @param {Array<string>} wallets - List of wallet addresses.
 * @param {boolean} formatOutput - Whether to format output as a table.
 */
async function runDetails(vaultAddress, wallets, formatOutput) {
    try {
        const vtru = new Web3(Web3.VTRU);
        const tokenVibe = new TokenVibe(vtru);

        // Retrieve associated wallets if vault address is provided
        const { merged } = await VtruVault.mergeWallets(vtru, vaultAddress, wallets);
        const details = await tokenVibe.getDetails(merged);

        let totalNoTokens = 0n;
        let totalBalance = 0n;
        let totalClaimed = 0n;
        let totalUnclaimed = 0n;

        const formattedData = details.map(row => {
            totalNoTokens += row.noTokens;
            totalBalance += row.balance;
            totalClaimed += row.claimed;
            totalUnclaimed += row.unclaimed;

            return {
                wallet: row.wallet,
                noTokens: formatNumber(row.noTokens, 0),
                balance: formatNumber(row.balance),
                claimed: formatRawNumber(row.claimed),
                unclaimed: formatRawNumber(row.unclaimed),
            };
        });

        // Append totals row
        formattedData.push({
            wallet: "Total",
            noTokens: formatNumber(totalNoTokens, 0),
            balance: formatNumber(totalBalance),
            claimed: formatRawNumber(totalClaimed),
            unclaimed: formatRawNumber(totalUnclaimed),
        });

        toConsole(formattedData, TITLE, KEYS, formatOutput);
    } catch (error) {
        console.error("❌ Error retrieving VIBE details:", error.message);
    }
}

/**
 * Parses command-line arguments and initiates VIBE details retrieval.
 */
function main() {
    const args = process.argv.slice(2);
    let vaultAddress = null;
    let wallets = [];
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
                wallets.push(args[i]);
                break;
        }
    }

    runDetails(vaultAddress, wallets, formatOutput).catch(error => {
        console.error("❌ Unexpected error:", error.message);
    });
}

main();
