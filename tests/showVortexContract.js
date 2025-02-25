#!/usr/bin/env node

/**
 * showVortexDetails.js
 * 
 * Active test for the TokenVortex class.
 * Retrieves and displays VORTEX details for given wallet addresses.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: January 2025
 */

const Web3 = require("../lib/libWeb3");
const { groupByWalletAndKind } = require("../lib/vtruUtils");

const TokenVortex = require("../lib/tokenVortex");

/**
 * Displays VORTEX details for a given wallet.
 * 
 * @param {string} wallet - The wallet address.
 * @param {Array<Object>} data - The VORTEX data containing tokenId and rarity.
 */
function show(group) {
    const { wallet, kind, ids } = group;
    console.log(wallet, kind, ids.length);
}

/**
 * Fetches and displays VORTEX details for multiple wallets.
 * 
 * @param {Array<string>} wallets - List of wallet addresses.
 */
async function getVortexDetails(wallets) {
    try {
        const web3 = await Web3.create(Web3.VTRU);
        const vortexContract = new TokenVortex(web3);
        const rows = await vortexContract.getVortexDetails(wallets);
        let groups = groupByWalletAndKind(rows);
        groups.forEach((group) => show(group));
    } catch (error) {
        console.error("Error:", error.message);
    }
}

/**
 * Displays usage instructions.
 */
function displayUsage() {
    console.log(`Usage: showVortexDetails.js [options] <wallet1> <wallet2> ... <walletN>

Options:
  -h              Display this usage information

Arguments:
  <wallet>  One or more wallet addresses to process (required)`);
}

/**
 * Main function to handle command-line arguments and execute logic.
 */
async function main() {
    const args = process.argv.slice(2);
    let walletAddresses = [];

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case "-h":
                displayUsage();
                process.exit(0);
            default:
                walletAddresses.push(args[i]);
                break;
        }
    }

    if (walletAddresses.length === 0) {
        console.error("Error: Missing wallet address(es).");
        displayUsage();
        process.exit(1);
    }

    await getVortexDetails(walletAddresses);
}

main();

