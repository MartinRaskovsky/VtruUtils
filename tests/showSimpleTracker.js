#!/usr/bin/env node

/**
* Author: Dr Martín Raskovsky
* Date: January 2025
* 
* Unit tests for the VtruTracker class.
* These tests use the actual class and do not rely on mocks.
*/

const VtruConfig = require('../lib/vtruConfig');
const VtruWeb3 = require('../lib/vtruWeb3');
const VtruVault = require('../lib/vtruVault');
const VtruTracker = require("../lib/vtruSimpleTracker");

async function main() {
    try {
        const config  = new VtruConfig('CONFIG_JSON_FILE_PATH', 'mainnet');
        const web3    = new VtruWeb3(config);
        const vaultAddress = config.get('VAULT_ADDRESS');
        const vault   = new VtruVault(vaultAddress, config, web3);

        const wallet  = config.get('WALLET_ADDRESS');
        const wallets = await vault.getVaultWallets();

        const explorerApiUrl = "https://explorer.vitruveo.xyz/api";
        const startBlock = config.get("START_BLOCK");
        const endBlock = config.get("END_BLOCK");
        const tracker = new VtruTracker(explorerApiUrl, startBlock, endBlock);

        console.log("Tracking Wallet: ", wallet);
        await tracker.track(wallet);
        console.log("Tracked:", tracker.get());

    } catch (error) {
        console.error("Error during walking:", error.message);
    }
};

main();

