/**
 * tokenWallet.js
 * 
 * A pseudo contract for interacting with NATIVE balances.
 * This class is introduced for systematic programming and generality,
 * allowing a uniform interface for querying balances without a dedicated smart contract.
 * 
 * Optimized for efficient blockchain access by utilizing raw balance retrieval methods.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const { executeBatch } = require("./libBatchEngine");
const Web3 = require("./libWeb3");

/**
 * Provides an interface for querying wallet balances.
 * Acts as a pseudo token for systematic programming.
 */
class TokenWallet {

    /**
     * Initializes the wallet contract interface.
     * 
     * @param {Object} web3 - The Web3 network instance.
     */
    constructor(web3) {
        this.web3 = web3;
        this.id = web3.getId();
    }

    /**
         * Retrieves the balance for a given wallet.
         * 
         * @param {string} wallet - The wallet address.
         * @returns {Promise<bigint>} The balance.
         */
     async getBalance(wallet) {
        return await this.web3.getWalletRawBalance(wallet);
    }

    /**
     * Retrieves balances for multiple wallets using batch processing.
     * 
     * Applies smaller batch size if on POL network.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<bigint|null>>} An array of balances, with null for failures.
     */
    async getBalances(wallets) {
        const batchSize = this.web3.getConfig().getBatchSize();
        const minBatchSize = this.web3.getConfig().getMinBatchSize();
        return await executeBatch(this.id, wallets, this.getBalance.bind(this), batchSize, minBatchSize);
    }
}

module.exports = TokenWallet;

