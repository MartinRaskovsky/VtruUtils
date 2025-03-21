#!/usr/bin/env node

/**
 * Retrieves and formats BSC staking details for given wallet addresses.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const Web3 = require('../lib/libWeb3');
const { getBlockDate } = require("../lib/libWeb3Timer");
const tokenStakedSevoX = require('../lib/tokenStakedSevoX');
const { formatRawNumber } = require("../lib/vtruUtils");
const { toConsole } = require("../lib/libPrettyfier");
const { SEC_SEVOX } = require('../shared/constants');

const TITLE = SEC_SEVOX;
const KEYS = ['wallet', 'unlocked', 'locked', 'date'];

/**
 * Displays usage instructions.
 */
function showUsage() {
    console.log(`\nUsage: getDetailsSevoXStaked.js [options] <wallet1> <wallet2> ... <walletN>\n`);
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
 * @param {string|null} groupBy - Grouping option.
 */
async function runDetails(vaultAddress, wallets, formatOutput, groupBy) {
    try {
        const bsc = new Web3(Web3.BSC);
        const token = new tokenStakedSevoX(bsc);

        const stakingDetails = await token.getDetails(wallets);
        if (!stakingDetails) {
            console.error("❌ Failed to retrieve staked SEVO-X data.");
            process.exit(1);
        }

        let totalUnlocked = 0n;
        let totalLocked = 0n;
        const formattedData = [];

        // Process staking data, sort by timestamp
        await Promise.all(
            stakingDetails.sort((a, b) => Number(a.stamp) - Number(b.stamp)).map(async row => {
                const unlocked = ((row.locked * 100n) / 95n) - row.locked;
                totalUnlocked += unlocked;
                totalLocked += row.locked;

                formattedData.push({
                    wallet: row.wallet,
                    unlocked: formatRawNumber(unlocked),
                    locked: formatRawNumber(row.locked),
                    date: await getBlockDate(bsc, row.stamp),
                });
            })
        );

        // Append totals row
        formattedData.push({
            wallet: 'Total',
            unlocked: formatRawNumber(totalUnlocked),
            locked: formatRawNumber(totalLocked),
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
    let groupBy = null;

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
            case '-g':
                groupBy = ['day', 'month', 'year'].includes(args[i + 1]) ? args[i + 1] : null;
                i++;
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

    runDetails(vaultAddress, walletAddresses, formatOutput, groupBy).catch(error => {
        console.error("❌ Unexpected error:", error.message);
    });
}

main();
