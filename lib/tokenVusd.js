/**
 * tokenVusd.js
 * 
 * Handles the logic for interacting with the VUSD contract.
 * Provides methods to fetch VUSD balances and revenue shares.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the VUSD contract.
 */
class TokenVusd extends TokenCommon {
    
    /**
     * Initializes the VUSD contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "VUSD");
    }

    /**
     * Retrieves the VUSD balance using the contract.
     */
    async getBalance(wallet) {
        const contract = this.getContract();
        return await contract.balanceOf(wallet);
    }

    /**
     * Retrieves the VUSD details using the contract.
     */
    async getDetail(wallet) {
        const contract = this.getContract();
        const balance = await this.getBalance(wallet);
        if (balance === null || balance === 0n) return null;

        return { balance };
    }

    /** Aliases for clarity */
    async getVusdBalance(wallet) {
        return this.getBalance(wallet);
    }

    async getVusdBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getVusdDetail(wallet) {
        return this.getDetail(wallet);
    }

    async getVusdDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = TokenVusd;

