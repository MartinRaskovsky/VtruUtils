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
const TokenStakedSevo = require('../lib/tokenStakedSevo');
const { formatNumber, formatRawNumber, mergeUnique } = require("../lib/vtruUtils");

function showUsage() {
    console.log(`\nUsage: getDetailSevoStake.js [options] <walletAddress1> <walletAddress2> ... <walletAddressN>\n`);
    console.log(`Options:`);
    console.log(`  -v <vaultAddress>   Specify a vault address to retrieve associated wallets.`);
    console.log(`  -b                  Use balance instead of staking details.`);
    console.log(`  -h                  Show this usage information.`);
    process.exit(0);
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

async function runBscStakedContract(vaultAddress, wallets) {
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

        let result = await tokenStakedSevo.getStakedDetails(wallets);
        if (!result) {
            console.error("Failed to get Stked SevoX");
            process.exit(1);
        }

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
        
        console.log(JSON.stringify(formattedData, null, 2));
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

function main() {
    const args = process.argv.slice(2);
    let vaultAddress = null;
    let walletAddresses = [];

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
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

    runBscStakedContract(vaultAddress, walletAddresses).catch(error => {
        console.error('❌ Error:', error.message);
    });
}

main();

