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
     * Retrieves the token balance for a given wallet.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<number|bigint|null>} The token balance, or null if retrieval fails.
     */
    async fetchBalance(wallet) {
        try {
            const contract = this.getContract();
            if (!contract) throw new Error("❌ Contract instance unavailable.");
            if (!isAddress(wallet)) throw new Error(`Invalid Ethereum address: ${wallet}`);

            // Call subclass-specific retrieval logic
            return await this.retrieveBalance(contract, getAddress(wallet));
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
            const contract = this.getContract();
            if (!contract) throw new Error("❌ Contract instance unavailable.");
            if (!isAddress(wallet)) throw new Error(`Invalid Ethereum address: ${wallet}`);
            
            // Call subclass-specific retrieval logic
            return await this.retrieveDetail(contract, getAddress(wallet));
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
        return Promise.all(wallets.map(wallet => this.fetchBalance(wallet)));
    }

    /**
     * Retrieves token details for multiple wallets in parallel.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<Object|null>>} An array of token details.
     */
    async getDetails(wallets) {
        const details = await Promise.all(wallets.map(wallet => this.fetchDetail(wallet)));
        return details.filter(detail => detail !== null).flat();
    }
}

module.exports = TokenCommon;

