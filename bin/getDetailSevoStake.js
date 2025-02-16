#!/usr/bin/env node

/**
 * Retrieves and formats BSC staking details for given wallet addresses.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { Web3 } = require('../lib/libWeb3');
const { Network } = require("../lib/libNetwork");
const VtruVault = require('../lib/vtruVault');
const TokenStakedSevo = require('../lib/tokenStakedSevo');
const { formatRawNumber, mergeUnique } = require("../lib/vtruUtils");
const { toConsole } = require("../lib/libPrettyfier");
const { SEC_SEVOX } = require('../shared/constants');

const TITLE = SEC_SEVOX;
const KEYS = ['wallet', 'unlocked', 'locked', 'date'];

function showUsage() {
    console.log(`\nUsage: getDetailSevoStake.js [options] <walletAddress1> <walletAddress2> ... <walletAddressN>\n`);
    console.log(`Options:`);
    console.log(`  -v <vaultAddress>   Specify a vault address to retrieve associated wallets.`);
    console.log(`  -b                  Use balance instead of staking details.`);
    console.log(`  -h                  Show this usage information.`);
    process.exit(0);
}

/**
 * Formats a blockchain timestamp into DD-MM-YYYY format.
 * 
 * @param {Object} bsc - BSC network provider.
 * @param {number} stamp - Blockchain timestamp.
 * @return {Promise<string>} - Formatted date string.
 */
async function formatStamp(bsc, stamp) {
    const block = await bsc.getProvider().getBlock(stamp);
    const date = new Date(block.timestamp * 1000);

    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
}

/**
 * Fetches and formats staking details for the given wallets.
 * 
 * @param {string|null} vaultAddress - Vault address, if specified.
 * @param {Array<string>} wallets - List of wallet addresses.
 * @param {boolean} formatOutput - Whether to format output as a table.
 */
async function runBscStakedContract(vaultAddress, wallets, formatOutput) {
    try {
        const network = await new Network([Web3.VTRU, Web3.BSC]);
        const vtru = network.get(Web3.VTRU);
        const bsc = network.get(Web3.BSC);
        const tokenStakedSevo = new TokenStakedSevo(bsc);

        // Retrieve associated wallets if vaultAddress is provided
        if (vaultAddress) {
            const vault = new VtruVault(vaultAddress, vtru);
            let vaultWallets = await vault.getVaultWallets();
            vaultWallets = mergeUnique([vault.getAddress()], vaultWallets);
            wallets = mergeUnique(vaultWallets, wallets);
        }

        let result = await tokenStakedSevo.getStakedDetails(wallets);
        if (!result) {
            console.error("❌ Failed to retrieve staked SEVO-X data.");
            process.exit(1);
        }

        let totals = { wallet: 'Total', unlocked: 0n, locked: 0n, date: "" };
        let formattedData = [];

        // Process staking data
        for (let row of result.sort((a, b) => Number(a.stamp) - Number(b.stamp))) {
            const unlocked = ((row.locked * 100n) / 95n) - row.locked;
            totals.unlocked += unlocked;
            totals.locked += row.locked;

            formattedData.push({
                wallet: row.wallet,
                unlocked: formatRawNumber(unlocked),
                locked: formatRawNumber(row.locked),
                date: await formatStamp(bsc, row.stamp),
            });
        }

        // Append totals row
        formattedData.push({
            wallet: 'Total',
            unlocked: formatRawNumber(totals.unlocked),
            locked: formatRawNumber(totals.locked),
            date: ""
        });

        toConsole(formattedData, TITLE, KEYS, formatOutput);
        
    } catch (error) {
        console.error("❌ Error:", error.message);
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

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-f':
                formatOutput = true;
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

    runBscStakedContract(vaultAddress, walletAddresses, formatOutput).catch(error => {
        console.error('❌ Error:', error.message);
    });
}

main();
