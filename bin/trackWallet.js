#!/usr/bin/env node

/**
 * Tracks wallet transactions within a specified block range using the Vitruveo blockchain explorer API.
 * If no end block is provided, the latest block number is retrieved dynamically.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const Web3 = require("../lib/libWeb3");
const VtruConfig = require("../lib/vtruConfig");
const VtruTracker = require("../lib/vtruTracker");
const { ethers } = require("ethers");

const EXPLORER_API_URL = "https://explorer.vitruveo.xyz/api";
const RPC_PROVIDER_URL = Web3.rpcUrls[Web3.VTRU];

/**
 * Tracks transactions for a wallet within a specified block range.
 *
 * @param {string} walletAddress - Wallet address to track.
 * @param {number} startBlock - Starting block number.
 * @param {number} endBlock - Ending block number.
 */
async function trackWallet(level, walletAddress, startBlock, endBlock) {
    try {
        const tracker = new VtruTracker(EXPLORER_API_URL);

        console.log("📌 Tracking wallet transactions...");
        console.log(`🔹 Wallet: ${walletAddress}`);
        console.log(`🔹 Start Block: ${startBlock}`);
        console.log(`🔹 End Block: ${endBlock}`);

        await tracker.track(walletAddress, startBlock, endBlock);

        const level0 = tracker.get();
        console.log(`📍 Level0: ${level0.length} recipients:`, level0);

        if (level) {
            console.log(`📌 Walking inner wallet transactions for level ${level} ...`);
            await tracker.walk(level, startBlock, endBlock);

            const levelN = tracker.get();
            console.log(`📍 LevelN: ${levelN.length} recipients:`, levelN);
        }

    } catch (error) {
        console.error("❌ Error tracking wallet transactions:", error.message);
    }
}

/**
 * Displays usage instructions.
 */
function displayUsage() {
    console.log(`
Usage: trackWallet.js [options]

Options:
  -l <level>       Recursive level)
  -w <wallet>      Wallet address to track (required if not in config)
  -s <startBlock>  Starting block number (default: 0)
  -e <endBlock>    Ending block number (default: latest)
  -h               Display this usage information
`);
}

/**
 * Parses command-line arguments and retrieves blockchain data.
 */
async function main() {
    const args = process.argv.slice(2);
    let walletAddress = null;
    let startBlock = 0;
    let endBlock = null;
    let level = 0;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case "-w":
                if (i + 1 < args.length) {
                    walletAddress = args[++i];
                } else {
                    console.error("❌ Error: Missing value for '-w'.");
                    displayUsage();
                    process.exit(1);
                }
                break;
            case "-l":
                if (i + 1 < args.length) {
                    level = parseInt(args[++i], 10);
                    if (isNaN(startBlock)) {
                        console.error("❌ Error: Invalid level.");
                        process.exit(1);
                    }
                } else {
                    console.error("❌ Error: Missing value for '-l'.");
                    displayUsage();
                    process.exit(1);
                }
                break;
            case "-s":
                if (i + 1 < args.length) {
                    startBlock = parseInt(args[++i], 10);
                    if (isNaN(startBlock)) {
                        console.error("❌ Error: Invalid start block number.");
                        process.exit(1);
                    }
                } else {
                    console.error("❌ Error: Missing value for '-s'.");
                    displayUsage();
                    process.exit(1);
                }
                break;
            case "-e":
                if (i + 1 < args.length) {
                    endBlock = parseInt(args[++i], 10);
                    if (isNaN(endBlock)) {
                        console.error("❌ Error: Invalid end block number.");
                        process.exit(1);
                    }
                } else {
                    console.error("❌ Error: Missing value for '-e'.");
                    displayUsage();
                    process.exit(1);
                }
                break;
            case "-h":
                displayUsage();
                process.exit(0);
            default:
                console.error(`❌ Error: Unexpected argument '${args[i]}'.`);
                displayUsage();
                process.exit(1);
        }
    }

    // Load default wallet from config if not provided
    if (!walletAddress) {
        const config = new VtruConfig();
        walletAddress = config.get("WALLET_ADDRESS");
        if (!walletAddress) {
            console.error("❌ Error: Wallet address is required.");
            displayUsage();
            process.exit(1);
        }
    }

    // Fetch latest block number only if endBlock is not provided
    if (endBlock === null) {
        try {
            console.log("🔍 Fetching latest block number...");
            const provider = new ethers.JsonRpcProvider(RPC_PROVIDER_URL);
            endBlock = await provider.getBlockNumber();
            console.log(`✅ Latest block number: ${endBlock}`);
        } catch (error) {
            console.error("❌ Error fetching latest block number:", error.message);
            process.exit(1);
        }
    }

    trackWallet(level, walletAddress, startBlock, endBlock).catch(error => {
        console.error("❌ Unexpected error:", error.message);
    });
}

main();
