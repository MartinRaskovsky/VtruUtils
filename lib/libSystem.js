/**
 * libSystem.js
 * A utility module for system operations.
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 *
 * This module includes:
 * - sleep: A function to delay execution for a given time.
 * - connectTo: Establishes a connection to a specified blockchain network.
 */

const { ethers } = require("ethers");
const VtruConfig = require("../lib/vtruConfig");
const VtruWeb3 = require("../lib/vtruWeb3");

/**
 * Pauses execution for a specified number of milliseconds.
 * @param {number} millis - The number of milliseconds to sleep.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

/**
 * Establishes a connection to the specified blockchain network.
 * @param {string} network - The network identifier ('vtru', 'bsc').
 * @returns {Object} An object containing the configuration and web3 instance.
 */
function connectTo(network) {
    let rpcUrl = null;
    let jsonPath = "";

    switch (network) {
        case "vtru":
            rpcUrl = "https://rpc.vitruveo.xyz";
            jsonPath = "CONFIG_JSON_FILE_PATH";
            break;
        case "bsc":
            rpcUrl = "https://bsc-dataseed.binance.org";
            jsonPath = "CONFIG_JSON_BSC_PATH";
            break;
        default:
            console.error(`❌ Unknown network: ${network}`);
            process.exit(1);
    }

    const config = new VtruConfig(jsonPath, "mainnet");
    const web3 = new VtruWeb3(config, rpcUrl);

    return { config, web3 };
}

module.exports = { connectTo, sleep };
