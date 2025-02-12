/**
 * VtruConfig.js
 * 
 * Handles the logic for loading and managing configuration data from 
 * environment variables and JSON configuration files.
 * 
 * Functionality:
 * - Loads configuration data from a JSON file specified in the .env file.
 * - Provides methods to retrieve contract ABIs, addresses, and environment settings.
 * - Supports reading and updating wallet and vault information in the .env file.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.resolve(__dirname, "../data/.env") });

class VtruConfig {
    
    /**
     * Initializes the configuration instance by loading the JSON file.
     * 
     * @param {string} [envLabel="CONFIG_JSON_FILE_PATH"] - Environment variable holding the JSON file path.
     * @param {string} [network="mainnet"] - Network (e.g., 'mainnet' or 'testnet').
     */
    constructor(envLabel = "CONFIG_JSON_FILE_PATH", network = "mainnet") {
        this.network = network;
        const filePath = process.env[envLabel];

        try {
            if (!filePath) {
                throw new Error(`${envLabel} file path not provided and not set in environment variables.`);
            }
            this.data = require(filePath);
        } catch (error) {
            console.error("❌ Error loading the JSON file:", error.message);
            this.data = null;
        }
    }

    /**
     * Retrieves the ABI for a given contract label.
     * 
     * @param {string} label - Label for the ABI.
     * @returns {object|null} ABI object, or null if not found.
     */
    getAbi(label) {
        if (!this.data) {
            console.error("❌ Configuration data for getAbi is not available.");
            return null;
        }
        return this.data.abi[label] || null;
    }

    /**
     * Retrieves the contract address for a given label.
     * 
     * @param {string} label - Label for the contract address.
     * @returns {string|null} Contract address, or null if not found.
     */
    getContractAddress(label) {
        if (!this.data) {
            console.error("❌ Configuration data for getContractAddress is not available.");
            return null;
        }
        return this.data[this.network]?.[label] || null;
    }

    /**
     * Retrieves an environment variable from the .env file.
     * 
     * @param {string} element - The key to retrieve.
     * @returns {string|null} The value, or null if not found.
     */
    get(element) {
        const value = process.env[element];
        if (!value) {
            console.error(`❌ "${element}" not found in .env file.`);
            return null;
        }
        return value;
    }

    /**
     * Retrieves wallet addresses from the .env file.
     * 
     * @returns {Array<string>} Array of wallet addresses.
     */
    getWallets() {
        const wallets = process.env.WALLETS;
        if (!wallets) {
            console.error("❌ Wallets not found in .env file.");
            return [];
        }
        return wallets.split(",").map(wallet => wallet.trim());
    }

    /**
     * Retrieves the vault address from the .env file.
     * 
     * @returns {string|null} Vault address, or null if not found.
     */
    getVaultAddress() {
        const vaultAddress = process.env.VAULT_ADDRESS;
        if (!vaultAddress) {
            console.error("❌ Vault address not found in .env file.");
            return null;
        }
        return vaultAddress;
    }

    /**
     * Updates the wallets in the .env file.
     * 
     * @param {Array<string>} wallets - Array of wallet addresses.
     */
    setWallets(wallets) {
        try {
            this.#updateEnvFile("WALLETS", wallets.join(", "));
            console.log("✅ Wallets updated in .env file.");
        } catch (error) {
            console.error("❌ Error updating wallets in .env file:", error.message);
        }
    }

    /**
     * Updates the vault address in the .env file.
     * 
     * @param {string} vaultAddress - Vault address.
     */
    setVaultAddress(vaultAddress) {
        try {
            this.#updateEnvFile("VAULT_ADDRESS", vaultAddress);
            console.log("✅ Vault address updated in .env file.");
        } catch (error) {
            console.error("❌ Error updating vault address in .env file:", error.message);
        }
    }

    /**
     * Updates or adds a key-value pair in the .env file (internal use only).
     * 
     * @param {string} key - The key to update or add.
     * @param {string} value - The value to set for the key.
     */
    #updateEnvFile(key, value) {
        const envPath = path.resolve(__dirname, "../data/.env");
        let envContents = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
        const keyValueRegex = new RegExp(`^${key}=.*`, "m");

        if (keyValueRegex.test(envContents)) {
            envContents = envContents.replace(keyValueRegex, `${key}=${value}`);
        } else {
            envContents += `\n${key}=${value}`;
        }

        fs.writeFileSync(envPath, envContents, "utf8");
    }
}

module.exports = VtruConfig;
