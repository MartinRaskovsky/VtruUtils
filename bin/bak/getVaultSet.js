#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: February 2025
 * 
 * Retrieves details for a specified Vault and an optional list of extra wallets.
 * Displays either full details or a summary based on user input.
 **/

const VtruConfig = require('../lib/vtruConfig');
const VtruWeb3 = require('../lib/vtruWeb3');
const VtruVault = require('../lib/vtruVault');
const VtruVaultDetails = require('../lib/vtruVaultDetails');

const { mergeUnique } = require("../lib/vtruUtils");

async function getVaultSet(vaultAddress, wallets, summaryMode) {
    try {
        const config = new VtruConfig('CONFIG_JSON_FILE_PATH', 'mainnet');
        const web3 = new VtruWeb3(config);
        const vault = new VtruVault(vaultAddress, config, web3);

        if (await vault.isBlocked()) {
            console.error(`Vault is blocked: ${vaultAddress}`);
            return;
        }

        if (!wallets || wallets.length === 0) {
            wallets = config.get('WALLETS');
            wallets = wallets
                ? wallets.split(/\s+/).map(addr => addr.trim()).filter(addr => addr.length > 0)
                : [];
        }
        
        let vaultWallets = await vault.getVaultWallets();
        vaultWallets = [vaultAddress, ...vaultWallets]; 
        wallets = mergeUnique(vaultWallets, wallets);

        const vaultDetails = new VtruVaultDetails(config, web3, 0);
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
            console.error('Error: No vault data found.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function displayUsage() {
    console.log(`Usage: getVaultSet.js [options] <vaultAddress> [wallet1] [wallet2] ...

Options:
  -s              Display a summary (name, held, staked, verses, vibes)
  -h              Display this usage information

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
            case '-h':
                displayUsage();
                process.exit(0);
            default:
                if (!vaultAddress) {
                    vaultAddress = args[i];
                } else {
                    wallets.push(args[i]);
                }
                break;
        }
    }

    if (!vaultAddress) {
        displayUsage();
        process.exit(1);
    }

    getVaultSet(vaultAddress, wallets, summaryMode).catch(error => {
        console.error('Error:', error.message);
    });
}

main();

