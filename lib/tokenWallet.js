/**
 * tokenWallet.js
 * 
 * A pseudo contract for interacting with VTRU wallet balances.
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
 * Provides an interface for querying VTRU wallet balances.
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
    }

    /**
     * Retrieves the VTRU balance for a given wallet.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<bigint|null>} The VTRU balance, or null if retrieval fails.
     */
    async getBalance(wallet) {
        try {
            return await this.web3.getWalletRawBalance(wallet);
        } catch (error) {
            console.error(`❌ Error getting balance for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    /**
     * Retrieves VTRU balances for multiple wallets using batch processing.
     * 
     * Applies smaller batch size if on POL network.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<bigint|null>>} An array of VTRU balances, with null for failures.
     */
    async getBalances(wallets) {
        //return await Promise.all(wallets.map(wallet => this.getBalance(wallet)));
        const batchSize = (this.web3.getId && this.web3.getId() === Web3.POL) ? 8 : 30;
        return await processInBatches(wallets, this.getBalance.bind(this), batchSize);
    }
}

module.exports = TokenWallet;

