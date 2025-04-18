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
    async getBalance(wallet) {
        const contract = this.getContract();
        const data = await contract.getTokens(wallet);
        return data ? BigInt(data.length) : 0n;
    }

    /**
     * Retrieves the VORTEX details for a given wallet.
     * 
     * @param {Object} contract - The contract instance.
     * @param {string} wallet - The wallet address.
     * @returns {Promise<Array<{tokenId: number, rarity: string}>|null>} The VORTEX details or null if retrieval fails.
     */
    async getDetail(wallet) {
        const contract = this.getContract();
        const data = await contract.getTokens(wallet);
        return data ? data.map(elem => ({ wallet, kind: elem.rarity, id: elem.tokenId })) : null;
    }
}

module.exports = TokenVortex;

