#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 * 
 * Retrieves details of a specified vault and displays them in either full or summary mode.
 * If the vault is blocked, it exits early with a message. 
 * Command-line options allow for a summary mode and help display.
 **/


const { Web3 } = require('../lib/libWeb3');
const { Network } = require("../lib/libNetwork");

const VtruVault = require('../lib/vtruVault');
const VtruVaultDetails = require('../lib/vtruVaultDetails');

async function getVaultDetails(vaultAddress, summaryMode) {
    try {
        const network = await new Network([Web3.VTRU]);
        const vtru = network.get(Web3.VTRU);

        const vault = new VtruVault(vaultAddress, vtru);

        if (await vault.isBlocked()) {
            console.log(`Vault is blocked: ${vaultAddress}`);
            return;
        }

        const vaultDetails = new VtruVaultDetails(network, 0);
        const vaultDetailsData = await vaultDetails.get(vault, 0, 1);

        if (vaultDetailsData) {
            console.log(JSON.stringify(
                summaryMode 
                    ? {
                        name: vaultDetailsData.name,
                        totalVTRUHeld: vaultDetailsData.totalVTRUHeld,
                        totalVTRUStaked: vaultDetailsData.totalVTRUStaked,
                        totalVERSE: vaultDetailsData.totalVERSE,
                        totalVIBE: vaultDetailsData.totalVIBE,
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
  -s              Display a summary (name, totalVTRUHeld, totalVTRUStaked, totalVERSE, totalVIBE)
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

