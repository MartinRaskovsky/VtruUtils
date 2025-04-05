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
const Web3 = require("./libWeb3");

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
        this.id = web3.getId();
    }

    /**
     * Retrieves the staking balance for a given wallet.
     * 
     * @param {Object} contract - The contract instance.
     * @param {string} wallet - Ethereum wallet address.
     * @returns {Promise<number|null>} The staking balance, or null if retrieval fails.
     */
    async getBalance(wallet) {
        // the balance of a Saked SevoX is the sum of the locked amounts for the wallet
        const contract = this.getContract();
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
    async getDetail(wallet) { 
        const contract = this.getContract();    
        const results = await contract.getLockedClaims(wallet);
        return results.map(data => ({
            wallet,
            stamp: data[0],
            locked: data[1]
        }));
    }

    /** Aliases for clarity */
    async getStakedBalance(wallet) {
        return this.getBalance(wallet);
    }

    async getStakedBalances(wallets) {
        const fetch = async (wallet) => { return await this.getBalance(wallet); };
        const batchSize = this.web3.getConfig().getBatchSize();
        const minBatchSize = this.web3.getConfig().getMinBatchSize();
        const balances = await executeBatch(this.id, wallets, fetch, batchSize, minBatchSize);
        return balances;//balances.filter(balance => balance !== null);
    }

    async getStakedDetail(wallet) {
        return this.getDetail(wallet);
    }

    async getStakedDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = tokenStakedSevoX;

