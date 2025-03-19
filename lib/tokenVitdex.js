/**
 * tokenVitdex.js
 * 
 * Handles the logic for interacting with the vitdex contract.
 * Provides methods to fetch vitdex balances and revenue shares.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the vitdex contract.
 */
class TokenVitdex extends TokenCommon {
    
    /**
     * Initializes the vitdex contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "VITDEX");
    }

    /**
     * Retrieves the vitdex details using the contract.
     */
    async retrieveDetail(contract, wallet) {
        try {
            const { tokenId, units, claimed } = await contract.getVitdexNFTByOwner(wallet);
            return { tokenId, units, claimed };
        } catch (error) {
            return null; // Silently failing as per original implementation
        }
    }

    /**
     * Retrieves the vitdex balance using the contract.
     */
      async retrieveBalance(contract, wallet) {
        //return await await contract.balanceOf(wallet);
        try {
            const { tokenId, units, claimed } = await contract.getVitdexNFTByOwner(wallet);
            return units;
        } catch (error) {
            return null; // Silently failing as per original implementation
        }
    }

    /** Aliases for clarity */
    async getVitdexBalance(wallet) {
        return this.fetchBalance(wallet);
    }

    async getVitdexBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getVitdexDetail(wallet) {
        return this.fetchDetail(wallet);
    }

    async getVitdexDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = TokenVitdex;

