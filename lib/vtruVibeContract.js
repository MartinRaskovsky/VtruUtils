/**
 * VtruVibeContract.js
 * 
 * Handles the logic for interacting with the VIBE contract.
 * Provides methods to fetch VIBE balances and revenue shares for individual and multiple wallets.
 * 
 * Optimized for efficient blockchain access by minimizing redundant contract calls.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
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
        return Promise.all(wallets.map(wallet => this.getVibeBalance(wallet)));
    }  

    /**
     * Retrieves the VIBE details for a given wallet.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<{wallet: string, balance: bigint, noTokens: bigint, claimed: bigint, unclaimed: bigint}|null>} The VIBE details or null if retrieval fails.
     */
    async getVibeDetail(wallet) {
        try {
            const contract = this.getContract();
            if (!contract) throw new Error("❌ Contract instance unavailable.");

            const balance = await this.getVibeBalance(wallet);
            if (!balance) return null;

            const [claimed, unclaimed] = await contract["getRevenueShareByOwner(address)"](wallet);
            const noTokens = await contract.balanceOf(wallet);

            return { wallet, balance, noTokens, claimed, unclaimed };
        } catch (error) {
            console.error(`❌ Error fetching VIBE detail for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    /**
     * Retrieves VIBE details for multiple wallets in parallel.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<{wallet: string. balance: bigint, noTokens: bigint, claimed: bigint, unclaimed: bigint}|null>>} An array of VIBE details.
     */
    async getVibeDetails(wallets) {  
        const details = await Promise.all(wallets.map(wallet => this.getVibeDetail(wallet)));
        return details.filter(detail => detail !== null); 
    }

    /**
     * Alias for getVibeBalances, used for consistency.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<bigint|null>>} An array of VIBE balances.
     */
    async getBalances(wallets) {
        return this.getVibeBalances(wallets);
    }
}

module.exports = VtruVibeContract;

