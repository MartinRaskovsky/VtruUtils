/**
 * tokenVerse.js
 * 
 * Handles the logic for interacting with the VERSE contract.
 * Provides methods to fetch VERSE balances.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the VERSE contract.
 */
class TokenVerse extends TokenCommon {
    
    /**
     * Initializes the VERSE contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "VERSE");
    }

    /**
     * Retrieves the VERSE balance using the contract.
     */
    async retrieveBalance(contract, wallet) {
        try {
            const nft = await contract.getVerseNFTByOwner(wallet);

            return nft ? nft[2] : null;
        } catch (error) {
            return null; // Silently failing as per original implementation
        }
    }

    /**
     * Retrieves the VERSE details using the contract.
     * (Since VERSE doesn't have extra details, return only balance.)
     */
    async retrieveDetail(contract, wallet) {
        const balance = await this.retrieveBalance(contract, wallet);
        if (balance === null) return null;
        return { wallet, balance };
    }

    /** Aliases for clarity */
    async getVerseBalance(wallet) {
        return this.fetchBalance(wallet);
    }

    async getVerseBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getVerseDetail(wallet) {
        return this.fetchDetail(wallet);
    }

    async getVerseDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = TokenVerse;

