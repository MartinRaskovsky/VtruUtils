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

const { mergeUnique } = require("../lib/vtruUtils");

function abort(message) {
    console.error(message);
    process.exit(1);
}

async function getSections(vaultAddress, wallets) {
    try {
        const network = await new Network(Web3.networkIds);
        const vtru = network.get(Web3.VTRU);

        let vaultWallets = [];
        let vault = null;

        if ((wallets.length === 0) && (vaultAddress.length === 0)) {
            vaultAddress = vtru.getConfig().get('VAULT_ADDRESS');
            wallets = vtru.getConfig().get('WALLETS');
            wallets = wallets
                ? wallets.split(/\s+/).map(addr => addr.trim()).filter(addr => addr.length > 0)
                : [];
        }

       if (vaultAddress && vaultAddress.length > 0) {
        vaultAddress = vaultAddress.toLowerCase();
        vault = new VtruVault(vaultAddress, vtru);
        vaultWallets = await vault.getVaultWallets();
       }
       
       vaultWallets = [vaultAddress, ...vaultWallets]; 
       const merged = mergeUnique(vaultWallets, wallets);

        const walletSections = new WalletSections(network);
        const data = await walletSections.get(merged);

        if (data) {
            data['address'] = vault ? vault.address : "";
            data['name'] = vault? await vault.getName() : "";
            data['wallets'] = merged;
            console.log(JSON.stringify( data, null, 2));
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

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-v':
                vault = args[i + 1];
                i++;
                break;
            case '-h':
                displayUsage();
                process.exit(0);
            default:
                wallets.push(args[i]);
                break;
        }
    }

    getSections(vault, wallets).catch(error => {
        abort(error.message);
    });
}

main();

