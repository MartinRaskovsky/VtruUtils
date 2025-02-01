/**
 * VtruVerseContract.js
 * Handles the logic for interacting with the VERSE contract.
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 */

const VtruContract = require("./vtruContract");

/**
 * Class for interacting with the VERSE contract.
 */
class VtruVerseContract extends VtruContract {
    /**
     * Constructor for VtruVerseContract.
     * @param {Object} config - The configuration instance.
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(config, web3) {
        super(config, web3, "VERSE");
    }

    /**
     * Fetches the VERSE balance for a given wallet.
     * @param {string} wallet - The wallet address.
     * @returns {Promise<number|null>} The VERSE balance, or null on failure.
     */
    async getVerseBalance(wallet) {
        try {
            const nft = await this.getContract().getVerseNFTByOwner(wallet);
            return nft ? nft[2] : null;
        } catch (error) {
            //console.error(`Error fetching VERSE balance for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    /**
     * Fetches the VERSE balances for multiple wallets.
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<number|null>>} An array of VERSE balances, with null for failures.
     */
    async getVerseBalances(wallets) {
        try {
            const promises = wallets.map((wallet) => this.getVerseBalance(wallet));
            return await Promise.all(promises);
        } catch (error) {
            console.error("Error fetching VERSE balances for wallets:", error.message);
            return [];
        }
    }
}

module.exports = VtruVerseContract;

