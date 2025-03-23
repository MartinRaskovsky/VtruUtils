#!/usr/bin/env node

/**
 * Retrieves and formats BSC staking details for given wallet addresses.
 *
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const Web3 = require('../lib/libWeb3');
const VtruVault = require("../lib/vtruVault");
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
    console.log("  -v <vaultAddress>   Specify an optional vault address to retrieve associated wallets.");
    console.log(`  -f                  Format output as an aligned table.`);
    console.log("  -g [day|month|year] Group date results by day, month, or year.");
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
        const vtru = new Web3(Web3.VTRU);
        const bsc = new Web3(Web3.BSC);
        const token = new tokenStakedSevoX(bsc);

        // Retrieve associated wallets if vault address is provided
        const { merged } = await VtruVault.mergeWallets(vtru, vaultAddress, wallets);

        const stakingDetails = await token.getDetails(merged);
        if (!stakingDetails) {
            console.error("❌ Failed to retrieve staked SEVO-X data.");
            process.exit(1);
        }

        // Helper to group by day/month/year
        function getGroupKey(date, groupBy) {
            if (groupBy === "year") return date.getFullYear().toString();
            if (groupBy === "month") return `${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
            return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear().toString().slice(-2)}`;
        }

        const groupedData = {};
        let totalUnlocked = 0n;
        let totalLocked = 0n;
        const formattedData = [];

        // Sort data by stamp (ascending)
        stakingDetails.sort((a, b) => Number(a.stamp) - Number(b.stamp));

        // Iterate and group if needed
        for (const row of stakingDetails) {
            const unlocked = ((row.locked * 100n) / 95n) - row.locked;
            totalUnlocked += unlocked;
            totalLocked += row.locked;
        
            // Fetch the actual block to get the timestamp
            const provider = bsc.getProvider();
            const block = await provider.getBlock(Number(row.stamp));
            const rawDate = new Date(block.timestamp * 1000); // Now a correct JS Date object
            const groupKey = getGroupKey(rawDate, groupBy);
            const formattedDate = await getBlockDate(bsc, row.stamp); // Only used for non-grouped mode
        
            if (groupBy) {
                if (!groupedData[groupKey]) {
                    groupedData[groupKey] = {
                        walletCount: 0,
                        unlocked: 0n,
                        locked: 0n,
                        date: groupKey // Or keep formatted if needed, but this matches grouping
                    };
                }
        
                groupedData[groupKey].walletCount++;
                groupedData[groupKey].unlocked += unlocked;
                groupedData[groupKey].locked += row.locked;
            } else {
                formattedData.push({
                    wallet: row.wallet,
                    unlocked: formatRawNumber(unlocked),
                    locked: formatRawNumber(row.locked),
                    date: formattedDate,
                });
            }
        }

        if (groupBy) {
            for (const [key, group] of Object.entries(groupedData)) {
                formattedData.push({
                    wallet: group.walletCount.toString(),
                    unlocked: formatRawNumber(group.unlocked),
                    locked: formatRawNumber(group.locked),
                    date: group.date
                });
            }
        }

        // Totals row
        formattedData.push({
            wallet: 'Total',
            unlocked: formatRawNumber(totalUnlocked),
            locked: formatRawNumber(totalLocked),
            date: ""
        });

        toConsole(formattedData, TITLE, KEYS, formatOutput);

    } catch (error) {
        console.error("❌ Error retrieving staking details:", error.message);
        console.error(error.stack); // 👈 This will show the actual failing line
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

    runDetails(vaultAddress, walletAddresses, formatOutput, groupBy).catch(error => {
        console.error("❌ Unexpected error:", error.message);
    });
}

main();
