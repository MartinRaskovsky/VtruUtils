/**
 * tokenSevo.js
 * 
 * Handles the logic for interacting with the SEVO contract.
 * Provides methods to fetch SEVO balances and revenue shares.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenCommon = require("./tokenCommon");

/**
 * Manages interactions with the SEVO contract.
 */
class TokenSevo extends TokenCommon {
    
    /**
     * Initializes the SEVO contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(web3) {
        super(web3, "SEVO");
    }

    /**
     * Retrieves the SEVO balance using the contract.
     */
    async getBalance(wallet) {
        const contract = this.getContract();
        return await contract.balanceOf(wallet);
    }

    /**
     * Retrieves the SEVO claim details for a given wallet.
     * @param {string} wallet - Wallet address
     * @return {object|null} Structured claim info or null if not available
     */
    async getDetail(wallet) {
        const contract = this.getContract();
        const detail = await contract.claimInfo(wallet);
        if (!detail) return null;

        const { withBtc, withoutBtc, gain, priorClaimed } = detail;
        return { wallet, withBtc, withoutBtc, gain, priorClaimed };
    }

}

module.exports = TokenSevo;

