#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 * Description: Retrieves JSON of verse details for given wallet addresses.
 */

const { Web3 } = require("../lib/libWeb3");
const { Network } = require("../lib/libNetwork");
const VtruVault = require("../lib/vtruVault");
const TokenVerse = require("../lib/tokenVerse");
const { formatNumber, formatRawNumber, mergeUnique } = require("../lib/vtruUtils");

function showUsage() {
    console.log("\nUsage: getVerseDetails.js [options] <walletAddress1> <walletAddress2> ... <walletAddressN>\n");
    console.log("Options:");
    console.log("  -v <vaultAddress>   Specify a vault address to retrieve associated wallets.");
    console.log("  -h                  Show this usage information.");
    process.exit(0);
}

async function runVerseContractDetails(vaultAddress, wallets) {
    try {
        const vtru = await Web3.create(Web3.VTRU);
        const tokenVerse = new TokenVerse(vtru);

        if (vaultAddress) {
            const vault = new VtruVault(vaultAddress, vtru);
            let vaultWallets = await vault.getVaultWallets();
            vaultWallets = mergeUnique([vault.getAddress()], vaultWallets);
            wallets = mergeUnique(vaultWallets, wallets);
        }

        let rows = await tokenVerse.getVerseDetails(wallets);

        let totals = {
            wallet: "Total",
            balance: 0n,
        };

        let formattedData = rows.map(row => {
            totals.balance += row.balance;

            return {
                wallet: row.wallet,
                balance: formatNumber(row.balance),
            };
        });

        formattedData.push({
            wallet: "Total",
            balance: formatNumber(totals.balance),
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
            case "-v":
                vaultAddress = args[i + 1];
                i++;
                break;
            case "-h":
                showUsage();
                break;
            default:
                walletAddresses.push(args[i]);
                break;
        }
    }

    runVerseContractDetails(vaultAddress, walletAddresses).catch(error => {
        console.error("❌ Error:", error.message);
    });
}

main();

