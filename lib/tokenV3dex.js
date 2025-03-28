/**
 * tokenV3dex.js
 * 
 * Handles the logic for interacting with the v3dex contract.
 * Provides methods to fetch v3dex balances and revenue shares.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the v3dex contract.
 */
class TokenV3dex extends TokenCommon {
    
    /**
     * Initializes the v3dex contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "V3DEX");
    }

    /**
     * Retrieves the v3dex balance using the contract.
     */
    async getBalance(wallet) {
        const contract = this.getContract();
        return await await contract.balanceOf(wallet);
    }

    /**
     * Retrieves the v3dex details using the contract.
     */
    async getDetail(wallet) {
        const contract = this.getContract();
        const balance = await this.getBalance(wallet);
        if (balance === null || balance === 0n) return null;

        return { balance };
    }

    /** Aliases for clarity */
    async getV3dexBalance(wallet) {
        return this.getBalance(wallet);
    }

    async getV3dexBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getV3dexDetail(wallet) {
        return this.getDetail(wallet);
    }

    async getV3dexDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = TokenV3dex;

