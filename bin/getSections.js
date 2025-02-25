#!/usr/bin/env node

/**
 * Retrieves details from a vault and/or a list of wallets.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const Web3 = require("../lib/libWeb3");
const Network = require("../lib/libNetwork");
const VtruVault = require('../lib/vtruVault');
const WalletSections = require('../lib/libWalletSections');
const { prettyfier2 } = require("../lib/libPrettyfier");

/**
 * Aborts execution with an error message.
 *
 * @param {string} message - Error message.
 */
function abort(message) {
    console.error(`❌ Error: ${message}`);
    process.exit(1);
}

/**
 * Fetches and formats details from a vault or a list of wallets.
 *
 * @param {string|null} vaultAddress - Vault address (if provided).
 * @param {Array<string>} wallets - Wallet addresses.
 * @param {boolean} formatOutput - Whether to format output as a table.
 */
async function getSections(vaultAddress, wallets, formatOutput) {
    try {
        const network = new Network(Web3.networkIds);
        const vtru = network.get(Web3.VTRU);

        // Retrieve default vault and wallets if none are provided
        if (!vaultAddress && wallets.length === 0) {
            vaultAddress = vtru.getConfig().get('VAULT_ADDRESS') || "";
            wallets = (vtru.getConfig().get('WALLETS') || "")
                .split(/\s+/)
                .map(addr => addr.trim())
                .filter(addr => addr.length > 0);
        }

        // Ensure at least one wallet or vault is provided
        if (!vaultAddress && wallets.length === 0) {
            abort("No vault or wallets provided.");
        }

        // Merge vault wallets with provided wallets
        const { merged, vault } = await VtruVault.mergeWallets(vtru, vaultAddress, wallets);
        const walletSections = new WalletSections(network);
        const data = await walletSections.get(merged);

        if (!data) {
            abort("No wallets data found.");
        }

        if (formatOutput) {
            const columns = ['wallet', 'balance'];
            const sectionTitles = walletSections.getSectionTitles();
            const totalKeys = walletSections.getTotalKeys();
            const keys = walletSections.getSectionKeys();

            keys.forEach((key, index) => {
                prettyfier2(data['wallets'], data[key], data[totalKeys[index]], sectionTitles[index], columns);
            });
        } else {
            // Preserve JSON format
            console.log(JSON.stringify({
                address: vault ? vault.address : "",
                name: vault ? await vault.getName() : "",
                wallets: merged,
                ...data
            }, null, 2));
        }
    } catch (error) {
        abort(error.message);
    }
}

/**
 * Displays usage instructions.
 */
function displayUsage() {
    console.log(`
Usage: getSections.js [options] [wallet1] [wallet2] ...

Options:
  -v <vaultAddress>  Specify a vault address to retrieve associated wallets.
  -f                 Format output as an aligned table.
  -h                 Display this usage information.

Arguments:
  <vaultAddress>  Optional address of a vault
  [wallets]       Optional list of wallet addresses
`);
}

/**
 * Parses command-line arguments and initiates retrieval.
 */
function main() {
    const args = process.argv.slice(2);
    let vaultAddress = null;
    let wallets = [];
    let formatOutput = false;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case "-v":
                if (i + 1 < args.length) {
                    vaultAddress = args[++i];
                } else {
                    abort("Missing vault address after '-v'.");
                }
                break;
            case "-f":
                formatOutput = true;
                break;
            case "-h":
                displayUsage();
                process.exit(0);
            default:
                wallets.push(args[i]);
                break;
        }
    }

    getSections(vaultAddress, wallets, formatOutput).catch(error => {
        abort(error.message);
    });
}

main();
