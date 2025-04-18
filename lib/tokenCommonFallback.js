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

class TokenCommonFallback extends TokenCommon {
    constructor(web3, tokenName) {
        super(web3, tokenName);
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
        return await contract.balanceOf(wallet);
    }
}

module.exports = TokenCommonFallback;

