#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: February 2025
 */

const VtruConfig = require('../lib/vtruConfig');
const VtruWeb3 = require('../lib/vtruWeb3');
const VtruVault = require('../lib/vtruVault');
const VtruStakedContract = require('../lib/vtruStakedContract');
const { formatRawNumber, mergeUnique } = require("../lib/vtruUtils");

function alignNumbers(rows) {
    const keys = ['amount', 'reward', 'totalStaked', 'availableToUnstake', 'estimatedMaturity'];
    const columnWidths = {};

    keys.forEach(key => {
        columnWidths[key] = rows.reduce((max, row) => {
            const value = row[key] || "";
            return Math.max(max, value.length);
        }, key.length);
    });

    const headers = keys.map(key => key.padStart(columnWidths[key], ' ')).join(' | ');
    const separator = keys.map(key => '-'.repeat(columnWidths[key])).join('-|-');
    const formattedRows = rows.filter(row => Object.values(row).some(value => value !== ""));

    const formattedData = formattedRows.map(row => {
        return keys.map(key => (row[key] || "").padStart(columnWidths[key], ' ')).join(' | ');
    });

    return [headers, separator, ...formattedData].join('\n');
}

async function runStakedContract(vaultAddress, wallets, useBalance, formatOutput) {
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
            wallet: '',
            amount: 0n,
            reward: 0n,
            totalStaked: 0n,
            availableToUnstake: 0n,
            estimatedMaturity: ""
        };

        const formattedData = result.map((row) => {
            const isMatured = row.maturityDays <= 0;
            let availableToUnstake = 0n;
            let totalStaked = row.unstakeAmount;

            if (isMatured) {
                availableToUnstake = totalStaked;
                totalStaked = 0n;
            }

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
                estimatedMaturity: isMatured
                    ? "Matured"
                    : new Date(Date.now() + row.maturityDays * 86400000)                  
                        .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })
            };
        });

        const totalsRow = {
            wallet: '',
            amount: formatRawNumber(totals.amount),
            reward: formatRawNumber(totals.reward),
            totalStaked: totals.totalStaked > 0n ? formatRawNumber(totals.totalStaked) : "",
            availableToUnstake: totals.availableToUnstake > 0n ? formatRawNumber(totals.availableToUnstake) : "",
            estimatedMaturity: ""
        };

        formattedData.push(totalsRow);

        if (formatOutput) {
            console.log("");
            console.log(alignNumbers(formattedData));
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

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-b':
                useBalance = true;
                break;
            case '-f':
                formatOutput = true;
                break;
            case '-v':
                vaultAddress = args[i + 1];
                i++;
                break;
            case '-h':
                console.log("Usage: getStakedDetails.js [options] <walletAddress1> <walletAddress2> ... <walletAddressN>");
                process.exit(0);
            default:
                walletAddresses.push(args[i]);
                break;
        }
    }

    if (!vaultAddress && walletAddresses.length === 0) {
        console.error('❌ Error: Missing wallet address(es).');
        process.exit(1);
    }

    runStakedContract(vaultAddress, walletAddresses, useBalance, formatOutput).catch(error => {
        console.error('❌ Error:', error.message);
    });
}

main();

