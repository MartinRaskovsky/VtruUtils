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
    async getBalance(wallet) {
        const contract = this.getContract();
        try {
            const nft = await contract.getVerseNFTByOwner(wallet);

            return nft ? nft[2] : 0n;
        } catch (error) {
            return 0n; // Silently failing as per original implementation
        }
    }

    /**
     * Retrieves the VERSE details using the contract.
     * (Since VERSE doesn't have extra details, return only balance.)
     */
    async getDetail(wallet) {
        const contract = this.getContract();
        const balance = await this.getBalance(wallet);
        if (balance === null) return null;
        return { wallet, balance };
    }

    /** Aliases for clarity */
    async getVerseBalance(wallet) {
        return this.getBalance(wallet);
    }

    async getVerseBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getVerseDetail(wallet) {
        return this.getDetail(wallet);
    }

    async getVerseDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = TokenVerse;

