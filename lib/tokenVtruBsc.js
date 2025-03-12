/**
 * tokenVtruBsc.js
 * 
 * Handles the logic for interacting with the SEC_VTRU_BSC contract.
 * Provides methods to fetch SEC_VTRU_BSC balances and revenue shares.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the SEC_VTRU_BSC contract.
 */
class TokenVtruBsc extends TokenCommon {
    
    /**
     * Initializes the SEC_VTRU_BSC contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "VTRUBridged");
    }

    /**
     * Retrieves the SEC_VTRU_BSC balance using the contract.
     */
    async retrieveBalance(contract, wallet) {
        return await await contract.balanceOf(wallet);
    }

    /**
     * Retrieves the SEC_VTRU_BSC details using the contract.
     */
    async retrieveDetail(contract, wallet) {
        const balance = await this.retrieveBalance(contract, wallet);
        if (balance === null || balance === 0n) return null;

        return { balance };
    }

    /** Aliases for clarity */
    async getVtruBscBalance(wallet) {
        return this.fetchBalance(wallet);
    }

    async getVtruBscBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getVtruBscDetail(wallet) {
        return this.fetchDetail(wallet);
    }

    async getVtruBscDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = TokenVtruBsc;

