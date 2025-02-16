#!/usr/bin/env node

/**
 * Retrieves JSON of VIBE details for given wallet addresses.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { Web3 } = require("../lib/libWeb3");
const VtruVault = require("../lib/vtruVault");
const TokenVibe = require("../lib/tokenVibe");
const { formatNumber, formatRawNumber, mergeUnique } = require("../lib/vtruUtils");
const { toConsole } = require("../lib/libPrettyfier");
const { SEC_VIBE } = require('../shared/constants');

const TITLE = SEC_VIBE;
const KEYS = ['wallet', 'noTokens', 'balance', 'claimed', 'unclaimed'];

function showUsage() {
    console.log("\nUsage: getDetailVibe.js [options] <walletAddress1> <walletAddress2> ... <walletAddressN>\n");
    console.log("Options:");
    console.log("  -v <vaultAddress>   Specify a vault address to retrieve associated wallets.");
    console.log("  -f                  Format output as an aligned table.");
    console.log("  -h                  Show this usage information.");
    process.exit(0);
}

/**
 * Fetches and formats VIBE token details for the given wallets.
 * 
 * @param {string|null} vaultAddress - Vault address, if provided.
 * @param {Array<string>} wallets - Wallet addresses.
 * @param {boolean} formatOutput - Whether to format output as a table.
 */
async function runVibeContractDetails(vaultAddress, wallets, formatOutput) {
    try {
        const vtru = await Web3.create(Web3.VTRU);
        const tokenVibe = new TokenVibe(vtru);

        // Retrieve associated wallets if vault address is provided
        if (vaultAddress) {
            const vault = new VtruVault(vaultAddress, vtru);
            wallets = mergeUnique([vault.getAddress()], await vault.getVaultWallets(), wallets);
        }

        let rows = await tokenVibe.getVibeDetails(wallets);

        let totals = {
            wallet: "Total",
            noTokens: 0n,
            balance: 0n,
            claimed: 0n,
            unclaimed: 0n,
        };

        let formattedData = rows.map(row => {
            totals.noTokens += row.noTokens;
            totals.balance += row.balance;
            totals.claimed += row.claimed;
            totals.unclaimed += row.unclaimed;

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
            noTokens: formatNumber(totals.noTokens, 0),
            balance: formatNumber(totals.balance),
            claimed: formatRawNumber(totals.claimed),
            unclaimed: formatRawNumber(totals.unclaimed),
        });

        toConsole(formattedData, TITLE, KEYS, formatOutput);

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

/**
 * Parses command-line arguments and initiates VIBE details retrieval.
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

    runVibeContractDetails(vaultAddress, walletAddresses, formatOutput).catch(error => {
        console.error("❌ Error:", error.message);
    });
}

main();
