#!/usr/bin/env node

/**
 * Retrieves and formats staking details for given addresses.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const Web3 = require("../lib/libWeb3");
const VtruVault = require("../lib/vtruVault");
const { getGroupKey } = require("../lib/vtruUtils");
const TokenStakedVtru = require("../lib/tokenStakedVtru");
const { categorizeAddresses } = require('../lib/addressCategorizer');
const { formatNumber, formatRawNumber } = require("../lib/vtruUtils");
const { toConsole } = require("../lib/libPrettyfier");
const { SEC_VTRU_STAKED } = require("../shared/constants");

const TITLE = SEC_VTRU_STAKED;
const KEYS = ['amount', 'reward', 'totalStaked', 'availableToUnstake', 'estimatedMaturity'];

function showUsage() {
    console.log("\nUsage: getDetailVtruStaked.js [options] <wallet1> <wallet2> ... <walletN>\n");
    console.log("Options:");
    console.log("  -v <vaultAddress>   Specify an optional vault address to retrieve associated wallets.");
    console.log("  -b                  Use balance instead of staking details.");
    console.log("  -f                  Format output as an aligned table.");
    console.log("  -g [day|month|year] Group results by maturity day, month, or year.");
    console.log("  -h                  Show this usage information.");
    process.exit(0);
}

/**
 * Fetches and formats staking details for given addresses.
 * 
 * @param {string|null} vaultAddress - Vault address, if provided.
 * @param {Array<string>} wallets - Wallet addresses.
 * @param {boolean} formatOutput - Whether to format output as a table.
 * @param {string|null} groupBy - Grouping option.
 */
async function runDetails(vaultAddress, wallets, formatOutput, groupBy) {
    try {
        const vtru = await Web3.create(Web3.VTRU);
        const tokenStakedVtru = new TokenStakedVtru(vtru);

        // Retrieve associated wallets if vault address is provided
        const { merged } = await VtruVault.mergeWallets(vtru, vaultAddress, wallets);
        const { evm, sol, tez, invalid } = categorizeAddresses(merged);

        let result = await tokenStakedVtru.getDetails(evm);
        if (!Array.isArray(result)) result = [result];

        result.sort((a, b) => a.maturityDays - b.maturityDays);

        let totals = {
            wallet: 'Total',
            amount: 0n,
            reward: 0n,
            totalStaked: 0n,
            availableToUnstake: 0n,
            estimatedMaturity: ""
        };

        let groupedData = {};

        if (groupBy) {
            for (const row of result) {
                const maturityDate = new Date(Date.now() + row.maturityDays * 86400000);
                const groupKey = getGroupKey(maturityDate, groupBy);

                if (!groupedData[groupKey]) {
                    groupedData[groupKey] = {
                        wallet: 0,
                        amount: 0n,
                        reward: 0n,
                        totalStaked: 0n,
                        availableToUnstake: 0n,
                        estimatedMaturity: groupKey
                    };
                }

                groupedData[groupKey].wallet++;
                groupedData[groupKey].amount += row.amount;
                groupedData[groupKey].reward += row.lockedAmount;
                groupedData[groupKey].totalStaked += row.unstakeAmount;

                if (row.maturityDays <= 0) {
                    groupedData[groupKey].availableToUnstake += row.unstakeAmount;
                    groupedData[groupKey].totalStaked -= row.unstakeAmount;
                }
            }
        }

        let formattedData = groupBy ? Object.values(groupedData).map(group => ({
            wallet: formatNumber(group.wallet, 0),
            amount: formatRawNumber(group.amount),
            reward: formatRawNumber(group.reward),
            totalStaked: formatRawNumber(group.totalStaked),
            availableToUnstake: group.availableToUnstake > 0n ? formatRawNumber(group.availableToUnstake) : "",
            estimatedMaturity: group.estimatedMaturity
        })) : result.map(row => {
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
                estimatedMaturity: isMatured ? "Matured" : getGroupKey(new Date(Date.now() + row.maturityDays * 86400000), groupBy || "day")
            };
        });

        if (!groupBy) {
            formattedData.push({
                wallet: 'Total',
                amount: formatRawNumber(totals.amount),
                reward: formatRawNumber(totals.reward),
                totalStaked: totals.totalStaked > 0n ? formatRawNumber(totals.totalStaked) : "",
                availableToUnstake: totals.availableToUnstake > 0n ? formatRawNumber(totals.availableToUnstake) : "",
                estimatedMaturity: ""
            });
        }

        toConsole(formattedData, TITLE, KEYS, formatOutput);

    } catch (error) {
        console.error("❌ Error:", error.message);
        console.error(error.stack); // 👈 This will show the actual failing line
    }
}

function main() {
    const args = process.argv.slice(2);
    let vaultAddress = null;
    let walletAddresses = [];
    let formatOutput = false;
    let groupBy = null;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-f':
                formatOutput = true;
                break;
            case '-g':
                groupBy = ['day', 'month', 'year'].includes(args[i + 1]) ? args[i + 1] : null;
                i++;
                break;
            case '-v':
                vaultAddress = args[i + 1];
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
        console.error('❌ Error:', error.message);
    });
}

main();
