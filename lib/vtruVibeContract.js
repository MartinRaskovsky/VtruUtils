/**
 * VtruVibeContract.js
 * Handles the logic for interacting with the VIBE contract.
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 */

const VtruContract = require("./vtruContract");

/**
 * Class for interacting with the VIBE contract.
 */
class VtruVibeContract extends VtruContract {
    /**
     * Constructor for VtruVibeContract.
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "VIBE");
    }

    /**
     * Fetches the VIBE balance for a given wallet.
     * @param {string} wallet - The wallet address.
     * @returns {Promise<bigint|null>} The VIBE balance, or null on failure.
     */
    async getVibeBalance(wallet) {
        try {
            const nfts = await this.getContract().getVibeNFTsByOwner(wallet);
            let balance = 0n;

            if (Array.isArray(nfts) && nfts.length > 0) {
                for (const nft of nfts) {
                    const denomination = nft[1];
                    balance += denomination;
                }
            }

            return balance;
        } catch (error) {
            console.error(`Error fetching VIBE balance for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    /**
     * Fetches the VIBE balances for multiple wallets.
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<bigint|null>>} An array of VIBE balances, with null for failures.
     */
    async getVibeBalances(wallets) {  
        try {
            const promises = wallets.map((wallet) => this.getVibeBalance(wallet));
            return await Promise.all(promises);
        } catch (error) {
            console.error("Error fetching VIBE balances for wallets:", error.message);
            return [];
        }
    }  
}

module.exports = VtruVibeContract;

