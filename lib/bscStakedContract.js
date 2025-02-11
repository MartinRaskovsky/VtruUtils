/**
 * BscStakedContract.js
 * 
 * Handles interaction with SEVOX staked contract, providing methods
 * to retrieve staked balances and stake details for individual and
 * multiple wallets, including maturity calculation.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { isAddress, getAddress } = require("ethers");
const VtruContract = require("./vtruContract");

/**
 * Extends VtruContract to interact with the SEVOX staking contract.
 * Provides methods to fetch staking balances and locked claims for wallets.
 */
class BscStakedContract extends VtruContract {
    
    /**
     * Initializes the contract interface with the blockchain provider.
     * 
     * @param {Object} web3 - Web3 provider instance.
     */
    constructor(web3) {
        super(web3, "SEVOX");
        this.provider = web3.getProvider(); // Assign provider at construction
    }

    /**
     * Fetches the staking balance of a given wallet.
     * 
     * @param {string} wallet - Ethereum wallet address.
     * @returns {Promise<number|null>} The staking balance or null if an error occurs.
     */
    async getBalance(wallet) {
        try {
            if (!isAddress(wallet)) throw new Error(`Invalid Ethereum address: ${wallet}`);

            const contract = this.getContract();
            if (!contract) throw new Error("Contract instance unavailable.");

            return await contract.balanceOf(getAddress(wallet));
        } catch (error) {
            console.error(`❌ Error fetching balance for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    /**
     * Fetches the staking balances of multiple wallets in parallel.
     * 
     * @param {string[]} wallets - Array of Ethereum wallet addresses.
     * @returns {Promise<number[]>} Array of balances corresponding to each wallet.
     */
    async getBalances(wallets) {
        try {
            if (!Array.isArray(wallets) || wallets.length === 0) throw new Error("Expected a non-empty array of wallets.");
            
            const contract = this.getContract();
            if (!contract) throw new Error("Contract instance unavailable.");

            const validWallets = wallets.filter(isAddress).map(getAddress);
            if (validWallets.length === 0) throw new Error("No valid Ethereum addresses provided.");

            return await Promise.all(validWallets.map(wallet => contract.balanceOf(wallet)));
        } catch (error) {
            console.error("❌ Error fetching balances:", error.message);
            return [];
        }
    }

    /**
     * Retrieves the locked staking claims for a specific wallet.
     * 
     * @param {string} wallet - Ethereum wallet address.
     * @returns {Promise<Object[]>} Array of staking details (timestamp and locked amount).
     */
    async getStakedDetail(wallet) {
        try {
            if (!isAddress(wallet)) throw new Error(`Invalid Ethereum address: ${wallet}`);

            const contract = this.getContract();
            if (!contract) throw new Error("Contract instance unavailable.");

            const results = await contract.getLockedClaims(getAddress(wallet));
            return results.map(data => ({
                wallet,
                stamp: data[0],
                locked: data[1]
            }));
        } catch (error) {
            console.error(`❌ Error fetching staked details for wallet ${wallet}:`, error.message);
            return [];
        }
    }

    /**
     * Fetches locked staking claims for multiple wallets in parallel.
     * 
     * @param {string[]} wallets - Array of Ethereum wallet addresses.
     * @returns {Promise<Object[]>} Combined array of staking details for all wallets.
     */
    async getStakedDetails(wallets) {
        try {
            if (!Array.isArray(wallets) || wallets.length === 0) throw new Error("Expected a non-empty array of wallets.");
            
            const results = await Promise.all(wallets.map(wallet => this.getStakedDetail(wallet)));
            return results.flat(); // Flattening to return a single array
        } catch (error) {
            console.error("❌ Error fetching staked balances for wallets:", error.message);
            return [];
        }
    }
}

module.exports = BscStakedContract;
