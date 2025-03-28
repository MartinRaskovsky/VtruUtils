/**
 * tokenCommon.js
 * 
 * Base class for handling TOKEN balances (VIBE, VERSE, ...).
 * Provides common methods for fetching balances and details.
 * 
 * Optimized for efficient blockchain access by minimizing redundant contract calls.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const VtruContract = require("./vtruContract");
const { processInBatches } = require("./libBatch");
const Web3 = require("./libWeb3");

/**
 * Base class for Vtru token contracts.
 * Supports querying balances and details for single and multiple wallets.
 */
class TokenCommon extends VtruContract {
    
    /**
     * Initializes the token contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     * @param {string} tokenType - The type of token (e.g., "VIBE", "VERSE", ...).
     */
    constructor(web3, tokenType) {
        super(web3, tokenType);
        this.web3 = web3;
        this.id = web3.getId();
        this.tokenType = tokenType;
        if (new.target === TokenCommon) {
            throw new Error("Cannot instantiate abstract class TokenCommon directly.");
        }
    }

    /**
     * Abstract method to retrieve the token balance for a given wallet.
     * Subclasses must implement this method.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<number|bigint|null>} The token balance, or null if retrieval fails.
     */
    async getBalance(wallet) {
        throw new Error("Abstract method getBalance(wallet) must be implemented in subclass.");
    }

    /**
     * Abstract method to fetch details from the contract for a given wallet.
     * Subclasses must implement this method.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<Object|null>} The token details, or null if retrieval fails.
     */
    async getDetail(wallet) {
        throw new Error("Abstract method getDetail(wallet) must be implemented in subclass.");
    }

    /**
     * Retrieves token balances for multiple wallets in parallel.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<number|bigint|null>>} An array of token balances.
     */
    async getBalances(wallets) {
        const fetch = async (wallet) => await this.getBalance(wallet);
        const batchSize = this.id === Web3.POL ? 8 : 30;
        const balances = await processInBatches(wallets, fetch, batchSize);
        return balances.filter(balance => balance !== null);
    }

    /**
     * Retrieves token details for multiple wallets in parallel.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<Object|null>>} An array of token details.
     */
    async getDetails(wallets) {
        const fetch = async (wallet) => await this.getDetail(wallet);
        const batchSize = this.id === Web3.POL ? 8 : 30;
        const details = await processInBatches(wallets, fetch, batchSize);
        return details.filter(detail => detail !== null).flat();
    }
}

module.exports = TokenCommon;

