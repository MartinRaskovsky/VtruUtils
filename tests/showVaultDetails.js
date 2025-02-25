#!/usr/bin/env node

/**
* Author: Dr Martín Raskovsky
* Date: January 2025
* 
* Unit tests for the VtruVaultDetails class.
* These tests use the actual class and do not rely on mocks.
*/
const VtruConfig = require('../lib/vtruConfig');
const Web3 = require("../lib/libWeb3");
const VtruVault = require('../lib/vtruVault');
const VtruVaultDetails = require('../lib/vtruVaultDetails');

async function getVaultDetails(vaultAddress, summaryMode) {
    try {
        const web3 = await Web3.create(Web3.VTRU);
        const vault = new VtruVault(vaultAddress, web3);

        const vaultDetails = new VtruVaultDetails(web3, 0, false);
        const vaultDetailsData = await vaultDetails.get(vault, 0);

        if (vaultDetailsData) {
            if (summaryMode) {
                console.log(JSON.stringify({
                    name: vaultDetailsData.name,
                    totalVTRUHeld: vaultDetailsData.totalVTRUHeld,
                    totalVTRUStaked: vaultDetailsData.totalVTRUStaked,
                    totalVERSE: vaultDetailsData.totalVERSE,
                    totalVIBE: vaultDetailsData.totalVIBE,
                }, null, 2));
            } else {
                console.log(JSON.stringify(vaultDetailsData, null, 2));
            }
        } else {
            console.error('Error: No vault data found.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function main() {
    const config = new VtruConfig();
    let vaultAddress = config.get('VAULT_ADDRESS');

    if (!vaultAddress) {
        console.error('Error: Missing VAULT_ADDRESS in .env.');
        process.exit(1);
    }

    try {
        getVaultDetails(vaultAddress, 0);
        getVaultDetails(vaultAddress, 1);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();

