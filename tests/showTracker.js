#!/usr/bin/env node

/**
* Author: Dr Martín Raskovsky
* Date: January 2025
* 
* Unit tests for the VtruTracker class.
* These tests use the actual class and do not rely on mocks.
*/


//const { ethers } = require("ethers");
const VtruConfig = require('../lib/vtruConfig');
const VtruWeb3 = require('../lib/vtruWeb3');
//const VtruVault = require('../lib/vtruVault');
const VtruTracker = require("../lib/vtruTracker");

async function main() {
    try {
        const config  = new VtruConfig('CONFIG_JSON_FILE_PATH', 'mainnet');
        const web3    = new VtruWeb3(config);
        const vaultAddress = config.get('VAULT_ADDRESS');
        //const vault   = new VtruVault(vaultAddress, config, web3);

        const wallet  = config.get('WALLET_ADDRESS');
        //const wallets = await vault.getVaultWallets();

        const explorerApiUrl = "https://explorer.vitruveo.xyz/api";
        const startBlock = config.get("START_BLOCK");
        const endBlock = config.get("END_BLOCK");
        const tracker = new VtruTracker(explorerApiUrl);

        // Test 0: Setup
        //console.log("Setup");
        //console.log("wallet:", wallet);
        //console.log("wallets: ", wallets);
        //console.log("startBlock:", startBlock);
        //console.log("endBlock:", endBlock);

        // Test 1: Initialize and check properties
        //console.log("\nInitialization");
        //console.log("Explorer API URL:", tracker.explorerApiUrl);
        //console.log("Start Block:", tracker.startBlock);
        //console.log("End Block:", tracker.endBlock);

        // Test 2: Track a wallet
        console.log("\nTracking Wallet: ", wallet);
        await tracker.track(wallet, startBlock, endBlock);
        console.log("Tracked wallets:", tracker.get());

        // Test 3: Track multiple wallets
        //console.log("\nTracking Wallets: ", wallets);
        //await tracker.trackMultiple(wallets, startBlock, endBlock);
        //console.log("Recipients after tracking wallets:", tracker.get());

        // Test 4: Walking through levels
        //console.log("\nWalking Through Levels");
        //await tracker.walk(2, startBlock, endBlock); // Walk through 2 levels of recipients
        //console.log("Tracked:", tracker.get());


    } catch (error) {
        console.error("Error during walking:", error.message);
    }
};

main();

