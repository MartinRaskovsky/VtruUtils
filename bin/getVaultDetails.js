#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 * 
 * Retrieves details of a specified vault and displays them in either full or summary mode.
 * If the vault is blocked, it exits early with a message. 
 * Command-line options allow for a summary mode and help display.
 **/

const VtruConfig = require('../lib/vtruConfig');
const VtruWeb3 = require('../lib/vtruWeb3');
const VtruVault = require('../lib/vtruVault');
const VtruVaultDetails = require('../lib/vtruVaultDetails');

async function getVaultDetails(vaultAddress, summaryMode) {
    try {
        const config = new VtruConfig('CONFIG_JSON_FILE_PATH', 'mainnet');
        const web3 = new VtruWeb3(config);
        const vault = new VtruVault(vaultAddress, config, web3);

        if (await vault.isBlocked()) {
            console.log(`Vault is blocked: ${vaultAddress}`);
            return;
        }

        const vaultDetails = new VtruVaultDetails(config, web3, 0);
        const vaultDetailsData = await vaultDetails.get(vault, 0, 1);

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
    console.log(`Usage: getVaultDetails.js [options]

Options:
  <vaultAddress>  Address of the vault to process (required)
  -s              Display a summary (name, held, staked, verses, vibes)
  -h              Display this usage information`);
}

function main() {
    const args = process.argv.slice(2);
    let vaultAddress = null;
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
                    console.error(`Error: Unexpected argument: ${args[i]}`);
                    displayUsage();
                    process.exit(1);
                }
                break;
        }
    }

    if (!vaultAddress) {
        console.error('Error: Missing vaultAddress argument.');
        displayUsage();
        process.exit(1);
    }

    getVaultDetails(vaultAddress, summaryMode).catch(error => {
        console.error('Error:', error.message);
    });
}

main();

