/**
 * vtruVault.js
 * 
 * Represents a Vault in the Vtru ecosystem.
 * Provides methods for interacting with the Vault smart contract, 
 * including retrieving wallet balances, checking stakes, and filtering wallets by balance.
 * 
 * Optimized for efficient blockchain access by reducing redundant contract calls.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { ethers } = require("ethers");
const { mergeUnique } = require("../lib/vtruUtils");

/**
 * Manages interactions with the Vault smart contract.
 * Supports querying balances, stakes, and associated wallets.
 */
class VtruVault {
    
    /**
     * Initializes the Vault contract instance.
     * 
     * @param {string} address - The Vault contract address.
     * @param {Object} web3 - The Web3 instance for blockchain interactions.
     */
    constructor(address, web3) {
        this.address = address;
        this.web3 = web3;

        this.contract = new ethers.Contract(
            address,
            web3.getConfig().getAbi("CreatorVault"),
            web3.getProvider()
        );
    }

    /**
     * Checks if the vault is blocked.
     * 
     * @returns {Promise<boolean|null>} True if the vault is blocked, otherwise false, or null on error.
     */
    async isBlocked() {
        try {
            return await this.contract.isBlocked();
        } catch (error) {
            console.error(`❌ Error checking if vault ${this.address} is blocked:`, error.message);
            return null;
        }
    }

    /**
     * Retrieves the balance of the vault in wei.
     * 
     * @returns {Promise<bigint|null>} The balance in wei, or null if an error occurs.
     */
    async vaultBalance() {
        try {
            return await this.contract.vaultBalance();
        } catch (error) {
            console.error(`❌ Error fetching balance for vault ${this.address}:`, error.message);
            return null;
        }
    }

    /**
     * Retrieves the wallets associated with the vault.
     * 
     * @returns {Promise<Array<string>|null>} An array of wallet addresses, or null if an error occurs.
     */
    async getVaultWallets() {
        try {
            return await this.contract.getVaultWallets();
        } catch (error) {
            const message = `Not a valid vault ${this.address}`
            console.error(`❌ ${message}`);
            throw new Error(message);
        }
    }

    /**
     * Checks if the vault has stakes.
     * 
     * @returns {Promise<boolean|null>} True if the vault has stakes, otherwise false, or null on error.
     */
    async hasStakes() {
        try {
            return await this.contract.hasStakes();
        } catch (error) {
            console.error(`❌ Error checking stakes for vault ${this.address}:`, error.message);
            return null;
        }
    }

    /**
     * Retrieves the name of the vault.
     * 
     * @returns {Promise<string|null>} The vault name, or null if an error occurs.
     */
    async getName() {
        try {
            return await this.contract.name();
        } catch (error) {
            console.error(`❌ Error fetching name for vault ${this.address}:`, error.message);
            return null;
        }
    }

    /**
     * Retrieves the vault contract address.
     * 
     * @returns {string} The vault contract address.
     */
    getAddress() {
        return this.address;
    }

    static async mergeWallets(web3, address, wallets) {
        let vault = null;
        let merged = wallets;
        if (address && address.length > 0) {
            vault = new VtruVault(address, web3);
            merged = mergeUnique([vault.getAddress(), ...await vault.getVaultWallets()], wallets);
        }
        return { merged, vault };
    }
}

module.exports = VtruVault;
