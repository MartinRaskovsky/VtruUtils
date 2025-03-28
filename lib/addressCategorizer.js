/**
 * addressCategorizer.js
 * 
 * Categorizes wallet addresses into EVM, Solana, Tezos, and Invalid groups.
 * Applies normalization where applicable.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const { isAddress, getAddress } = require("ethers");
const bs58 = require("bs58");

/**
 * Categorizes a list of wallet addresses.
 * 
 * @param {Array<string>} addresses - Raw wallet address list.
 * @returns {Object} { evm: [], sol: [], tez: [], invalid: [] }
 */
function categorizeAddresses(addresses) {
    const evm = [];
    const sol = [];
    const tez = [];
    const invalid = [];

    for (const address of addresses) {
        if (isEvmAddress(address)) {
            evm.push(getAddress(address)); // Apply checksum
        } else if (isSolAddress(address)) {
            sol.push(address);
        } else if (isTezAddress(address)) {
            tez.push(address);
        } else {
            invalid.push(address);
        }
    }

    return { evm, sol, tez, invalid };
}

function isEvmAddress(addr) {
    return typeof addr === "string" && isAddress(addr);
}

function isSolAddress(addr) {
    try {
        const decoded = bs58.decode(addr);
        return decoded.length === 32;
    } catch {
        return false;
    }
}

function isTezAddress(addr) {
    return typeof addr === "string" && /^tz[1-3][1-9A-HJ-NP-Za-km-z]{33}$/.test(addr);
}

module.exports = { categorizeAddresses };

