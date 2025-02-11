/**
 * libWeb3.js
 * 
 * Provides a Web3 class for managing blockchain connections.
 * Supports Vitruveo (VTRU) and Binance Smart Chain (BSC) networks.
 * Handles RPC connections, configuration, and wallet balance retrieval.
 * 
 * Connection Mechanism:
 * - Upon instantiation, the Web3 class initializes an RPC connection using ethers.
 * - The `_readyPromise` stores the result of `checkConnection()`, an async method that 
 *   attempts to fetch the latest block number from the provider.
 * - Any method that depends on a successful connection (e.g., `getLatestBlockNumber()`) 
 *   first awaits `_readyPromise`, ensuring that the connection is established before 
 *   executing further blockchain queries.
 * - If the connection attempt fails, an error message is logged, and the process exits.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { ethers } = require("ethers");
const VtruConfig = require("./vtruConfig");

class Web3 {
  static VTRU = "vtru";
  static BSC = "bsc";

  /**
   * Initializes a Web3 instance for a specified blockchain network.
   * 
   * @param {string} id - Network identifier (e.g., Web3.VTRU, Web3.BSC).
   */
  constructor(id) {
    this.id = id;
    this.rpcUrl = null;
    this.jsonPath = "";
    this.latestBlockNumber = null;

    switch (id) {
      case Web3.VTRU:
        this.rpcUrl = "https://rpc.vitruveo.xyz";
        this.jsonPath = "CONFIG_JSON_FILE_PATH";
        break;
      case Web3.BSC:
        this.rpcUrl = "https://bsc-dataseed.binance.org";
        this.jsonPath = "CONFIG_JSON_BSC_PATH";
        break;
      default:
        console.error(`❌ Unknown id: ${id}`);
        process.exit(1);
    }

    this.config = new VtruConfig(this.jsonPath, "mainnet");
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);

    // Start asynchronous connection check immediately.
    this._readyPromise = this.checkConnection();
  }

  /**
   * Checks if the connection to the RPC server is successful.
   * Fetches and stores the latest block number.
   * Logs an error message and exits if the connection fails.
   * 
   * @returns {Promise<void>}
   */
  async checkConnection() {
    try {
      this.latestBlockNumber = await this.provider.getBlockNumber();
    } catch (error) {
      console.error("❌ Error: Unable to connect. Please check your internet connection.");
      process.exit(1);
    }
  }

  /**
   * Creates a new Web3 instance synchronously.
   * 
   * @param {string} id - Network identifier (e.g., Web3.VTRU, Web3.BSC).
   * @returns {Web3} A new Web3 instance.
   */
  static create(id) {
    return new Web3(id);
  }

  /**
   * Retrieves the network identifier.
   * 
   * @returns {string} The network identifier.
   */
  getId() {
    return this.id;
  }

  /**
   * Retrieves the configuration instance.
   * 
   * @returns {Object} The configuration instance.
   */
  getConfig() {
    return this.config;
  }

  /**
   * Retrieves the RPC URL.
   * 
   * @returns {string} The RPC URL.
   */
  getRpcUrl() {
    return this.rpcUrl;
  }

  /**
   * Retrieves the JSON configuration path.
   * 
   * @returns {string} The JSON configuration path.
   */
  getJsonPath() {
    return this.jsonPath;
  }

  /**
   * Retrieves the provider instance.
   * 
   * @returns {Object} The provider instance.
   */
  getProvider() {
    return this.provider;
  }

  /**
   * Retrieves the latest block number fetched during connection check.
   * Waits for the connection check to complete before returning the value.
   * 
   * @returns {Promise<number|null>} The latest block number or null if unavailable.
   */
  async getLatestBlockNumber() {
    await this._readyPromise;
    return this.latestBlockNumber;
  }

  /**
   * Fetches the raw balance of a given wallet address.
   * 
   * @param {string} wallet - The wallet address.
   * @returns {Promise<bigint>} The raw wallet balance in WEI.
   */
  async getWalletRawBalance(wallet) {
    try {
      return await this.getProvider().getBalance(wallet);
    } catch (error) {
      console.error(`❌ Error fetching balance for wallet ${wallet}:`, error.message);
      return 0n;
    }
  }
  
  /**
   * Fetches the raw balances for multiple wallet addresses in parallel.
   * 
   * @param {Array<string>} wallets - The array of wallet addresses.
   * @returns {Promise<Array<bigint>>} An array of wallet balances in WEI.
   */
  async getWalletRawBalances(wallets) {
    if (!Array.isArray(wallets)) {
      console.error("❌ Invalid input: wallets must be an array.");
      return [];
    }
  
    return Promise.all(wallets.map(wallet => this.getWalletRawBalance(wallet)));
  }
}

module.exports = { Web3 };
