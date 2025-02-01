/**
 * VtruSimpleTracker.js
 * Handles the logic for basic simple tracking of recipient addresses.
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 */

const axios = require("axios");

/**
 * Class for tracking recipient addresses based on blockchain transactions.
 */
class VtruSimpleTracker {
    /**
     * Constructor for VtruSimpleTracker.
     * @param {string} explorerApiUrl - Base API URL for the blockchain explorer.
     * @param {number} [startBlock=0] - Fixed start block for all operations.
     * @param {number} [endBlock=99999999] - Fixed end block for all operations.
     */
    constructor(explorerApiUrl, startBlock = 0, endBlock = 99999999) {
        this.explorerApiUrl = explorerApiUrl;
        this.startBlock = startBlock;
        this.endBlock = endBlock;
        this.addressSet = new Map(); // Stores unique addresses with an unmarked status.
    }

    /**
     * Fetch transactions and add recipient addresses to the set.
     * @param {string} address - The address to track transactions for.
     */
    async track(address) {
        console.log(`Tracking transactions for: ${address}`);

        try {
            const response = await axios.get(this.explorerApiUrl, {
                params: {
                    module: "account",
                    action: "txlist",
                    address,
                    startblock: this.startBlock,
                    endblock: this.endBlock,
                    sort: "asc",
                },
            });

            if (response.data.status === "1" && Array.isArray(response.data.result) && response.data.result.length > 0) {
                response.data.result.forEach((tx) => {
                    // Only consider native coin transfers (no contractAddress and non-zero value)
                    if (!tx.contractAddress && tx.value && tx.value !== "0") {
                        const toAddress = tx.to?.toLowerCase();
                        if (toAddress) {
                            this.addressSet.set(toAddress, false); // Add the address with an unmarked status
                        }
                    }
                });
            } else {
                console.log("No transactions found or an error occurred:", response.data);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error.message);
        }
    }

    /**
     * Retrieve all unique addresses as an array.
     * @returns {Array<string>} An array of tracked addresses.
     */
    get() {
        return Array.from(this.addressSet.keys());
    }
}

module.exports = VtruSimpleTracker;

