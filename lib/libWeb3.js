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
const { Connection, PublicKey } = require('@solana/web3.js');
const { TezosToolkit } = require('@taquito/taquito');

const EvmBlockchain    = require("./evmBlockchain");
const SolanaBlockchain = require("./solanaBlockchain");
const TezosBlockchain  = require("./tezosBlockchain");
const Config = require("./libConfig");

class Web3 {
    static CHAIN_EVM = "evm";
    static CHAIN_SOL = "sol"
    static CHAIN_TEZ = "tez";

    static VTRU = "vtru";
    static BSC = "bsc";
    static ETH = "eth";
    static POL = "pol";
    static SOL = "sol";
    static TEZ = "tez";

    static networkIds = [Web3.VTRU, Web3.BSC, Web3.ETH, Web3.POL, Web3.SOL, Web3.TEZ];
    static NET_EVM = [Web3.VTRU, Web3.BSC, Web3.ETH, Web3.POL];
    static NET_SOL = [Web3.SOL];
    static NET_TEZ = [Web3.TEZ];

    // Static Currency Mapping
    static currency = {
        [Web3.VTRU]: "VTRU",
        [Web3.BSC]: "BNB",
        [Web3.ETH]: "ETH",
        [Web3.POL]: "POL",
        [Web3.SOL]: "SOL",
        [Web3.TEZ]: "TEZ",
    };

    // Static RPC URLs & JSON Paths
    static rpcUrls = {
        [Web3.VTRU]: "https://rpc.vitruveo.xyz",
        [Web3.BSC]: "https://bsc-dataseed.binance.org",
        [Web3.ETH]: "https://rpc.mevblocker.io",
        [Web3.POL]: "https://polygon-rpc.com",
        [Web3.SOL]: "https://api.mainnet-beta.solana.com",
        //[Web3.TEZ]: "https://mainnet.tezos.marigold.dev",
        [Web3.TEZ]: "https://mainnet.api.tez.ie",
    };

    static jsonPaths = {
        [Web3.VTRU]: "CONFIG_JSON_FILE_PATH",
        [Web3.BSC]: "CONFIG_JSON_BSC_PATH",
        [Web3.ETH]: "CONFIG_JSON_ETH_PATH",
        [Web3.POL]: "CONFIG_JSON_POL_PATH",
        [Web3.SOL]: "CONFIG_JSON_SOL_PATH",
        [Web3.TEZ]: "CONFIG_JSON_TEZ_PATH",
    };

    // Cached Providers & Latest Block Numbers
    static providers = {};

    /**
     * Initializes a Web3 instance for a specified blockchain network.
     * 
     * @param {string} id - Network identifier (e.g., one of networkIds).
     */
    constructor(id) {
        if (!Web3.networkIds.includes(id)) {
            throw new Error(`❌ Unknown network ID: ${id}`);
        }

        this.id = id;
        this.rpcUrl = Web3.rpcUrls[id];
        this.jsonPath = Web3.jsonPaths[id];

        if (!Web3.providers[id]) {
            switch (id) {
                case Web3.SOL:
                    Web3.providers[id] = new Connection(this.rpcUrl);
                    break;
                case Web3.TEZ:
                    Web3.providers[id] = new TezosToolkit(this.rpcUrl);
                    break;
                default:
                    Web3.providers[id] = new ethers.JsonRpcProvider(this.rpcUrl);
                    break;
            }
        }

        this.provider = Web3.providers[id];
        this.config = new Config(this.jsonPath, "mainnet");

        // Restore original async initialization mechanism
        this.latestBlockNumber = null;
        this._readyPromise = this.checkConnection();

        this.blockchain = this.initializeBlockchain(this.provider);

    }

    initializeBlockchain(provider) {
        switch (this.id) {
          case Web3.VTRU:
          case Web3.BSC:
          case Web3.ETH:
          case Web3.POL:
            return new EvmBlockchain(provider);
          case Web3.SOL:
            return new SolanaBlockchain(provider);
          case Web3.TEZ:
            return new TezosBlockchain(provider);
          default:
            throw new Error('Unsupported blockchain ID');
        }
    }

    /**
     * Ensures the connection is established by fetching the latest block number.
     * Retries up to 3 times before failing.
     * 
     * @returns {Promise<void>}
     */
    async checkConnection() {
        if (this.id === Web3.SOL || this.id === Web3.TEZ) { return; }
        const maxRetries = 3;
        const delayMs = 500; // 0.5 seconds between retries

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                this.latestBlockNumber = await this.provider.getBlockNumber();
                return;
            } catch (error) {
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, delayMs)); // Delay before retrying
                } else {
                    console.error("❌ Error: Unable to connect after multiple attempts. Please check your internet connection.");
                    this.latestBlockNumber = null;
                }
            }
        }
    }

    /**
     * Creates a new Web3 instance synchronously.
     * 
     * @param {string} id - Network identifier (e.g., Web3.VTRU, Web3.BSC, Web3.ETH, Web3.POL).
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
     * @returns {Config} - The configuration instance.
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

    getConnection() {
        return this.blockchain;
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
            return this.blockchain.getBalance(wallet);
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
        return this.blockchain.getBalances(wallets);
    }
}

module.exports = Web3;
