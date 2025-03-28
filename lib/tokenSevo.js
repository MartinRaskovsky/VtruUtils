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
     * Retrieves the SEVO details using the contract.
     */
    async getDetail(wallet) {
        const contract = this.getContract();
        const balance = await this.getBalance(wallet);
        if (balance === null || balance === 0n) return null;

        //const [claimed, unclaimed] = await contract["getRevenueShareByOwner(address)"](wallet);
        //const noTokens = await contract.balanceOf(wallet);

        return { wallet, balance, noTokens, claimed, unclaimed };
    }

    /** Aliases for clarity */
    async getSevoBalance(wallet) {
        return this.getBalance(wallet);
    }

    async getSevoBalances(wallets) {
        return this.getBalances(wallets);
    }

    async getSevoDetail(wallet) {
        return this.getDetail(wallet);
    }

    async getSevoDetails(wallets) {
        return this.getDetails(wallets);
    }
}

module.exports = TokenSevo;

