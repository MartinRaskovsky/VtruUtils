#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 * Description: Retrieves JSON of vibe details for given wallet addresses.
 */

const { Web3 } = require("../lib/libWeb3");
const { Network } = require("../lib/libNetwork");
const VtruVault = require("../lib/vtruVault");
const TokenVibe = require("../lib/tokenVibe");
const { formatNumber, formatRawNumber, mergeUnique } = require("../lib/vtruUtils");

function showUsage() {
    console.log("\nUsage: getVibeDetails.js [options] <walletAddress1> <walletAddress2> ... <walletAddressN>\n");
    console.log("Options:");
    console.log("  -v <vaultAddress>   Specify a vault address to retrieve associated wallets.");
    console.log("  -h                  Show this usage information.");
    process.exit(0);
}

async function runVibeContractDetails(vaultAddress, wallets) {
    try {
        const vtru = await Web3.create(Web3.VTRU);
        const vibeContract = new TokenVibe(vtru);

        if (vaultAddress) {
            const vault = new VtruVault(vaultAddress, vtru);
            let vaultWallets = await vault.getVaultWallets();
            vaultWallets = mergeUnique([vault.getAddress()], vaultWallets);
            wallets = mergeUnique(vaultWallets, wallets);
        }

        let rows = await vibeContract.getVibeDetails(wallets);

        let totals = {
            wallet: "Total",
            noTokens: 0n,
            balance: 0n,
            claimed: 0n,
            unclaimed: 0n,
        };

        let formattedData = rows.map(row => {
            totals.noTokens += row.noTokens;
            totals.balance += row.balance;
            totals.claimed += row.claimed;
            totals.unclaimed += row.unclaimed;

            return {
                wallet: row.wallet,
                noTokens: formatNumber(row.noTokens),
                balance: formatNumber(row.balance),
                claimed: formatRawNumber(row.claimed),
                unclaimed: formatRawNumber(row.unclaimed),
            };
        });

        formattedData.push({
            wallet: "Total",
            noTokens: formatNumber(totals.noTokens),
            balance: formatNumber(totals.balance),
            claimed: formatRawNumber(totals.claimed),
            unclaimed: formatRawNumber(totals.unclaimed),
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

    runVibeContractDetails(vaultAddress, walletAddresses).catch(error => {
        console.error("❌ Error:", error.message);
    });
}

main();

