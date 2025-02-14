#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 * Description: Retrieves JSON of vortex details for given wallet addresses.
 */

const { Web3 } = require("../lib/libWeb3");
const { Network } = require("../lib/libNetwork");
const VtruVault = require("../lib/vtruVault");
const TokenVortex = require("../lib/tokenVortex");
const { groupByWalletAndKind, mergeUnique } = require("../lib/vtruUtils");

function showUsage() {
    console.log("\nUsage: getDetailVortex.js [options] <address1> <address2> ... <addressN>\n");
    console.log("Options:");
    console.log("  -v <vaultAddress>   Specify a vault address to retrieve associated wallets.");
    console.log("  -h                  Show this usage information.");
    process.exit(0);
}

async function getDetailVortex(vaultAddress, wallets) {
    try {
        const vtru = await Web3.create(Web3.VTRU);
        const tokenVortex = new TokenVortex(vtru);

        if (vaultAddress) {
            const vault = new VtruVault(vaultAddress, vtru);
            let vaultWallets = await vault.getVaultWallets();
            vaultWallets = mergeUnique([vault.getAddress()], vaultWallets);
            wallets = mergeUnique(vaultWallets, wallets);
        }

        let rows = await tokenVortex.getVortexDetails(wallets);
        let groups = groupByWalletAndKind(rows);

        let totals = {
            wallet: "Total",
            kind: "",
            count: 0,
        };

        let formattedData = groups.map(group => {
            totals.count += group.ids.length;

            return {
                wallet: group.wallet,
                kind: group.kind,
                count: group.ids.length,
                //ids: group.ids.map((id) => Number(id)),
            };
        });

        formattedData.push({
            wallet: "Total",
            kind: "",
            count: totals.count,
            ids: [],
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

    getDetailVortex(vaultAddress, walletAddresses).catch(error => {
        console.error("❌ Error:", error.message);
    });
}

main();

