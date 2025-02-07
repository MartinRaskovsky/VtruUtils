/**
 * vtruVault.js
 * A class representing a Vault in the Vtru ecosystem.
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * This class provides methods for interacting with the Vault smart contract, 
 * including retrieving wallet balances, checking stakes, and filtering wallets by balance.
 */

const { ethers } = require("ethers");

/**
 * Class for interacting with the Vault smart contract.
 */
class VtruVault {
    /**
     * Constructor for VtruVault.
     * @param {string} address - The Vault contract address.
     * @param {Object} config - The configuration object containing contract ABI.
     * @param {Object} web3 - The Web3 instance for blockchain interactions.
     */
    constructor(address, config, web3) {
        this.address = address;
        this.web3 = web3;

        this.contract = new ethers.Contract(
            address,
            config.getAbi("CreatorVault"),
            web3.getProvider()
        );
    }

    /**
     * Checks if the vault is blocked.
     * @returns {Promise<boolean>} True if the vault is blocked, otherwise false.
     */
    async isBlocked() {
        try {
            return await this.contract.isBlocked();
        } catch (error) {
            console.error(`This address does not seem to be a vault ${this.address}`);
            return null;
        }
    }

    /**
     * Retrieves the balance of the vault.
     * @returns {Promise<bigint|null>} The balance in wei, or null if an error occurs.
     */
    async vaultBalance() {
        try {
            return await this.contract.vaultBalance();
        } catch (error) {
            console.error(`Error fetching balance for vault ${this.address}:`, error.message);
            return null;
        }
    }

    /**
     * Retrieves the wallets associated with the vault.
     * @returns {Promise<Array<string>|null>} An array of wallet addresses, or null if an error occurs.
     */
    async getVaultWallets() {
        try {
            return await this.contract.getVaultWallets();
        } catch (error) {
            console.error(`Error fetching wallets for vault ${this.address}:`, error.message);
            return null;
        }
    }

    /**
     * Checks if the vault has stakes.
     * @returns {Promise<boolean|null>} True if the vault has stakes, otherwise false, or null on error.
     */
    async hasStakes() {
        try {
            return await this.contract.hasStakes();
        } catch (error) {
            console.error(`Error checking stakes for vault ${this.address}:`, error.message);
            return null;
        }
    }

    /**
     * Retrieves the name of the vault.
     * @returns {Promise<string|null>} The vault name, or null if an error occurs.
     */
    async getName() {
        try {
            return await this.contract.name();
        } catch (error) {
            console.error(`Error fetching name for vault ${this.address}:`, error.message);
            return null;
        }
    }

    /**
     * Gets the vault contract address.
     * @returns {string} The vault contract address.
     */
    getAddress() {
        return this.address;
    }
}

module.exports = VtruVault;

