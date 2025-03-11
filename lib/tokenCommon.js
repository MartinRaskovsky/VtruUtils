/**
 * tokenCommon.js
 * 
 * Base class for handling token contracts (VIBE, VERSE, ...).
 * Provides common methods for fetching balances and details.
 * 
 * Optimized for efficient blockchain access by minimizing redundant contract calls.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const VtruContract = require("./vtruContract");
const { isAddress, getAddress } = require("ethers");
const { processInBatches } = require("./libBatch");

/**
 * Base class for Vtru token contracts.
 * Supports querying balances and details for single and multiple wallets.
 */
class TokenCommon extends VtruContract {
    
    /**
     * Initializes the token contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     * @param {string} tokenType - The type of token (e.g., "VIBE",  "VERSE", ...).
     */
    constructor(web3, tokenType) {
        super(web3, tokenType);
        this.tokenType = tokenType;
    }

    /**
     * Core logic to retrieve balance from the contract.
     * Called directly by `fetchBalance` and `processInBatches`.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<number|bigint>} The token balance.
     * @throws Will throw an error if retrieval fails.
     */
    async innerFetchBalance(wallet) {
        const contract = this.getContract();
        if (!contract) throw new Error("❌ Contract instance unavailable.");
        if (!isAddress(wallet)) throw new Error(`Invalid Ethereum address: ${wallet}`);
        return await this.retrieveBalance(contract, getAddress(wallet));
    }

    /**
     * Core logic to retrieve token details.
     * Called directly by `fetchDetail` and `processInBatches`.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<Object>} The token details object.
     * @throws Will throw an error if retrieval fails.
     */
    async innerFetchDetail(wallet) {
        const contract = this.getContract();
        if (!contract) throw new Error("❌ Contract instance unavailable.");
        if (!isAddress(wallet)) throw new Error(`Invalid Ethereum address: ${wallet}`);
        return await this.retrieveDetail(contract, getAddress(wallet));
    }

    /**
     * Retrieves the token balance for a given wallet.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<number|bigint|null>} The token balance, or null if retrieval fails.
     */
    async fetchBalance(wallet) {
        try {
            return await this.innerFetchBalance(wallet);
        } catch (error) {
            console.error(`❌ Error fetching ${this.tokenType} balance for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    /**
     * Retrieves the token details for a given wallet.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<Object|null>} Token details object or null if retrieval fails.
     */
    async fetchDetail(wallet) {
        try {
            return await this.innerFetchDetail(wallet);
        } catch (error) {
            console.error(`❌ Error fetching ${this.tokenType} details for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    /**
     * Subclasses must implement this method to fetch balance from the contract.
     */
    async retrieveBalance(contract, wallet) {
        throw new Error("retrieveBalance must be implemented in subclass");
    }

    /**
     * Subclasses must implement this method to fetch details from the contract.
     */
    async retrieveDetail(contract, wallet) {
        throw new Error("retrieveDetail must be implemented in subclass");
    }

    /**
     * Retrieves token balances for multiple wallets in parallel.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<number|bigint|null>>} An array of token balances.
     */
    async getBalances(wallets) {
        //return Promise.all(wallets.map(wallet => this.fetchBalance(wallet)));
        return await processInBatches(wallets, this.innerFetchBalance.bind(this));
    }

    /**
     * Retrieves token details for multiple wallets in parallel.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<Object|null>>} An array of token details.
     */
    async getDetails(wallets) {
        //const details = await Promise.all(wallets.map(wallet => this.fetchDetail(wallet)));
        const details = await processInBatches(wallets, this.innerFetchDetail.bind(this));
        return details.filter(detail => detail !== null).flat();
    }
}

module.exports = TokenCommon;

