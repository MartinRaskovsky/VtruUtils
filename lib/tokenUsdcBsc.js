/**
 * tokenUsdcBsc.js
 * 
 * Handles the logic for interacting with the SEC_USDC_BSC contract.
 * Provides methods to fetch SEC_USDC_BSC balances and revenue shares.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the SEC_USDC_BSC contract.
 */
class TokenUsdcBsc extends TokenCommon {
    
    /**
     * Initializes the SEC_USDC_BSC contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "USDC");
    }

    /**
     * Retrieves the SEC_USDC_BSC balance using the contract.
     */
    async retrieveBalance(contract, wallet) {
        return await await contract.balanceOf(wallet);
    }

    /**
     * Retrieves the SEC_USDC_BSC details using the contract.
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

