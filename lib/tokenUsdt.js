/**
 * tokenUsdt.js
 * 
 * Handles the logic for interacting with usdc  contracts.
 * Provides a method to fetch usd balance.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenCommon = require("./tokenCommon");
const { formatVusdNumber } = require("../lib/vtruUtils");

/**
 * Manages interactions with the vtru pol contract.
 */
class TokenUsdt extends TokenCommon {
    
    /**
     * Initializes the usdc contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "USDT");
        this.id = web3.getId();
    }

    /**
     * Retrieves the usdc balance using the contract.
     */
    async getBalance(wallet) {
        const contract = this.getContract();
        return await contract.balanceOf(wallet);
    }
}

module.exports = TokenUsdt;

