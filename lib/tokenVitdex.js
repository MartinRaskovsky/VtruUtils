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
     * Retrieves the vitdex balance using the contract.
     */
      async getBalance(wallet) {
        const contract = this.getContract();
        const { tokenId, units, claimed } = await contract.getVitdexNFTByOwner(wallet);
        return units;
    }

    /**
     * Retrieves the vitdex details using the contract.
     */
    async getDetail(wallet) {
        const contract = this.getContract();
        const { tokenId, units, claimed } = await contract.getVitdexNFTByOwner(wallet);
        return { tokenId, units, claimed };
    }

}

module.exports = TokenVitdex;

