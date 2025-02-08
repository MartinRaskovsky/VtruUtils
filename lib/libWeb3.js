/**
 * libWeb3.js
 * A class for web3 connections.
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 *
 * This module includes:
 * - Web3: A class for managing blockchain connections.
 */

const { ethers } = require("ethers");
const VtruConfig = require("./vtruConfig");

class Web3 {
    static VTRU = "vtru";
    static BSC = "bsc";

    constructor(network) {

        this.network = network;
        this.rpcUrl = null;
        this.jsonPath = "";
        this.latestBlockNumber = null;

        switch (network) {
            case Web3.VTRU:
                this.rpcUrl = "https://rpc.vitruveo.xyz";
                this.jsonPath = "CONFIG_JSON_FILE_PATH";
                break;
            case Web3.BSC:
                this.rpcUrl = "https://bsc-dataseed.binance.org";
                this.jsonPath = "CONFIG_JSON_BSC_PATH";
                break;
            default:
                console.error(`❌ Unknown network: ${network}`);
                process.exit(1);
        }

        this.config = new VtruConfig(this.jsonPath, "mainnet");
        this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    }

    /**
     * Check if the connection to the RPC server is successful.
     * Logs an error message if the connection fails.
     */
    async checkConnection() {
        try {
            this.latestBlockNumber = await this.provider.getBlockNumber();
        } catch (error) {
            console.error("❌ Error: Unable to connect. Please check your internet connection.");
            process.exit(1);
        }
    }
    
    // Check connection on initialization
    static async create(network) {
        const instance = new Web3(network);
        await instance.checkConnection();
        return instance;
    }

    /**
     * Get the network identifier.
     * @returns {string} The network identifier.
     */
    getNetwork() {
        return this.network;
    }

    /**
     * Get the configuration instance.
     * @returns {Object} The configuration instance.
     */
    getConfig() {
        return this.config;
    }

    /**
     * Get the RPC URL.
     * @returns {string} The RPC URL.
     */
    getRpcUrl() {
        return this.rpcUrl;
    }

    /**
     * Get the JSON configuration path.
     * @returns {string} The JSON configuration path.
     */
    getJsonPath() {
        return this.jsonPath;
    }

    /**
     * Get the provider instance.
     * @returns {Object} The provider instance.
     */
    getProvider() {
        return this.provider;
    }

    /**
     * Get the latest block number retrieved during connection check.
     * @returns {number|null} The latest block number or null if unavailable.
     */
    getLatestBlockNumber() {
        return this.latestBlockNumber;
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

module.exports = { Web3 };
