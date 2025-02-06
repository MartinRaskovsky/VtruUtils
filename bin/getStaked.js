#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 * Description: Retrieves and formats staking details for given wallet addresses.
 */

const VtruConfig = require('../lib/vtruConfig');
const VtruWeb3 = require('../lib/vtruWeb3');
const VtruVault = require('../lib/vtruVault');
const VtruStakedContract = require('../lib/vtruStakedContract');
const { formatRawNumber, mergeUnique } = require("../lib/vtruUtils");

function showUsage() {
    console.log(`\nUsage: getStaked.js [options] <walletAddress1> <walletAddress2> ... <walletAddressN>\n`);
    console.log(`Options:`);
    console.log(`  -v <vaultAddress>   Specify a vault address to retrieve associated wallets.`);
    console.log(`  -b                  Use balance instead of staking details.`);
    console.log(`  -f                  Format output as an aligned table.`);
    console.log(`  -g [day|month|year] Group results by maturity day, month, or year.`);
    console.log(`  -h                  Show this usage information.`);
    process.exit(0);
}

function alignNumbers(rows) {
    const keys = ['amount', 'reward', 'totalStaked', 'availableToUnstake', 'estimatedMaturity'];
    const columnWidths = {};

    keys.forEach(key => {
        columnWidths[key] = rows.reduce((max, row) => {
            const value = row[key] ? String(row[key]) : "";
            return Math.max(max, value.length);
        }, key.length);
    });

    const headers = keys.map(key => key.padStart(columnWidths[key], ' ')).join(' | ');
    const separator = keys.map(key => '-'.repeat(columnWidths[key])).join('-|-');
    const formattedRows = rows.filter(row => Object.values(row).some(value => value !== ""));

    const formattedData = formattedRows.map(row => {
        return keys.map(key => String(row[key] || "").padStart(columnWidths[key], ' ')).join(' | ');
    });

    return [headers, separator, ...formattedData].join('\n');
}

function getGroupKey(date, groupBy) {
    if (groupBy === "year") return date.getFullYear().toString().slice(-2);
    if (groupBy === "month") return `${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear().toString().slice(-2)}`;
    return `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear().toString().slice(-2)}`;
}


async function runStakedContract(vaultAddress, wallets, useBalance, formatOutput, groupBy) {
    try {
        const config = new VtruConfig('CONFIG_JSON_FILE_PATH', 'mainnet');
        const web3 = new VtruWeb3(config);
        const stakedContract = new VtruStakedContract(config, web3);

        if (vaultAddress) {
            const vault = new VtruVault(vaultAddress, config, web3);
            let vaultWallets = await vault.getVaultWallets();
            vaultWallets = mergeUnique([vault.getAddress()], vaultWallets);
            wallets = mergeUnique(vaultWallets, wallets);
        }

        let result = wallets.length === 1
            ? await (useBalance ? stakedContract.getStakedBalance(wallets[0]) : stakedContract.getStakedDetail(wallets[0]))
            : await (useBalance ? stakedContract.getStakedBalances(wallets) : stakedContract.getStakedDetails(wallets));

        if (!Array.isArray(result)) {
            result = [result];
        }

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
            result.forEach(row => {
                const maturityDate = new Date(Date.now() + row.maturityDays * 86400000);
                const groupKey = getGroupKey(maturityDate, groupBy);

                if (!groupedData[groupKey]) {
                    groupedData[groupKey] = {
                        wallet: `Group: ${groupKey}`,
                        amount: 0n,
                        reward: 0n,
                        totalStaked: 0n,
                        availableToUnstake: 0n,
                        estimatedMaturity: groupKey
                    };
                }
                
                groupedData[groupKey].amount += row.amount;
                groupedData[groupKey].reward += row.lockedAmount;
                groupedData[groupKey].totalStaked += row.unstakeAmount;
                if (row.maturityDays <= 0) {
                    groupedData[groupKey].availableToUnstake += row.unstakeAmount;
                    groupedData[groupKey].totalStaked -= row.unstakeAmount;
                }
            });
        }

        let formattedData = groupBy ? Object.values(groupedData).map(group => {
            return {
                ...group,
                amount: formatRawNumber(group.amount),
                reward: formatRawNumber(group.reward),
                totalStaked: formatRawNumber(group.totalStaked),
                availableToUnstake: group.availableToUnstake > 0n ? formatRawNumber(group.availableToUnstake) : ""
            };
        }) : result.map(row => {
            const isMatured = row.maturityDays <= 0;
            let availableToUnstake = isMatured ? row.unstakeAmount : 0n;
            let totalStaked = isMatured ? 0n : row.unstakeAmount;

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

        if (groupBy) {
            let groupTotals = {
                wallet: 'Grouped Total',
                amount: formatRawNumber(Object.values(groupedData).reduce((sum, g) => sum + g.amount, 0n)),
                reward: formatRawNumber(Object.values(groupedData).reduce((sum, g) => sum + g.reward, 0n)),
                totalStaked: formatRawNumber(Object.values(groupedData).reduce((sum, g) => sum + g.totalStaked, 0n)),
                availableToUnstake: Object.values(groupedData).reduce((sum, g) => sum + g.availableToUnstake, 0n) > 0n 
                    ? formatRawNumber(Object.values(groupedData).reduce((sum, g) => sum + g.availableToUnstake, 0n)) 
                    : "",
                estimatedMaturity: ""
            };
            formattedData.push(groupTotals);
        } else {
            formattedData.push({
                wallet: 'Total',
                amount: formatRawNumber(totals.amount),
                reward: formatRawNumber(totals.reward),
                totalStaked: totals.totalStaked > 0n ? formatRawNumber(totals.totalStaked) : "",
                availableToUnstake: totals.availableToUnstake > 0n ? formatRawNumber(totals.availableToUnstake) : "",
                estimatedMaturity: ""
            });
        }

        if (formatOutput) {
            console.log("\n" + alignNumbers(formattedData));
        } else {
            console.log(JSON.stringify(formattedData, null, 2));
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

function main() {
    const args = process.argv.slice(2);
    let vaultAddress = null;
    let walletAddresses = [];
    let useBalance = false;
    let formatOutput = false;
    let groupBy = null;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-b':
                useBalance = true;
                break;
            case '-f':
                formatOutput = true;
                break;
            case '-g':
                groupBy = ['day', 'month', 'year'].includes(args[i + 1]) ? args[i + 1] : null;
                if (!groupBy) showUsage();
                i++;
                break;
            case '-v':
                vaultAddress = args[i + 1];
                i++;
                break;
            case '-h':
                showUsage();
            default:
                walletAddresses.push(args[i]);
                break;
        }
    }

    runStakedContract(vaultAddress, walletAddresses, useBalance, formatOutput, groupBy).catch(error => {
        console.error('❌ Error:', error.message);
    });
}

main();

