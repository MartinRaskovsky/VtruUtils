/**
 * VtruVortexContract.js
 * 
 * Handles the logic for interacting with the VORTEX contract.
 * Provides methods to fetch VORTEX balances for individual and multiple wallets.
 * 
 * Optimized for efficient blockchain access by minimizing redundant contract calls.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const VtruContract = require("./vtruContract");

/**
 * Manages interactions with the VORTEX contract.
 * Supports querying VORTEX balances for single and multiple wallets.
 */
class VtruVortexContract extends VtruContract {
    
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
     * @param {string} wallet - The wallet address.
     * @returns {Promise<number|null>} The VORTEX balance, or null if retrieval fails.
     */
    async getVortexBalance(wallet) {
        try {
            const contract = this.getContract();
            if (!contract) throw new Error("❌ Contract instance unavailable.");

            const data = await contract.getTokens(wallet);
            return data ? data.length : 0;
        } catch (error) {
            console.error(`❌ Error fetching VORTEX balance for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    /**
     * Retrieves VORTEX balances for multiple wallets in parallel.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<number|null>>} An array of VORTEX balances, with null for failures.
     */
    async getVortexBalances(wallets) {
        return Promise.all(wallets.map(wallet => this.getVortexBalance(wallet)));
    }

    /**
     * Retrieves the VORTEX details for a given wallet.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<Array<{tokenId: number, rarity: string}>|null>} The VORTEX details or null if retrieval fails.
     */
    async getVortexDetail(wallet) {
        try {
            const contract = this.getContract();
            if (!contract) throw new Error("❌ Contract instance unavailable.");

            const data = await contract.getTokens(wallet);
            return data ? data.map(elem => ({ tokenId: elem.tokenId, rarity: elem.rarity })) : null;
        } catch (error) {
            console.error(`❌ Error fetching VORTEX detail for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    /**
     * Retrieves VORTEX details for multiple wallets in parallel.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<{tokenId: number, rarity: string}>[]>} An array of VORTEX details.
     */
    async getVortexDetails(wallets) {  
        const details = await Promise.all(wallets.map(wallet => this.getVortexDetail(wallet)));
        return details.filter(detail => detail !== null); 
    }

    /**
     * Alias for getVortexBalances, used for consistency.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<number|null>>} An array of VORTEX balances.
     */
    async getBalances(wallets) {
        return this.getVortexBalances(wallets);
    }
}

module.exports = VtruVortexContract;

