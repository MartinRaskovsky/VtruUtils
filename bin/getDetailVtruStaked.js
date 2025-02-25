#!/usr/bin/env node

/**
 * Retrieves and formats staking details for given addresses.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { Web3 } = require("../lib/libWeb3");
const VtruVault = require('../lib/vtruVault');
const TokenStakedVtru = require('../lib/tokenStakedVtru');
const { formatRawNumber } = require("../lib/vtruUtils");
const { toConsole } = require("../lib/libPrettyfier");
const { SEC_VTRU_STAKED } = require('../shared/constants');

const TITLE = SEC_VTRU_STAKED;
const KEYS = ['wallet', 'amount', 'reward', 'totalStaked', 'availableToUnstake', 'estimatedMaturity'];

/**
 * Displays usage instructions.
 */
function showUsage() {
    console.log("\nUsage: getDetailVtruStaked.js [options] <wallet1> <wallet2> ... <walletN>\n");
    console.log("Options:");
    console.log("  -v <vaultAddress>   Specify a vault address to retrieve associated wallets.");
    console.log("  -b                  Use balance instead of staking details.");
    console.log("  -f                  Format output as an aligned table.");
    console.log("  -g [day|month|year] Group results by maturity day, month, or year.");
    console.log("  -h                  Show this usage information.");
    process.exit(0);
}

/**
 * Generates a grouping key based on a given date and grouping option.
 *
 * @param {Date} date - The date object.
 * @param {string} groupBy - Grouping option ('day', 'month', 'year').
 * @return {string} - Grouped key.
 */
function getGroupKey(date, groupBy) {
    if (groupBy === "year") return date.getFullYear().toString();
    if (groupBy === "month") return `${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear().toString().slice(-2)}`;
}

/**
 * Fetches and formats staking details for given addresses.
 *
 * @param {string|null} vaultAddress - Vault address, if specified.
 * @param {Array<string>} wallets - List of wallet addresses.
 * @param {boolean} formatOutput - Whether to format output as a table.
 * @param {string|null} groupBy - Grouping option.
 */
async function runDetails(vaultAddress, wallets, formatOutput, groupBy) {
    try {
        const vtru = new Web3(Web3.VTRU);
        const tokenStakedVtru = new TokenStakedVtru(vtru);

        // Retrieve associated wallets if vault address is provided
        const { merged } = await VtruVault.mergeWallets(vtru, vaultAddress, wallets);
        let result = await tokenStakedVtru.getDetails(merged);

        if (!Array.isArray(result)) {
            result = [result];
        }

        result.sort((a, b) => a.maturityDays - b.maturityDays);

        let totals = { amount: 0n, reward: 0n, totalStaked: 0n, availableToUnstake: 0n };
        let groupedData = {};

        const formattedData = result.map(row => {
            const isMatured = row.maturityDays <= 0;
            const availableToUnstake = isMatured ? row.unstakeAmount : 0n;
            const totalStaked = isMatured ? 0n : row.unstakeAmount;

            totals.amount += row.amount;
            totals.reward += row.lockedAmount;
            totals.totalStaked += totalStaked;
            totals.availableToUnstake += availableToUnstake;

            return {
                wallet: row.wallet,
                amount: formatRawNumber(row.amount),
                reward: formatRawNumber(row.lockedAmount),
                totalStaked: totalStaked > 0n ? formatRawNumber(totalStaked) : "",
                availableToUnstake: availableToUnstake > 0n ? formatRawNumber(availableToUnstake) : "",
                estimatedMaturity: isMatured ? "Matured" : getGroupKey(new Date(Date.now() + row.maturityDays * 86400000), groupBy || "day"),
            };
        });

        // Append totals row
        formattedData.push({
            wallet: "Total",
            amount: formatRawNumber(totals.amount),
            reward: formatRawNumber(totals.reward),
            totalStaked: totals.totalStaked > 0n ? formatRawNumber(totals.totalStaked) : "",
            availableToUnstake: totals.availableToUnstake > 0n ? formatRawNumber(totals.availableToUnstake) : "",
            estimatedMaturity: "",
        });

        toConsole(formattedData, TITLE, KEYS, formatOutput);
    } catch (error) {
        console.error("❌ Error retrieving VTRU staking details:", error.message);
    }
}

/**
 * Parses command-line arguments and initiates staking details retrieval.
 */
function main() {
    const args = process.argv.slice(2);
    let vaultAddress = null;
    let wallets = [];
    let formatOutput = false;
    let groupBy = null;

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
            case "-g":
                if (i + 1 < args.length && ["day", "month", "year"].includes(args[i + 1])) {
                    groupBy = args[++i];
                }
                break;
            case "-h":
                showUsage();
                break;
            default:
                wallets.push(args[i]);
                break;
        }
    }

    runDetails(vaultAddress, wallets, formatOutput, groupBy).catch(error => {
        console.error("❌ Unexpected error:", error.message);
    });
}

main();
