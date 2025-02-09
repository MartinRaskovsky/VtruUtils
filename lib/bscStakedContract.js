/**
 * BscStakedContract.js
 * 
 * Handles interaction with SEVOX staked contract, providing methods
 * to retrieve staked balances and stake details for individual and
 * multiple wallets, including maturity calculation.
 *
 * Author: Dr Martín Raskovsky
 * Date: February 2025
 */

const { isAddress, getAddress } = require("ethers");
const VtruContract = require("./vtruContract");

class BscStakedContract extends VtruContract {
    constructor(web3) {
        super(web3, "SEVOX");
        this.provider = web3.getProvider(); // Assign provider at construction
    }

    async getBalance(wallet) {
        try {
            const contract = this.getContract();
            if (!contract) throw new Error("Contract instance unavailable.");
            if (!isAddress(wallet)) throw new Error(`Invalid Ethereum address: ${wallet}`);

            const walletAddress = getAddress(wallet);
            return await contract.balanceOf(walletAddress);
        } catch (error) {
            console.error(`❌ Error fetching contract balance for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    async getBalances(wallets) {
        try {
            if (!Array.isArray(wallets)) throw new Error("Invalid wallets input. Expected an array.");
            if (wallets.length === 0) return [];

            return await Promise.all(wallets.map(wallet => this.getBalance(wallet)));
        } catch (error) {
            console.error("❌ Error fetching contract balances for wallets:", error.message);
            return [];
        }
    }

}

module.exports = BscStakedContract;

