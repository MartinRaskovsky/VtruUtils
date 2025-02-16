#!/usr/bin/env node

/**
 * Retrieves JSON of Vortex details for given wallet addresses.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { Web3 } = require("../lib/libWeb3");
const VtruVault = require("../lib/vtruVault");
const TokenVortex = require("../lib/tokenVortex");
const { groupByWalletAndKind, mergeUnique } = require("../lib/vtruUtils");
const { toConsole } = require("../lib/libPrettyfier");
const { SEC_VORTEX } = require('../shared/constants');

const TITLE = SEC_VORTEX;
const KEYS = ['wallet', 'kind', 'count'];

function showUsage() {
    console.log("\nUsage: getDetailVortex.js [options] <address1> <address2> ... <addressN>\n");
    console.log("Options:");
    console.log("  -v <vaultAddress>   Specify a vault address to retrieve associated wallets.");
    console.log("  -f                  Format output as an aligned table.");
    console.log("  -h                  Show this usage information.");
    process.exit(0);
}

/**
 * Fetches and formats Vortex details for the given wallets.
 * 
 * @param {string|null} vaultAddress - Vault address, if provided.
 * @param {Array<string>} wallets - Wallet addresses.
 * @param {boolean} formatOutput - Whether to format output as a table.
 */
async function getDetailVortex(vaultAddress, wallets, formatOutput) {
    try {
        const vtru = await Web3.create(Web3.VTRU);
        const tokenVortex = new TokenVortex(vtru);

        // Retrieve associated wallets if vault address is provided
        if (vaultAddress) {
            const vault = new VtruVault(vaultAddress, vtru);
            wallets = mergeUnique([vault.getAddress()], await vault.getVaultWallets(), wallets);
        }

        let rows = await tokenVortex.getVortexDetails(wallets);
        let groups = groupByWalletAndKind(rows);

        let totals = { wallet: "Total", kind: "", count: 0 };

        let formattedData = groups.map(group => {
            totals.count += group.ids.length;
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
            count: totals.count,
        });

        toConsole(formattedData, TITLE, KEYS, formatOutput);

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

/**
 * Parses command-line arguments and initiates Vortex details retrieval.
 */
function main() {
    const args = process.argv.slice(2);
    let vaultAddress = null;
    let walletAddresses = [];
    let formatOutput = false;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case "-v":
                vaultAddress = args[i + 1];
                i++;
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

    getDetailVortex(vaultAddress, walletAddresses, formatOutput).catch(error => {
        console.error("❌ Error:", error.message);
    });
}

main();
