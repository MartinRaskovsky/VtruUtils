/**
 * tokenSevoX.js
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
class tokenSevoX extends TokenCommon {
    
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
        return await contract.balanceOf(wallet);;
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
    async getSevoXBalance(wallet) {
        return this.fetchBalance(wallet);
    }

    async getSevoXBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getSevoXDetail(wallet) {
        return this.fetchDetail(wallet);
    }

    async getSevoXDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = tokenSevoX;

