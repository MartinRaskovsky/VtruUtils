/**
 * libWeb3.js
 * 
 * Provides a Web3 class for managing blockchain connections.
 * Supports Vitruveo (VTRU), Binance (BSC), and Ethereum (ETH) networks.
 * Handles RPC connections, configuration, and wallet balance retrieval.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { ethers } = require("ethers");
const VtruConfig = require("./vtruConfig");

class Web3 {
    static VTRU = "vtru";
    static BSC = "bsc";
    static ETH = "eth";
    static networkIds = [Web3.VTRU, Web3.BSC, Web3.ETH];

    // Static Currency Mapping
    static currency = {
        [Web3.VTRU]: "VTRU",
        [Web3.BSC]: "BNB",
        [Web3.ETH]: "ETH",
    };

    // Static RPC URLs & JSON Paths
    static rpcUrls = {
        [Web3.VTRU]: "https://rpc.vitruveo.xyz",
        [Web3.BSC]: "https://bsc-dataseed.binance.org",
        [Web3.ETH]: "https://rpc.mevblocker.io",
    };

    static jsonPaths = {
        [Web3.VTRU]: "CONFIG_JSON_FILE_PATH",
        [Web3.BSC]: "CONFIG_JSON_BSC_PATH",
        [Web3.ETH]: "CONFIG_JSON_ETH_PATH",
    };

    // Cached Providers & Latest Block Numbers
    static providers = {};

    /**
     * Initializes a Web3 instance for a specified blockchain network.
     * 
     * @param {string} id - Network identifier (e.g., Web3.VTRU, Web3.BSC, Web3.ETH).
     */
    constructor(id) {
        if (!Web3.networkIds.includes(id)) {
            throw new Error(`❌ Unknown network ID: ${id}`);
        }

        this.id = id;
        this.rpcUrl = Web3.rpcUrls[id];
        this.jsonPath = Web3.jsonPaths[id];

        if (!Web3.providers[id]) {
            Web3.providers[id] = new ethers.JsonRpcProvider(this.rpcUrl);
        }

        this.provider = Web3.providers[id];
        this.config = new VtruConfig(this.jsonPath, "mainnet");

        // Restore original async initialization mechanism
        this.latestBlockNumber = null;
        this._readyPromise = this.checkConnection();
    }

    /**
     * Ensures the connection is established by fetching the latest block number.
     * 
     * @returns {Promise<void>}
     */
    async checkConnection() {
        try {
            this.latestBlockNumber = await this.provider.getBlockNumber();
        } catch (error) {
            console.error("❌ Error: Unable to connect. Please check your internet connection.");
            this.latestBlockNumber = null;
        }
    }

    /**
     * Creates a new Web3 instance synchronously.
     * 
     * @param {string} id - Network identifier (e.g., Web3.VTRU, Web3.BSC, Web3.ETH).
     * @returns {Web3} A new Web3 instance.
     */
    static create(id) {
        return new Web3(id);
    }

    /**
     * Returns the latest block number for the network.
     * Ensures the connection is ready before fetching the block number.
     * 
     * @returns {Promise<number|null>} - The latest block number or null if unavailable.
     */
    async getLatestBlockNumber() {
        await this._readyPromise;
        return this.latestBlockNumber;
    }

    /**
     * Retrieves the network identifier.
     * 
     * @returns {string} - The network identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Retrieves the configuration instance.
     * 
     * @returns {VtruConfig} - The configuration instance.
     */
    getConfig() {
        return this.config;
    }

    /**
     * Retrieves the RPC URL for the network.
     * 
     * @returns {string} - The RPC URL.
     */
    getRpcUrl() {
        return this.rpcUrl;
    }

    /**
     * Retrieves the JSON configuration path.
     * 
     * @returns {string} - The JSON configuration path.
     */
    getJsonPath() {
        return this.jsonPath;
    }

    /**
     * Retrieves the provider instance for the network.
     * 
     * @returns {ethers.JsonRpcProvider} - The provider instance.
     */
    getProvider() {
        return this.provider;
    }

    /**
     * Fetches the raw balance of a given wallet address.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<bigint>} - The raw wallet balance in WEI.
     */
    async getWalletRawBalance(wallet) {
        if (!wallet || typeof wallet !== "string") {
            console.error("❌ Error: Invalid wallet address.");
            return 0n;
        }
        try {
            return await this.provider.getBalance(wallet);
        } catch (error) {
            console.error(`❌ Error fetching balance for wallet ${wallet}: ${error.message}`);
            return 0n;
        }
    }

    /**
     * Fetches the raw balances for multiple wallet addresses in parallel.
     * 
     * @param {Array<string>} wallets - The array of wallet addresses.
     * @returns {Promise<Array<bigint>>} - An array of wallet balances in WEI.
     */
    async getWalletRawBalances(wallets) {
        if (!Array.isArray(wallets) || wallets.length === 0) {
            console.error("❌ Error: wallets must be a non-empty array.");
            return [];
        }
        return Promise.all(wallets.map(wallet => this.getWalletRawBalance(wallet)));
    }
}

module.exports = Web3;
