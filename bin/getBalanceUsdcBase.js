#!/usr/bin/env node

/**
 * Retrieves USDC balances for given wallet addresses.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const Web3 = require("../lib/libWeb3");
const VtruVault = require("../lib/vtruVault");
const TokenUsdc = require("../lib/tokenUsdcBase");
const { categorizeAddresses } = require('../lib/addressCategorizer');
const { formatVusdNumber } = require("../lib/vtruUtils");
const { toConsole } = require("../lib/libPrettyfier");
const { SEC_USDC_BASE } = require('../shared/constants');

const TITLE = SEC_USDC_BASE;
const KEYS = ['wallet', 'balance'];

/**
 * Displays usage instructions.
 */
function showUsage() {
    console.log("\nUsage: getBalanceUsdcBase.js [options] <wallet1> <wallet2> ... <walletN>\n");
    console.log("Options:");
    console.log("  -v <vaultAddress>   Specify a vault address to retrieve associated wallets.");
    console.log("  -f                  Format output as an aligned table.");
    console.log("  -h                  Show this usage information.");
    process.exit(0);
}

/**
 * Fetches and formats balances for the given wallet addresses.
 *
 * @param {string|null} vaultAddress - Vault address, if specified.
 * @param {Array<string>} raw - List of wallet addresses.
 * @param {boolean} formatOutput - Whbaseer to format output as a table.
 */
async function runBalances(vaultAddress, raw, formatOutput) {
    try {
        const net = new Web3(Web3.BASE);
        const token = new TokenUsdc(net);

        const { evm, sol, tez, invalid } = categorizeAddresses(raw);

        // Retrieve associated wallets if vault address is provided
        const { merged } = await VtruVault.mergeWallets(net, vaultAddress, evm);
        const balances = await token.getBalances(merged);
        let totalBalance = 0n;
        const formattedData = [];

        merged.forEach((wallet, index) => {
            const balance = balances[index];
            if (balance && balance !== 0n) {
                formattedData.push({ wallet, balance: formatVusdNumber(balance) });
                totalBalance += balance;
            }
        });

        formattedData.push({
            wallet: "Total",
            balance: formatVusdNumber(totalBalance),
        });

        toConsole(formattedData, TITLE, KEYS, formatOutput);
    } catch (error) {
        console.error("❌ Error retrieving USDC held balances:", error.message);
    }
}

/**
 * Parses command-line arguments and initiates balance retrieval.
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

    runBalances(vaultAddress, wallets, formatOutput).catch(error => {
        console.error("❌ Unexpected error:", error.message);
    });
}

main();
