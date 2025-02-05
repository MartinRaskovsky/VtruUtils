/**
 * VtruContract.js
 * Handles the logic for contracts.
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 */

const { ethers } = require("ethers");

/**
 * Class representing a Vtru contract.
 */
class VtruContract {
    /**
     * Constructor for VtruContract.
     * @param {VtruConfig} config - The Vtru configuration instance.
     * @param {VtruWeb3} web3 - The Vtru Web3 instance.
     * @param {string} name - The name of the contract.
     */
    constructor(config, web3, name) {
        this.config = config;
        this.web3 = web3;
        this.name = name;
    }

    /**
     * Get the contract address for the given contract name.
     * @returns {string|null} The contract address or null if not found.
     */
    getAddress() {
        if (!this.name) {
            console.error("Configuration name for getAddress is not available.");
            return null;
        }

        const address = this.config.getContractAddress(this.name);
        if (!address) {
            console.error(`The specified contract address for '${this.name}' does not exist.`);
            return null;
        }

        return address;
    }

    /**
     * Get an instance of the ethers.js contract.
     * @returns {ethers.Contract|null} The contract instance, or null if failed.
     */
    /*getContract() {
        const abi = this.config.getAbi(this.name);
        const address = this.getAddress();

        if (!abi || !address) {
            console.error("Failed to create contract instance due to missing ABI or address.");
            return null;
        }

        return new ethers.Contract(address, abi, this.web3.getProvider());
    }*/

    getContract() {
        const abi = this.config.getAbi(this.name);
        const address = this.getAddress();
    
        if (!abi || !address) {
            console.error("Failed to create contract instance due to missing ABI or address.");
            return null;
        }
    
        try {
            const provider = this.web3.getProvider();
            const contract = new ethers.Contract(address, abi, provider);
            return contract;
        } catch (error) {
            console.error("❌ Error creating contract:", error.message);
            return null;
        }
    }
    
    
}

module.exports = VtruContract;

