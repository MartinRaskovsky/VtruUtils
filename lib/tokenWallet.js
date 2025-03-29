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

const { processInBatches } = require("./libBatch");
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
         * Retrieves the balance for a given wallet without internal error handling.
         * 
         * @param {string} wallet - The wallet address.
         * @returns {Promise<bigint>} The balance.
         * @throws Will propagate errors encountered during retrieval.
         */
     async getBalanceInner(wallet) {
        return await this.web3.getWalletRawBalance(wallet);
    }

    /**
     * Retrieves the balance for a given wallet.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<bigint|null>} The balance, or null if retrieval fails.
     */
    async getBalance(wallet) {

        try {
            return this.getBalanceInner(wallet);
        } catch (error) {
            console.error(`❌ Error getting balance for wallet ${wallet}:`, error.message);
            return null;
        }
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
        const batchSize = (this.id === Web3.POL) ?  8 : 
                          (this.id === Web3.SOL) ?  10 :
                          30;
        //console.log(`tokenWallet::getBalances(ID=${this.id} batchSize=${batchSize} #wallets=${wallets.length})`);
        return await processInBatches(wallets, this.getBalanceInner.bind(this), batchSize);
    }
}

module.exports = TokenWallet;

