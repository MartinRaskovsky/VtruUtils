/**
 * tokenUsdcBsc.js
 * 
 * Handles the logic for interacting with the usdc bsc contract.
 * Provides methods to fetch usdc bsc balances and revenue shares.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the usdc bsc contract.
 */
class TokenUsdcBsc extends TokenCommon {
    
    /**
     * Initializes the usdc bsc contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "USDC");
    }

    /**
     * Retrieves the usdc bsc balance using the contract.
     */
    async retrieveBalance(contract, wallet) {
        return await await contract.balanceOf(wallet);
    }

    /**
     * Retrieves the usdc bsc details using the contract.
     */
    async retrieveDetail(contract, wallet) {
        const balance = await this.retrieveBalance(contract, wallet);
        if (balance === null || balance === 0n) return null;

        return { balance };
    }

    /** Aliases for clarity */
    async getUsdcBscBalance(wallet) {
        return this.fetchBalance(wallet);
    }

    async getUsdcBscBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getUsdcBscDetail(wallet) {
        return this.fetchDetail(wallet);
    }

    async getUsdcBscDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = TokenUsdcBsc;

