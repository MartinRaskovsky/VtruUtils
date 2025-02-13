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
 * Date: February 2025
 */

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
            console.error(`❌ Error fetching ${this.web3} balance for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    /**
     * Retrieves VTRU balances for multiple wallets in parallel.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<bigint|null>>} An array of VTRU balances, with null for failures.
     */
    async getBalances(wallets) {  
        try {
            return await Promise.all(wallets.map(wallet => this.getBalance(wallet)));
        } catch (error) {
            console.error("❌ Error fetching ${this.web3} balances for wallets:", error.message);
            return [];
        }
    }  
}

module.exports = TokenWallet;
