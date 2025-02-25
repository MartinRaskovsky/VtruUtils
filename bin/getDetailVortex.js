#!/usr/bin/env node

/**
 * Retrieves JSON of Vortex details for given wallet addresses.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const Web3 = require("../lib/libWeb3");
const VtruVault = require("../lib/vtruVault");
const TokenVortex = require("../lib/tokenVortex");
const { groupByWalletAndKind } = require("../lib/vtruUtils");
const { toConsole } = require("../lib/libPrettyfier");
const { SEC_VORTEX } = require('../shared/constants');

const TITLE = SEC_VORTEX;
const KEYS = ['wallet', 'kind', 'count'];

/**
 * Displays usage instructions.
 */
function showUsage() {
    console.log("\nUsage: getDetailVortex.js [options] <wallet1> <wallet2> ... <walletN>\n");
    console.log("Options:");
    console.log("  -v <vaultAddress>   Specify a vault address to retrieve associated wallets.");
    console.log("  -f                  Format output as an aligned table.");
    console.log("  -h                  Show this usage information.");
    process.exit(0);
}

/**
 * Fetches and formats Vortex details for the given wallets.
 *
 * @param {string|null} vaultAddress - Vault address, if specified.
 * @param {Array<string>} wallets - List of wallet addresses.
 * @param {boolean} formatOutput - Whether to format output as a table.
 */
async function runDetails(vaultAddress, wallets, formatOutput) {
    try {
        const vtru = new Web3(Web3.VTRU);
        const tokenVortex = new TokenVortex(vtru);

        // Retrieve associated wallets if vault address is provided
        const { merged } = await VtruVault.mergeWallets(vtru, vaultAddress, wallets);
        const details = await tokenVortex.getDetails(merged);
        const groups = groupByWalletAndKind(details);

        let totalCount = 0;
        const formattedData = groups.map(group => {
            totalCount += group.ids.length;
            return {
                wallet: group.wallet,
                kind: group.kind,
                count: group.ids.length,
            };
        });

        // Append totals row
        formattedData.push({
            wallet: "Total",
            kind: "",
            count: totalCount,
        });

        toConsole(formattedData, TITLE, KEYS, formatOutput);
    } catch (error) {
        console.error("❌ Error retrieving Vortex details:", error.message);
    }
}

/**
 * Parses command-line arguments and initiates Vortex details retrieval.
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
