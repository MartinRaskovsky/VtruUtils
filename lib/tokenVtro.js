/**
 * tokenVtro.js
 * 
 * Handles the logic for interacting with the VTRO contract.
 * Provides methods to fetch VTRO balances and revenue shares.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the VTRO contract.
 */
class TokenVtro extends TokenCommon {
    
    /**
     * Initializes the VTRO contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "VTRO");
    }

    /**
     * Retrieves the VTRO balance using the contract.
     */
    async getBalance(wallet) {
        const contract = this.getContract();
        return await contract.balanceOf(wallet);
    }

    /**
     * Retrieves the VTRO details using the contract.
     */
    async getDetail(wallet) {
        const contract = this.getContract();
        const balance = await this.getBalance(wallet);
        if (balance === null || balance === 0n) return null;

        return { balance };
    }

    /** Aliases for clarity */
    async getVtroBalance(wallet) {
        return this.getBalance(wallet);
    }

    async getVtroBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getVtroDetail(wallet) {
        return this.getDetail(wallet);
    }

    async getVtroDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = TokenVtro;

