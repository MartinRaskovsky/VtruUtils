#!/usr/bin/env node

/**
* Author: Dr Martín Raskovsky
* Date: January 2025
* 
* Unit tests for the VtruVaultDetails class.
* These tests use the actual class and do not rely on mocks.
*/
const VtruConfig = require('../lib/vtruConfig');
const VtruWeb3 = require('../lib/vtruWeb3');
const VtruVault = require('../lib/vtruVault');
const VtruVaultDetails = require('../lib/vtruVaultDetails');

async function getVaultDetails(config, vaultAddress, summaryMode) {
    try {
        const web3 = new VtruWeb3(config);
        const vault = new VtruVault(vaultAddress, config, web3);

        const vaultDetails = new VtruVaultDetails(config, web3, 0);
        const vaultDetailsData = await vaultDetails.get(vault, 0, 1);

        if (vaultDetailsData) {
            if (summaryMode) {
                console.log(JSON.stringify({
                    name: vaultDetailsData.name,
                    held: vaultDetailsData.held,
                    staked: vaultDetailsData.staked,
                    verses: vaultDetailsData.verses,
                    vibes: vaultDetailsData.vibes,
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
    const config = new VtruConfig('CONFIG_JSON_FILE_PATH', 'mainnet');
    let vaultAddress = config.get('VAULT_ADDRESS');

    if (!vaultAddress) {
        console.error('Error: Missing VAULT_ADDRESS in .env.');
        process.exit(1);
    }

    try {
        getVaultDetails(config, vaultAddress, 0);
        getVaultDetails(config, vaultAddress, 1);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();

