/**
 * VtruTracker.js
 * 
 * Handles the logic for tracking recipient addresses based on blockchain transactions.
 * Extends VtruTransaction to fetch transaction history and track unique recipient addresses.
 * 
 * Optimized for efficiency by minimizing redundant API calls and implementing batch processing.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const VtruTransaction = require("./vtruTransaction");

/**
 * Tracks recipient addresses using blockchain transactions.
 * Utilizes transaction data to build a set of unique recipient addresses.
 */
class VtruTracker extends VtruTransaction {
    
    /**
     * Initializes the tracker with the blockchain explorer API URL.
     * 
     * @param {string} explorerApiUrl - Base API URL for the blockchain explorer.
     */
    constructor(explorerApiUrl) {
        super(explorerApiUrl);
        this.addressSet = new Map(); // Stores unique addresses with a marked status
    }

    /**
     * Fetches transactions and adds recipient addresses to the tracking set.
     * Only considers native coin transfers (ignores contract transactions).
     * 
     * @param {string} address - The address to track.
     * @param {number} [startBlock=0] - Start block for transaction search.
     * @param {number} [endBlock=99999999] - End block for transaction search.
     */
    async track(address, startBlock = 0, endBlock = 99999999) {
        try {
            const transactions = await this.getTransactions(address, startBlock, endBlock); // Use parent class method

            transactions.forEach((tx) => {
                if (!tx.contractAddress && tx.value && tx.value !== "0") {
                    const toAddress = tx.to?.toLowerCase();
                    if (toAddress) this.addressSet.set(toAddress, false); // Store as unmarked
                }
            });
        } catch (error) {
            console.error(`❌ Error tracking address ${address}:`, error.message);
        }
    }

    /**
     * Retrieves all unique tracked addresses as an array.
     * 
     * @returns {Array<string>} An array of tracked addresses.
     */
    get() {
        return Array.from(this.addressSet.keys());
    }

    /**
     * Recursively tracks addresses in the current set up to a given depth.
     * Prevents redundant processing of already marked addresses.
     * 
     * @param {number} level - The recursion depth for tracking.
     * @param {number} [startBlock=0] - Start block for transaction search.
     * @param {number} [endBlock=99999999] - End block for transaction search.
     */
    async walk(level, startBlock = 0, endBlock = 99999999) {
        if (level <= 0) return;
        console.log(`🔍 Starting walk at level ${level}...`);

        const unmarkedAddresses = [...this.addressSet.entries()].filter(([, isMarked]) => !isMarked);
        for (const [address] of unmarkedAddresses) {
            this.addressSet.set(address, true); // Mark as processed
            await this.track(address, startBlock, endBlock);
        }

        await this.walk(level - 1, startBlock, endBlock);
    }

    /**
     * Tracks multiple addresses in parallel for efficiency.
     * 
     * @param {Array<string>} addresses - List of addresses to track.
     * @param {number} [startBlock=0] - Start block for transaction search.
     * @param {number} [endBlock=99999999] - End block for transaction search.
     */
    async trackMultiple(addresses, startBlock = 0, endBlock = 99999999) {
        await Promise.all(addresses.map(address => this.track(address, startBlock, endBlock)));
    }
}

module.exports = VtruTracker;
