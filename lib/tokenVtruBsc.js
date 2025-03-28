/**
 * tokenVtruBsc.js
 * 
 * Handles the logic for interacting with the vtru bsc contract.
 * Provides methods to fetch vtru bsc balances and revenue shares.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the vtru bsc contract.
 */
class TokenVtruBsc extends TokenCommon {
    
    /**
     * Initializes the vtru bsc contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "VTRUBridged");
    }

    /**
     * Retrieves the vtru bsc balance using the contract.
     */
    async getBalance(wallet) {
        const contract = this.getContract();
        return await await contract.balanceOf(wallet);
    }

    /**
     * Retrieves the vtru bsc details using the contract.
     */
    async getDetail(wallet) {
        const contract = this.getContract();
        const balance = await this.getBalance(wallet);
        if (balance === null || balance === 0n) return null;

        return { balance };
    }

    /** Aliases for clarity */
    async getVtruBscBalance(wallet) {
        return this.getBalance(wallet);
    }

    async getVtruBscBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getVtruBscDetail(wallet) {
        return this.getDetail(wallet);
    }

    async getVtruBscDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = TokenVtruBsc;

