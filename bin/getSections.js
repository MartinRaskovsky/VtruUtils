#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: February 2025
 * 
 * Retrieves details from a vault and/or a list of wallets.
 **/

const { Web3 } = require("../lib/libWeb3");
const { Network } = require("../lib/libNetwork");

const VtruVault = require('../lib/vtruVault');
const WalletSections = require('../lib/libWalletSections');
const { prettyfier2 } = require("../lib/libPrettyfier");

const TITLE = "Top Level Sections";
const KEYS = ['address', 'name', 'wallets'];

function abort(message) {
    console.error(message);
    process.exit(1);
}

/**
 * Fetches and formats details from a vault or a list of wallets.
 *
 * @param {string} vaultAddress - Vault address (if provided).
 * @param {Array<string>} wallets - Wallet addresses.
 * @param {boolean} formatOutput - Whether to format output as a table.
 */
async function getSections(vaultAddress, wallets, formatOutput) {
    try {
        const network = await new Network(Web3.networkIds);
        const vtru = network.get(Web3.VTRU);

        if ((wallets.length === 0) && (vaultAddress.length === 0)) {
            vaultAddress = vtru.getConfig().get('VAULT_ADDRESS');
            wallets = vtru.getConfig().get('WALLETS');
            wallets = wallets
                ? wallets.split(/\s+/).map(addr => addr.trim()).filter(addr => addr.length > 0)
                : [];
        }

       const { merged, vault }  = await VtruVault.mergeWallets(vtru, vaultAddress, wallets);

        const walletSections = new WalletSections(network);
        const data = await walletSections.get(merged);
        if (data) {
            if (formatOutput) {
                const columns = ['wallet', 'balance'];
                const sectionTitles = walletSections.getSectionTitles();
                const totalKeys = walletSections.getTotalKeys();
                const keys = walletSections.getSectionKeys();
                keys.forEach((key,index) => { 
                    prettyfier2(data['wallets'], data[key], data[totalKeys[index]], sectionTitles[index], columns);
                });
            } else {
                data['address'] = vault ? vault.address : "";
                data['name'] = vault? await vault.getName() : "";
                data['wallets'] = merged;
                console.log(JSON.stringify( data, null, 2));
            }
        } else {
            abort('Error: No wallets data found.');
        }
    } catch (error) {
        abort(error.message);
    }
}

function displayUsage() {
    console.log(`Usage: getSections.js [options] [wallet1] [wallet2] ...

Options:
  -v <vaultAddress>  Specify a vault address to retrieve associated wallets.
  -h                 Display this usage information

Arguments:
  <vaultAddress>  Optional address of a vault
  [wallets]       Optional list of wallets addresses`);
}

function main() {
    const args = process.argv.slice(2);
    let vault = "";
    let wallets = [];
    let formatOutput = false;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-v':
                vault = args[i + 1];
                i++;
                break;
            case '-f':
                formatOutput = true;
                break;
            case '-h':
                displayUsage();
                process.exit(0);
            default:
                wallets.push(args[i]);
                break;
        }
    }

    getSections(vault, wallets, formatOutput).catch(error => {
        abort(error.message);
    });
}

main();

