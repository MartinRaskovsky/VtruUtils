#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: February 2025
 * 
 * Retrieves details for a specified Vault and an optional list of extra wallets.
 * Displays either full details or a summary based on user input.
 **/

const VtruConfig = require('../lib/vtruConfig');
const { Web3 } = require("../lib/libWeb3");
const VtruVault = require('../lib/vtruVault');
const VtruVaultDetails = require('../lib/vtruVaultDetails');

const { mergeUnique } = require("../lib/vtruUtils");

function abort(message) {
    console.error(message);
    process.exit(1);
}
async function getVaultSet(vaultAddress, wallets, summaryMode) {
    try {
        const web3 = await Web3.create(Web3.VTRU);

        if (wallets.length == 0 && (!vaultAddress || vaultAddress.length === 0)) {
            vaultAddress = web3.getConfig().get('VAULT_ADDRESS');
        }
        if (!vaultAddress || vaultAddress.length === 0) {
            abort('Vault address not provided and not found in .env');
        }
        vaultAddress = vaultAddress.toLowerCase();
    
        const vault = new VtruVault(vaultAddress, web3);

        if (await vault.isBlocked()) {
            abort(`Vault is blocked: ${vaultAddress}`);
        }

        if (!wallets || wallets.length === 0) {
            wallets = web3.getConfig().get('WALLETS');
            wallets = wallets
                ? wallets.split(/\s+/).map(addr => addr.trim()).filter(addr => addr.length > 0)
                : [];
        }
        
        let vaultWallets = await vault.getVaultWallets();
        vaultWallets = [vaultAddress, ...vaultWallets]; 
        wallets = mergeUnique(vaultWallets, wallets);

        const vaultDetails = new VtruVaultDetails(web3, 0);
        const vaultDetailsData = await vaultDetails.get(vault, 0, 1, wallets);

        if (vaultDetailsData) {
            console.log(JSON.stringify(
                summaryMode 
                    ? {
                        name: vaultDetailsData.name,
                        held: vaultDetailsData.held,
                        staked: vaultDetailsData.staked,
                        verses: vaultDetailsData.verses,
                        vibes: vaultDetailsData.vibes,
                    } 
                    : vaultDetailsData, 
                null, 2
            ));
        } else {
            abort('Error: No vault data found.');
        }
    } catch (error) {
        abort(error.message);
    }
}

function displayUsage() {
    console.log(`Usage: getVaultSet.js [options] <vaultAddress> [wallet1] [wallet2] ...

Options:
  -s                 Display a summary (name, held, staked, verses, vibes)
  -v <vaultAddress>  Specify a vault address to retrieve associated wallets.
  -h                 Display this usage information

Arguments:
  <vaultAddress>  Address of the vault to process (required)
  [wallets]       Optional list of additional wallet addresses`);
}

function main() {
    const args = process.argv.slice(2);
    let vaultAddress = null;
    let wallets = [];
    let summaryMode = false;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-s':
                summaryMode = true;
                break;
            case '-v':
                vaultAddress = args[i + 1];
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

    getVaultSet(vaultAddress, wallets, summaryMode).catch(error => {
        abort(error.message);
    });
}

main();

