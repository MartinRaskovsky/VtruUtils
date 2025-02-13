#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 * Description: Retrieves and formats bsc staking details for given wallet addresses.
 */

//const VtruConfig = require('../lib/vtruConfig');
const { Web3 } = require('../lib/libWeb3');
const { Network } = require("../lib/libNetwork");

const VtruVault = require('../lib/vtruVault');
const TokenStakedVtru = require('../lib/tokenStakedVtru');
const TokenStakedSevo = require('../lib/tokenStakedSevo');
const { formatNumber, formatRawNumber, mergeUnique } = require("../lib/vtruUtils");

function showUsage() {
    console.log(`\nUsage: getBscStaked.js [options] <walletAddress1> <walletAddress2> ... <walletAddressN>\n`);
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

function getGroupKey(date) {
    return `${("0" + date.getDate()).slice(-2)}-${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear().toString().slice(-2)}`;
}

async function formatStamp(bsc, stamp) {
    const block = await bsc.getProvider().getBlock(stamp);

    const timestamp = block.timestamp * 1000; // Convert seconds to milliseconds
    const date = new Date(timestamp);

    // Get day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed (January is 0)
    const year = date.getFullYear();
    return (`${day}-${month}-${year}`);
}

async function runBscStakedContract(vaultAddress, wallets, useBalance, formatOutput, groupBy) {
    try {
        const network = await new Network([Web3.VTRU, Web3.BSC]);
        const vtru = network.get(Web3.VTRU);
        const bsc = network.get(Web3.BSC);
        const tokenStakedSevo = new TokenStakedSevo(bsc);

        if (vaultAddress) {
            const vault = new VtruVault(vaultAddress, vtru);
            let vaultWallets = await vault.getVaultWallets();
            vaultWallets = mergeUnique([vault.getAddress()], vaultWallets);
            wallets = mergeUnique(vaultWallets, wallets);
        }

        let result = wallets.length === 1
            ? await (useBalance ? tokenStakedSevo.getStakedDetail(wallets[0]) : tokenStakedSevo.getStakedDetail(wallets[0]))
            : await (useBalance ? tokenStakedSevo.getStakedDetails(wallets) : tokenStakedSevo.getStakedDetails(wallets));

        let totals = {
            wallet: 'Total',
            unlocked: 0n,
            locked: 0n,
            date: ""
        };

        let rows = result.sort((a, b) => Number(a.stamp) - Number(b.stamp));
        let formattedData = [];
        
        for (let j=0; j<rows.length; j++) {
            let row = rows[j];

            const stamp = row['stamp'];
            const locked = row['locked'];
            const unlocked = ((locked * 100n) / 95n) - locked;
            const wallet = row['wallet'];
            totals.unlocked += unlocked;
            totals.locked += locked;

            formattedData.push({
                wallet: wallet,
                unlocked: formatRawNumber(unlocked),
                locked: formatRawNumber(locked),
                date: await formatStamp(bsc, stamp),
            });
        }

        formattedData.push({
            wallet: 'Total',
            locked: formatRawNumber(totals. locked),
            unlocked: formatRawNumber(totals. unlocked),
                date: ""
            });
        

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
                groupBy = ['none', 'day', 'month', 'year'].includes(args[i + 1]) ? args[i + 1] : null;
                if (!groupBy) showUsage();
                if (groupBy === 'none') groupBy = null;
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

    runBscStakedContract(vaultAddress, walletAddresses, useBalance, formatOutput, groupBy).catch(error => {
        console.error('❌ Error:', error.message);
    });
}

main();

