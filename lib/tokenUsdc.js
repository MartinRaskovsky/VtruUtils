/**
 * tokenUsdc.js
 * 
 * Handles the logic for interacting with the vtru pol contract.
 * Provides methods to fetch vtru pol balances and revenue shares.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the vtru pol contract.
 */
class TokenUsdc extends TokenCommon {
    
    /**
     * Initializes the vtru pol contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "USDC");
    }

    /**
     * Retrieves the vtru pol balance using the contract.
     */
    async getBalance(wallet) {
        const contract = this.getContract();
        return await await contract.balanceOf(wallet);
    }
}

module.exports = TokenUsdc;

