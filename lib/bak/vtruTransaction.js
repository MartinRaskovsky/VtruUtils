/**
 * vtruTransaction.js
 * Handles the logic for tracking transactions.
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 */

const axios = require("axios");

/**
 * Class for fetching transactions from a blockchain explorer.
 */
class VtruTransaction {
    /**
     * Constructor for VtruTransaction.
     * @param {string} explorerApiUrl - Base API URL for the blockchain explorer.
     */
    constructor(explorerApiUrl) {
        this.explorerApiUrl = explorerApiUrl;
    }

    /**
     * Fetches transactions for a given address within a specified block range.
     * @param {string} address - The address to track transactions for.
     * @param {number} [startBlock=0] - The starting block for the query.
     * @param {number} [endBlock=99999999] - The ending block for the query.
     * @returns {Promise<Array>} A promise resolving to an array of transactions.
     */
    async getTransactions(address, startBlock = 0, endBlock = 99999999) {
        try {
            const response = await axios.get(this.explorerApiUrl, {
                params: {
                    module: "account",
                    action: "txlist",
                    address,
                    startblock: startBlock,
                    endblock: endBlock,
                    sort: "asc",
                },
            });

            if (response.data.status === "1" && Array.isArray(response.data.result) && response.data.result.length > 0) {
                return response.data.result;
            } else {
                console.log("No transactions found or an error occurred:", response.data);
                return [];
            }
        } catch (error) {
            console.error(`Error fetching transactions for address ${address}:`, error.message);
            return [];
        }
    }
}

module.exports = VtruTransaction;

