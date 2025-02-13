/**
 * tokenVortex.js
 * 
 * Handles the logic for interacting with the VORTEX contract.
 * Provides methods to fetch VORTEX balances for individual and multiple wallets.
 * 
 * Optimized for efficient blockchain access by minimizing redundant contract calls.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the VORTEX contract.
 * Supports querying VORTEX balances and details for single and multiple wallets.
 */
class TokenVortex extends TokenCommon {
    
    /**
     * Initializes the VORTEX contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "Vortex");
    }

    /**
     * Retrieves the VORTEX balance for a given wallet.
     * 
     * @param {Object} contract - The contract instance.
     * @param {string} wallet - The wallet address.
     * @returns {Promise<number|null>} The VORTEX balance, or null if retrieval fails.
     */
    async retrieveBalance(contract, wallet) {
        const data = await contract.getTokens(wallet);
        return data ? data.length : 0;
    }

    /**
     * Retrieves the VORTEX details for a given wallet.
     * 
     * @param {Object} contract - The contract instance.
     * @param {string} wallet - The wallet address.
     * @returns {Promise<Array<{tokenId: number, rarity: string}>|null>} The VORTEX details or null if retrieval fails.
     */
    async retrieveDetail(contract, wallet) {
        const data = await contract.getTokens(wallet);
        return data ? data.map(elem => ({ tokenId: elem.tokenId, rarity: elem.rarity })) : null;
    }

    /** Aliases for clarity */
    async getVortexBalance(wallet) {
        return this.fetchBalance(wallet);
    }

    async getVortexBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getVortexDetail(wallet) {
        return this.fetchDetail(wallet);
    }

    async getVortexDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = TokenVortex;

