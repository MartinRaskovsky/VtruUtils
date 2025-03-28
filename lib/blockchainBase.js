/**
 * blockchainBase.js
 *
 * Abstract base class for blockchain interactions.
 *
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

class BlockchainBase {
    constructor() {
        if (new.target === BlockchainBase) {
            throw new TypeError("Cannot instantiate an abstract class.");
        }
    }

    /**
     * Retrieves the native balance for a given wallet.
     * @param {string} wallet - The wallet address.
     * @returns {Promise<number|bigint>} The native balance.
     */
    async getBalance(wallet) {
        throw new Error("Method 'getBalance' must be implemented.");
    }

    /**
     * Retrieves native balances for multiple wallets.
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<number|bigint>>} An array of native balances.
     */
    async getBalances(wallets) {
        throw new Error("Method 'getBalances' must be implemented.");
    }
}

module.exports = BlockchainBase;

