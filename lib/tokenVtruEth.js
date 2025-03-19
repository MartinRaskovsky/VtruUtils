/**
 * tokenVtruEth.js
 * 
 * Handles the logic for interacting with the vtru eth contract.
 * Provides methods to fetch vtru eth balances and revenue shares.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the vtru eth contract.
 */
class TokenVtruEth extends TokenCommon {
    
    /**
     * Initializes the vtru eth contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "VTRUBridged");
    }

    /**
     * Retrieves the vtru eth balance using the contract.
     */
    async retrieveBalance(contract, wallet) {
        return await await contract.balanceOf(wallet);
    }

    /**
     * Retrieves the vtru eth details using the contract.
     */
    async retrieveDetail(contract, wallet) {
        const balance = await this.retrieveBalance(contract, wallet);
        if (balance === null || balance === 0n) return null;

        return { balance };
    }

    /** Aliases for clarity */
    async getVtruEthBalance(wallet) {
        return this.fetchBalance(wallet);
    }

    async getVtruEthBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getVtruEthDetail(wallet) {
        return this.fetchDetail(wallet);
    }

    async getVtruEthDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = TokenVtruEth;

