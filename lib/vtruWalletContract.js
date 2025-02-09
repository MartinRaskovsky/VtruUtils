/**
 * VtruWalletContract.js
 * Handles the logic for interacting with a psudo VTRU Wallet contract.
 * Author: Dr Martín Raskovsky
 * Date: February 2025
 */

/**
 * Class for interacting with the psudo VTRU Wallet contract.
 */
class VtruWalletContract {
    /**
     * Constructor for VtruWalletContract.
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        this.web3 = web3;
    }

    /**
     * Fetches the VTRU balance for a given wallet.
     * @param {string} wallet - The wallet address.
     * @returns {Promise<bigint|null>} The VTRU balance, or null on failure.
     */
    async getBalance(wallet) {
        try {
            return await this.web3.getWalletRawBalance(wallet);
        } catch (error) {
            console.error(`Error fetching VTRU balance for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    /**
     * Fetches the VTRU balances for multiple wallets.
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<bigint|null>>} An array of VTRU balances, with null for failures.
     */
    async getBalances(wallets) {  
        try {
            const promises = wallets.map((wallet) => this.getBalance(wallet));
            return await Promise.all(promises);
        } catch (error) {
            console.error("Error fetching VTRU balances for wallets:", error.message);
            return [];
        }
    }  

}

module.exports = VtruWalletContract;

