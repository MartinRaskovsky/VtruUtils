#!/usr/bin/env node

/**
 * Retrieves VTRU Stake Balance for given wallet addresses.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { Web3 } = require("../lib/libWeb3");
const VtruVault = require("../lib/vtruVault");
const TokenStakedVtru = require("../lib/tokenStakedVtru");
const { formatRawNumber } = require("../lib/vtruUtils");
const { toConsole } = require("../lib/libPrettyfier");
const { SEC_VTRU_STAKE } = require('../shared/constants');

const TITLE = SEC_VTRU_STAKE;
const KEYS = ['wallet', 'balance'];

function showUsage() {
    console.log("\nUsage: getBalanceVtruStake.js [options] <wallet1> <wallet2> ... <walletN>\n");
    console.log("Options:");
    console.log("  -v <vaultAddress>   Specify a vault address to retrieve associated wallets.");
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
        const vtru = await Web3.create(Web3.VTRU);
        const token = new TokenStakedVtru(vtru);
   
        // Retrieve associated wallets if vault address is provided
        const { merged }  = await VtruVault.mergeWallets(vtru, vaultAddress, wallets);

        let rows = await token.getBalances(merged);

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
                    wallet: merged[i],
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

