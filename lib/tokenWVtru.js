/**
 * tokenWVtru.js
 * 
 * Handles the logic for interacting with the wVTRU contract.
 * Provides methods to fetch wVTRU balances and revenue shares.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the wVTRU contract.
 */
class TokenWVtru extends TokenCommon {
    
    /**
     * Initializes the wVTRU contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "wVTRU");
    }

    /**
     * Retrieves the wVTRU balance using the contract.
     */
    async retrieveBalance(contract, wallet) {
        return await await contract.balanceOf(wallet);
    }

    /**
     * Retrieves the wVTRU details using the contract.
     */
    async retrieveDetail(contract, wallet) {
        const balance = await this.retrieveBalance(contract, wallet);
        if (balance === null || balance === 0n) return null;

        return { balance };
    }

    /** Aliases for clarity */
    async getWVtruBalance(wallet) {
        return this.fetchBalance(wallet);
    }

    async getWVtruBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getWVtruDetail(wallet) {
        return this.fetchDetail(wallet);
    }

    async getWVtruDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = TokenWVtru;

