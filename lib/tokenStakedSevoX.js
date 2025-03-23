/**
 * tokenStakedSevoX.js
 * 
 * Handles interaction with SEVO staked contract, providing methods
 * to retrieve staked balances and stake details for individual and
 * multiple wallets, including maturity calculation.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the SEVO staking contract.
 * Provides methods to fetch staking balances and locked claims for wallets.
 */
class tokenStakedSevoX extends TokenCommon {
    
    /**
     * Initializes the contract interface with the blockchain provider.
     * 
     * @param {Object} web3 - Web3 provider instance.
     */
    constructor(web3) {
        super(web3, "SEVOX");
        this.provider = web3.getProvider();
    }

    /**
     * Retrieves the staking balance for a given wallet.
     * 
     * @param {Object} contract - The contract instance.
     * @param {string} wallet - Ethereum wallet address.
     * @returns {Promise<number|null>} The staking balance, or null if retrieval fails.
     */
    async retrieveBalance(contract, wallet) {
        // the balance of a Saked SevoX is the sum of the locked amounts for the wallet
        const results = await contract.getLockedClaims(wallet);

        // Sum all locked values (BigInt)
        const totalLocked = results.reduce((sum, data) => sum + data[1], 0n);
    
        return totalLocked;
    }
    
    /**
     * Retrieves the locked staking claims for a given wallet.
     * 
     * @param {Object} contract - The contract instance.
     * @param {string} wallet - Ethereum wallet address.
     * @returns {Promise<Object[]>} Array of staking details (timestamp and locked amount).
     */
    async retrieveDetail(contract, wallet) {      
        const results = await contract.getLockedClaims(wallet);
        return results.map(data => ({
            wallet,
            stamp: data[0],
            locked: data[1]
        }));
    }

    /** Aliases for clarity */
    async getStakedBalance(wallet) {
        return this.fetchBalance(wallet);
    }

    async getStakedBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getStakedDetail(wallet) {
        return this.fetchDetail(wallet);
    }

    async getStakedDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = tokenStakedSevoX;

