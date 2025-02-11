/**
 * VtruVerseContract.js
 * 
 * Handles the logic for interacting with the VERSE contract.
 * Provides methods to fetch VERSE balances for individual and multiple wallets.
 * 
 * Optimized for efficient blockchain access by minimizing redundant contract calls.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const VtruContract = require("./vtruContract");

/**
 * Manages interactions with the VERSE contract.
 * Supports querying VERSE balances for single and multiple wallets.
 */
class VtruVerseContract extends VtruContract {
    
    /**
     * Initializes the VERSE contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "VERSE");
    }

    /**
     * Retrieves the VERSE balance for a given wallet.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<number|null>} The VERSE balance, or null if retrieval fails.
     */
    async getVerseBalance(wallet) {
        try {
            const contract = this.getContract();
            if (!contract) throw new Error("❌ Contract instance unavailable.");

            const nft = await contract.getVerseNFTByOwner(wallet);
            return nft ? nft[2] : null;
        } catch (error) {
            return null; // Silently failing as per original implementation
        }
    }

    /**
     * Retrieves VERSE balances for multiple wallets in parallel.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<number|null>>} An array of VERSE balances, with null for failures.
     */
    async getVerseBalances(wallets) {
        try {
            return await Promise.all(wallets.map(wallet => this.getVerseBalance(wallet)));
        } catch (error) {
            console.error("❌ Error fetching VERSE balances for wallets:", error.message);
            return [];
        }
    }

    /**
     * Alias for getVerseBalances, used for consistency.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<number|null>>} An array of VERSE balances.
     */
    async getBalances(wallets) {
        return await this.getVerseBalances(wallets);
    }
}

module.exports = VtruVerseContract;
