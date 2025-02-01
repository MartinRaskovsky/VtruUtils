/**
 * VtruTracker.js
 * Handles the logic for tracking recipient addresses.
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 */

const vtruTransaction = require("./vtruTransaction");

/**
 * Class for tracking recipient addresses using blockchain transactions.
 */
class VtruTracker extends vtruTransaction {
    /**
     * Constructor for VtruTracker.
     * @param {string} explorerApiUrl - Base API URL for the blockchain explorer.
     */
    constructor(explorerApiUrl) {
        super(explorerApiUrl);
        this.addressSet = new Map(); // Stores unique addresses with a marked status
    }

    /**
     * Fetch transactions and add recipient addresses to the set.
     * @param {string} address - The address to track.
     * @param {number} [startBlock=0] - Start block for transaction search.
     * @param {number} [endBlock=99999999] - End block for transaction search.
     */
    async track(address, startBlock = 0, endBlock = 99999999) {
        try {
            const transactions = await this.getTransactions(address, startBlock, endBlock); // Use parent class method

            transactions.forEach((tx) => {
                // Only consider native coin transfers (no contractAddress and non-zero value)
                if (!tx.contractAddress && tx.value && tx.value !== "0") {
                    const toAddress = tx.to?.toLowerCase();
                    if (toAddress && !this.addressSet.has(toAddress)) {
                        this.addressSet.set(toAddress, false); // Add the address with an unmarked status
                    }
                }
            });
        } catch (error) {
            console.error(`Error tracking address ${address}:`, error.message);
        }
    }

    /**
     * Retrieve all unique addresses as an array.
     * @returns {Array<string>} An array of tracked addresses.
     */
    get() {
        return Array.from(this.addressSet.keys());
    }

    /**
     * Recursively tracks addresses in the current set up to a given depth.
     * @param {number} level - The recursion depth for tracking.
     * @param {number} [startBlock=0] - Start block for transaction search.
     * @param {number} [endBlock=99999999] - End block for transaction search.
     */
    async walk(level, startBlock = 0, endBlock = 99999999) {
        if (level <= 0) return;
        console.log(`Starting walk at level ${level}...`);

        for (const [address, isMarked] of this.addressSet.entries()) {
            if (!isMarked) {
                this.addressSet.set(address, true);
                await this.track(address, startBlock, endBlock);
                await this.walk(level - 1, startBlock, endBlock);
            }
        }
    }

    /**
     * Applies track to every element in an array of addresses.
     * @param {Array<string>} addresses - List of addresses to track.
     * @param {number} [startBlock=0] - Start block for transaction search.
     * @param {number} [endBlock=99999999] - End block for transaction search.
     */
    async trackMultiple(addresses, startBlock = 0, endBlock = 99999999) {
        for (const address of addresses) {
            await this.track(address, startBlock, endBlock);
        }
    }
}

module.exports = VtruTracker;

