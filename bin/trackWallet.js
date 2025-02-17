#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 * 
 * Tracks wallet transactions within a specified block range using the Vitruveo blockchain explorer API.
 * If no end block is provided, the latest block number is retrieved dynamically.
 **/

const VtruConfig = require("../lib/vtruConfig");
const VtruTracker = require("../lib/vtruTracker");
const { ethers } = require("ethers");

async function trackWallet(walletAddress, startBlock, endBlock) {
    try {
        const explorerApiUrl = "https://explorer.vitruveo.xyz/api";
        const tracker = new VtruTracker(explorerApiUrl);

        console.log("Tracking wallet transactions with the following parameters:");
        console.log(`Wallet: ${walletAddress}`);
        console.log(`Start Block: ${startBlock}`);
        console.log(`End Block: ${endBlock}`);

        await tracker.track(walletAddress, startBlock, endBlock);

        console.log("Recipients:", tracker.get());
    } catch (error) {
        console.error("Error tracking wallet transactions:", error.message);
    }
}

function displayUsage() {
    console.log(`Usage: trackWallets.js [options]

Options:
  -w <wallet>  Address of the wallet to track (required)
  -s <startBlock>     Starting block number (default: 0)
  -e <endBlock>       Ending block number (default: latest)
  -h                  Display this usage information`);
}

async function main() {
    const args = process.argv.slice(2);
    let walletAddress = null;
    let startBlock = 0;
    let endBlock = null;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case "-w":
                walletAddress = args[++i];
                break;
            case "-s":
                startBlock = parseInt(args[++i], 10);
                break;
            case "-e":
                endBlock = parseInt(args[++i], 10);
                break;
            case "-h":
                displayUsage();
                process.exit(0);
            default:
                console.error(`Error: Unexpected argument: ${args[i]}`);
                displayUsage();
                process.exit(1);
        }
    }

    if (!walletAddress) {
        const config = new VtruConfig();
        walletAddress = config.get("WALLET_ADDRESS");
        if (!walletAddress) {
            console.error("Error: Wallet address is required.");
            displayUsage();
            process.exit(1);
        }
    }

    if (endBlock === null) {
        try {
            const provider = new ethers.JsonRpcProvider("https://rpc.vitruveo.xyz");
            endBlock = await provider.getBlockNumber();
        } catch (error) {
            console.error("Error fetching latest block number:", error.message);
            process.exit(1);
        }
    }

    trackWallet(walletAddress, startBlock, endBlock).catch(error => {
        console.error("Error:", error.message);
    });
}

main();

