/**
 * tokenVibe.js
 * 
 * Handles the logic for interacting with the VIBE contract.
 * Provides methods to fetch VIBE balances and revenue shares.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the VIBE contract.
 */
class TokenVibe extends TokenCommon {
    
    /**
     * Initializes the VIBE contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "VIBE");
    }

    /**
     * Retrieves the VIBE balance using the contract.
     */
    async retrieveBalance(contract, wallet) {
        return await contract.getVibeNFTSharesByOwner(wallet);
    }

    /**
     * Retrieves the VIBE details using the contract.
     */
    async retrieveDetail(contract, wallet) {
        const balance = await this.retrieveBalance(contract, wallet);
        if (balance === null || balance === 0n) return null;

        const [claimed, unclaimed] = await contract["getRevenueShareByOwner(address)"](wallet);
        const noTokens = await contract.balanceOf(wallet);

        return { wallet, balance, noTokens, claimed, unclaimed };
    }

    /** Aliases for clarity */
    async getVibeBalance(wallet) {
        return this.fetchBalance(wallet);
    }

    async getVibeBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getVibeDetail(wallet) {
        return this.fetchDetail(wallet);
    }

    async getVibeDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = TokenVibe;

