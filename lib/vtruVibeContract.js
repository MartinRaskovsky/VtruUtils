/**
 * VtruVibeContract.js
 * 
 * Handles the logic for interacting with the VIBE contract.
 * Provides methods to fetch VIBE balances and revenue shares for individual and multiple wallets.
 * 
 * Optimized for efficient blockchain access by minimizing redundant contract calls.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: January 2025
 */

const VtruContract = require("./vtruContract");

/**
 * Manages interactions with the VIBE contract.
 * Supports querying VIBE balances and revenue shares for single and multiple wallets.
 */
class VtruVibeContract extends VtruContract {
    
    /**
     * Initializes the VIBE contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "VIBE");
    }

    /**
     * Retrieves the VIBE balance for a given wallet.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<bigint|null>} The VIBE balance, or null if retrieval fails.
     */
    async getVibeBalance(wallet) {
        try {
            const contract = this.getContract();
            if (!contract) throw new Error("❌ Contract instance unavailable.");

            return await contract.getVibeNFTSharesByOwner(wallet);
        } catch (error) {
            console.error(`❌ Error fetching VIBE balance for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    /**
     * Retrieves VIBE balances for multiple wallets in parallel.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<bigint|null>>} An array of VIBE balances, with null for failures.
     */
    async getVibeBalances(wallets) {  
        try {
            return await Promise.all(wallets.map(wallet => this.getVibeBalance(wallet)));
        } catch (error) {
            console.error("❌ Error fetching VIBE balances for wallets:", error.message);
            return [];
        }
    }  

    /**
     * Retrieves the revenue share for a given wallet.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<bigint|null>} The revenue share balance, or null if retrieval fails.
     */
    async getVibeRevenue(wallet) {
        try {
            const contract = this.getContract();
            if (!contract) throw new Error("❌ Contract instance unavailable.");

            const data = await contract["getRevenueShareByOwner(address)"](wallet);
            return data ? data[1] : null;
        } catch (error) {
            console.error(`❌ Error fetching VIBE revenue for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    /**
     * Alias for getVibeBalances, used for consistency.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<bigint|null>>} An array of VIBE balances.
     */
    async getBalances(wallets) {
        return await this.getVibeBalances(wallets);
    }
}

module.exports = VtruVibeContract;
