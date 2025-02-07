/**
 * VtruWeb3.js
 * Handles the Web3 configuration and provider setup for vtru.
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 */

const { ethers } = require("ethers");

const RPC_URL = "https://rpc.vitruveo.xyz";

/**
 * Class representing Web3 configuration and interactions.
 */
class VtruWeb3 {
    /**
     * Constructor for VtruWeb3.
     * @param {Object} config - The vtru configuration instance.
     */
    constructor(config) {
        this.config = config;
        this.rpc = RPC_URL;
        this.provider = new ethers.JsonRpcProvider(this.rpc);

        // Check connection on initialization
        this.checkConnection();
    }

    /**
     * Check if the connection to the RPC server is successful.
     * Logs an error message if the connection fails.
     */
    async checkConnection() {
        try {
            // Try to get the latest block number to verify connectivity
            await this.provider.getBlockNumber();
        } catch (error) {
            console.error("Error: Unable to connect to the RPC server. Please check your internet connection.");
        }
    }

    /**
     * Get the RPC URL.
     * @returns {string} - The RPC URL.
     */
    getRPC() {
        return this.rpc;
    }

    /**
     * Get the ethers provider instance.
     * @returns {ethers.JsonRpcProvider} - The provider instance.
     */
    getProvider() {
        return this.provider;
    }

    /**
     * Fetch the raw balance of a given wallet address.
     * @param {string} wallet - The wallet address.
     * @returns {Promise<bigint>} - The raw wallet balance in WEI.
     */
    async getWalletRawBalance(wallet) {
        try {
            return await this.getProvider().getBalance(wallet);
        } catch (error) {
            console.error(`Error fetching balance for wallet ${wallet}:`, error.message);
            return 0n; // Return 0 balance if fetching fails
        }
    }

    /**
     * Fetch the raw balances for multiple wallet addresses.
     * @param {Array<string>} wallets - The array of wallet addresses.
     * @returns {Promise<Array<bigint>>} - An array of wallet balances in WEI.
     */
    async getWalletRawBalances(wallets) {
        if (!Array.isArray(wallets)) {
            console.error("❌ Invalid input: wallets must be an array.");
            return [];
        }

        const balancePromises = wallets.map(async (wallet) => {
            return this.getWalletRawBalance(wallet);
        });

        return Promise.all(balancePromises);
    }
}

module.exports = VtruWeb3;

