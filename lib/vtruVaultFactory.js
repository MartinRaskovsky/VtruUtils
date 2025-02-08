/**
 * VtruVaultFactory.js
 * A factory class for managing and interacting with vaults in the Vtru ecosystem.
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Extends the VtruContract class to provide functionality for retrieving and processing vault data.
 */

const { sleep } = require("./libSystem");
const VtruContract = require("./vtruContract");
const Vault = require("./vtruVault"); // Required for creating Vault instances

/**
 * Factory class for retrieving and processing vault data.
 */
class VtruVaultFactory extends VtruContract {
    /**
     * Constructor for VtruVaultFactory.
     * @param {Object} web3 - The Web3 instance.
     * @param {string} [contractName="CreatorVaultFactory"] - The contract name.
     */
    constructor(web3, contractName = "CreatorVaultFactory") {
        super(web3, contractName);
    }

    /**
     * Retrieves the total number of vaults.
     * @returns {Promise<number|null>} The total number of vaults, or null if an error occurs.
     */
    async getVaultCount() {
        try {
            return await this.getContract().getVaultCount();
        } catch (error) {
            console.error("Error fetching vault count:", error.message);
            return null;
        }
    }

    /**
     * Retrieves a batch of vault addresses.
     * @param {number} start - The starting index.
     * @param {number} end - The ending index.
     * @returns {Promise<Array<string>|null>} An array of vault addresses, or null if an error occurs.
     */
    async getVaultBatch(start, end) {
        try {
            return await this.getContract().getVaultBatch(start, end);
        } catch (error) {
            console.error(`Error fetching vault batch from ${start} to ${end}:`, error.message);
            return null;
        }
    }

    /**
     * Iterates through all vaults and applies a callback function to each vault.
     * @param {number} [limit=Infinity] - The maximum number of vaults to process. If not provided, processes all.
     * @param {Function} callback - A function to process each vault.
     */
    async processVaults(limit = Infinity, callback) {
        try {
            const vaultCount = await this.getVaultCount();
            if (vaultCount === null) return;

            const vaultAddresses = await this.getVaultBatch(0, vaultCount);
            if (!Array.isArray(vaultAddresses)) return;

            for (let i = 0; i < vaultCount; i++) {
                if (i >= limit) break; // Stop if the limit is reached
                const vault = new Vault(vaultAddresses[i], this.web3);
                await callback(vault, i);
                await sleep(20);
            }
        } catch (error) {
            console.error("Error processing vaults:", error.message);
        }
    }
}

module.exports = VtruVaultFactory;

