/**
 * tokenCommonFallback.js
 * 
 * Fallback for ERC-20 tokens using ethers.js only.
 * Provides getBalance() and inherits batch logic.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenCommon = require('./tokenCommon');
const Logger = require("../lib/libLogger");

const MODULE = "tokenCommonFallback";

class TokenCommonFallback extends TokenCommon {
    constructor(web3, tokenName) {
        super(web3, tokenName);
        this.id = web3.getId();
        this.tokenName = tokenName;
    }

    /**
     * Implements single balance call using ethers.
     * Enables use of getBalances() from base class.
     * 
     * @param {string} wallet
     * @returns {Promise<bigint|null>}
     */
    async getBalance(wallet) {
        const contract = this.getContract();
        if (!contract) return null;

        try {
            return await contract.balanceOf(wallet);
        } catch (err) {
            Logger.warn(`${MODULE} (${this.id}/${this.tokenName}) balanceOf call failed for ${wallet}: ${err.code || err.message}`);
            return -1n;
        }
    }
}

module.exports = TokenCommonFallback;

