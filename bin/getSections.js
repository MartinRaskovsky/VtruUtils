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
const { categorizeAddresses } = require('../lib/addressCategorizer');
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

async function mergeData(chain, net, data, wallets, formatOutput, toLower) {
    if (wallets.length === 0) return 0;

    const network = new Network(net);
    const walletSections = new WalletSections(network);
    const result = await walletSections.get(wallets, toLower);

    if (result && typeof result === 'object') {

        if (result.errors != "" && data.errors == "") data.errors = result.errors; 
        data[chain] = result;

        if (formatOutput) {
            const sectionTitles = walletSections.getSectionTitles(); 
            const totalKeys = walletSections.getTotalKeys(); 
            const keys = walletSections.getSectionKeys(); 
            const columns = ['wallet', 'balance'];

            console.log(chain, net);
            keys.forEach((key, index) => {
                prettyfier2(result['wallets'], result[key], result[totalKeys[index]], sectionTitles[index], columns);
            });
        }
    }
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
        const vtru = new Web3(Web3.VTRU);

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
        const { evm, sol, tez, invalid } = categorizeAddresses(merged);
        
        let data = { errors: "" };

        if (invalid.length > 0) {
            data.errors= `Invalid wallet addresses: ${invalid.join("<br>")}`;
        }
   
        await mergeData(Web3.CHAIN_EVM, Web3.NET_EVM, data, evm, formatOutput, 1);
        await mergeData(Web3.CHAIN_SOL, Web3.NET_SOL, data, sol, formatOutput, 0);
        await mergeData(Web3.CHAIN_TEZ, Web3.NET_TEZ, data, tez, formatOutput, 0);

        if (!data) {
            abort("No wallets data found.");
        }

        if (!formatOutput) {

            console.log(JSON.stringify({
                address: vault ? vault.address : "",
                name: vault ? await vault.getName() : "",
                wallets: merged,
                ...data
            }, null, 2));
        }
    } catch (error) {
        console.log(JSON.stringify({
            address: vaultAddress,
            wallets: wallets,
            errors: error.message
        }, null, 2));
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
